/* ===========================
   CLEDUCA — Sistema de Cuentas y Perfiles
   =========================== */
window.CleoAuth = (function() {
  const STORAGE_KEY = 'cleduca_profiles';
  const ACTIVE_KEY  = 'cleduca_active';
  const MAX_FREE    = 2;

  // Supabase Init
  const SUPABASE_URL = 'https://tmbvwsauzngvydldjuqe.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_fE32RmyeRXacyyQx9PyZvA_PIC45T8g';
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
  let currentUser = null;

  // Attempt to restore session on load
  if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        currentUser = session.user;
        syncFromCloud();
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      if (currentUser) syncFromCloud();
    });
  }

  async function syncFromCloud() {
    if (!currentUser || !currentUser.user_metadata) return;
    const cloudProfiles = currentUser.user_metadata.cleduca_profiles;
    if (cloudProfiles && Array.isArray(cloudProfiles)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProfiles));
      // Refresh UI if needed
      if (window.renderPerfil && typeof window.renderPerfil === 'function') {
        const active = getActive();
        if (active) window.renderPerfil();
      }
    }
  }

  async function syncToCloud(profiles) {
    if (!supabase || !currentUser) return;
    await supabase.auth.updateUser({
      data: { cleduca_profiles: profiles }
    });
  }

  async function registerAccount(email, password) {
    if (!supabase) return { error: 'Supabase no inicializado' };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Mover perfiles locales a la nube
    await syncToCloud(getAll());
    return { success: true };
  }

  async function loginAccount(email, password) {
    if (!supabase) return { error: 'Supabase no inicializado' };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // El onAuthStateChange sincronizará los datos desde la nube
    return { success: true };
  }

  async function logoutAccount() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    window.location.reload();
  }

  async function loginWithGoogle() {
    if (!supabase) return { error: 'Supabase no inicializado' };
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) return { error: error.message };
    return { success: true };
  }

  function isUserLoggedIn() {
    return currentUser !== null;
  }


  function getAll() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveAll(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    syncToCloud(profiles); // Async sync
  }
  function getActive() {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (!id) return null;
    return getAll().find(p => p.id === id) || null;
  }
  function setActive(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  }
  function createProfile({ name, avatar, pin, grade, isGoogle, googleEmail }) {
    const all = getAll();
    const isPremium = CleoMonetization.isPremium();
    const maxProfiles = isPremium ? 5 : MAX_FREE;
    if (all.length >= maxProfiles) {
      return { error: 'max_profiles', max: maxProfiles };
    }
    const profile = {
      id:          'p_' + Date.now(),
      name:        name || 'Explorador',
      avatar:      avatar || '🐉',
      pin:         pin || null,
      grade:       grade || 3,
      isGoogle:    !!isGoogle,
      googleEmail: googleEmail || null,
      theme:       'selva',
      darkMode:    false,
      skin:        'verde',
      accessory:   'none',
      nickname:    name || 'Cleo',
      xp:          0,
      level:       1,
      streak:      0,
      lastStudy:   null,
      lives:       5,
      livesLastRegen: Date.now(),
      gems:        0,
      achievements: [],
      gamesPlayed:  {},
      subjectXP:   { matematicas:0, lenguaje:0, ciencias:0, sociales:0, logica:0, arte:0 },
      chests:      { lastFree: null, available: 0 },
      createdAt:   Date.now()
    };
    all.push(profile);
    saveAll(all);
    setActive(profile.id);
    return { success: true, profile };
  }
  function updateProfile(id, changes) {
    const all = getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return false;
    all[idx] = { ...all[idx], ...changes };
    saveAll(all);
    return all[idx];
  }
  function deleteProfile(id) {
    const all = getAll().filter(p => p.id !== id);
    saveAll(all);
    if (localStorage.getItem(ACTIVE_KEY) === id) {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }
  function validatePin(id, pin) {
    const p = getAll().find(p => p.id === id);
    if (!p) return false;
    if (!p.pin) return true;
    return p.pin === pin;
  }
  function canAddProfile() {
    const all = getAll();
    const isPremium = CleoMonetization.isPremium();
    const max = isPremium ? 5 : MAX_FREE;
    return all.length < max;
  }
  function profileCount() { return getAll().length; }

  return { getAll, getActive, setActive, createProfile, updateProfile,
           deleteProfile,
    isUserLoggedIn,
    registerAccount,
    loginAccount,
    loginWithGoogle,
    logoutAccount,
    validatePin, canAddProfile, profileCount, MAX_FREE };
})();

/* ===========================
   CLEDUCA — Gamificación
   =========================== */
window.CleoGame = (function() {
  const LIVES_MAX  = 5;
  const LIVES_REGEN_MS = 30 * 60 * 1000; // 30 min por vida

  function getProfile() { return CleoAuth.getActive(); }
  function saveProfile(changes) {
    const p = getProfile();
    if (!p) return;
    return CleoAuth.updateProfile(p.id, changes);
  }

  // ── XP & Level ──
  function addXP(amount) {
    const p = getProfile();
    if (!p) return;
    const newXP = (p.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    const leveled = newLevel > (p.level || 1);
    saveProfile({ xp: newXP, level: newLevel });
    showXPFloat(amount);
    checkAchievementsXP(newXP);
    if (leveled) showLevelUp(newLevel);
    return { xp: newXP, level: newLevel, leveled };
  }
  function addSubjectXP(subject, amount) {
    const p = getProfile();
    if (!p) return;
    const subXP = { ...(p.subjectXP || {}) };
    subXP[subject] = (subXP[subject] || 0) + amount;
    saveProfile({ subjectXP: subXP });
  }
  function getXPForLevel(level) { return (level - 1) * 500; }
  function getNextLevelXP(level) { return level * 500; }
  function getLevelProgress() {
    const p = getProfile();
    if (!p) return 0;
    const cur = getXPForLevel(p.level);
    const next = getNextLevelXP(p.level);
    return Math.round(((p.xp - cur) / (next - cur)) * 100);
  }
  function getLevelName(level) {
    if (level <= 2)  return "Principiante";
    if (level <= 5)  return "Explorador";
    if (level <= 10) return "Aventurero";
    if (level <= 20) return "Sabio";
    return "Maestro";
  }

  // ── Lives ──
  function getLives() {
    const p = getProfile();
    if (!p) return LIVES_MAX;
    if (CleoMonetization.isPremium()) return LIVES_MAX;
    regenerateLives(p);
    return Math.min(getProfile().lives || 0, LIVES_MAX);
  }
  function regenerateLives(p) {
    const now = Date.now();
    const lastRegen = p.livesLastRegen || now;
    const elapsed = now - lastRegen;
    const livesToAdd = Math.floor(elapsed / LIVES_REGEN_MS);
    if (livesToAdd > 0 && (p.lives || 0) < LIVES_MAX) {
      const newLives = Math.min((p.lives || 0) + livesToAdd, LIVES_MAX);
      saveProfile({ lives: newLives, livesLastRegen: now });
    }
  }
  function loseLife() {
    const p = getProfile();
    if (!p) return false;
    if (CleoMonetization.isPremium()) return true;
    const lives = Math.max(0, (p.lives || 0) - 1);
    saveProfile({ lives });
    return lives > 0;
  }
  function refillLives() {
    saveProfile({ lives: LIVES_MAX, livesLastRegen: Date.now() });
  }
  function getLifeRegenTime() {
    const p = getProfile();
    if (!p) return 0;
    const elapsed = Date.now() - (p.livesLastRegen || Date.now());
    const nextRegen = LIVES_REGEN_MS - (elapsed % LIVES_REGEN_MS);
    return Math.ceil(nextRegen / 60000); // minutos
  }

  // ── Streak ──
  function updateStreak() {
    const p = getProfile();
    if (!p) return;
    const now = new Date();
    const today = now.toDateString();
    const last  = p.lastStudy ? new Date(p.lastStudy).toDateString() : null;
    let streak = p.streak || 0;
    if (!last) {
      streak = 1;
    } else if (last === today) {
      return streak;
    } else {
      const diff = (now - new Date(p.lastStudy)) / 86400000;
      streak = diff <= 1.5 ? streak + 1 : 1;
    }
    saveProfile({ streak, lastStudy: Date.now() });
    checkAchievementsStreak(streak);
    return streak;
  }
  function saveStreak() {
    const p = getProfile();
    if (!p) return;
    if (CleoMonetization.isPremium()) return true;
    // Para usuarios free, requiere ver un ad
    return false;
  }

  // ── Cofres ──
  function checkFreeChest() {
    const p = getProfile();
    if (!p) return false;
    const lastFree = p.chests?.lastFree;
    if (!lastFree) return true;
    const hoursSince = (Date.now() - lastFree) / 3600000;
    const limit = CleoMonetization.isPremium() ? 8 : 24;
    return hoursSince >= limit;
  }
  function claimFreeChest() {
    const p = getProfile();
    if (!p) return null;
    const rewards = generateChestRewards();
    saveProfile({ chests: { lastFree: Date.now(), available: 0 } });
    return rewards;
  }
  function generateChestRewards() {
    const xpReward = Math.floor(Math.random() * 50) + 20;
    addXP(xpReward);
    return { xp: xpReward, message: `¡Ganaste ${xpReward} XP! ⭐` };
  }

  // ── Logros ──
  function unlockAchievement(id) {
    const p = getProfile();
    if (!p) return false;
    const achieved = p.achievements || [];
    if (achieved.includes(id)) return false;
    const achData = CLEDUCA_DATA.achievements.find(a => a.id === id);
    if (!achData) return false;
    achieved.push(id);
    saveProfile({ achievements: achieved });
    addXP(achData.xp || 0);
    showAchievementPopup(achData);
    return true;
  }
  function checkAchievementsXP(xp) {
    if (xp >= 100)  unlockAchievement('xp_100');
    if (xp >= 500)  unlockAchievement('xp_500');
    if (xp >= 1000) unlockAchievement('xp_1000');
    if (xp >= 5000) unlockAchievement('xp_5000');
  }
  function checkAchievementsStreak(streak) {
    if (streak >= 3)  unlockAchievement('streak_3');
    if (streak >= 7)  unlockAchievement('streak_7');
    if (streak >= 30) unlockAchievement('streak_30');
  }
  function checkGameAchievement(type, data) {
    const p = getProfile();
    if (!p) return;
    const games = p.gamesPlayed || {};
    games[type] = (games[type] || 0) + 1;
    const total = Object.values(games).reduce((a,b) => a+b, 0);
    saveProfile({ gamesPlayed: games });
    if (total === 1) unlockAchievement('first_game');
    if (data?.perfect) unlockAchievement('perfect_quiz');
    if (data?.fast)    unlockAchievement('speed_demon');
    const subjects = Object.keys(games).filter(k => games[k] >= 10);
    subjects.forEach(s => {
      if (s === 'matematicas') unlockAchievement('math_master');
      if (s === 'lenguaje')    unlockAchievement('reading_master');
      if (s === 'ciencias')    unlockAchievement('science_master');
    });
  }

  // ── UI helpers ──
  function showXPFloat(amount) {
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = '+' + amount + ' XP';
    el.style.left = Math.random() * 60 + 20 + '%';
    el.style.top = '70%';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
  function showLevelUp(level) {
    CleoSpeech.say(CLEDUCA_DATA.cleoMessages.levelUp[
      Math.floor(Math.random() * CLEDUCA_DATA.cleoMessages.levelUp.length)
    ]);
    CleoUI.toast('¡Subiste al nivel ' + level + '!', '🌟', 'success');
    CleoAnimations.confetti();
  }
  function showAchievementPopup(ach) {
    CleoUI.toast(`¡Logro: ${ach.name}!`, ach.emoji, 'success');
    setTimeout(() => CleoAnimations.confetti(), 300);
  }

  return {
    addXP, addSubjectXP, getLevelProgress, getLevelName, getXPForLevel, getNextLevelXP,
    getLives, loseLife, refillLives, getLifeRegenTime,
    updateStreak, saveStreak,
    checkFreeChest, claimFreeChest,
    unlockAchievement, checkGameAchievement,
    LIVES_MAX
  };
})();

/* ===========================
   CLEDUCA — Monetización
   =========================== */
window.CleoMonetization = (function() {
  const KEY = 'cleduca_premium';
  const PLANS = [
    {
      id: 'basico',
      name: 'Premium Básico',
      emoji: '⭐',
      price: '$9.900',
      period: '/mes',
      color: '#6366F1',
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
      id: 'familiar',
      name: 'Premium Familiar',
      emoji: '👨‍👩‍👧‍👦',
      price: '$19.900',
      period: '/mes',
      color: '#7C3AED',
      popular: true,
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

  function isPremium() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      if (!data) return false;
      return data.active && data.expiry > Date.now();
    } catch { return false; }
  }
  function getPlan() {
    try { return JSON.parse(localStorage.getItem(KEY))?.plan || null; }
    catch { return null; }
  }
  function activatePremium(planId, days = 30) {
    localStorage.setItem(KEY, JSON.stringify({
      active: true,
      plan: planId,
      expiry: Date.now() + days * 86400000,
      activatedAt: Date.now()
    }));
    CleoGame.unlockAchievement('premium_user');
  }
  function showPlansModal() {
    CleoUI.showModal('plans');
  }
  function showAdModal(onComplete) {
    CleoUI.showAdModal(onComplete);
  }
  function watchAdForLives(onComplete) {
    showAdModal(() => {
      CleoGame.refillLives();
      CleoUI.toast('¡Vidas recargadas! ❤️', '❤️', 'success');
      if (onComplete) onComplete();
    });
  }
  function watchAdForStreak(onComplete) {
    showAdModal(() => {
      const p = CleoAuth.getActive();
      if (p) {
        CleoAuth.updateProfile(p.id, {
          streak: p.streak || 1,
          lastStudy: Date.now()
        });
        CleoUI.toast('¡Racha salvada! 🔥', '🔥', 'success');
      }
      if (onComplete) onComplete();
    });
  }

  return { isPremium, getPlan, activatePremium, showPlansModal,
           watchAdForLives, watchAdForStreak, showAdModal, PLANS };
})();
