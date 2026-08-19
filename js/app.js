/* ===========================
   CLEDUCA — App Principal: Router, UI, Cleo, Animaciones, Speech
   =========================== */

window.CLEO_BACK_ARROW = `<svg style="width:22px;height:22px;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

// ── SPEECH (Voz Femenina para Cleo) ──
window.CleoSpeech = (function() {
  let enabled = true;
  const synth = window.speechSynthesis;
  let cachedVoice = null;

  // Nombres de voces femeninas conocidas en español
  const FEMALE_NAMES = ['paulina','sabina','mónica','monica','elena','laura','helena',
    'conchita','lucía','lucia','penélope','penelopenelope','miren','google español',
    'microsoft sabina','microsoft helena','microsoft laura'];

  function findFemaleVoice() {
    if (cachedVoice) return cachedVoice;
    const voices = synth.getVoices();
    if (!voices.length) return null;
    // 1. Buscar voz femenina en español por nombre
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    const female = esVoices.find(v => {
      const n = v.name.toLowerCase();
      return FEMALE_NAMES.some(f => n.includes(f));
    });
    if (female) { cachedVoice = female; return female; }
    // 2. Buscar cualquier voz española que NO sea masculina (evitar 'Jorge','Andrés','Diego')
    const MALE_NAMES = ['jorge','andrés','andres','diego','enrique','carlos','pablo','juan'];
    const nonMale = esVoices.find(v => !MALE_NAMES.some(m => v.name.toLowerCase().includes(m)));
    if (nonMale) { cachedVoice = nonMale; return nonMale; }
    // 3. Cualquier voz en español
    if (esVoices.length) { cachedVoice = esVoices[0]; return esVoices[0]; }
    // 4. Fallback
    cachedVoice = voices[0];
    return voices[0];
  }

  // Refrescar cache cuando las voces se cargan (async en Chrome)
  if (synth) synth.onvoiceschanged = () => { cachedVoice = null; };

  function say(text, rate=0.92, pitch=1.35) {
    if (!enabled || !synth || !text) return;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-CO';
    utt.rate = rate;
    utt.pitch = pitch; // Más agudo = más femenino/dulce
    utt.volume = 0.9;
    const voice = findFemaleVoice();
    if (voice) utt.voice = voice;
    synth.speak(utt);
  }
  function toggle() { enabled = !enabled; return enabled; }
  function isEnabled() { return enabled; }

  return { say, toggle, isEnabled };
})();

// ── ANIMATIONS ──
window.CleoAnimations = (function() {
  function confetti() {
    const colors = ['#58CC02','#FFC800','#1CB0F6','#FF6B35','#A855F7','#EC4899'];
    for (let i=0; i<80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random()*100}%;
        top:-10px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${Math.random()*10+6}px;
        height:${Math.random()*10+6}px;
        border-radius:${Math.random()>0.5?'50%':'2px'};
        animation-duration:${Math.random()*2+1.5}s;
        animation-delay:${Math.random()*0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(), 3500);
    }
  }

  function ripple(el, e) {
    const rect = el.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;
      left:${(e.clientX||e.touches?.[0]?.clientX||0)-rect.left-size/2}px;
      top:${(e.clientY||e.touches?.[0]?.clientY||0)-rect.top-size/2}px;`;
    el.appendChild(r);
    setTimeout(()=>r.remove(), 700);
  }

  return { confetti, ripple };
})();

// ── MASCOTA CLEO SVG ──
window.CleoChr = (function() {
  // Genera el SVG de Cleo (Perrito Husky/Criollo) según skin activa
  function getSVG(skin='verde', expression='happy', accessory='none') {
    const colors = {
      verde:     { body:'#292524', belly:'#F8FAFC', eye:'#3B82F6', innerEar:'#F472B6', collar:'#EF4444' }, // Husky Clásico (Negro/Blanco Ojos Azules)
      galaxia:   { body:'#4C1D95', belly:'#EDE9FE', eye:'#8B5CF6', innerEar:'#C4B5FD', collar:'#F59E0B' }, // Purple
      oceanica:  { body:'#0369A1', belly:'#E0F2FE', eye:'#0284C7', innerEar:'#BAE6FD', collar:'#10B981' }, // Blue
      fuego:     { body:'#9A3412', belly:'#FFEDD5', eye:'#EA580C', innerEar:'#FDBA74', collar:'#F59E0B' }, // Orange/Red
      artica:    { body:'#64748B', belly:'#F8FAFC', eye:'#38BDF8', innerEar:'#CBD5E1', collar:'#3B82F6' }, // Light Grey
      primavera: { body:'#BE185D', belly:'#FCE7F3', eye:'#EC4899', innerEar:'#F9A8D4', collar:'#F59E0B' }, // Pink
      dorada:    { body:'#B45309', belly:'#FEF3C7', eye:'#D97706', innerEar:'#FDE68A', collar:'#EF4444' }, // Golden
      oscura:    { body:'#18181B', belly:'#52525B', eye:'#A1A1AA', innerEar:'#71717A', collar:'#3B82F6' }  // Dark mode
    };
    const c = colors[skin] || colors.verde;

    // Expression variants (Eyes and mouth)
    const eyes = {
      happy:     `<circle cx="37" cy="46" r="6.5" fill="${c.eye}"/>
                  <circle cx="63" cy="46" r="6.5" fill="${c.eye}"/>
                  <circle cx="35" cy="43.5" r="2.5" fill="#FFFFFF"/>
                  <circle cx="61" cy="43.5" r="2.5" fill="#FFFFFF"/>
                  <circle cx="38" cy="48" r="1.2" fill="#FFFFFF"/>
                  <circle cx="64" cy="48" r="1.2" fill="#FFFFFF"/>`,
      surprised: `<circle cx="37" cy="45" r="7.5" fill="${c.eye}"/>
                  <circle cx="63" cy="45" r="7.5" fill="${c.eye}"/>
                  <circle cx="35" cy="42" r="3" fill="#FFFFFF"/>
                  <circle cx="61" cy="42" r="3" fill="#FFFFFF"/>`,
      sad:       `<circle cx="37" cy="48" r="6" fill="${c.eye}"/>
                  <circle cx="63" cy="48" r="6" fill="${c.eye}"/>
                  <path d="M30 42 Q37 38 44 42" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <path d="M56 42 Q63 38 70 42" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      celebrating:`<path d="M31 46 Q37 39 43 46" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                    <path d="M57 46 Q63 39 69 46" stroke="${c.eye}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      thinking:  `<circle cx="37" cy="46" r="6" fill="${c.eye}"/>
                  <circle cx="63" cy="46" r="6" fill="${c.eye}"/>
                  <path d="M31 38 L43 42" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <path d="M57 42 L69 38" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    };

    const mouths = {
      happy:     `<ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1E293B"/>
                  <path d="M50 59.5 L50 63" stroke="#1E293B" stroke-width="2" fill="none"/>
                  <path d="M43 63 Q50 70 57 63" stroke="#1E293B" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <path d="M47 65 Q50 72 53 65" fill="#F43F5E"/>`, // Lengüita de perrito
      surprised: `<ellipse cx="50" cy="55" rx="5" ry="3.5" fill="#1E293B"/>
                  <ellipse cx="50" cy="64" rx="4" ry="6" fill="#1E293B"/>`,
      sad:       `<ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1E293B"/>
                  <path d="M43 67 Q50 62 57 67" stroke="#1E293B" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      celebrating:`<ellipse cx="50" cy="55" rx="5" ry="3.5" fill="#1E293B"/>
                   <path d="M41 62 Q50 74 59 62" fill="#F43F5E" stroke="#1E293B" stroke-width="2"/>`,
      thinking:  `<ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1E293B"/>
                  <path d="M45 64 L55 64" stroke="#1E293B" stroke-width="2" fill="none" stroke-linecap="round"/>`
    };

    // Accessory
    const accessories = {
      none:  '',
      hat:   `<path d="M22 18 C22 18 50 4 78 18 L72 22 L28 22 Z" fill="#EF4444"/>
               <rect x="36" y="4" width="28" height="16" rx="4" fill="#EF4444"/>
               <rect x="36" y="16" width="28" height="4" fill="#F59E0B"/>`,
      glasses:`<circle cx="37" cy="46" r="11" fill="rgba(255,255,255,0.25)" stroke="#1E293B" stroke-width="3"/>
               <circle cx="63" cy="46" r="11" fill="rgba(255,255,255,0.25)" stroke="#1E293B" stroke-width="3"/>
               <line x1="48" y1="46" x2="52" y2="46" stroke="#1E293B" stroke-width="3"/>`,
      crown: `<polygon points="50,2 58,16 70,8 66,22 34,22 30,8 42,16" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
               <circle cx="50" cy="2" r="3" fill="#EF4444"/>
               <circle cx="70" cy="8" r="3" fill="#3B82F6"/>
               <circle cx="30" cy="8" r="3" fill="#10B981"/>`,
      bowtie:`<polygon points="50,82 38,88 42,82 38,76 50,82 62,76 58,82 62,88" fill="#EF4444"/>
               <circle cx="50" cy="82" r="3" fill="#B91C1C"/>`,
      cape:  `<path d="M25 80 Q50 120 75 80 L80 105 Q50 140 20 105 Z" fill="#7C3AED" opacity="0.9"/>`
    };

    return `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" class="cleo-svg">
      <!-- Sombra -->
      <ellipse cx="50" cy="124" rx="32" ry="6" fill="rgba(0,0,0,0.12)"/>
      <!-- Cola de perrito feliz -->
      <path d="M70 95 Q92 85 86 112 Q76 108 68 100" fill="${c.body}" style="transform-origin:70px 95px;animation:cleoWave 1.8s ease-in-out infinite;"/>
      <path d="M86 112 Q88 118 92 110 Q85 106 86 112" fill="${c.belly}"/>
      <!-- Capa (detrás) -->
      ${accessory === 'cape' ? accessories.cape : ''}
      <!-- Cuerpo -->
      <ellipse cx="50" cy="92" rx="26" ry="28" fill="${c.body}"/>
      <ellipse cx="50" cy="94" rx="17" ry="22" fill="${c.belly}"/>
      <!-- Patitas traseras -->
      <ellipse cx="26" cy="116" rx="10" ry="8" fill="${c.body}"/>
      <ellipse cx="26" cy="119" rx="6" ry="4" fill="${c.belly}"/>
      <ellipse cx="74" cy="116" rx="10" ry="8" fill="${c.body}"/>
      <ellipse cx="74" cy="119" rx="6" ry="4" fill="${c.belly}"/>
      <!-- Patitas delanteras de perrito -->
      <rect x="35" y="88" width="11" height="30" rx="5" fill="${c.belly}"/>
      <rect x="54" y="88" width="11" height="30" rx="5" fill="${c.belly}"/>
      <!-- Orejas triangulares suaves de perrito Husky -->
      <polygon points="28,34 12,8 42,20" fill="${c.body}"/>
      <polygon points="27,32 16,14 38,22" fill="${c.innerEar}"/>
      <polygon points="72,34 88,8 58,20" fill="${c.body}"/>
      <polygon points="73,32 84,14 62,22" fill="${c.innerEar}"/>
      <!-- Cabeza redondeada de perrito -->
      <ellipse cx="50" cy="44" rx="34" ry="30" fill="${c.body}"/>
      <!-- Máscara facial blanca de Husky/Criollo -->
      <path d="M50 18 Q30 18 20 44 Q20 68 50 72 Q80 68 80 44 Q70 18 50 18" fill="${c.belly}"/>
      <!-- Estrella/Llama en la frente de Cleo -->
      <path d="M50 20 Q44 26 40 38 Q48 40 50 34 Q52 40 60 38 Q56 26 50 20" fill="${c.body}"/>
      <!-- Collar rojo con placa dorada -->
      <path d="M26 71 Q50 80 74 71 L72 77 Q50 86 28 77 Z" fill="${c.collar}"/>
      <circle cx="50" cy="80" r="4.5" fill="#F59E0B" stroke="#B45309" stroke-width="1"/>
      <!-- Ojos -->
      ${eyes[expression] || eyes.happy}
      <!-- Hocico y boca -->
      ${mouths[expression] || mouths.happy}
      <!-- Mejillas rosaditas -->
      <ellipse cx="26" cy="54" rx="4.5" ry="2.5" fill="#FF9DC0" opacity="0.65"/>
      <ellipse cx="74" cy="54" rx="4.5" ry="2.5" fill="#FF9DC0" opacity="0.65"/>
      <!-- Accesorio -->
      ${accessory !== 'cape' ? accessories[accessory] || '' : ''}
    </svg>`;
  }

  function renderInto(el, skin, expression, accessory) {
    if (el) el.innerHTML = getSVG(skin, expression, accessory);
  }

  return { getSVG, renderInto };
})();

// ── UI MANAGER ──
window.CleoUI = (function() {
  const app = () => document.getElementById('app');

  function toast(title, icon='ℹ️', type='info', subtitle='') {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();
    const t = document.createElement('div');
    t.className = `toast ${type} animate-slideInRight`;
    t.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-text">
        <strong>${title}</strong>
        ${subtitle?`<span>${subtitle}</span>`:''}
      </div>
    `;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(100%)'; setTimeout(()=>t.remove(),300); }, 3000);
  }

  function showModal(type) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';

    if (type === 'plans') {
      const plans = CleoMonetization.PLANS;
      overlay.innerHTML = `
        <div class="modal-sheet">
          <div class="modal-handle"></div>
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:2.5rem;margin-bottom:8px;">👑</div>
            <h2 class="modal-title">¡Hazte Premium!</h2>
            <p class="modal-subtitle">Desbloquea todo el potencial de Cleduca</p>
          </div>
          ${plans.map(p=>`
            <div style="background:var(--c-surface);border-radius:20px;padding:16px;margin-bottom:12px;
                 border:2px solid ${p.popular?'var(--c-primary)':'var(--c-border)'};position:relative;">
              ${p.popular?`<span class="badge-new" style="position:absolute;top:-8px;right:12px;">⭐ MÁS POPULAR</span>`:''}
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                <div>
                  <span style="font-size:1.5rem;">${p.emoji}</span>
                  <strong style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;margin-left:8px;">${p.name}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.2rem;color:var(--c-primary);">${p.price}</div>
                  <div style="font-size:0.75rem;color:var(--c-text-muted);">${p.period}</div>
                </div>
              </div>
              <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
                ${p.features.map(f=>`<li style="font-size:0.85rem;color:var(--c-text-muted);">✅ ${f}</li>`).join('')}
              </ul>
              <button class="btn btn-primary btn-full" onclick="CleoMonetization.activatePremium('${p.id}');document.getElementById('modal-overlay').remove();CleoUI.toast('¡Premium activado! 🎉','👑','success');">
                Obtener ${p.name}
              </button>
            </div>
          `).join('')}
          <button class="btn btn-ghost btn-full" onclick="document.getElementById('modal-overlay').remove()">No gracias</button>
        </div>
      `;
    }

    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  function showAdModal(onComplete) {
    let countdown = 5;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay center';
    overlay.id = 'ad-overlay';
    const render = () => {
      overlay.innerHTML = `
        <div class="modal-dialog" style="text-align:center;">
          <div style="font-size:2rem;margin-bottom:12px;">📺</div>
          <h3 class="modal-title">¡Ve un video y gana vidas!</h3>
          <p class="modal-subtitle">Esperando al anuncio...</p>
          <div class="ad-countdown">${countdown}</div>
          <div class="ad-progress" style="margin-top:16px;">
            <div class="ad-progress-fill" style="width:${((5-countdown)/5)*100}%;"></div>
          </div>
          <div style="margin-top:12px;padding:20px;background:var(--c-surface);border-radius:16px;
               height:120px;display:flex;align-items:center;justify-content:center;
               color:var(--c-text-muted);font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;">
            📢 Espacio Publicitario
          </div>
          <p style="font-size:0.75rem;color:var(--c-text-muted);margin-top:12px;">
            ¡Gracias por apoyar Cleduca!
          </p>
        </div>
      `;
    };
    render();
    document.body.appendChild(overlay);
    const interval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(interval);
        overlay.remove();
        if (onComplete) onComplete();
      } else {
        render();
      }
    }, 1000);
  }

  function renderGameView({ title, progress, lives, content, onBack }) {
    const view = document.getElementById('view-game');
    if (!view) return;
    view.innerHTML = `
      <div class="game-header">
        <button class="top-back-btn" onclick="(${onBack})()">${CLEO_BACK_ARROW}</button>
        <div class="game-progress-bar"><div class="game-progress-fill" style="width:${progress}%"></div></div>
        <div class="stat-chip lives" style="font-size:1.05rem;padding:6px 12px;"><span class="icon">❤️</span> ${lives}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;padding:12px;
           background:var(--c-bg-nav);border-bottom:1px solid var(--c-border);">
        <h3 style="font-size:1rem;font-family:'Plus Jakarta Sans',sans-serif;">${title}</h3>
      </div>
      <div style="flex:1;overflow-y:auto;">${content}</div>
    `;
    CleoRouter.showView('game');
  }

  function showGameEnd({ score, total, correct, wrong, perfect, onReplay, onHome }) {
    const view = document.getElementById('view-game');
    if (!view) return;
    const pct = Math.round((correct/total)*100);
    // Store callbacks globally so onclick can find them
    window._gameEndReplay = onReplay;
    window._gameEndHome = onHome;
    view.innerHTML = `
      <div style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;
           justify-content:center;padding:32px 20px;gap:24px;text-align:center;">
        <div style="font-size:4rem;animation:bounceIn 0.6s ease;">
          ${perfect?'🏆':pct>=70?'⭐':'😊'}
        </div>
        <div>
          <h2 style="font-size:2rem;margin-bottom:8px;">
            ${perfect?'¡Perfecto!':pct>=70?'¡Muy bien!':'¡Sigue practicando!'}
          </h2>
          <p style="color:var(--c-text-muted);font-size:1rem;">${correct} de ${total} correctas (${pct}%)</p>
        </div>
        <div style="background:var(--c-surface);border-radius:20px;padding:20px;width:100%;display:flex;gap:16px;justify-content:center;">
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-xp);">+${score}</div>
            <div style="font-size:0.8rem;color:var(--c-text-muted);">XP ganados</div>
          </div>
          <div style="width:1px;background:var(--c-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-primary);">${correct}</div>
            <div style="font-size:0.8rem;color:var(--c-text-muted);">Correctas</div>
          </div>
          <div style="width:1px;background:var(--c-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-lives);">${wrong}</div>
            <div style="font-size:0.8rem;color:var(--c-text-muted);">Incorrectas</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
          <button class="btn btn-primary btn-full btn-lg" onclick="window._gameEndReplay()">🔄 Jugar de nuevo</button>
          <button class="btn btn-secondary btn-full" onclick="window._gameEndHome()">🏠 Volver al inicio</button>
        </div>
      </div>
    `;
  }

  function showAdModal(onComplete) {
    let secondsLeft = 5;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div class="modal-card animate-scaleUp" style="text-align:center;padding:24px;">
        <div style="background:var(--grad-hero);border-radius:16px;padding:24px;color:#fff;margin-bottom:16px;position:relative;overflow:hidden;">
          <div style="font-size:3rem;margin-bottom:8px;animation:floatBig 2s infinite ease-in-out;">📺</div>
          <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.3rem;margin-bottom:4px;">
            Anuncio publicitario
          </h3>
          <p style="font-size:0.85rem;opacity:0.9;">Recargando tus vidas con Cleo...</p>
          
          <div style="margin-top:16px;background:rgba(255,255,255,0.2);height:10px;border-radius:5px;overflow:hidden;">
            <div id="ad-progress-bar" style="width:100%;height:100%;background:#fff;transition:width 1s linear;"></div>
          </div>
        </div>

        <div id="ad-status-btn" class="btn btn-secondary btn-full" style="opacity:0.7;cursor:not-allowed;font-weight:700;">
          ⏳ Espera <span id="ad-timer">5</span>s para reclamar la recompensa
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const interval = setInterval(() => {
      secondsLeft--;
      const timerEl = document.getElementById('ad-timer');
      const progressEl = document.getElementById('ad-progress-bar');
      if (timerEl) timerEl.textContent = secondsLeft;
      if (progressEl) progressEl.style.width = `${(secondsLeft/5)*100}%`;

      if (secondsLeft <= 0) {
        clearInterval(interval);
        const btn = document.getElementById('ad-status-btn');
        if (btn) {
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          btn.className = 'btn btn-primary btn-full btn-lg';
          btn.innerHTML = '✨ ¡Reclamar +5 Vidas ❤️!';
          btn.onclick = () => {
            modal.remove();
            CleoGame.refillLives();
            CleoUI.toast('¡Vidas recargadas con éxito! ❤️', '❤️', 'success');
            if (onComplete) onComplete();
          };
        }
      }
    }, 1000);
  }

  return { toast, showModal, showAdModal, renderGameView, showGameEnd };
})();

// ── ROUTER ──
window.CleoRouter = (function() {
  const views = ['splash','login','profiles','auth','grade','home','materias','subject','idiomas','juegos','logros','perfil','tienda','game'];
  let currentView = 'splash';

  function showView(id) {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());
    document.querySelectorAll('.view').forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none'; // Force hide
    });
    const el = document.getElementById('view-'+id);
    if (el) { 
      el.classList.add('active'); 
      el.style.display = 'flex'; // Force show
      currentView = id; 
    }
    updateNav(id);
  }

  function navigate(to, data={}) {
    switch(to) {
      case 'home':     renderHome(); showView('home'); break;
      case 'materias': renderMaterias(); showView('materias'); break;
      case 'juegos':   renderJuegos(); showView('juegos'); break;
      case 'logros':   renderLogros(); showView('logros'); break;
      case 'perfil':   renderPerfil(); showView('perfil'); break;
      case 'subject':
        if (data.subject === 'idiomas') {
          renderIdiomas(); showView('idiomas');
        } else {
          renderSubject(data); showView('subject');
        }
        break;
      case 'game':     showView('game'); break;
      case 'grade':    showGradeSelector(); break;
      case 'login':    showAuthScreen(); break;
      default: showView(to);
    }
    updateFab(to);
  }

  function updateNav(view) {
    const navMap = { home:'nav-home', materias:'nav-materias', juegos:'nav-juegos', logros:'nav-logros', perfil:'nav-perfil' };
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navId = navMap[view];
    if (navId) document.getElementById(navId)?.classList.add('active');
    // Show/hide bottom nav
    const noNav = ['splash','login','profiles','auth','grade','game'];
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = noNav.includes(view) ? 'none' : 'flex';
  }

  function updateFab(view) {
    const fab = document.getElementById('nav-fab');
    if (!fab) return;
    const configs = {
      home:     { icon:'🎮', label:'Jugar' },
      materias: { icon:'▶️', label:'Empezar' },
      juegos:   { icon:'🎲', label:'Sorpresa' },
      logros:   { icon:'🎯', label:'Reto' },
      perfil:   { icon:'✨', label:'Editar Cleo' }
    };
    const cfg = configs[view] || configs.home;
    fab.querySelector('.fab-icon').textContent = cfg.icon;
    fab.querySelector('.fab-label').textContent = cfg.label;
    fab._action = view;
  }

  function fabAction() {
    const fab = document.getElementById('nav-fab');
    const view = fab?._action || currentView;
    switch(view) {
      case 'home':     navigate('juegos'); break;
      case 'materias': { const first = CLEDUCA_DATA.subjects[0]; navigate('subject',{subject:first.id}); break; }
      case 'juegos':   {
        const profile = CleoAuth.getActive();
        const grade = profile?.grade || 3;
        const games = ['quiz','sopa','memoria','carrera'];
        const g = games[Math.floor(Math.random()*games.length)];
        startGame(g, CLEDUCA_DATA.subjects[0].id, grade);
        break;
      }
      case 'logros':   navigate('logros'); break;
      case 'perfil':   document.getElementById('cleo-edit-section')?.scrollIntoView({behavior:'smooth'}); break;
    }
  }

  return { navigate, showView, fabAction };
})();

// ── RENDER FUNCTIONS ──
function renderHome() {
  const profile = CleoAuth.getActive();
  if (!profile) { CleoRouter.navigate('profiles'); return; }
  const grade = profile.grade || 3;
  const xp = profile.xp || 0;
  const lives = CleoGame.getLives();
  const streak = profile.streak || 0;
  const level = profile.level || 1;
  const progress = CleoGame.getLevelProgress();
  const skin = profile.skin || 'verde';
  const accessory = profile.accessory || 'none';
  const chestAvailable = CleoGame.checkFreeChest();

  const hourNow = new Date().getHours();
  const greeting = hourNow < 12 ? '¡Buenos días' : hourNow < 18 ? '¡Buenas tardes' : '¡Buenas noches';
  const randomWelcome = CLEDUCA_DATA.cleoMessages.welcome[Math.floor(Math.random()*CLEDUCA_DATA.cleoMessages.welcome.length)];

  const featuredGames = [
    { type:'carrera', subject:'matematicas', icon:'🏎️', badge:'POPULAR', title:'Carrera de Números', desc:'Acelera tu mente y resuelve operaciones para ganar la carrera', color:'#FF9800' },
    { type:'capibara', subject:'matematicas', icon:'🦦', badge:'NUEVO', title:'Aventura Capibara', desc:'Esquiva obstáculos y atrapa la respuesta correcta', color:'#38BDF8' },
    { type:'misterio', subject:'logica', icon:'🕵️', badge:'NUEVO', title:'Detective Cleo', desc:'Resuelve acertijos y encuentra al culpable con tu pensamiento crítico', color:'#10B981' },
    { type:'rompecabezas', subject:'logica', icon:'🧩', badge:'NUEVO', title:'Rompecabezas de Cleo', desc:'Intercambia las fichas para armar la imagen', color:'#EC4899' },
    { type:'diferencias', subject:'logica', icon:'👀', badge:'POPULAR', title:'Diferencias', desc:'Encuentra al intruso rápidamente', color:'#A855F7' },
    { type:'sopa', subject:'lenguaje', icon:'🔤', badge:'', title:'Sopa de Letras', desc:'Encuentra las palabras escondidas antes de que se acabe el tiempo', color:'#1CB0F6' }
  ];

  document.getElementById('view-home').innerHTML = `
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="top-bar-logo" style="display:flex;align-items:center;gap:6px;">
        <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;background:#fff;">
          ${CleoChr.getSVG(skin, 'happy', accessory).replace('class="cleo-svg"', 'class="cleo-svg" style="width:100%;height:100%;"')}
        </div>
        Cleduca
      </div>
      <div class="top-stats">
        <div class="stat-chip xp"><span class="icon">⭐</span>${xp}</div>
        <div class="stat-chip lives" onclick="${lives<=0?`CleoMonetization.watchAdForLives(()=>renderHome())`:''}">
          <span class="icon">❤️</span>${lives}
        </div>
        <div class="stat-chip streak"><span class="icon">🔥</span>${streak}</div>
      </div>
    </div>

    <div style="overflow-y:auto;flex:1;padding-bottom:24px;">
      <!-- Hero Section -->
      <div style="background:var(--grad-hero);padding:20px 16px 28px;border-radius:0 0 28px 28px;
           margin-bottom:16px;position:relative;overflow:hidden;">
        <!-- Clouds decoration -->
        <div style="position:absolute;top:0;right:0;width:80px;height:50px;
             background:rgba(255,255,255,0.2);border-radius:50%;transform:translate(20%,-30%)"></div>
        <div style="position:absolute;top:10px;left:60px;width:50px;height:30px;
             background:rgba(255,255,255,0.15);border-radius:50%;"></div>
        
        <div style="display:flex;align-items:center;gap:14px;position:relative;z-index:1;">
          <div id="home-cleo" style="flex-shrink:0;cursor:pointer;" onclick="CleoSpeech.say('${randomWelcome}')">
            <div class="animate-float" style="width:84px;height:84px;border-radius:50%;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.2);background:#fff;padding:4px;">
              ${CleoChr.getSVG(skin, 'happy', accessory).replace('class="cleo-svg"', 'class="cleo-svg" style="width:100%;height:100%;"')}
            </div>
          </div>
          <div style="flex:1;">
            <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.3rem;color:#fff;
                 text-shadow:0 2px 8px rgba(0,0,0,0.2);">
              ${greeting}, ${profile.name}! 👋
            </div>
            <div style="color:rgba(255,255,255,0.9);font-size:0.85rem;font-weight:700;margin-top:2px;">
              ${CLEDUCA_DATA.grades.find(g=>g.id===grade)?.name||'Explorador'} · Nivel ${level} · ${CleoGame.getLevelName(level)}
            </div>
            <!-- Level progress -->
            <div style="margin-top:10px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:rgba(255,255,255,0.85);font-size:0.7rem;font-weight:800;">NIVEL ${level}</span>
                <span style="color:rgba(255,255,255,0.85);font-size:0.7rem;font-weight:800;">NIVEL ${level+1}</span>
              </div>
              <div style="height:8px;background:rgba(255,255,255,0.3);border-radius:8px;overflow:hidden;">
                <div style="height:100%;width:${progress}%;background:#fff;border-radius:8px;
                     transition:width 1s ease;box-shadow:0 0 8px rgba(255,255,255,0.5);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chest (if available) -->
      ${chestAvailable ? `
        <div style="margin:0 16px 16px;" onclick="openFreeChest()">
          <div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:20px;padding:14px 16px;
               display:flex;align-items:center;gap:14px;cursor:pointer;
               box-shadow:0 4px 16px rgba(245,158,11,0.3);animation:pulse 2s ease-in-out infinite;">
            <span style="font-size:2.2rem;">📦</span>
            <div style="flex:1;">
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#fff;font-size:1rem;">¡Cofre Gratis Disponible!</div>
              <div style="color:rgba(255,255,255,0.85);font-size:0.8rem;">Ábrelo para ganar XP y recompensas</div>
            </div>
            <span style="font-size:1.5rem;color:#fff;">→</span>
          </div>
        </div>
      ` : ''}

      <!-- Materias Section (Horizontal Scroll) -->
      <div style="padding:0 16px 8px;display:flex;align-items:center;justify-content:space-between;">
        <h2 style="font-size:1.1rem;font-weight:900;">📚 Materias y Cursos</h2>
        <button class="btn btn-ghost btn-sm" onclick="CleoRouter.navigate('materias')" style="color:var(--c-primary);font-weight:700;">Ver todas →</button>
      </div>
      
      <div style="padding:0 16px 4px;">
        <div class="home-materias-scroll">
          ${CLEDUCA_DATA.subjects.map(s => `
            <div class="home-materia-card animate-fadeInUp"
                 onclick="${s.isSpecial ? `CleoRouter.navigate('idiomas')` : `CleoRouter.navigate('subject',{subject:'${s.id}'})`}">
              <div>
                <div style="font-size:2.2rem;margin-bottom:6px;">${s.emoji}</div>
                <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:0.9rem;color:var(--c-text);">${s.name}</div>
              </div>
              <div style="font-size:0.75rem;color:var(--c-primary);font-weight:700;margin-top:8px;">Explorar →</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Premium Banner (if not premium) -->
      ${!CleoMonetization.isPremium() ? `
        <div style="padding:0 16px 16px;">
          <div class="premium-banner" onclick="CleoUI.showModal('plans')">
            <span class="premium-banner-icon">👑</span>
            <div class="premium-banner-text">
              <h3>¡Hazte Premium!</h3>
              <p>Vidas ilimitadas, todos los juegos y sin anuncios</p>
            </div>
            <span class="premium-badge">Desde $9.900/mes</span>
          </div>
        </div>
      ` : ''}

      <!-- Featured Games Section -->
      <div style="padding:8px 16px 8px;display:flex;align-items:center;justify-content:space-between;">
        <h2 style="font-size:1.1rem;font-weight:900;">🎮 ¡A Jugar!</h2>
        <button class="btn btn-ghost btn-sm" onclick="CleoRouter.navigate('juegos')" style="color:var(--c-primary);font-weight:700;">Ver todos →</button>
      </div>

      <div style="padding:0 16px;display:flex;flex-direction:column;gap:12px;">
        <!-- Featured Main Game Card -->
        ${featuredGames.slice(0,1).map((g,i)=>`
          <div class="game-card animate-fadeInUp" style="animation-delay:${i*0.1}s"
               onclick="startGame('${g.type}','${g.subject}',${grade})">
            <div class="game-card-img" style="background:linear-gradient(135deg,${g.color}22,${g.color}44);">
              <span style="font-size:3.5rem;">${g.icon}</span>
              ${g.badge?`<span class="game-card-badge">${g.badge}</span>`:''}
            </div>
            <div class="game-card-body">
              <div class="game-card-tag">${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.emoji} ${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.name||''}</div>
              <h3 class="game-card-title">${g.title}</h3>
              <p class="game-card-desc">${g.desc}</p>
              <button class="game-card-btn">Jugar ahora ▶</button>
            </div>
          </div>
        `).join('')}

        <!-- Grid for remaining games -->
        <div class="games-grid">
          ${featuredGames.slice(1).map((g,i)=>`
            <div class="game-card animate-fadeInUp" style="animation-delay:${(i+1)*0.08}s;display:flex;flex-direction:column;"
                 onclick="startGame('${g.type}','${g.subject}',${grade})">
              <div class="game-card-img" style="background:linear-gradient(135deg,${g.color}22,${g.color}44);height:90px;">
                <span style="font-size:2.8rem;">${g.icon}</span>
                ${g.badge?`<span class="game-card-badge" style="font-size:0.6rem;">${g.badge}</span>`:''}
              </div>
              <div class="game-card-body" style="padding:10px;flex:1;display:flex;flex-direction:column;">
                <div class="game-card-tag" style="font-size:0.6rem;">${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.emoji}</div>
                <h3 class="game-card-title" style="font-size:0.95rem;">${g.title}</h3>
                <button class="game-card-btn" style="margin-top:auto;padding:6px;justify-content:center;font-size:0.8rem;">Jugar ▶</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  setTimeout(() => CleoSpeech.say(randomWelcome), 800);
}

function renderMaterias() {
  const profile = CleoAuth.getActive();
  if (!profile) return;
  const grade = profile.grade || 3;
  const gradeInfo = CLEDUCA_DATA.grades.find(g => g.id === grade);

  const totalLangLevels = Object.keys(CLEDUCA_DATA.idiomas).reduce((acc, k) => acc + CLEDUCA_DATA.idiomas[k].levels.length, 0);
  const completedLangLevels = Object.keys(profile.gamesPlayed || {}).filter(k => k.startsWith('idiomas_') && profile.gamesPlayed[k]).length;
  const langPct = totalLangLevels > 0 ? Math.min(100, Math.round((completedLangLevels / totalLangLevels) * 100)) : 0;

  document.getElementById('view-materias').innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">📚 Materias y Cursos</div>
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:0.85rem;color:var(--c-primary);background:var(--c-surface);padding:4px 10px;border-radius:12px;border:1px solid var(--c-border);">
        ${gradeInfo?.emoji || '🌱'} ${gradeInfo?.name || 'Grado'}
      </div>
    </div>
    
    <div style="overflow-y:auto;flex:1;padding:16px;display:flex;flex-direction:column;gap:14px;">
      <!-- Grade Info Header Banner -->
      <div class="card" style="background:var(--grad-hero);padding:20px;border-radius:24px;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,0.12);">
        <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.25rem;">
          Plan Escolar — ${gradeInfo?.name || 'Primaria'}
        </div>
        <div style="font-size:0.85rem;color:rgba(255,255,255,0.9);margin-top:4px;font-weight:600;">
          Explora cada materia y completa sus lecciones e itinerarios para subir de nivel
        </div>
      </div>

      <!-- Subjects Grid -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${CLEDUCA_DATA.subjects.map(s => {
          let pct = 0;
          if (s.isSpecial) {
            pct = langPct;
          } else {
            const xp = profile.subjectXP?.[s.id] || 0;
            pct = Math.min(100, Math.round((xp / 300) * 100));
          }
          return `
            <div class="card animate-fadeInUp" style="padding:16px;display:flex;flex-direction:column;gap:12px;cursor:pointer;background:var(--c-surface);border:2px solid var(--c-border);border-radius:20px;box-shadow:0 4px 16px rgba(0,0,0,0.04);transition:transform 0.2s;"
                 onclick="${s.isSpecial ? `CleoRouter.navigate('idiomas')` : `CleoRouter.navigate('subject',{subject:'${s.id}'})`}">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:52px;height:52px;border-radius:16px;background:${s.color}15;border:2px solid ${s.color}30;display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;">
                  ${s.emoji}
                </div>
                <div style="flex:1;">
                  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.05rem;color:var(--c-text);">${s.name}</div>
                  <div style="font-size:0.8rem;color:var(--c-text-muted);font-weight:600;margin-top:2px;">${s.desc || 'Temas y lecciones para practicar'}</div>
                </div>
                <span style="font-size:1.2rem;color:var(--c-text-muted);">→</span>
              </div>
              
              <div style="margin-top:2px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-size:0.75rem;color:var(--c-text-muted);font-weight:700;">Progreso</span>
                  <span style="font-size:0.8rem;font-weight:800;color:${s.color};">${pct}%</span>
                </div>
                <div class="progress-wrap" style="height:8px;background:var(--c-bg-card);border-radius:6px;overflow:hidden;border:1px solid var(--c-border);">
                  <div class="progress-bar" style="width:${pct}%;background:${s.color};height:100%;border-radius:6px;"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderSubject(data) {
  const subject = data?.subject || 'matematicas';
  const profile = CleoAuth.getActive();
  const grade = profile?.grade || 3;
  const subData = CLEDUCA_DATA.subjects.find(s=>s.id===subject);
  const content = CLEDUCA_DATA.content[grade]?.[subject];

  const SUBJECT_GAMES = {
    matematicas: [
      { type:'carrera', label:'Carrera de Números', icon:'🏎️', desc:'Sumas y cálculos a toda velocidad' },
      { type:'snake', label:'La Serpiente de Cleo', icon:'🐍', desc:'Atrapa las operaciones correctas' },
      { type:'quiz', label:'Quiz de Matemáticas', icon:'⚡', desc:'Desafíos matemáticos por tiempo' },
      { type:'sopa', label:'Sopa de Números', icon:'🔤', desc:'Encuentra términos matemáticos' }
    ],
    lenguaje: [
      { type:'sopa', label:'Sopa de Letras', icon:'🔤', desc:'Encuentra sustantivos, verbos y palabras' },
      { type:'quiz', label:'Quiz de Lenguaje', icon:'⚡', desc:'Ortografía, gramática y lecturas' },
      { type:'misterio', label:'Cuentos & Adivinanzas', icon:'📖', desc:'Comprensión de lectura interactiva' }
    ],
    ciencias: [
      { type:'capibara', label:'Aventura Capibara', icon:'🦦', desc:'Esquiva obstáculos y atrapa respuestas' },
      { type:'anatomia', label:'Anatomía del Cuerpo', icon:'🫀', desc:'Conoce los órganos y sistemas del cuerpo' },
      { type:'quiz', label:'Trivia de Ciencias', icon:'🌿', desc:'Naturaleza, células y ecosistemas' },
      { type:'sopa', label:'Sopa de Ciencias', icon:'🔤', desc:'Buscador de términos científicos' }
    ],
    sociales: [
      { type:'quiz', label:'Explorador del Mundo', icon:'🌎', desc:'Geografía e historia de Colombia' },
      { type:'rompecabezas', label:'Rompecabezas de Mapas', icon:'🧩', desc:'Arma los mapas e imágenes históricas' },
      { type:'sopa', label:'Sopa de Sociales', icon:'🔤', desc:'Regiones y mapas de Colombia' }
    ],
    logica: [
      { type:'misterio', label:'Detective Cleo', icon:'🕵️', desc:'Resuelve casos y lecturas detectivescas' },
      { type:'rompecabezas', label:'Rompecabezas Visual HD', icon:'🧩', desc:'Arma imágenes visuales HD' },
      { type:'diferencias', label:'5 Diferencias', icon:'👀', desc:'Encuentra la figura intrusa' },
      { type:'puzzle', label:'Puzzles de Secuencias', icon:'🧠', desc:'Patrones numéricos y lógicos' },
      { type:'memoria', label:'Memoria Visual', icon:'🧠', desc:'Parejas de imágenes' }
    ],
    arte: [
      { type:'pintura', label:'Estudio de Dibujo y Color', icon:'🎨', desc:'Lienzo interactivo para pintar' },
      { type:'dressup', label:'Viste a Cleo', icon:'👗', desc:'Atuendos y sombreros para la mascota' },
      { type:'musica', label:'Piano de Cleo', icon:'🎹', desc:'Crea notas y canciones en piano' },
      { type:'diferencias', label:'Diferencias Artísticas', icon:'👀', desc:'Encuentra los detalles en las obras' }
    ]
  };

  const games = SUBJECT_GAMES[subject] || [
    { type:'quiz', label:'Quiz Veloz', icon:'⚡', desc:'Preguntas de conocimiento' },
    { type:'sopa', label:'Sopa de Letras', icon:'🔤', desc:'Encuentra las palabras' }
  ];

  document.getElementById('view-subject').innerHTML = `
    <div class="top-bar">
      <button class="top-back-btn" onclick="CleoRouter.navigate('materias')">${CLEO_BACK_ARROW}</button>
      <div class="top-bar-logo">${subData?.emoji} ${subData?.name}</div>
      <div></div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:16px;display:flex;flex-direction:column;gap:14px;">
      <div class="card">
        <h3 style="margin-bottom:12px;font-size:1rem;">📋 Temas del grado</h3>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
          ${(content?.topics||[]).map(t=>`
            <li style="display:flex;align-items:center;gap:8px;font-size:0.9rem;">
              <span style="color:${subData?.color||'var(--c-primary)'};font-size:1.1rem;">✓</span>${t}
            </li>
          `).join('')}
        </ul>
      </div>
      <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🎮 Juegos de ${subData?.name}</h3>
      ${games.map(g=>`
        <div class="game-card" onclick="startGame('${g.type}','${subject}',${grade})">
          <div class="game-card-img" style="background:${subData?.color}22;height:100px;">
            <span style="font-size:3.5rem;">${g.icon}</span>
          </div>
          <div class="game-card-body">
            <div class="game-card-tag">${subData?.emoji} ${subData?.name}</div>
            <h3 class="game-card-title">${g.label}</h3>
            <p class="game-card-desc">${g.desc}</p>
            <button class="game-card-btn">Jugar ▶</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderIdiomas() {
  const profile = CleoAuth.getActive();
  if (!profile) return;
  const data = CLEDUCA_DATA.idiomas;
  
  let html = `
    <div class="top-bar">
      <button class="top-back-btn" onclick="CleoRouter.navigate('materias')">${CLEO_BACK_ARROW}</button>
      <div class="top-bar-logo">🌎 Idiomas del Mundo</div>
      <div class="top-stats">
        <div class="stat-chip lives"><span class="icon">❤️</span> ${CleoGame.getLives()}</div>
      </div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:20px 16px;background:var(--grad-bg);">
      <p style="text-align:center;color:var(--c-text-muted);margin-bottom:20px;font-weight:700;">Completa cada lección para desbloquear la ruta de aprendizaje 🚀</p>
  `;
  
  Object.keys(data).forEach(langKey => {
    const lang = data[langKey];
    html += `
      <div style="background:var(--c-surface);border-radius:24px;padding:20px;margin-bottom:20px;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.3rem;font-weight:800;color:var(--c-primary);display:flex;align-items:center;gap:8px;margin:0;">
            ${lang.emoji} Curso de ${lang.name}
          </h2>
          <span style="font-size:0.75rem;background:var(--c-bg-card);color:var(--c-text-muted);padding:4px 10px;border-radius:12px;font-weight:700;border:1px solid var(--c-border);">
            ${lang.category || 'Idiomas'}
          </span>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:14px;position:relative;">
          <div style="position:absolute;left:28px;top:20px;bottom:20px;width:4px;background:var(--c-border);z-index:0;border-radius:2px;"></div>
    `;
    
    let isUnlocked = true;
    
    lang.levels.forEach((lvl, i) => {
      const isCompleted = profile.gamesPlayed && profile.gamesPlayed[`idiomas_${langKey}_${lvl.id}`];
      
      html += `
        <div style="display:flex;align-items:center;gap:16px;z-index:1;" onclick="${isUnlocked ? `startGame('quiz_idioma','${langKey}_${lvl.id}',3)` : `CleoUI.toast('Completa el Nivel ${lvl.id-1} para desbloquear este nivel','🔒','info')`}">
          <div style="width:58px;height:58px;border-radius:50%;background:${isUnlocked ? (isCompleted ? 'var(--c-primary)' : '#F59E0B') : 'var(--c-border)'};
               border: 4px solid var(--c-surface);display:flex;align-items:center;justify-content:center;
               font-size:1.4rem;box-shadow:0 4px 12px rgba(0,0,0,0.1);color:#fff;cursor:pointer;
               transition:transform 0.2s;transform:scale(${isUnlocked ? '1' : '0.9'});">
            ${isUnlocked ? (isCompleted ? '⭐' : '▶') : '🔒'}
          </div>
          <div style="flex:1;background:var(--c-surface);border:2px solid ${isUnlocked ? (isCompleted?'var(--c-primary)':'#F59E0B') : 'var(--c-border)'};
               border-radius:16px;padding:12px 16px;cursor:${isUnlocked?'pointer':'not-allowed'};
               opacity:${isUnlocked?1:0.6};box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:0.8rem;color:var(--c-text-muted);font-weight:700;">Nivel ${lvl.id}</div>
              ${isCompleted ? '<span style="font-size:0.75rem;background:var(--c-primary);color:#fff;padding:2px 8px;border-radius:10px;font-weight:700;">¡Completado!</span>' : (isUnlocked ? '<span style="font-size:0.75rem;background:#F59E0B;color:#fff;padding:2px 8px;border-radius:10px;font-weight:700;">¡Empezar!</span>' : '')}
            </div>
            <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:var(--c-text);font-size:1.05rem;margin-top:2px;">
              ${lvl.name}
            </div>
          </div>
        </div>
      `;
      if (!isCompleted) isUnlocked = false; 
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  document.getElementById('view-idiomas').innerHTML = html;
}

function renderJuegos() {
  const profile = CleoAuth.getActive();
  const grade = profile?.grade || 3;

    const allGames = [
      { type:'capibara', subject:'matematicas', icon:'🦦', title:'Aventura Capibara', desc:'Esquiva obstáculos y atrapa la respuesta', color:'#38BDF8', badge:'NUEVO' },
      { type:'diferencias', subject:'logica', icon:'👀', title:'Diferencias', desc:'Encuentra al intruso rápidamente', color:'#A855F7', badge:'POPULAR' },
      { type:'puzzle', subject:'logica', icon:'🧠', title:'Puzzles de Secuencias', desc:'Adivina qué número o figura sigue', color:'#EF4444', badge:'NUEVO' },
      { type:'anatomia', subject:'ciencias', icon:'🫀', title:'Anatomía del Cuerpo', desc:'Conoce los órganos y cómo funciona tu cuerpo', color:'#E74C3C', badge:'NUEVO' },
      { type:'pintura', subject:'arte', icon:'🎨', title:'Estudio de Dibujo', desc:'Lienzo interactivo para pintar y colorear', color:'#EC4899', badge:'CREATIVO' },
      { type:'dressup', subject:'arte', icon:'👗', title:'Viste a Cleo', desc:'Pruébale gorras, gafas y atuendos a Cleo', color:'#F1C40F', badge:'NUEVO' },
      { type:'musica', subject:'arte', icon:'🎹', title:'Piano de Cleo', desc:'Toca notas y compone canciones', color:'#9B59B6', badge:'NUEVO' },
      { type:'snake', subject:'matematicas', icon:'🐍', title:'La Serpiente de Cleo', desc:'Atrapa las sumas y números correctos', color:'#58CC02', badge:'HOT' },
      { type:'carrera', subject:'matematicas', icon:'🏎️', title:'Carrera de Números', desc:'Sumas y operaciones a toda velocidad', color:'#FF9800', badge:'' },
      { type:'sopa', subject:'lenguaje', icon:'🔤', title:'Sopa de Letras', desc:'Encuentra palabras de cualquier materia', color:'#1CB0F6', badge:'' },
      { type:'memoria', subject:'logica', icon:'🧩', title:'Memoria de Imágenes', desc:'Encuentra las parejas iguales', color:'#A855F7', badge:'' }
    ];

  document.getElementById('view-juegos').innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">🎮 Juegos</div>
      <div class="stat-chip lives"><span class="icon">❤️</span> ${CleoGame.getLives()}</div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:16px;display:flex;flex-direction:column;gap:12px;">
      ${allGames.slice(0,1).map((g,i)=>`
        <div class="game-card animate-fadeInUp" style="animation-delay:${i*0.07}s"
             onclick="startGame('${g.type}','${g.subject}',${grade})">
          <div class="game-card-img" style="background:linear-gradient(135deg,${g.color}22,${g.color}44);height:140px;">
            <span style="font-size:4rem;">${g.icon}</span>
            ${g.badge?`<span class="game-card-badge">${g.badge}</span>`:''}
          </div>
          <div class="game-card-body" style="padding:16px;">
            <div class="game-card-tag">${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.emoji} ${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.name||''}</div>
            <h3 class="game-card-title" style="font-size:1.1rem;">${g.title}</h3>
            <p class="game-card-desc">${g.desc}</p>
            <button class="game-card-btn">Jugar ▶</button>
          </div>
        </div>
      `).join('')}

      <div class="games-grid">
        ${allGames.slice(1).map((g,i)=>`
          <div class="game-card animate-fadeInUp" style="animation-delay:${(i+1)*0.07}s;display:flex;flex-direction:column;height:100%;"
               onclick="startGame('${g.type}','${g.subject}',${grade})">
            <div class="game-card-img" style="background:linear-gradient(135deg,${g.color}22,${g.color}44);height:90px;">
              <span style="font-size:2.5rem;">${g.icon}</span>
              ${g.badge?`<span class="game-card-badge">${g.badge}</span>`:''}
            </div>
            <div class="game-card-body" style="padding:10px;flex:1;display:flex;flex-direction:column;">
              <div class="game-card-tag" style="font-size:0.65rem;">${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.emoji}</div>
              <h3 class="game-card-title" style="font-size:0.85rem;margin-bottom:4px;flex:1;">${g.title}</h3>
              <button class="game-card-btn" style="padding:6px;font-size:0.75rem;">Jugar ▶</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLogros() {
  const profile = CleoAuth.getActive();
  const achieved = profile?.achievements || [];
  const all = CLEDUCA_DATA.achievements;
  const unlockedCount = achieved.length;

  document.getElementById('view-logros').innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">🏆 Logros</div>
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.85rem;color:var(--c-text-muted);">
        ${unlockedCount}/${all.length}
      </div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:16px;display:flex;flex-direction:column;gap:16px;">
      ${CleoGame.checkFreeChest() ? `
        <div onclick="openFreeChest()" style="background:linear-gradient(135deg,#F59E0B,#D97706);
             border-radius:20px;padding:16px;display:flex;align-items:center;gap:14px;cursor:pointer;
             box-shadow:0 4px 16px rgba(245,158,11,0.3);">
          <span style="font-size:2.5rem;animation:bounceIn 1s ease infinite;">📦</span>
          <div style="flex:1;">
            <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#fff;">¡Cofre Gratis!</div>
            <div style="color:rgba(255,255,255,0.85);font-size:0.8rem;">Toca para abrirlo ahora</div>
          </div>
        </div>
      ` : `
        <div style="background:var(--c-surface);border-radius:20px;padding:16px;
             display:flex;align-items:center;gap:14px;opacity:0.7;">
          <span style="font-size:2rem;">📦</span>
          <div>
            <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">Próximo cofre gratis</div>
            <div style="font-size:0.8rem;color:var(--c-text-muted);">Vuelve mañana para reclamarlo</div>
          </div>
        </div>
      `}
      ${(() => {
        const categories = {
          '🌟 Progreso y Exploración': ['first_game', 'level_5', 'level_10', 'perfeccionista'],
          '🔥 Rachas y Dedicación': ['streak_3', 'streak_7'],
          '🎨 Colección y Cleo': ['cleo_custom', 'shop_buyer'],
          '🧠 Conocimiento': ['math_master', 'lang_master', 'science_master']
        };

        return Object.keys(categories).map(catName => {
          const ids = categories[catName];
          const items = all.filter(a => ids.includes(a.id) || (!Object.values(categories).flat().includes(a.id) && catName.includes('Progreso')));
          if (items.length === 0) return '';

          return `
            <div style="margin-top:8px;">
              <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:var(--c-primary);margin-bottom:12px;">
                ${catName}
              </h3>
              <div style="display:flex;flex-direction:column;gap:10px;">
                ${items.map(a => {
                  const done = achieved.includes(a.id);
                  return `
                    <div class="achievement-card ${done?'':'locked'}">
                      <div class="achievement-icon" style="background:${done?'var(--grad-btn)':'var(--c-border)'};">
                        ${a.emoji}
                      </div>
                      <div class="achievement-info">
                        <div class="achievement-name">${a.name}</div>
                        <div class="achievement-desc">${a.desc}</div>
                        <div class="achievement-xp">+${a.xp} XP ${done?'· ✅ Completado':'· 🔒 Bloqueado'}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      })()}
    </div>
  `;
}
function buyChest(cost, tier) {
  const profile = CleoAuth.getActive();
  if (!profile) return;
  const currentXP = profile.xp || 0;
  if (currentXP < cost) {
    CleoUI.toast(`¡Necesitas ${cost} XP para canjear este cofre!`, '🔒', 'info');
    return;
  }
  
  profile.xp = currentXP - cost;
  CleoAuth.updateProfile(profile.id, { xp: profile.xp });
  CleoGame.addLives(3);
  CleoAnimations.confetti();
  CleoSpeech.say('¡Felicidades! Canjeaste un cofre de recompensas con tus puntos.');
  
  CleoUI.toast(`¡Cofre ${tier} canjeado con éxito! +3 Vidas ❤️`, '🎁', 'success');
  renderPerfil();
}

function renderPerfil() {
  const profile = CleoAuth.getActive();
  if (!profile) return;
  const skin = profile.skin || 'verde';
  const accessory = profile.accessory || 'none';
  const xp = profile.xp || 0;
  const level = profile.level || 1;
  const tab = window.currentProfileTab || 'cleo';

  document.getElementById('view-perfil').innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">👤 Mi Perfil y Cuenta</div>
    </div>
    
    <!-- 3 TABS EXACTAS -->
    <div style="display:flex;background:var(--c-surface);border-bottom:1px solid var(--c-border);">
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:800;font-size:0.85rem;
              color:${tab==='cleo'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='cleo'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='cleo'; renderPerfil();">
        🐶 Personalizar Cleo
      </button>
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:800;font-size:0.85rem;
              color:${tab==='cuenta'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='cuenta'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='cuenta'; renderPerfil();">
        👤 Cuenta y Datos
      </button>
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:800;font-size:0.85rem;
              color:${tab==='ajustes'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='ajustes'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='ajustes'; renderPerfil();">
        ⚙️ Ajustes App
      </button>
    </div>

    <div style="overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;padding:16px;display:flex;flex-direction:column;gap:16px;">
      ${tab === 'cleo' ? `
        <!-- Mascot Header SVG -->
        <div class="card" style="text-align:center;padding:20px;">
          <div id="cleo-main" style="width:130px;height:130px;margin:0 auto 12px;cursor:pointer;border-radius:50%;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.12);background:#fff;padding:6px;"
               onclick="CleoSpeech.say('¡Hola! ¡Soy ${profile.nickname||'Cleo'} y soy tu fiel compañero!')">
            ${CleoChr.getSVG(skin, 'happy', accessory).replace('class="cleo-svg"', 'class="cleo-svg" style="width:100%;height:100%;"')}
          </div>
          <div class="cleo-name-tag">${profile.nickname || profile.name}</div>
          <div style="color:var(--c-text-muted);font-size:0.85rem;margin:4px 0;font-weight:600;">
            Nivel ${level} · ${CleoGame.getLevelName(level)}
          </div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:0.95rem;color:var(--c-xp);margin-top:4px;">
            ⭐ ${xp} Puntos XP acumulados
          </div>
        </div>

        <!-- Edit nickname -->
        <div class="card" id="cleo-edit-section">
          <h3 style="font-size:1rem;margin-bottom:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">✏️ Apodo de la Mascota</h3>
          <div style="display:flex;gap:8px;">
            <input class="input-field" id="nickname-input" placeholder="Nombre para Cleo..." value="${profile.nickname||''}" style="flex:1;">
            <button class="btn btn-primary btn-sm" onclick="saveNickname()">Guardar</button>
          </div>
        </div>

        <!-- Tienda de Cofres con Puntos XP -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:var(--c-primary);">
            🎁 Canje de Cofres por Puntos
          </h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--c-bg-card);padding:12px 14px;border-radius:16px;border:1px solid var(--c-border);">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.8rem;">📦</span>
                <div>
                  <div style="font-weight:800;font-size:0.9rem;">Cofre Bronce</div>
                  <div style="font-size:0.75rem;color:var(--c-text-muted);">Restaura +3 Vidas</div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="buyChest(100, 'Bronce')">
                ⭐ 100 XP
              </button>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;background:var(--c-bg-card);padding:12px 14px;border-radius:16px;border:1px solid var(--c-border);">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.8rem;">🎁</span>
                <div>
                  <div style="font-weight:800;font-size:0.9rem;">Cofre Plata</div>
                  <div style="font-size:0.75rem;color:var(--c-text-muted);">Vidas + XP Extra</div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="buyChest(250, 'Plata')">
                ⭐ 250 XP
              </button>
            </div>
          </div>
        </div>

        <!-- Skins -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🎨 Skins de Cleo</h3>
          <div class="skins-grid">
            ${CLEDUCA_DATA.skins.map(s=>{
              const locked = s.locked && xp < s.xpRequired;
              return `
                <div class="skin-card ${skin===s.id?'selected':''} ${locked?'locked':''}"
                     onclick="${locked?`CleoUI.toast('Necesitas ${s.xpRequired} XP','🔒','info')`:`selectSkin('${s.id}')`}">
                  <div class="skin-card-icon">${s.emoji}</div>
                  <div class="skin-card-name">${s.name.replace('Cleo ','')}</div>
                  ${locked?`<div class="skin-lock">🔒</div>`:``}
                  ${!locked&&s.xpRequired>0?`<div style="font-size:0.6rem;color:var(--c-primary);">⭐${s.xpRequired}</div>`:``}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Accessories -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🎩 Accesorios</h3>
          <div class="skins-grid">
            ${CLEDUCA_DATA.accessories.map(a=>{
              const locked = a.locked && xp < a.xpRequired;
              return `
                <div class="skin-card ${accessory===a.id?'selected':''} ${locked?'locked':''}"
                     onclick="${locked?`CleoUI.toast('Necesitas ${a.xpRequired} XP','🔒','info')`:`selectAccessory('${a.id}')`}">
                  <div class="skin-card-icon">${a.emoji}</div>
                  <div class="skin-card-name">${a.name}</div>
                  ${locked?`<div class="skin-lock">🔒</div>`:``}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : tab === 'cuenta' ? `
        <!-- Account Details Tab -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:14px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">👤 Datos de la Cuenta</h3>
          
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="font-size:0.8rem;font-weight:700;color:var(--c-text-muted);">Nombre del Estudiante:</label>
              <input class="input-field" value="${profile.name}" style="margin-top:4px;" onchange="CleoAuth.updateProfile('${profile.id}', {name: this.value})">
            </div>

            <div>
              <label style="font-size:0.8rem;font-weight:700;color:var(--c-text-muted);">Correo Electrónico:</label>
              <input class="input-field" value="${profile.email || 'estudiante@cleduca.com'}" style="margin-top:4px;" onchange="CleoAuth.updateProfile('${profile.id}', {email: this.value}); CleoUI.toast('Correo guardado','✅','success');">
            </div>

            <div>
              <label style="font-size:0.8rem;font-weight:700;color:var(--c-text-muted);">Contraseña de Acceso:</label>
              <input type="password" class="input-field" value="••••••••" style="margin-top:4px;" onchange="CleoUI.toast('Contraseña actualizada','🔒','success');">
            </div>

            <div>
              <label style="font-size:0.8rem;font-weight:700;color:var(--c-text-muted);">PIN de Seguridad de Padres:</label>
              <input type="text" maxlength="4" class="input-field" value="${profile.parentPin || '1234'}" style="margin-top:4px;" onchange="CleoAuth.updateProfile('${profile.id}', {parentPin: this.value}); CleoUI.toast('PIN actualizado','🔐','success');">
            </div>
          </div>
        </div>

        <!-- Official Social Media -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🌐 Redes Sociales y Soporte Cleduca</h3>
          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:10px;">
            <a href="https://instagram.com" target="_blank" style="text-decoration:none;" class="btn btn-secondary">
              📸 Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" style="text-decoration:none;" class="btn btn-secondary">
              🎵 TikTok
            </a>
            <a href="https://facebook.com" target="_blank" style="text-decoration:none;" class="btn btn-secondary">
              📘 Facebook
            </a>
            <a href="https://wa.me/573000000000" target="_blank" style="text-decoration:none;" class="btn btn-secondary">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- App Info -->
        <div class="card" style="text-align:center;">
          <div style="font-weight:800;font-size:0.95rem;">Cleduca v2.7 — Educación Primaria</div>
          <div style="font-size:0.78rem;color:var(--c-text-muted);margin-top:4px;">Alineado con el currículo del Ministerio de Educación de Colombia 🇨🇴</div>
        </div>
      ` : `
        <!-- Settings Tab -->
        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🎨 Tema de la App</h3>
          <div class="themes-grid">
            ${CLEDUCA_DATA.themes.map(t=>`
              <button class="theme-btn ${(profile.theme||'selva')===t.id?'active':''}"
                      style="background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]});"
                      onclick="selectTheme('${t.id}')">
                <span>${t.emoji}</span>
              </button>
            `).join('')}
          </div>
          
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--c-border);">
            <div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;">🌙 Modo Oscuro</div>
              <div style="font-size:0.8rem;color:var(--c-text-muted);">Cámbialo cuando quieras</div>
            </div>
            <div onclick="toggleDarkMode()" style="width:52px;height:28px;border-radius:14px;background:${profile.darkMode?'var(--c-primary)':'var(--c-border)'};position:relative;cursor:pointer;transition:background 0.3s ease;">
              <div style="position:absolute;top:3px;left:${profile.darkMode?'24px':'3px'};width:22px;height:22px;border-radius:50%;background:#fff;transition:left 0.3s ease;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--c-border);">
            <div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;">🔊 Voz de Cleo</div>
              <div style="font-size:0.8rem;color:var(--c-text-muted);">Activar o desactivar audios</div>
            </div>
            <div onclick="toggleVoice()" style="width:52px;height:28px;border-radius:14px;background:${profile.voiceEnabled!==false?'var(--c-primary)':'var(--c-border)'};position:relative;cursor:pointer;transition:background 0.3s ease;">
              <div style="position:absolute;top:3px;left:${profile.voiceEnabled!==false?'24px':'3px'};width:22px;height:22px;border-radius:50%;background:#fff;transition:left 0.3s ease;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;">🎒 Mi Grado Escolar</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${CLEDUCA_DATA.grades.map(g=>`
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;border:2px solid ${profile.grade===g.id?'var(--c-primary)':'var(--c-border)'};background:${profile.grade===g.id?'var(--c-surface)':'var(--c-bg-card)'};cursor:pointer;" onclick="changeGrade(${g.id})">
                <span style="font-size:1.5rem;">${g.emoji}</span>
                <div style="flex:1;">
                  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;">${g.name}</div>
                  <div style="font-size:0.78rem;color:var(--c-text-muted);">${g.ages}</div>
                </div>
                ${profile.grade===g.id?'<span style="color:var(--c-primary);font-size:1.3rem;">✓</span>':''}
              </div>
            `).join('')}
          </div>
        </div>
      `}

      <!-- Logout -->
      <button class="btn btn-ghost btn-full" onclick="CleoAuth.isUserLoggedIn() ? CleoAuth.logoutAccount() : (CleoAuth.setActive(null), showAuthScreen())"
              style="margin-top:16px;color:var(--c-lives);">
        ${CleoAuth.isUserLoggedIn() ? '🚪 Cerrar Sesión' : '👤 Salir del Perfil'}
      </button>
    </div>
  `;
}

// ── PROFILE ACTION FUNCTIONS ──
function saveNickname() {
  const val = document.getElementById('nickname-input')?.value?.trim();
  if (!val) return;
  const p = CleoAuth.getActive();
  CleoAuth.updateProfile(p.id, { nickname: val });
  CleoUI.toast(`¡Apodo guardado: ${val}!`, '🐉', 'success');
  renderPerfil();
}
function selectSkin(id) {
  const p = CleoAuth.getActive();
  CleoAuth.updateProfile(p.id, { skin: id });
  CleoGame.unlockAchievement('cleo_custom');
  CleoUI.toast('¡Skin de Cleo cambiado! 🎨', '✨', 'success');
  renderPerfil();
}
function selectAccessory(id) {
  const p = CleoAuth.getActive();
  CleoAuth.updateProfile(p.id, { accessory: id });
  CleoUI.toast('¡Accesorio puesto! 🎩', '✨', 'success');
  renderPerfil();
}
function selectTheme(id) {
  const p = CleoAuth.getActive();
  CleoAuth.updateProfile(p.id, { theme: id });
  document.documentElement.setAttribute('data-theme', id);
  CleoUI.toast('¡Tema cambiado! 🎨', '✨', 'success');
  renderPerfil();
}
function toggleDarkMode() {
  const p = CleoAuth.getActive();
  const newDark = !p.darkMode;
  CleoAuth.updateProfile(p.id, { darkMode: newDark });
  document.documentElement.setAttribute('data-dark', newDark);
  renderPerfil();
}
function toggleVoice() {
  const p = CleoAuth.getActive();
  const newState = p.voiceEnabled !== false ? false : true;
  CleoAuth.updateProfile(p.id, { voiceEnabled: newState });
  if (!newState && CleoSpeech.isEnabled()) {
    CleoSpeech.toggle();
  } else if (newState && !CleoSpeech.isEnabled()) {
    CleoSpeech.toggle();
  }
  renderPerfil();
}
function changeGrade(gradeId) {
  const p = CleoAuth.getActive();
  CleoAuth.updateProfile(p.id, { grade: gradeId });
  const g = CLEDUCA_DATA.grades.find(g=>g.id===gradeId);
  CleoUI.toast(`¡Grado cambiado a ${g?.name}!`, g?.emoji, 'success');
  renderPerfil();
}
function openFreeChest() {
  if (!CleoGame.checkFreeChest()) return;
  const rewards = CleoGame.claimFreeChest();
  CleoAnimations.confetti();
  CleoSpeech.say(CLEDUCA_DATA.cleoMessages.chest[0]);
  CleoUI.toast(`¡Cofre abierto! ${rewards.message}`, '📦', 'success');
  setTimeout(() => renderHome(), 500);
}
function showSettings() {
  CleoUI.toast('Configuración disponible próximamente', '⚙️', 'info');
}

// ── GAME STARTER ──
// ── GAME INTRO POPUP ──
const GAME_INFO = {
  quiz:        { icon:'🧠', name:'Quiz Veloz', desc:'Responde preguntas de selección múltiple. ¡Elige la correcta antes de agotar tus vidas!', howTo:'Lee la pregunta y toca la respuesta correcta. Si necesitas ayuda, usa el botón 💡.' },
  quiz_idioma: { icon:'🌎', name:'Curso de Idiomas', desc:'Aprende vocabulario y frases claves pronunciando y reconociendo palabras.', howTo:'Selecciona la opción correcta en el idioma objetivo para subir de nivel.' },
  sopa:        { icon:'🔤', name:'Sopa de Letras', desc:'Encuentra todas las palabras escondidas en la cuadrícula de letras.', howTo:'Haz clic o desliza en las letras para formar las palabras de la lista.' },
  memoria:     { icon:'🧩', name:'Memoria de Imágenes', desc:'Encuentra los pares de cartas iguales volteándolas de dos en dos.', howTo:'Toca una carta para voltearla y busca su pareja idéntica.' },
  carrera:     { icon:'🏎️', name:'Carrera de Números', desc:'Resuelve operaciones matemáticas a toda velocidad para llegar a la meta.', howTo:'Responde cada cálculo lo más rápido posible.' },
  snake:       { icon:'🐍', name:'La Serpiente de Cleo', desc:'Guía a la serpiente para comer el resultado correcto y crecer.', howTo:'Usa las flechas del teclado o botones en pantalla para dirigir la serpiente.' },
  capibara:    { icon:'🦦', name:'Aventura Capibara', desc:'Ayuda al simpático capibara a esquivar obstáculos y atrapar la respuesta correcta.', howTo:'Mueve al capibara a la izquierda o derecha para alinearlo con la respuesta correcta.' },
  diferencias:  { icon:'👀', name:'Diferencias', desc:'Encuentra al elemento intruso en la cuadrícula.', howTo:'Observa con atención y toca la figura que sea diferente a las demás.' },
  puzzle:       { icon:'🧠', name:'Puzzles de Secuencias', desc:'Descubre el patrón numérico o lógico de la serie.', howTo:'Analiza la secuencia de números y selecciona cuál sigue.' },
  anatomia:     { icon:'🫀', name:'Anatomía del Cuerpo', desc:'Explora los órganos y la estructura del cuerpo humano.', howTo:'Lee y escucha las explicaciones de cada parte del cuerpo.' },
  pintura:      { icon:'🎨', name:'Estudio de Dibujo', desc:'Expresa tu creatividad dibujando y coloreando en un lienzo interactivo.', howTo:'Elige tus colores favoritos y dibuja con tu dedo o ratón.' },
  dressup:      { icon:'👗', name:'Viste a Cleo', desc:'Personaliza a Cleo con accesorios y atuendos.', howTo:'Toca los accesorios para probárselos a Cleo.' },
  musica:       { icon:'🎹', name:'Piano de Cleo', desc:'Crea notas y melodías musicales en un piano colorido.', howTo:'Toca las teclas del piano para escuchar las notas musicales.' },
  rompecabezas: { icon:'🧩', name:'Rompecabezas de Cleo', desc:'Arma la imagen desordenada intercambiando fichas.', howTo:'Toca una ficha y luego otra para cambiarlas de lugar.' },
  misterio:     { icon:'🕵️', name:'Detective Cleo', desc:'Resuelve acertijos de lógica encontrando al sospechoso correcto.', howTo:'Lee la pista con atención y selecciona cuál sospechoso coincide.' }
};

function showGameIntro(type, subject, grade) {
  const info = GAME_INFO[type] || { icon:'🎮', name:'Juego', desc:'', howTo:'' };
  const subjectInfo = CLEDUCA_DATA.subjects.find(s => s.id === subject);
  const view = document.getElementById('view-game');
  view.innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;
         justify-content:center;padding:32px 20px;gap:20px;text-align:center;">
      <div style="font-size:5rem;animation:bounceIn 0.6s ease;">${info.icon}</div>
      <h1 style="font-size:1.8rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;
           background:var(--grad-btn);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
        ${info.name}
      </h1>
      ${subjectInfo ? `<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
           border-radius:20px;background:${subjectInfo.color}15;border:1px solid ${subjectInfo.color}30;">
        <span>${subjectInfo.emoji}</span>
        <span style="font-weight:700;font-size:0.85rem;color:${subjectInfo.color};">${subjectInfo.name}</span>
      </div>` : ''}
      <div class="card" style="text-align:left;width:100%;padding:20px;">
        <p style="margin-bottom:12px;line-height:1.5;">${info.desc}</p>
        <div style="background:var(--c-surface);border-radius:14px;padding:14px;">
          <div style="font-weight:800;font-size:0.85rem;margin-bottom:6px;color:var(--c-primary);">📋 Cómo jugar:</div>
          <p style="font-size:0.9rem;line-height:1.5;color:var(--c-text-muted);">${info.howTo}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:row;gap:12px;width:100%;align-items:center;">
        <button class="top-back-btn" onclick="CleoRouter.navigate('home')" style="width:48px;height:48px;">${CLEO_BACK_ARROW}</button>
        <button class="btn btn-primary btn-lg" style="flex:1;" onclick="launchGame('${type}','${subject}',${grade})">
          ▶ ¡Empezar!
        </button>
      </div>
    </div>
  `;
  CleoRouter.showView('game');
}

function startGame(type, subject, grade) {
  const lives = CleoGame.getLives();
  if (lives <= 0 && !CleoMonetization.isPremium()) {
    CleoMonetization.watchAdForLives(() => startGame(type, subject, grade));
    return;
  }
  // Show intro popup instead of starting immediately
  showGameIntro(type, subject, grade);
}

function launchGame(type, subject, grade) {
  // Actually start the game engine
  document.getElementById('view-game').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;gap:16px;">
      <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.15);background:#fff;animation:floatBig 2s ease-in-out infinite;">
        <img src="img/cleo_logo.png" alt="Cleo" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:var(--c-primary);">Cargando lección con Cleo...</div>
    </div>
  `;
  setTimeout(() => {
    switch(type) {
      case 'quiz':         GameQuiz.start(subject, grade); break;
      case 'quiz_idioma': {
        const parts = String(subject).split('_');
        GameDuolingo.start(parts[0] || 'ingles', parts[1] || 1);
        break;
      }
      case 'sopa':         GameSopa.start(subject, grade); break;
      case 'memoria':      GameMemoria.start(6); break;
      case 'carrera':      GameCarrera.start(grade); break;
      case 'snake':        GameSnake.start(subject, grade); break;
      case 'capibara':     GameCapibara.start(subject, grade); break;
      case 'diferencias':  GameDiferencias.start(); break;
      case 'puzzle':       GamePuzzle.start(); break;
      case 'anatomia':     GameAnatomia.start(); break;
      case 'pintura':      GamePintura.start(); break;
      case 'dressup':      GameDressUp.start(); break;
      case 'musica':       GameMusica.start(); break;
      case 'rompecabezas': GameRompecabezas.start(); break;
      case 'misterio':     GameMisterio.start(); break;
      default:             GameQuiz.start(subject, grade); break;
    }
  }, 300);
}

// ── PROFILE SCREENS ──
function showAuthScreen() {
  document.getElementById('view-login').innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;padding:0;background:var(--grad-bg);">
      <div class="onboard-header">
        <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;animation:floatBig 4s ease-in-out infinite;">
          <img src="img/cleo_logo.png" alt="Cleo" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <h1 class="onboard-title">¡Hola!</h1>
        <p class="onboard-subtitle">Guarda el progreso de tus niños en la nube</p>
      </div>
      <div class="onboard-body" style="display:flex;flex-direction:column;justify-content:center;">
        <div class="card" style="margin-bottom:20px;">
          <div class="input-group">
            <label class="input-label">Correo Electrónico</label>
            <input type="email" class="input-field" id="auth-email" placeholder="tu@correo.com">
          </div>
          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <input type="password" class="input-field" id="auth-pass" placeholder="Mínimo 6 caracteres">
          </div>
          <div style="display:flex;gap:12px;margin-top:24px;">
            <button class="btn btn-secondary btn-full" onclick="handleRegister()">Crear Cuenta</button>
            <button class="btn btn-primary btn-full" onclick="handleLogin()">Entrar</button>
          </div>
        </div>

        <button class="btn btn-full" onclick="handleGoogleLogin()" style="background:#fff;color:#333;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuar con Google
        </button>

        <button class="btn btn-ghost btn-full" onclick="showProfiles()" style="color:var(--c-text-muted);">
          👤 Continuar sin cuenta
        </button>
      </div>
    </div>
  `;
  CleoRouter.showView('login');
}

async function handleGoogleLogin() {
  CleoUI.toast('Redirigiendo a Google...', '🌐', 'info');
  const res = await CleoAuth.loginWithGoogle();
  if (res && res.error) {
    CleoUI.toast(res.error, '❌', 'error');
  }
}

async function handleLogin() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) return CleoUI.toast('Llena todos los campos', '⚠️', 'error');
  
  CleoUI.toast('Iniciando sesión...', '⏳', 'info');
  const res = await CleoAuth.loginAccount(email, pass);
  if (res.error) {
    CleoUI.toast(res.error, '❌', 'error');
  } else {
    CleoUI.toast('¡Bienvenido!', '🎉', 'success');
    showProfiles();
  }
}

async function handleRegister() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) return CleoUI.toast('Llena todos los campos', '⚠️', 'error');
  if (pass.length < 6) return CleoUI.toast('Contraseña muy corta (mínimo 6)', '⚠️', 'error');
  
  CleoUI.toast('Creando cuenta...', '⏳', 'info');
  const res = await CleoAuth.registerAccount(email, pass);
  if (res.error) {
    CleoUI.toast(res.error, '❌', 'error');
  } else {
    CleoUI.toast('¡Cuenta creada con éxito!', '🎉', 'success');
    showProfiles();
  }
}

function showProfiles() {
  const profiles = CleoAuth.getAll();
  const canAdd = CleoAuth.canAddProfile();

  document.getElementById('view-profiles').innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;padding:0;">
      <!-- Header -->
      <div style="background:var(--grad-hero);padding:48px 24px 40px;text-align:center;border-radius:0 0 32px 32px;">
        <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;animation:floatBig 4s ease-in-out infinite;">
          <img src="img/cleo_logo.png" alt="Cleo" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <h1 style="color:#fff;font-size:2rem;margin-bottom:4px;">¡Bienvenido a Cleduca!</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:0.95rem;">¿Quién va a aprender hoy?</p>
      </div>

      <div style="flex:1;padding:24px 16px;">
        ${profiles.length === 0 ? `
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:4rem;margin-bottom:12px;">👶</div>
            <h2 style="font-size:1.3rem;margin-bottom:8px;">¡Crea tu primer perfil!</h2>
            <p style="color:var(--c-text-muted);margin-bottom:24px;">Personaliza tu experiencia de aprendizaje</p>
          </div>
        ` : ''}

        <div class="profiles-grid">
          ${profiles.map(p=>`
            <div class="profile-card" onclick="selectProfile('${p.id}')">
              <div class="profile-avatar">
                ${CleoChr.getSVG(p.skin||'verde','happy',p.accessory||'none').replace('class="cleo-svg"','class="cleo-svg" style="width:100%;height:100%;"')}
              </div>
              <div class="profile-name">${p.name}</div>
              <div class="profile-grade">${CLEDUCA_DATA.grades.find(g=>g.id===p.grade)?.name||'Explorador'}</div>
              <div style="width:100%;margin-top:4px;">
                <div class="progress-wrap" style="height:6px;">
                  <div class="progress-bar" style="width:${CleoGame.getLevelProgress()}%;"></div>
                </div>
              </div>
            </div>
          `).join('')}

          ${canAdd ? `
            <div class="profile-card add-profile" onclick="showCreateProfile()">
              <div style="font-size:2.5rem;color:var(--c-primary);">+</div>
              <div class="profile-name" style="color:var(--c-primary);">Nuevo Perfil</div>
              <div class="profile-grade">${!CleoMonetization.isPremium()&&profiles.length>=1?`(${CleoAuth.MAX_FREE} máx. gratis)`:''}</div>
            </div>
          ` : `
            <div class="profile-card add-profile" style="opacity:0.6;" onclick="CleoUI.showModal('plans')">
              <div style="font-size:2rem;">👑</div>
              <div class="profile-name" style="color:var(--c-primary);">Premium</div>
              <div class="profile-grade">Para más perfiles</div>
            </div>
          `}
        </div>

        <button class="btn btn-ghost btn-full" onclick="showAuthScreen()"
                style="margin-top:16px;color:var(--c-text-muted);">
          👤 Volver al Login
        </button>
      </div>
    </div>
  `;
  CleoRouter.showView('profiles');
}

function selectProfile(id) {
  const p = CleoAuth.getAll().find(pr=>pr.id===id);
  if (!p) return;
  if (p.pin) {
    showPinModal(id);
  } else {
    CleoAuth.setActive(id);
    applyProfileSettings(p);
    CleoRouter.navigate('home');
  }
}

function showPinModal(profileId) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay center';
  overlay.innerHTML = `
    <div class="modal-dialog" style="text-align:center;">
      <div style="font-size:2rem;margin-bottom:12px;">🔒</div>
      <h3 class="modal-title">Ingresa tu PIN</h3>
      <p class="modal-subtitle">PIN de 4 dígitos para entrar al perfil</p>
      <div class="pin-inputs">
        ${[0,1,2,3].map(i=>`<input class="pin-digit" type="password" maxlength="1" inputmode="numeric" id="pd${i}" oninput="movePinFocus(${i})">`).join('')}
      </div>
      <button class="btn btn-primary btn-full" onclick="validatePin('${profileId}')">Entrar</button>
      <button class="btn btn-ghost btn-full" onclick="this.closest('.modal-overlay').remove()" style="margin-top:8px;">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('pd0')?.focus();
}

function movePinFocus(i) {
  const next = document.getElementById(`pd${i+1}`);
  if (next) next.focus();
}
function validatePin(profileId) {
  const pin = [0,1,2,3].map(i=>document.getElementById(`pd${i}`)?.value||'').join('');
  if (CleoAuth.validatePin(profileId, pin)) {
    document.querySelector('.modal-overlay')?.remove();
    CleoAuth.setActive(profileId);
    const p = CleoAuth.getActive();
    applyProfileSettings(p);
    CleoRouter.navigate('home');
  } else {
    [0,1,2,3].forEach(i => { const el = document.getElementById(`pd${i}`); if(el) el.value=''; el?.classList.add('animate-shake'); });
    CleoUI.toast('PIN incorrecto', '🔒', 'error');
  }
}

function applyProfileSettings(p) {
  document.documentElement.setAttribute('data-theme', p.theme || 'selva');
  document.documentElement.setAttribute('data-dark', p.darkMode || false);
}

function showCreateProfile(isGuest=false) {
  if (isGuest) {
    const result = CleoAuth.createProfile({ name:'Explorador', avatar:'🐉', pin:null, grade:3 });
    if (result.success) {
      applyProfileSettings(result.profile);
      CleoRouter.navigate('grade');
    }
    return;
  }
  document.getElementById('view-auth').innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;">
      <div class="onboard-header">
        <div style="width:70px;height:70px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;">
          <img src="img/cleo_logo.png" alt="Cleo" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <h1 class="onboard-title">Crear Perfil</h1>
        <p class="onboard-subtitle">Personaliza tu experiencia en Cleduca</p>
      </div>
      <div class="onboard-body">
        <!-- Google Sign-in -->
        <button class="btn btn-google btn-full btn-lg" onclick="signInWithGoogle()" style="margin-bottom:16px;">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continuar con Google
        </button>
        <div class="divider-text">o con un nombre</div>
        <div class="input-group">
          <label class="input-label">¿Cómo te llamas?</label>
          <input class="input-field" id="profile-name" placeholder="Tu nombre..." maxlength="20">
        </div>
        <div class="input-group">
          <label class="input-label">PIN de seguridad (opcional)</label>
          <div class="pin-inputs">
            ${[0,1,2,3].map(i=>`<input class="pin-digit" type="password" maxlength="1" inputmode="numeric" id="new-pd${i}" oninput="movePinFocus2(${i})">`).join('')}
          </div>
          <p style="font-size:0.8rem;color:var(--c-text-muted);text-align:center;">Déjalo vacío si no quieres PIN</p>
        </div>
        <button class="btn btn-primary btn-full btn-lg" onclick="createNewProfile()">Crear perfil 🐶</button>
        <button class="btn btn-ghost btn-full" onclick="showProfiles()" style="margin-top:8px;">← Volver</button>
      </div>
    </div>
  `;
  CleoRouter.showView('auth');
}

function movePinFocus2(i) {
  const next = document.getElementById(`new-pd${i+1}`);
  if (next) next.focus();
}

function createNewProfile() {
  const name = document.getElementById('profile-name')?.value?.trim() || 'Explorador';
  const pin = [0,1,2,3].map(i=>document.getElementById(`new-pd${i}`)?.value||'').join('');
  const result = CleoAuth.createProfile({ name, pin: pin.length===4?pin:null, grade:3 });
  if (result.error === 'max_profiles') {
    CleoUI.toast(`Máximo ${result.max} perfiles en tu plan`, '👑', 'info');
    setTimeout(() => CleoUI.showModal('plans'), 1000);
    return;
  }
  applyProfileSettings(result.profile);
  CleoRouter.navigate('grade');
}

function signInWithGoogle() {
  // Google OAuth placeholder — needs Google Cloud Console Client ID to activate
  CleoUI.toast('Google Sign-In disponible próximamente', '🔜', 'info');
  CleoUI.toast('Por ahora usa nombre + PIN', 'ℹ️', 'info');
}

function showGradeSelector() {
  let selected = 3;
  const render = () => {
    document.getElementById('view-grade').innerHTML = `
      <div style="min-height:100dvh;display:flex;flex-direction:column;">
        <div class="onboard-header">
          <div style="font-size:3rem;margin-bottom:8px;">🎒</div>
          <h1 class="onboard-title">¿En qué curso estás?</h1>
          <p class="onboard-subtitle">Elige tu nivel para empezar a jugar y aprender</p>
        </div>
        <div class="onboard-body" style="display:flex;flex-direction:column;gap:10px;flex:1;">
          ${CLEDUCA_DATA.grades.map(g=>`
            <div class="grade-card ${selected===g.id?'selected':''}" onclick="selectGrade(${g.id})">
              <div class="grade-icon">${g.emoji}</div>
              <div class="grade-info">
                <div class="grade-name">${g.name}</div>
                <div class="grade-ages">Niños de ${g.ages}</div>
              </div>
              <span class="grade-check">✓</span>
            </div>
          `).join('')}
        </div>
        <div style="padding:16px 20px 32px;">
          <button class="btn btn-primary btn-full btn-lg" onclick="confirmGrade(${selected})">Continuar ▶</button>
        </div>
      </div>
    `;
  };
  window.selectGrade = (id) => { selected = id; render(); };
  window.confirmGrade = (id) => {
    const p = CleoAuth.getActive();
    if (p) CleoAuth.updateProfile(p.id, { grade: id });
    CleoRouter.navigate('home');
  };
  render();
  CleoRouter.showView('grade');
}
