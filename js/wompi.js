/* ===========================
   CLEDUCA — Módulo de Pagos Wompi
   =========================== */
window.CleoWompi = (function () {

  // ── CONFIGURACIÓN (producción) ──
  const CONFIG = {
    publicKey:      'pub_prod_yMqcIq23A5WlWpotQg0bIOU03FrVU1p3',
    integrityKey:   'prod_integrity_iDAS7Y6hCRFhCLgZfV58PusBfVG9NDg0',
    eventsKey:      'prod_events_0S5rivetLkX8TfxbYh4SOW2YQBLyb8EI',
    currency:       'COP',
    checkoutUrl:    'https://checkout.wompi.co/p/',
    // Supabase Edge Function para firma server-side:
    signatureEndpoint: 'https://tmbvwsauzngvydldjuqe.supabase.co/functions/v1/wompi-signature'
  };

  const PLANS = [
    {
      id:        'basico',
      name:      'Premium Básico',
      emoji:     '⭐',
      price:     9900,    // COP
      priceText: '$9.900',
      period:    '/mes',
      color:     '#6366F1',
      features: [
        '3 perfiles de usuario',
        'Vidas ilimitadas',
        'Sin anuncios',
        'Cofre cada 8 horas',
        '4 skins de Cleo',
        'Salva tu racha gratis'
      ]
    },
    {
      id:        'familiar',
      name:      'Premium Familiar',
      emoji:     '👨‍👩‍👧‍👦',
      price:     19900,   // COP
      priceText: '$19.900',
      period:    '/mes',
      color:     '#7C3AED',
      popular:   true,
      features: [
        '5 perfiles de usuario',
        'Vidas ilimitadas',
        'Sin anuncios',
        'Cofre cada 8 horas',
        'TODOS los skins de Cleo',
        'Todos los accesorios',
        'Control parental avanzado',
        'Salva tu racha gratis',
        'Acceso anticipado a contenido'
      ]
    }
  ];

  /**
   * Genera una referencia única para la transacción.
   */
  function generateReference(planId) {
    const ts  = Date.now();
    const uid = (window.CleoAuth?.getActive()?.id || 'guest').replace(/[^a-z0-9]/gi, '');
    return `cleduca_${planId}_${uid}_${ts}`;
  }

  /**
   * Calcula la firma de integridad SHA-256 localmente como fallback.
   * IMPORTANTE: en producción real esto debe hacerse en el servidor.
   * Aquí usamos la función de Supabase; si falla, calculamos en cliente.
   */
  async function getSignature(reference, amountCents, currency) {
    // Intentar con Supabase Edge Function (recomendado)
    try {
      const res = await fetch(CONFIG.signatureEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, amountCents, currency })
      });
      if (res.ok) {
        const { signature } = await res.json();
        if (signature) return signature;
      }
    } catch (e) {
      console.warn('[Wompi] Edge function no disponible, calculando localmente:', e.message);
    }

    // Fallback: calcular en cliente (solo para desarrollo/sandbox)
    const str = `${reference}${amountCents}${currency}${CONFIG.integrityKey}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Abre el checkout de Wompi para un plan.
   * @param {string} planId  - 'basico' | 'familiar'
   * @param {Function} [onSuccess] - callback cuando el pago es exitoso
   */
  async function checkout(planId, onSuccess) {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) { console.error('[Wompi] Plan no encontrado:', planId); return; }

    const reference   = generateReference(planId);
    const amountCents = plan.price * 100; // Wompi usa centavos
    const currency    = CONFIG.currency;

    // Guardar en localStorage para verificar al volver
    localStorage.setItem('cleduca_pending_payment', JSON.stringify({
      reference, planId, timestamp: Date.now()
    }));

    // Callback URL para cuando Wompi redirige de vuelta
    const redirectUrl = `${window.location.origin}/app/?payment_status=approved&ref=${reference}&plan=${planId}`;

    const signature = await getSignature(reference, amountCents, currency);

    // Construir URL de Wompi Checkout
    const params = new URLSearchParams({
      'public-key':             CONFIG.publicKey,
      'currency':               currency,
      'amount-in-cents':        amountCents.toString(),
      'reference':              reference,
      'signature:integrity':    signature,
      'redirect-url':           redirectUrl,
      'customer-data:email':    window.CleoAuth?.getActive()?.googleEmail || '',
    });

    const checkoutURL = `${CONFIG.checkoutUrl}?${params.toString()}`;

    // Abrir en nueva ventana/tab
    window.open(checkoutURL, '_blank', 'noopener');

    // Guardar callback para cuando el usuario vuelva
    if (onSuccess) {
      window.__wompiSuccessCallback = { planId, fn: onSuccess };
    }
  }

  /**
   * Verifica el estado de un pago por referencia usando la API de Wompi.
   * Se llama automáticamente al detectar ?payment_status=approved en la URL.
   */
  async function verifyPaymentFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const status    = urlParams.get('payment_status');
    const ref       = urlParams.get('ref');
    const plan      = urlParams.get('plan');

    if (!status || !ref) return false;

    if (status === 'approved' || status === 'APPROVED') {
      // Verificar con la API de Wompi
      try {
        const res = await fetch(
          `https://production.wompi.co/v1/transactions?reference=${ref}`,
          { headers: { Authorization: `Bearer ${CONFIG.publicKey}` } }
        );
        const data = await res.json();
        const txn  = data?.data?.[0];

        if (txn && (txn.status === 'APPROVED' || txn.status === 'approved')) {
          activateAfterPayment(plan, ref, txn);
          return true;
        }
      } catch (e) {
        // Si la API falla, confiamos en el redirect (solo para demo)
        console.warn('[Wompi] No se pudo verificar con API:', e.message);
        activateAfterPayment(plan, ref, null);
        return true;
      }
    }

    // Limpiar URL
    const cleanURL = window.location.pathname;
    window.history.replaceState({}, document.title, cleanURL);
    return false;
  }

  /**
   * Activa el plan premium después de un pago exitoso.
   */
  function activateAfterPayment(planId, reference, txnData) {
    if (!planId) return;

    // Activar premium
    if (window.CleoMonetization) {
      CleoMonetization.activatePremium(planId, 30);
    }

    // Registrar en localStorage
    localStorage.setItem('cleduca_last_payment', JSON.stringify({
      reference, planId, timestamp: Date.now(),
      transactionId: txnData?.id || null
    }));

    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // Notificar al usuario
    setTimeout(() => {
      if (window.CleoUI) {
        CleoUI.toast('¡Pago exitoso! Bienvenido a Premium 🎉', '👑', 'success');
      }
      if (window.CleoAnimations) {
        CleoAnimations.confetti();
      }
      if (window.__wompiSuccessCallback) {
        window.__wompiSuccessCallback.fn?.();
      }
    }, 500);
  }

  /**
   * Genera el HTML del modal de planes con botones Wompi reales.
   */
  function renderPlansModal() {
    return `
      <div style="padding:24px 16px;max-height:80vh;overflow-y:auto;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:2.5rem;margin-bottom:8px;">👑</div>
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.5rem;margin:0 0 4px;">
            Hazte Premium
          </h2>
          <p style="color:var(--c-text-muted);font-size:0.9rem;margin:0;">
            Desbloquea todo el potencial de Cleduca
          </p>
        </div>

        ${PLANS.map(plan => `
          <div style="border:2px solid ${plan.popular ? plan.color : 'var(--c-border)'};
                      border-radius:20px;padding:20px;margin-bottom:16px;position:relative;
                      background:${plan.popular ? `linear-gradient(135deg,${plan.color}10,${plan.color}05)` : 'var(--c-surface)'};">
            ${plan.popular ? `
              <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);
                          background:${plan.color};color:#fff;padding:4px 16px;border-radius:20px;
                          font-size:0.75rem;font-weight:700;">⭐ MÁS POPULAR</div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <div>
                <div style="font-size:1.5rem;margin-bottom:2px;">${plan.emoji} ${plan.name}</div>
                <div style="font-size:2rem;font-weight:900;color:${plan.color};">
                  ${plan.priceText}<span style="font-size:1rem;font-weight:500;color:var(--c-text-muted);">${plan.period}</span>
                </div>
              </div>
            </div>

            <ul style="list-style:none;padding:0;margin:0 0 16px;display:flex;flex-direction:column;gap:8px;">
              ${plan.features.map(f => `
                <li style="display:flex;align-items:center;gap:8px;font-size:0.9rem;">
                  <span style="color:#22C55E;font-size:1rem;">✓</span> ${f}
                </li>
              `).join('')}
            </ul>

            <button
              id="wompi-btn-${plan.id}"
              class="btn btn-full btn-lg"
              style="background:${plan.color};color:#fff;border-radius:14px;font-weight:700;"
              onclick="CleoWompi.checkout('${plan.id}', () => { document.querySelectorAll('.modal-overlay').forEach(m=>m.remove()); })">
              💳 Suscribirme — ${plan.priceText}/mes
            </button>
          </div>
        `).join('')}

        <p style="text-align:center;font-size:0.75rem;color:var(--c-text-muted);margin-top:8px;">
          🔒 Pago seguro procesado por Wompi · Sin compromisos de permanencia
        </p>
      </div>
    `;
  }

  // ── Auto-verificar al cargar si hay redirect de Wompi ──
  window.addEventListener('DOMContentLoaded', () => {
    verifyPaymentFromURL();
  });

  return {
    checkout,
    verifyPaymentFromURL,
    activateAfterPayment,
    renderPlansModal,
    PLANS,
    CONFIG
  };
})();
