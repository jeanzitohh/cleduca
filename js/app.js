/* ===========================
   CLEDUCA — App Principal: Router, UI, Cleo, Animaciones, Speech
   =========================== */

window.CLEO_BACK_ARROW = `<svg style="width:22px;height:22px;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

// ── SPEECH (Voz Femenina para Cleo) ──
window.CleoSpeech = (function() {
  const VOICE_KEY = 'cleduca_voice_enabled';
  const synth = window.speechSynthesis;
  let cachedVoice = null;
  let _enabled = localStorage.getItem(VOICE_KEY) !== 'false'; // Lee de localStorage una sola vez

  // Nombres de voces femeninas conocidas en español
  const FEMALE_NAMES = ['paulina','sabina','mónica','monica','elena','laura','helena',
    'conchita','lucía','lucia','penélope','penelopenelope','miren','google español',
    'microsoft sabina','microsoft helena','microsoft laura'];

  function findFemaleVoice() {
    if (cachedVoice) return cachedVoice;
    const voices = synth ? synth.getVoices() : [];
    if (!voices.length) return null;
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    const female = esVoices.find(v => FEMALE_NAMES.some(f => v.name.toLowerCase().includes(f)));
    if (female) { cachedVoice = female; return female; }
    const MALE_NAMES = ['jorge','andrés','andres','diego','enrique','carlos','pablo','juan'];
    const nonMale = esVoices.find(v => !MALE_NAMES.some(m => v.name.toLowerCase().includes(m)));
    if (nonMale) { cachedVoice = nonMale; return nonMale; }
    if (esVoices.length) { cachedVoice = esVoices[0]; return esVoices[0]; }
    cachedVoice = voices[0]; return voices[0];
  }

  if (synth) synth.onvoiceschanged = () => { cachedVoice = null; };

  function say(text, rate=0.92, pitch=1.35) {
    if (!_enabled || !synth || !text) return;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-CO'; utt.rate = rate; utt.pitch = pitch; utt.volume = 0.9;
    const voice = findFemaleVoice();
    if (voice) utt.voice = voice;
    synth.speak(utt);
  }

  function setEnabled(val) {
    _enabled = !!val;
    localStorage.setItem(VOICE_KEY, val ? 'true' : 'false');
    if (!val && synth) synth.cancel();
  }

  function toggle() { setEnabled(!_enabled); return _enabled; }
  function isEnabled() { return _enabled; }

  return { say, toggle, isEnabled, setEnabled };
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
  function getSVG(skin='verde', expression='happy', accessory='none') {
    const accEmojis = {
      hat: '🎩', crown: '👑', pirate: '🏴‍☠️', beanie: '🧶', ninja: '🥷',
      glasses: '🕶️', smart_glasses: '👓', hero_mask: '🎭', monocle: '🧐', star_glasses: '🤩',
      bowtie: '🎀', cape: '🦸', explorer: '🦺', armor: '🛡️', tutu: '🩰'
    };
    const accEmoji = accEmojis[accessory] || '';

    return `
      <div class="cleo-svg" style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:visible;">
        <img src="/img/Logo_cleduca_transparente.png" alt="Cleo" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 16px rgba(0,0,0,0.15));" onerror="this.src='/img/Logo_cleduca_transparente.svg'">
        ${accEmoji ? `<div style="position:absolute;top:2px;right:2px;font-size:1.6rem;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.4));z-index:5;pointer-events:none;">${accEmoji}</div>` : ''}
      </div>
    `;
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
      // Usar Wompi si está disponible, sino usar CleoWompi directamente
      const useWompi = typeof CleoWompi !== 'undefined';
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
              <!-- Botón Wompi real -->
              <button class="btn btn-primary btn-full"
                      style="background:${p.popular?'linear-gradient(135deg,#7C3AED,#0EA5E9)':'var(--c-primary)'};"
                      onclick="
                        if(typeof CleoWompi!=='undefined'){
                          document.getElementById('modal-overlay').remove();
                          CleoWompi.checkout('${p.id}', ()=>CleoUI.toast('¡Premium activado! 🎉','👑','success'));
                        } else {
                          CleoMonetization.activatePremium('${p.id}');
                          document.getElementById('modal-overlay').remove();
                          CleoUI.toast('¡Premium activado! 🎉','👑','success');
                        }">
                💳 Suscribirme — ${p.price}${p.period}
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

  function renderGameView({ title, progress, lives, content, onBack, tip }) {
    const view = document.getElementById('view-game');
    if (!view) return;
    window._gameOnBack = onBack || (() => CleoRouter.navigate('juegos'));
    window._gameTip = tip || "Lee atentamente las opciones y piensa antes de elegir. ¡Tú puedes!";
    view.innerHTML = `
      <div class="game-header" style="flex-shrink:0;">
        <button class="top-back-btn" onclick="if(window._gameOnBack) window._gameOnBack(); else CleoRouter.navigate('juegos');">${CLEO_BACK_ARROW}</button>
        <div class="game-progress-bar"><div class="game-progress-fill" style="width:${progress}%"></div></div>
        <div class="stat-chip lives" style="font-size:1.05rem;padding:6px 10px;"><span class="icon">❤️</span> ${lives}</div>
        <button onclick="CleoUI.toast(window._gameTip, '💡', 'info'); CleoSpeech.say(window._gameTip);" style="background:#F59E0B;color:#fff;border:none;border-radius:12px;padding:6px 10px;font-weight:800;font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:4px;flex-shrink:0;">💡 Tip</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;padding:10px 16px;background:var(--c-bg-nav);border-bottom:1px solid var(--c-border);flex-shrink:0;">
        <h3 style="font-size:1rem;font-family:'Plus Jakarta Sans',sans-serif;margin:0;text-align:center;">${title}</h3>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;position:relative;width:100%;height:100%;">${content}</div>
    `;
    CleoRouter.showView('game');
  }

  function showGameEnd({ score, total, correct, wrong, perfect, onReplay, onHome }) {
    const view = document.getElementById('view-game');
    if (!view) return;
    const pct = Math.round((correct/total)*100);
    const timeSpent = Math.round((Date.now() - (window._gameStartTime || Date.now())) / 1000);
    // Store callbacks globally so onclick can find them
    window._gameEndReplay = onReplay;
    window._gameEndHome = onHome;

    // Send telemetry to Supabase
    try {
      if (window.supabase_client && window._activeChildId) {
        supabase_client.from('game_telemetry').insert([{
          child_id: window._activeChildId,
          game_type: window._currentGameType || 'quiz',
          subject: window._currentGameSubject || 'general',
          grade: window._currentGameGrade || 1,
          score: score || 0,
          correct_answers: correct || 0,
          wrong_answers: wrong || 0,
          time_spent_seconds: timeSpent
        }]).then(() => {}).catch(e => console.warn('Telemetry error:', e));
      }
    } catch(e) {}

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
          <p style="color:var(--c-text-muted);font-size:1rem;">${correct} de ${total} correctas (${pct}%) · ⏱️ ${timeSpent}s</p>
        </div>
        <div style="background:var(--c-surface);border-radius:20px;padding:20px;width:100%;display:flex;gap:12px;justify-content:center;">
          <div style="text-align:center;">
            <div style="font-size:1.6rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-xp);">+${score}</div>
            <div style="font-size:0.75rem;color:var(--c-text-muted);">XP</div>
          </div>
          <div style="width:1px;background:var(--c-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.6rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-primary);">${correct}</div>
            <div style="font-size:0.75rem;color:var(--c-text-muted);">Correctas</div>
          </div>
          <div style="width:1px;background:var(--c-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.6rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-lives);">${wrong}</div>
            <div style="font-size:0.75rem;color:var(--c-text-muted);">Incorrectas</div>
          </div>
          <div style="width:1px;background:var(--c-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.6rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-streak);">${timeSpent}s</div>
            <div style="font-size:0.75rem;color:var(--c-text-muted);">Tiempo</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
          <button class="btn btn-primary btn-full btn-lg" onclick="window._gameEndReplay()" style="font-size:1.15rem;padding:16px;">⏭️ Siguiente Nivel</button>
          <button class="btn btn-secondary btn-full" onclick="window._gameEndHome()">🏠 Volver al inicio</button>
        </div>
      </div>
    `;
  }

  function showAdModal(onComplete) {
    document.querySelectorAll('.modal-overlay.ad-modal').forEach(m => m.remove());
    const AD_DURATION = 10; // segundos obligatorios
    let secondsLeft = AD_DURATION;
    let adWatched = false;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay center ad-modal active';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div class="modal-card animate-scaleUp" style="text-align:center;padding:0;overflow:hidden;max-width:360px;width:100%;">

        <!-- Header -->
        <div style="background:var(--grad-hero);padding:18px 20px 14px;position:relative;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="../img/Logo_cleduca_transparente.png" alt="Cleo"
                   style="width:32px;height:32px;object-fit:contain;"
                   onerror="this.src='img/Logo_cleduca_transparente.png'">
              <span style="color:#fff;font-weight:800;font-size:0.95rem;">Ver anuncio → Ganar recompensa</span>
            </div>
            <div id="ad-timer-badge"
                 style="background:rgba(0,0,0,0.25);color:#fff;padding:4px 10px;border-radius:20px;
                        font-size:0.8rem;font-weight:800;">
              ⏱ <span id="ad-timer">${AD_DURATION}</span>s
            </div>
          </div>

          <!-- Progress bar -->
          <div style="margin-top:10px;background:rgba(255,255,255,0.25);height:6px;border-radius:3px;overflow:hidden;">
            <div id="ad-progress-bar"
                 style="width:0%;height:100%;background:#fff;border-radius:3px;transition:width 1s linear;">
            </div>
          </div>
        </div>

        <!-- Ad container (Google AdSense) -->
        <div style="background:#f9f9f9;min-height:200px;display:flex;align-items:center;justify-content:center;
                    border-bottom:1px solid #eee;padding:8px;position:relative;">
          <!-- Etiqueta reglamentaria de AdSense -->
          <div style="position:absolute;top:4px;left:8px;font-size:0.65rem;color:#aaa;font-family:sans-serif;">
            Publicidad
          </div>
          <ins class="adsbygoogle"
               id="cleo-ad-slot"
               style="display:block;width:320px;min-height:180px;"
               data-ad-client="ca-pub-4702701194736185"
               data-ad-slot="4002873818"
               data-ad-format="rectangle"
               data-full-width-responsive="false">
          </ins>
        </div>

        <!-- Footer / CTA -->
        <div style="padding:16px 20px;">
          <div id="ad-reward-info" style="font-size:0.85rem;color:var(--c-text-muted);margin-bottom:12px;">
            🐶 Cleo está esperando. Mira el anuncio completo para recibir tu recompensa.
          </div>
          <button id="ad-claim-btn"
                  class="btn btn-secondary btn-full"
                  style="opacity:0.5;cursor:not-allowed;font-weight:700;font-size:0.95rem;"
                  disabled>
            ⏳ Disponible en <span id="ad-btn-timer">${AD_DURATION}</span>s
          </button>
          <button onclick="document.querySelector('.ad-modal').remove();"
                  style="background:none;border:none;color:var(--c-text-muted);font-size:0.8rem;
                         cursor:pointer;margin-top:8px;width:100%;padding:4px;">
            Cancelar (sin recompensa)
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Iniciar AdSense dentro del modal
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch(e) {
      console.warn('[CleoAd] AdSense no disponible:', e.message);
    }

    // Countdown
    const interval = setInterval(() => {
      secondsLeft--;
      const pct = ((AD_DURATION - secondsLeft) / AD_DURATION) * 100;

      const timerEl    = document.getElementById('ad-timer');
      const btnTimerEl = document.getElementById('ad-btn-timer');
      const progressEl = document.getElementById('ad-progress-bar');

      if (timerEl)    timerEl.textContent    = Math.max(0, secondsLeft);
      if (btnTimerEl) btnTimerEl.textContent = Math.max(0, secondsLeft);
      if (progressEl) progressEl.style.width = `${Math.min(100, pct)}%`;

      if (secondsLeft <= 0) {
        clearInterval(interval);
        adWatched = true;

        const claimBtn  = document.getElementById('ad-claim-btn');
        const rewardInfo= document.getElementById('ad-reward-info');
        const timerBadge= document.getElementById('ad-timer-badge');

        if (timerBadge) timerBadge.innerHTML = '✅ ¡Listo!';
        if (rewardInfo) rewardInfo.innerHTML  = '🎉 ¡Gracias por ver el anuncio! Ya puedes reclamar tu recompensa.';

        if (claimBtn) {
          claimBtn.disabled   = false;
          claimBtn.style.opacity  = '1';
          claimBtn.style.cursor   = 'pointer';
          claimBtn.className      = 'btn btn-primary btn-full btn-lg';
          claimBtn.innerHTML      = '✨ ¡Reclamar recompensa!';
          claimBtn.onclick = () => {
            modal.remove();
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
      el.scrollTop = 0; // Reset scroll
      el.querySelectorAll('*').forEach(child => { if(child.style) child.scrollTop = 0; });
      window.scrollTo(0, 0); // Reset body scroll
      currentView = id; 
    }
    updateNav(id);
  }

  function navigate(to, data={}) {
    try {
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
        case 'idiomas':  renderIdiomas(); showView('idiomas'); break;
        case 'game':     showView('game'); break;
        case 'grade':    showGradeSelector(); break;
        case 'login':    showAuthScreen(); break;
        default: showView(to);
      }
      updateFab(to);
    } catch(err) {
      console.error('[CleoRouter] Error en navigate('+to+'):', err);
      CleoUI.toast('Error interno: ' + err.message, '⚠️', 'error');
    }
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
  if (!profile) {
    console.warn('[renderHome] No hay perfil activo, redirigiendo a perfiles...');
    CleoRouter.navigate('profiles');
    return;
  }
  console.log('[renderHome] Perfil activo:', profile.name, '| Tema:', profile.theme);
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
      <div class="top-bar-logo">🌍 Ruta de Idiomas</div>
      <div class="top-stats">
        <div class="stat-chip lives"><span class="icon">❤️</span> ${CleoGame.getLives()}</div>
      </div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:20px 16px;background:var(--grad-bg);">
      <p style="text-align:center;color:var(--c-text-muted);margin-bottom:20px;font-weight:800;">Avanza por Unidades Temáticas completando cada lección 🚀</p>
  `;
  
  Object.keys(data).forEach(langKey => {
    const lang = data[langKey];
    html += `
      <div style="background:var(--c-surface);border-radius:24px;padding:30px 10px;margin-bottom:30px;box-shadow:0 8px 24px rgba(0,0,0,0.06);position:relative;overflow:hidden;">
        
        <!-- Encabezado del idioma -->
        <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:30px;z-index:2;position:relative;">
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.6rem;font-weight:900;color:var(--c-primary);margin:0 0 4px 0;">
            ${lang.emoji} ${lang.name}
          </h2>
          <span style="font-size:0.75rem;background:var(--c-bg-card);color:var(--c-text-muted);padding:4px 12px;border-radius:12px;font-weight:800;border:1px solid var(--c-border);text-transform:uppercase;">
            Ruta Temática
          </span>
        </div>
        
        <!-- Línea conectora central (El camino) -->
        <div style="position:absolute;left:50%;top:120px;bottom:60px;width:8px;background:var(--c-border);transform:translateX(-50%);z-index:0;border-radius:4px;"></div>
        
        <!-- Nodos de niveles (Zig-Zag estilo Duolingo) -->
        <div style="display:flex;flex-direction:column;gap:45px;position:relative;z-index:1;align-items:center;">
    `;
    
    let isUnlocked = true;
    const unitTopics = [
      { unit: 'Unidad 1', topic: 'Saludos & Básicos', emoji: '👋' },
      { unit: 'Unidad 2', topic: 'Colores & Animales', emoji: '🎨' },
      { unit: 'Unidad 3', topic: 'En la Escuela', emoji: '🎒' },
      { unit: 'Unidad 4', topic: 'Comida & Frutas', emoji: '🍎' },
      { unit: 'Unidad 5', topic: 'Familia & Casa', emoji: '🏠' },
      { unit: 'Unidad 6', topic: 'Viajes & Lugares', emoji: '✈️' }
    ];
    
    lang.levels.forEach((lvl, i) => {
      const isCompleted = profile.gamesPlayed && profile.gamesPlayed[`idiomas_${langKey}_${lvl.id}`];
      const topicInfo = unitTopics[i % unitTopics.length];
      
      const offsets = [0, 45, 60, 45, 0, -45, -60, -45];
      const offset = offsets[i % offsets.length];
      
      const bgColor = isUnlocked ? (isCompleted ? '#58CC02' : '#FF9800') : '#E5E5E5';
      const borderColor = isUnlocked ? (isCompleted ? '#46A302' : '#E65100') : '#CECECE';
      const textColor = isUnlocked ? '#FFF' : '#AFAFAF';
      const icon = isUnlocked ? (isCompleted ? '⭐' : topicInfo.emoji) : '🔒';
      const scale = isUnlocked && !isCompleted ? '1.15' : '1';
      const bounceAnim = isUnlocked && !isCompleted ? 'animation: bounce 2s infinite;' : '';
      const cursor = isUnlocked ? 'pointer' : 'not-allowed';
      
      const clickAction = isUnlocked ? `startGame('quiz_idioma','${langKey}_${lvl.id}',3)` : `CleoUI.toast('Completa el nivel anterior primero','🔒','info')`;
      
      html += `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translateX(${offset}px);cursor:${cursor};position:relative;" onclick="${clickAction}">
          
          <!-- Tooltip flotante con lección actual -->
          ${isUnlocked && !isCompleted ? `
            <div style="position:absolute;top:-45px;background:#FFF;padding:8px 14px;border-radius:14px;border:2px solid #E5E5E5;font-size:0.8rem;font-weight:900;color:#4B4B4B;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10;animation: floatUp 2s infinite ease-in-out;">
              ¡Empezar ${topicInfo.unit}!
              <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:#FFF;border-right:2px solid #E5E5E5;border-bottom:2px solid #E5E5E5;"></div>
            </div>
          ` : ''}

          <!-- Botón Circular del Nodo -->
          <div style="width:75px;height:75px;border-radius:50%;background:${bgColor};border-bottom: 6px solid ${borderColor};display:flex;align-items:center;justify-content:center;font-size:2rem;color:${textColor};transition:transform 0.2s;${bounceAnim} transform:scale(${scale});">
            ${icon}
          </div>
          
          <!-- Etiqueta con Unidad y Tema -->
          <div style="margin-top:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:0.95rem;color:${isUnlocked ? '#1E293B' : '#AFAFAF'};background:${isUnlocked ? '#FFF' : 'transparent'};padding:4px 14px;border-radius:14px;border:${isUnlocked ? '2px solid #E5E5E5' : 'none'};box-shadow:${isUnlocked ? '0 4px 0 #E5E5E5' : 'none'};text-align:center;">
            ${topicInfo.unit}: ${lvl.name || topicInfo.topic}
          </div>
        </div>
      `;
      
      if (!isCompleted) isUnlocked = false; 
    });
    
    html += `
        </div>
        
        <!-- Cofre final -->
        <div style="display:flex;justify-content:center;margin-top:40px;position:relative;z-index:1;">
          <div style="width:85px;height:85px;border-radius:18px;background:var(--c-surface);border:4px solid var(--c-border);display:flex;align-items:center;justify-content:center;font-size:3rem;box-shadow:0 6px 0 var(--c-border);opacity:0.9;">
            🎁
          </div>
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
      { type:'programacion', subject:'programacion', icon:'👨‍💻', title:'Código y Algoritmos', desc:'Programa comandos para llevar a Cleo a la meta', color:'#6366F1', badge:'NUEVO' },
      { type:'arte_recrear', subject:'arte', icon:'🎨', title:'Recrear Dibujo (Gartic)', desc:'Recrea el dibujo muestra pintando casillas', color:'#EC4899', badge:'NUEVO' },
      { type:'pesca_capibara', subject:'ciencias', icon:'🐟', title:'Pesca Capibara', desc:'Pesca la respuesta correcta para la Capibara', color:'#0284C7', badge:'NUEVO' },
      { type:'teatro', subject:'teatro', icon:'🎭', title:'Taller de Teatro', desc:'Expresión corporal y dramas interactivos', color:'#F43F5E', badge:'NUEVO' },
      { type:'cinta', subject:'matematicas', icon:'⚙️', title:'Cinta Transportadora', desc:'Clasifica los objetos en la caja correcta', color:'#38BDF8', badge:'' },
      { type:'burbujas', subject:'lenguaje', icon:'🎈', title:'Estallido de Respuestas', desc:'Revienta burbujas con respuestas correctas', color:'#EC4899', badge:'' },
      { type:'runner_edu', subject:'matematicas', icon:'🏃', title:'Runner Educativo', desc:'Esquiva y responde correctamente', color:'#F59E0B', badge:'' },
      { type:'magnetico', subject:'lenguaje', icon:'🧲', title:'Imanes Educativos', desc:'Arrastra las piezas a su lugar', color:'#10B981', badge:'' },
      { type:'hacker', subject:'logica', icon:'💻', title:'Hackeo Lógico', desc:'Desencripta antes de que se acabe el tiempo', color:'#8B5CF6', badge:'' },
      { type:'torres', subject:'ciencias', icon:'🛡️', title:'Defensa de la Base', desc:'Detén a los enemigos con la respuesta correcta', color:'#EF4444', badge:'' },
      { type:'alquimia', subject:'ciencias', icon:'🧪', title:'Laboratorio Químico', desc:'Combina ingredientes para la reacción', color:'#14B8A6', badge:'' },
      { type:'circuitos', subject:'logica', icon:'🔌', title:'Constructor de Circuitos', desc:'Conecta las tuberías y completa el camino', color:'#F59E0B', badge:'' },
      { type:'capibara', subject:'matematicas', icon:'🦦', title:'Aventura Capibara', desc:'Esquiva obstáculos y atrapa la respuesta', color:'#38BDF8', badge:'' },
      { type:'diferencias', subject:'logica', icon:'👀', title:'Diferencias', desc:'Encuentra al intruso rápidamente', color:'#A855F7', badge:'POPULAR' },
      { type:'puzzle', subject:'logica', icon:'🧠', title:'Puzzles de Secuencias', desc:'Adivina qué número o figura sigue', color:'#EF4444', badge:'' },
      { type:'anatomia', subject:'ciencias', icon:'🫀', title:'Anatomía del Cuerpo', desc:'Conoce los órganos y cómo funciona tu cuerpo', color:'#E74C3C', badge:'' },
      { type:'pintura', subject:'arte', icon:'🎨', title:'Estudio de Dibujo', desc:'Lienzo interactivo para pintar y colorear', color:'#EC4899', badge:'' },
      { type:'dressup', subject:'arte', icon:'👗', title:'Viste a Cleo', desc:'Pruébale gorras, gafas y atuendos a Cleo', color:'#F1C40F', badge:'' },
      { type:'musica', subject:'arte', icon:'🎹', title:'Piano de Cleo', desc:'Toca notas y compone canciones', color:'#9B59B6', badge:'' },
      { type:'snake', subject:'matematicas', icon:'🐍', title:'La Serpiente de Cleo', desc:'Atrapa las sumas y números correctos', color:'#58CC02', badge:'HOT' },
      { type:'carrera', subject:'matematicas', icon:'🏎️', title:'Carrera de Números', desc:'Sumas y operaciones a toda velocidad', color:'#FF9800', badge:'' },
      { type:'sopa', subject:'lenguaje', icon:'🔤', title:'Sopa de Letras', desc:'Encuentra palabras de cualquier materia', color:'#1CB0F6', badge:'' },
      { type:'memoria', subject:'logica', icon:'🧩', title:'Memoria de Imágenes', desc:'Encuentra las parejas iguales', color:'#A855F7', badge:'' },
      { type:'rompecabezas', subject:'logica', icon:'🧩', title:'Rompecabezas HD', desc:'Arma las piezas de las imágenes', color:'#38BDF8', badge:'' },
      { type:'misterio', subject:'logica', icon:'🕵️', title:'Detective Cleo', desc:'Resuelve el misterio acompañado', color:'#10B981', badge:'' }
    ];

  const featured = allGames[0];
  const gridGames = allGames.slice(1);

  document.getElementById('view-juegos').innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">🎮 Juegos</div>
      <div class="stat-chip lives"><span class="icon">❤️</span> ${CleoGame.getLives()}</div>
    </div>
    <div style="overflow-y:auto;flex:1;padding:16px;display:flex;flex-direction:column;gap:12px;">
      
      <!-- Featured Game -->
      <div class="game-card animate-fadeInUp" onclick="startGame('${featured.type}','${featured.subject}',${grade})">
        <div class="game-card-img" style="background:linear-gradient(135deg,${featured.color}22,${featured.color}44);height:140px;">
          <span style="font-size:4rem;animation:pulse 2s infinite;">${featured.icon}</span>
          ${featured.badge?`<span class="game-card-badge">${featured.badge}</span>`:''}
        </div>
        <div class="game-card-body" style="padding:16px;">
          <div class="game-card-tag">${CLEDUCA_DATA.subjects.find(s=>s.id===featured.subject)?.emoji || '🎮'} ${CLEDUCA_DATA.subjects.find(s=>s.id===featured.subject)?.name || 'Especial'}</div>
          <h3 class="game-card-title" style="font-size:1.1rem;">${featured.title}</h3>
          <p class="game-card-desc">${featured.desc}</p>
          <button class="game-card-btn">Jugar Destacado ▶</button>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="games-grid" style="margin-top:8px;">
        ${gridGames.map((g,i)=>`
          <div class="game-card animate-fadeInUp" style="animation-delay:${Math.min((i+1)*0.05, 0.5)}s;display:flex;flex-direction:column;height:100%;"
               onclick="startGame('${g.type}','${g.subject}',${grade})">
            <div class="game-card-img" style="background:linear-gradient(135deg,${g.color}22,${g.color}44);height:90px;">
              <span style="font-size:2.5rem;">${g.icon}</span>
              ${g.badge?`<span class="game-card-badge">${g.badge}</span>`:''}
            </div>
            <div class="game-card-body" style="padding:10px;flex:1;display:flex;flex-direction:column;">
              <div class="game-card-tag" style="font-size:0.65rem;">${CLEDUCA_DATA.subjects.find(s=>s.id===g.subject)?.emoji || '🎮'}</div>
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
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:600;font-size:0.85rem;
              color:${tab==='cleo'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='cleo'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='cleo'; renderPerfil();">
        🐶 Personalizar Cleo
      </button>
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:600;font-size:0.85rem;
              color:${tab==='cuenta'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='cuenta'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='cuenta'; renderPerfil();">
        👤 Cuenta y datos
      </button>
      <button style="flex:1;padding:12px 4px;border:none;background:none;font-weight:600;font-size:0.85rem;
              color:${tab==='ajustes'?'var(--c-primary)':'var(--c-text-muted)'};
              border-bottom:${tab==='ajustes'?'3px solid var(--c-primary)':'3px solid transparent'};"
              onclick="window.currentProfileTab='ajustes'; renderPerfil();">
        ⚙️ Ajustes de app
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

        <!-- Cuidado de Mascota Cleo (Estilo Pou) -->
        <div class="card" style="text-align:center;padding:16px;">
          <h3 style="font-size:0.95rem;margin-bottom:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:var(--c-primary);">
            ❤️ Cuidados de Cleo
          </h3>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;font-size:0.75rem;">
            <div style="background:var(--c-bg-card);padding:8px;border-radius:12px;">
              <div>🍖 Hambre</div>
              <div style="font-weight:800;color:var(--c-primary);font-size:0.9rem;">${(window._cleoCare||{hunger:85}).hunger}%</div>
            </div>
            <div style="background:var(--c-bg-card);padding:8px;border-radius:12px;">
              <div>🎾 Felicidad</div>
              <div style="font-weight:800;color:var(--c-xp);font-size:0.9rem;">${(window._cleoCare||{happiness:90}).happiness}%</div>
            </div>
            <div style="background:var(--c-bg-card);padding:8px;border-radius:12px;">
              <div>⚡ Energía</div>
              <div style="font-weight:800;color:var(--c-streak);font-size:0.9rem;">${(window._cleoCare||{energy:95}).energy}%</div>
            </div>
          </div>
          <div style="display:flex;gap:6px;justify-content:center;">
            <button class="btn btn-primary btn-sm" onclick="feedCleo()">🍖 Alimentar</button>
            <button class="btn btn-secondary btn-sm" onclick="playCleo()">🎾 Acariciar</button>
            <button class="btn btn-secondary btn-sm" onclick="sleepCleo()">🌙 Descansar</button>
          </div>
        </div>

        <!-- Accessories -->
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <h3 style="font-size:1rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;">🎩 Accesorios por categoría</h3>
          </div>

          <!-- Category filter bar -->
          <div style="display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;padding-bottom:4px;">
            ${['todos','cabeza','cara','cuerpo'].map(cat=>`
              <button class="btn btn-sm ${ (window._activeAccessoryCat||'todos')===cat?'btn-primary':'btn-secondary' }"
                      style="font-size:0.75rem;padding:6px 12px;"
                      onclick="window._activeAccessoryCat='${cat}'; renderPerfil();">
                ${cat==='todos'?'✨ Todos':cat==='cabeza'?'🧢 Cabeza':cat==='cara'?'👓 Cara':'👕 Cuerpo'}
              </button>
            `).join('')}
          </div>

          <div class="skins-grid">
            ${(CLEDUCA_DATA.accessories.filter(a=>(window._activeAccessoryCat||'todos')==='todos'||a.category===(window._activeAccessoryCat||'todos')||a.id==='none')).map(a=>{
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
window._cleoCare = window._cleoCare || { hunger: 85, happiness: 90, energy: 95 };

function feedCleo() {
  window._cleoCare.hunger = Math.min(100, window._cleoCare.hunger + 15);
  window._cleoCare.happiness = Math.min(100, window._cleoCare.happiness + 5);
  CleoAnimations.confetti();
  CleoSpeech.say('¡Mmm, qué delicioso! 🍖 ¡Gracias por alimentarme!');
  CleoUI.toast('¡Cleo comió con mucho gusto!', '🍖', 'success');
  CleoGame.addXP(10);
  renderPerfil();
}

function playCleo() {
  window._cleoCare.happiness = Math.min(100, window._cleoCare.happiness + 20);
  window._cleoCare.energy = Math.max(10, window._cleoCare.energy - 10);
  CleoAnimations.confetti();
  CleoSpeech.say('¡Yayy! 🎾 ¡Eres mi mejor amigo!');
  CleoUI.toast('¡Acariciaste y jugaste con Cleo!', '🎾', 'success');
  CleoGame.addXP(15);
  renderPerfil();
}

function sleepCleo() {
  window._cleoCare.energy = 100;
  CleoSpeech.say('Zzz... 🌙 Cleo ha descansado y renovó su energía.');
  CleoUI.toast('¡Cleo durmió y recuperó su energía!', '🌙', 'info');
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
  if (!p) return;
  const newState = p.voiceEnabled !== false ? false : true;
  CleoAuth.updateProfile(p.id, { voiceEnabled: newState });
  CleoSpeech.setEnabled(newState);
  CleoUI.toast(newState ? '🔊 Voz de Cleo activada' : '🔇 Voz de Cleo desactivada', newState ? '🔊' : '🔇', 'info');
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
  setTimeout(() => {
    renderHome();
    if (typeof renderLogros === 'function') renderLogros();
  }, 500);
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
  diferencias: { icon:'👀', name:'Diferencias', desc:'Encuentra al elemento intruso en la cuadrícula.', howTo:'Observa con atención y toca la figura que sea diferente a las demás.' },
  puzzle:      { icon:'🧠', name:'Puzzles de Secuencias', desc:'Descubre el patrón numérico o lógico de la serie.', howTo:'Analiza la secuencia de números y selecciona cuál sigue.' },
  anatomia:    { icon:'🫀', name:'Anatomía del Cuerpo', desc:'Explora los órganos y la estructura del cuerpo humano.', howTo:'Lee y escucha las explicaciones de cada parte del cuerpo.' },
  pintura:     { icon:'🎨', name:'Estudio de Dibujo', desc:'Expresa tu creatividad dibujando y coloreando en un lienzo interactivo.', howTo:'Elige tus colores favoritos y dibuja con tu dedo o ratón.' },
  dressup:     { icon:'👗', name:'Viste a Cleo', desc:'Personaliza a Cleo con accesorios y atuendos.', howTo:'Toca los accesorios para probárselos a Cleo.' },
  musica:      { icon:'🎹', name:'Piano de Cleo', desc:'Crea notas y melodías musicales en un piano colorido.', howTo:'Toca las teclas del piano para escuchar las notas musicales.' },
  rompecabezas:{ icon:'🧩', name:'Rompecabezas de Cleo', desc:'Arma la imagen desordenada intercambiando fichas.', howTo:'Toca una ficha y luego otra para cambiarlas de lugar.' },
  misterio:    { icon:'🕵️', name:'Detective Cleo', desc:'Resuelve acertijos de lógica encontrando al sospechoso correcto.', howTo:'Lee la pista con atención y selecciona cuál sospechoso coincide.' },
  cinta:       { icon:'⚙️', name:'Cinta Transportadora', desc:'Clasifica los objetos en la caja correcta antes de que se caigan.', howTo:'Arrastra cada objeto a la categoría correspondiente.' },
  burbujas:    { icon:'🎈', name:'Estallido de Respuestas', desc:'Revienta las burbujas que contengan la respuesta correcta.', howTo:'Toca las burbujas correctas tan rápido como puedas.' },
  runner_edu:  { icon:'🏃', name:'Runner Educativo', desc:'Esquiva obstáculos y cambia al carril con la respuesta correcta.', howTo:'Desliza a izquierda o derecha para mover el vehículo.' },
  magnetico:   { icon:'🧲', name:'Imanes Educativos', desc:'Arrastra letras y números a los espacios vacíos.', howTo:'Toca y arrastra cada pieza magnética a su lugar correspondiente.' },
  hacker:      { icon:'💻', name:'Hackeo Lógico', desc:'Desencripta el sistema antes de que se acabe el tiempo.', howTo:'Escribe o selecciona la respuesta para evitar el bloqueo del sistema.' },
  torres:      { icon:'🛡️', name:'Defensa de la Base', desc:'Usa el escudo con la respuesta correcta para detener a los enemigos.', howTo:'Selecciona la opción correcta antes de que los enemigos toquen la base.' },
  alquimia:    { icon:'🧪', name:'Laboratorio Químico', desc:'Combina los ingredientes correctos para crear una reacción.', howTo:'Arrastra ingredientes al matraz según las instrucciones.' },
  circuitos:   { icon:'🔌', name:'Constructor de Circuitos', desc:'Conecta las tuberías o palabras para cerrar el circuito.', howTo:'Toca las piezas para rotarlas y conectar el camino.' },
  programacion:{ icon:'👨‍💻', name:'Código y Algoritmos', desc:'Programa la secuencia de comandos para guiar a Cleo a la meta.', howTo:'Selecciona bloques (Avanzar, Girar, Saltar) y ejecuta tu código.' },
  arte_recrear:{ icon:'🎨', name:'Recrear Dibujo (Gartic)', desc:'Recrea la figura o dibujo de píxeles pintando las casillas según el patrón.', howTo:'Mira la muestra de la izquierda y pinta los cuadros correspondientes en tu lienzo.' },
  pesca_capibara:{ icon:'🐟', name:'Pesca Capibara Educativa', desc:'Pesca los peces con la respuesta correcta para alimentar a la Capibara.', howTo:'Mueve la caña y atrapa el pez que contenga el resultado correcto.' },
  teatro:      { icon:'🎭', name:'Taller de Teatro', desc:'Representa emociones y dales vida a los cuentos interactivos.', howTo:'Elige las expresiones y decisiones dramáticas para continuar la historia.' }
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
  window._gameStartTime = Date.now();
  window._currentGameType = type;
  window._currentGameSubject = subject;
  window._currentGameGrade = grade;
  // Actually start the game engine
  document.getElementById('view-game').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;gap:16px;">
      <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.15);background:#fff;animation:floatBig 2s ease-in-out infinite;padding:4px;">
        <img src="/img/Logo_cleduca_transparente.png" alt="Cleo" style="width:100%;height:100%;object-fit:contain;" onerror="this.src='/img/Logo_cleduca_transparente.svg'">
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
      case 'cinta':        GameCinta.start(subject, grade); break;
      case 'burbujas':     GameBurbujas.start(subject, grade); break;
      case 'runner_edu':   GameRunner.start(subject, grade); break;
      case 'magnetico':    GameMagnetico.start(subject, grade); break;
      case 'hacker':       GameHacker.start(subject, grade); break;
      case 'torres':       GameTowerDefense.start(subject, grade); break;
      case 'alquimia':     GameAlquimia.start(subject, grade); break;
      case 'circuitos':    GameCircuitos.start(subject, grade); break;
      case 'programacion': GameProgramacion.start(subject, grade); break;
      case 'arte_recrear': GameArteRecrear.start(); break;
      case 'pesca_capibara': GameCapibaraPesca.start(subject, grade); break;
      case 'teatro':       GameTeatro.start(subject, grade); break;
      default:             GameQuiz.start(subject, grade); break;
    }
  }, 300);
}

// ── PROFILE SCREENS ──
function showAuthScreen() {
  document.getElementById('view-login').innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;padding:0;background:var(--grad-bg);">
      <div class="onboard-header">
        <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;animation:floatBig 4s ease-in-out infinite;padding:4px;">
          <img src="/img/Logo_cleduca_transparente.png" alt="Cleo" style="width:100%;height:100%;object-fit:contain;" onerror="this.src='/img/Logo_cleduca_transparente.svg'">
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
            <div style="position:relative;display:flex;align-items:center;">
              <input type="password" class="input-field" id="auth-pass" placeholder="Mínimo 6 caracteres" style="padding-right:46px;">
              <button type="button" onclick="togglePasswordVisibility('auth-pass', this)" style="position:absolute;right:8px;background:none;border:none;font-size:1.3rem;cursor:pointer;padding:6px;color:var(--c-text-muted);" title="Ver / Ocultar Contraseña">
                👁️
              </button>
            </div>
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

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) btnEl.textContent = '🙈';
  } else {
    input.type = 'password';
    if (btnEl) btnEl.textContent = '👁️';
  }
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
    CleoUI.toast('¡Bienvenid@!', '🎉', 'success');
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
        <div style="width:80px;height:80px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;animation:floatBig 4s ease-in-out infinite;padding:4px;">
          <img src="/img/Logo_cleduca_transparente.png" alt="Cleo" style="width:100%;height:100%;object-fit:contain;" onerror="this.src='/img/Logo_cleduca_transparente.svg'">
        </div>
        <h1 style="color:#fff;font-size:2rem;margin-bottom:4px;">¡Bienvenid@ a Cleduca!</h1>
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
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay center active';
  overlay.id = 'modal-pin-overlay';
  overlay.style.zIndex = '999999';
  overlay.innerHTML = `
    <div class="modal-dialog animate-scaleUp" style="text-align:center;padding:24px;max-width:320px;">
      <div style="font-size:2.8rem;margin-bottom:8px;">🔒</div>
      <h3 class="modal-title" style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;">Ingresa tu PIN</h3>
      <p class="modal-subtitle" style="font-size:0.85rem;color:var(--c-text-muted);margin-bottom:16px;">PIN de 4 dígitos para ingresar al perfil</p>
      
      <div class="pin-inputs" style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">
        ${[0,1,2,3].map(i => `
          <input class="pin-digit" type="password" maxlength="1" inputmode="numeric" id="pd${i}"
                 style="width:48px;height:54px;font-size:1.5rem;text-align:center;border-radius:14px;border:2px solid var(--c-border);background:var(--c-surface);font-weight:900;"
                 oninput="movePinFocus(${i}, '${profileId}')"
                 onkeydown="handlePinBackspace(event, ${i})">
        `).join('')}
      </div>

      <button class="btn btn-primary btn-full btn-lg" onclick="validatePin('${profileId}')">
        🚀 Entrar al perfil
      </button>
      <button class="btn btn-ghost btn-full" onclick="document.getElementById('modal-pin-overlay')?.remove()" style="margin-top:8px;color:var(--c-text-muted);">
        Cancelar
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('pd0')?.focus(), 100);
}

function movePinFocus(i, profileId) {
  const currentInput = document.getElementById(`pd${i}`);
  if (currentInput && currentInput.value) {
    const next = document.getElementById(`pd${i+1}`);
    if (next) {
      next.focus();
    } else if (i === 3) {
      currentInput.blur();
      validatePin(profileId);
    }
  }
}

function handlePinBackspace(e, i) {
  if (e.key === 'Backspace') {
    const currentInput = document.getElementById(`pd${i}`);
    if (currentInput && !currentInput.value && i > 0) {
      const prev = document.getElementById(`pd${i-1}`);
      if (prev) prev.focus();
    }
  }
}

function validatePin(profileId) {
  // Guard: si el overlay ya fue procesado, no ejecutar de nuevo
  const overlay = document.getElementById('modal-pin-overlay');
  if (!overlay || overlay.dataset.processing === '1') return;
  overlay.dataset.processing = '1';

  const pin = [0,1,2,3].map(i => document.getElementById(`pd${i}`)?.value || '').join('');
  if (pin.length < 4) {
    overlay.dataset.processing = '0';
    CleoUI.toast('Ingresa los 4 dígitos de tu PIN', '🔒', 'info');
    return;
  }
  if (!CleoAuth.validatePin(profileId, pin)) {
    overlay.dataset.processing = '0';
    [0,1,2,3].forEach(i => { const el = document.getElementById(`pd${i}`); if (el) el.value = ''; });
    document.getElementById('pd0')?.focus();
    CleoUI.toast('PIN incorrecto. Inténtalo de nuevo.', '🔒', 'error');
    return;
  }
  // PIN correcto: cerrar modal, activar perfil y navegar
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
  CleoAuth.setActive(profileId);
  const p = CleoAuth.getActive();
  applyProfileSettings(p);
  CleoRouter.navigate('home');
  CleoUI.toast(`¡Bienvenid@, ${p?.name || 'Explorador'}! 🚀`, '👋', 'success');
  CleoSpeech.say(`¡Hola ${p?.name || ''}! Listo para aprender.`);
  document.documentElement.setAttribute('data-theme', p.theme || 'selva');
  document.documentElement.setAttribute('data-dark', p.darkMode || false);
  if (window.CleoSpeech && p.voiceEnabled === false) {
    CleoSpeech.setEnabled(false);
  } else if (window.CleoSpeech && p.voiceEnabled === true) {
    CleoSpeech.setEnabled(true);
  }
}

function applyProfileSettings(p) {
  if (!p) return;
  document.documentElement.setAttribute('data-theme', p.theme || 'selva');
  document.documentElement.setAttribute('data-dark', p.darkMode || false);
  if (window.CleoSpeech && p.voiceEnabled === false) {
    CleoSpeech.setEnabled(false);
  } else if (window.CleoSpeech && p.voiceEnabled === true) {
    CleoSpeech.setEnabled(true);
  }
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
        <div style="width:70px;height:70px;margin:0 auto 12px;border-radius:50%;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;padding:4px;">
          <img src="/img/Logo_cleduca_transparente.png" alt="Cleo" style="width:100%;height:100%;object-fit:contain;" onerror="this.src='/img/Logo_cleduca_transparente.svg'">
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
