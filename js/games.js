/* ===========================
   CLEDUCA — Motor de Juegos
   =========================== */

// ── QUIZ VELOZ ──
window.GameQuiz = (function() {
  let state = {};

  function start(subject, grade, onEnd) {
    let data;
    if (subject.startsWith('ingles_') || subject.startsWith('portugues_')) {
      const parts = subject.split('_');
      const langData = CLEDUCA_DATA.idiomas[parts[0]];
      const levelData = langData.levels.find(l => l.id == parts[1]);
      data = { quiz: levelData.quiz };
    } else {
      data = CLEDUCA_DATA.content[grade]?.[subject];
    }
    if (!data?.quiz) return;
    
    // Check for answered questions in profile
    const profile = CleoAuth.getActive();
    let answered = [];
    if (profile && profile.gamesPlayed && profile.gamesPlayed.quizCorrect) {
      answered = profile.gamesPlayed.quizCorrect[subject] || [];
    }
    
    // Filter out answered questions
    let newQs = data.quiz.filter(q => !answered.includes(q.q));
    
    // If not enough new questions, mix with old ones
    if (newQs.length < 10) {
      const oldQs = data.quiz.filter(q => answered.includes(q.q));
      newQs = [...newQs, ...shuffle(oldQs)];
    }
    
    const questions = shuffle(newQs).slice(0, 10);
    state = { subject, grade, questions, current:0, score:0, lives:CleoGame.getLives(),
               wrong:0, startTime:Date.now(), onEnd, fastAnswers:0 };
    CleoGame.updateStreak();
    renderQuestion();
  }

  function renderQuestion() {
    const q = state.questions[state.current];
    if (!q) return endGame();
    const progress = ((state.current) / state.questions.length) * 100;
    const lives = CleoGame.getLives();
    const isLang = state.subject.startsWith('ingles_') || state.subject.startsWith('portugues_');
    const title = isLang ? CLEDUCA_DATA.idiomas[state.subject.split('_')[0]].name : (CLEDUCA_DATA.subjects.find(s=>s.id===state.subject)?.name || 'Quiz');
    
    CleoUI.renderGameView({
      title: title,
      progress,
      lives,
      content: `
        <div class="question-area animate-fadeInUp">
          <div style="font-size:0.85rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
               color:var(--c-text-muted);margin-bottom:12px;display:flex;justify-content:space-between;">
            <span>Pregunta ${state.current+1} de ${state.questions.length}</span>
            ${q.tip ? `<button class="btn-ghost" onclick="GameQuiz.showTip()" style="padding:0 8px;color:var(--c-primary);font-weight:bold;">💡 Ayuda</button>` : ''}
          </div>
          <div class="question-text">${q.q}</div>
          <div class="options-grid" id="options-grid">
            ${q.opts.map((opt,i) => `
              <button class="option-btn" onclick="GameQuiz.answer(${i})"
                      id="opt-${i}">${opt}</button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function answer(idx) {
    const q = state.questions[state.current];
    const buttons = document.querySelectorAll('.option-btn');
    const elapsed = (Date.now() - state.startTime) / 1000;
    const isFast  = elapsed < 5;
    buttons.forEach(b => b.disabled = true);

    if (idx === q.ans) {
      buttons[idx].classList.add('correct');
      const xpGained = q.xp || 10;
      CleoGame.addXP(xpGained);
      CleoGame.addSubjectXP(state.subject, xpGained);
      state.score += xpGained;
      if (isFast) state.fastAnswers++;
      
      // Save question as correctly answered
      const profile = CleoAuth.getActive();
      if (profile) {
        if (!profile.gamesPlayed) profile.gamesPlayed = {};
        if (!profile.gamesPlayed.quizCorrect) profile.gamesPlayed.quizCorrect = {};
        if (!profile.gamesPlayed.quizCorrect[state.subject]) profile.gamesPlayed.quizCorrect[state.subject] = [];
        if (!profile.gamesPlayed.quizCorrect[state.subject].includes(q.q)) {
          profile.gamesPlayed.quizCorrect[state.subject].push(q.q);
          CleoAuth.updateProfile(profile.id, { gamesPlayed: profile.gamesPlayed });
        }
      }
      
      CleoSpeech.say(randomMsg('correct'));
      setTimeout(() => nextQuestion(), 900);
    } else {
      buttons[idx].classList.add('wrong');
      if (q.ans !== undefined) buttons[q.ans].classList.add('correct');
      state.wrong++;
      const hasLife = CleoGame.loseLife();
      state.lives = CleoGame.getLives();
      CleoSpeech.say(randomMsg('wrong'));
      if (!hasLife) {
        setTimeout(() => showNoLives(), 1000);
      } else {
        setTimeout(() => nextQuestion(), 1200);
      }
    }
    state.startTime = Date.now();
  }

  function nextQuestion() {
    state.current++;
    if (state.current >= state.questions.length) {
      endGame();
    } else {
      renderQuestion();
    }
  }

  function showTip() {
    const q = state.questions[state.current];
    if (q && q.tip) {
      CleoUI.toast(q.tip, '💡', 'info');
      CleoSpeech.say(q.tip);
    }
  }

  function endGame() {
    const perfect = state.wrong === 0;
    const fast    = state.fastAnswers >= 3;
    CleoGame.checkGameAchievement(state.subject, { perfect, fast });
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score,
      total: state.questions.length,
      correct: state.questions.length - state.wrong,
      wrong: state.wrong,
      perfect,
      onReplay: () => start(state.subject, state.grade, state.onEnd),
      onHome:   () => CleoRouter.navigate('home')
    });
  }

  function showNoLives() {
    CleoMonetization.watchAdForLives(() => {
      state.lives = CleoGame.getLives();
      renderQuestion();
    });
  }

  function randomMsg(type) {
    const msgs = CLEDUCA_DATA.cleoMessages[type] || [];
    return msgs[Math.floor(Math.random() * msgs.length)] || '';
  }
  function shuffle(arr) {
    for (let i = arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  return { start, answer, showTip };
})();

// ── SOPA DE LETRAS ──
window.GameSopa = (function() {
  let state = {};

  function start(subject, grade) {
    const data = CLEDUCA_DATA.content[grade]?.[subject]?.sopa;
    if (!data) return;
    const size = data.size || 8;
    const words = shuffle([...data.words]).slice(0, 6);
    const grid  = buildGrid(words, size);
    state = { subject, grade, words, grid, size, found:[], foundCells:[], selecting:false,
               startCell:null, cells:[], score:0, startTime:Date.now() };
    CleoGame.updateStreak();
    renderSopa();
  }

  function buildGrid(words, size) {
    const grid = Array.from({length:size}, () => Array(size).fill(''));
    const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0]];
    words.forEach(word => {
      let placed = false;
      let tries  = 0;
      while (!placed && tries < 100) {
        tries++;
        const dir  = dirs[Math.floor(Math.random()*dirs.length)];
        const r    = Math.floor(Math.random()*size);
        const c    = Math.floor(Math.random()*size);
        const w    = word.toUpperCase();
        if (canPlace(grid, w, r, c, dir, size)) {
          placeWord(grid, w, r, c, dir);
          placed = true;
        }
      }
    });
    // Fill blanks
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r=0; r<size; r++)
      for (let c=0; c<size; c++)
        if (!grid[r][c]) grid[r][c] = alpha[Math.floor(Math.random()*alpha.length)];
    return grid;
  }
  function canPlace(grid, word, r, c, dir, size) {
    for (let i=0; i<word.length; i++) {
      const nr = r + dir[0]*i;
      const nc = c + dir[1]*i;
      if (nr<0||nr>=size||nc<0||nc>=size) return false;
      if (grid[nr][nc] && grid[nr][nc]!==word[i]) return false;
    }
    return true;
  }
  function placeWord(grid, word, r, c, dir) {
    for (let i=0; i<word.length; i++) {
      grid[r+dir[0]*i][c+dir[1]*i] = word[i];
    }
  }

  function renderSopa() {
    const subject = CLEDUCA_DATA.subjects.find(s=>s.id===state.subject);
    const cellSize = Math.min(36, Math.floor((window.innerWidth - 48) / state.size));
    CleoUI.renderGameView({
      title: 'Sopa de Letras — ' + (subject?.name||''),
      progress: (state.found.length / state.words.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="padding:16px;display:flex;flex-direction:column;gap:16px;align-items:center;">
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
            ${state.words.map(w=>`
              <span class="badge badge-primary" id="word-${w}"
                style="${state.found.includes(w)?'background:var(--c-primary);color:#fff;text-decoration:line-through':''}">
                ${w}
              </span>
            `).join('')}
          </div>
          <div id="sopa-grid" style="display:grid;grid-template-columns:repeat(${state.size},${cellSize}px);
               gap:2px;user-select:none;touch-action:none;">
            ${state.grid.map((row,r)=>row.map((cell,c)=>`
              <div class="sopa-cell" data-r="${r}" data-c="${c}"
                   style="width:${cellSize}px;height:${cellSize}px;display:flex;align-items:center;
                   justify-content:center;border-radius:8px;border:1.5px solid var(--c-border);
                   background:var(--c-bg-card);font-family:'Plus Jakarta Sans',sans-serif;
                   font-weight:700;font-size:${Math.max(10,cellSize-14)}px;cursor:pointer;
                   transition:all 0.15s ease;"
                   onmousedown="GameSopa.startSel(${r},${c})"
                   onmouseover="GameSopa.moveSel(${r},${c})"
                   onmouseup="GameSopa.endSel()"
                   ontouchstart="GameSopa.startSel(${r},${c})"
                   ontouchmove="GameSopa.handleTouch(event)"
                   ontouchend="GameSopa.endSel()">
                ${cell}
              </div>
            `).join('')).join('')}
          </div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.85rem;color:var(--c-text-muted);">
            Encontradas: ${state.found.length}/${state.words.length}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  let selStart = null, selCells = [];

  function startSel(r, c) {
    selStart = {r,c};
    selCells = [{r,c}];
    highlightCells([{r,c}], 'var(--c-secondary)');
  }
  function moveSel(r, c) {
    if (!selStart) return;
    const path = getPath(selStart.r, selStart.c, r, c);
    selCells = path;
    clearHighlights();
    highlightCells(path, 'var(--c-secondary)');
  }
  function endSel() {
    if (!selStart || selCells.length === 0) { selStart=null; return; }
    const word = selCells.map(({r,c})=>state.grid[r][c]).join('');
    const wordRev = word.split('').reverse().join('');
    const found = state.words.find(w => w===word || w===wordRev);
    if (found && !state.found.includes(found)) {
      state.found.push(found);
      state.foundCells.push(...selCells);
      highlightCells(selCells, 'var(--c-primary)');
      document.getElementById('word-'+found)?.setAttribute('style',
        'background:var(--c-primary);color:#fff;text-decoration:line-through;');
      const xp = 20;
      CleoGame.addXP(xp);
      CleoGame.addSubjectXP(state.subject, xp);
      state.score += xp;
      CleoSpeech.say('¡Encontraste ' + found + '! ¡Excelente!');
      if (state.found.length === state.words.length) {
        setTimeout(() => {
          CleoGame.checkGameAchievement(state.subject, { perfect:true });
          CleoAnimations.confetti();
          CleoUI.showGameEnd({
            score:state.score, total:state.words.length,
            correct:state.found.length, wrong:0, perfect:true,
            onReplay:()=>start(state.subject,state.grade),
            onHome:()=>CleoRouter.navigate('home')
          });
        }, 800);
      }
    } else {
      clearHighlights();
    }
    selStart = null;
    selCells = [];
  }
  function handleTouch(e) {
    e.preventDefault();
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    if (el?.classList.contains('sopa-cell')) {
      const r = parseInt(el.dataset.r);
      const c = parseInt(el.dataset.c);
      moveSel(r, c);
    }
  }
  function getPath(r1,c1,r2,c2) {
    const dr = r2-r1, dc = c2-c1;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [{r:r1,c:c1}];
    // Only straight lines
    if (dr!==0 && dc!==0 && Math.abs(dr)!==Math.abs(dc)) return [{r:r1,c:c1}];
    const sr = dr===0?0:(dr>0?1:-1);
    const sc = dc===0?0:(dc>0?1:-1);
    const path = [];
    for (let i=0; i<=len; i++) path.push({r:r1+sr*i, c:c1+sc*i});
    return path;
  }
  function highlightCells(cells, color) {
    cells.forEach(({r,c}) => {
      const el = document.querySelector(`.sopa-cell[data-r="${r}"][data-c="${c}"]`);
      if (el) el.style.background = color;
    });
  }
  function clearHighlights() {
    document.querySelectorAll('.sopa-cell').forEach(el => {
      el.style.background = 'var(--c-bg-card)';
    });
    // Re-highlight found words
    if (state.foundCells && state.foundCells.length > 0) {
      highlightCells(state.foundCells, 'var(--c-primary)');
    }
  }
  function shuffle(arr) {
    for (let i=arr.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  return { start, startSel, moveSel, endSel, handleTouch };
})();

// ── MEMORIA ──
window.GameMemoria = (function() {
  let state = {};
  const CARDS = [
    {id:'sol',emoji:'☀️',label:'Sol'},
    {id:'luna',emoji:'🌙',label:'Luna'},
    {id:'estrella',emoji:'⭐',label:'Estrella'},
    {id:'planta',emoji:'🌿',label:'Planta'},
    {id:'perro',emoji:'🐕',label:'Perro'},
    {id:'gato',emoji:'🐱',label:'Gato'},
    {id:'libro',emoji:'📚',label:'Libro'},
    {id:'lapiz',emoji:'✏️',label:'Lápiz'},
    {id:'corazon',emoji:'❤️',label:'Corazón'},
    {id:'arbol',emoji:'🌳',label:'Árbol'},
    {id:'flor',emoji:'🌸',label:'Flor'},
    {id:'mariposa',emoji:'🦋',label:'Mariposa'}
  ];

  function start(pairs = 6) {
    const selected = shuffle([...CARDS]).slice(0, pairs);
    const cards = shuffle([...selected, ...selected].map((c,i) => ({...c, uid:i})));
    state = { cards, flipped:[], matched:[], moves:0, score:0, startTime:Date.now() };
    CleoGame.updateStreak();
    renderMemoria();
  }

  function renderMemoria() {
    const cols = state.cards.length <= 12 ? 4 : 4;
    CleoUI.renderGameView({
      title: 'Memoria de Imágenes',
      progress: (state.matched.length / state.cards.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="padding:16px;">
          <div style="text-align:center;margin-bottom:12px;">
            <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:var(--c-text-muted);">
              Movimientos: ${state.moves} | Parejas: ${state.matched.length/2}/${state.cards.length/2}
            </span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;">
            ${state.cards.map((card,i) => {
              const isFlipped  = state.flipped.includes(i);
              const isMatched  = state.matched.includes(card.uid);
              return `
                <div class="memory-card" onclick="GameMemoria.flip(${i})"
                     style="aspect-ratio:1;border-radius:16px;border:2.5px solid var(--c-border);
                     background:${isFlipped||isMatched?'var(--c-surface)':'var(--grad-btn)'};
                     display:flex;align-items:center;justify-content:center;
                     font-size:2rem;cursor:pointer;transition:all 0.3s ease;
                     transform:${isFlipped||isMatched?'rotateY(0deg)':'rotateY(180deg)'};
                     ${isMatched?'opacity:0.6;border-color:var(--c-primary);':''}
                     box-shadow:0 2px 8px var(--c-shadow-card);">
                  ${isFlipped||isMatched?card.emoji:'❓'}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function flip(idx) {
    if (state.flipped.length >= 2) return;
    if (state.flipped.includes(idx)) return;
    if (state.matched.includes(state.cards[idx].uid)) return;
    state.flipped.push(idx);
    state.moves++;
    if (state.flipped.length === 2) {
      const [a,b] = state.flipped;
      if (state.cards[a].id === state.cards[b].id) {
        state.matched.push(state.cards[a].uid, state.cards[b].uid);
        const xp = 15;
        CleoGame.addXP(xp);
        state.score += xp;
        state.flipped = [];
        if (state.matched.length === state.cards.length) {
          setTimeout(() => {
            CleoAnimations.confetti();
            CleoGame.checkGameAchievement('memoria', { perfect: state.moves <= state.cards.length });
            CleoUI.showGameEnd({
              score:state.score, total:state.cards.length/2,
              correct:state.cards.length/2, wrong:0, perfect:true,
              onReplay:()=>start(), onHome:()=>CleoRouter.navigate('home')
            });
          }, 600);
          return;
        }
      } else {
        setTimeout(() => { state.flipped = []; renderMemoria(); }, 800);
      }
    }
    renderMemoria();
  }

  function shuffle(arr) {
    for (let i=arr.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  return { start, flip };
})();

// ── CARRERA DE NÚMEROS ──
window.GameCarrera = (function() {
  let state = {};

  function start(grade) {
    const ops = generateOps(grade);
    state = { grade, ops, current:0, score:0, lives:5, position:0, totalLaps:5,
               startTime:Date.now(), timer:null };
    CleoGame.updateStreak();
    renderCarrera();
  }

  function generateOps(grade) {
    const ops = [];
    for (let i=0; i<10; i++) {
      if (grade <= 2) {
        const a = Math.floor(Math.random()*20)+1;
        const b = Math.floor(Math.random()*20)+1;
        const ans = a + b;
        const wrong = [ans-2,ans+1,ans-1,ans+3].filter(x=>x>0&&x!==ans);
        ops.push({q:`${a} + ${b} = ?`, ans, opts:shuffle([ans,...wrong.slice(0,3)])});
      } else if (grade <= 3) {
        const a = Math.floor(Math.random()*10)+1;
        const b = Math.floor(Math.random()*10)+1;
        const ans = a * b;
        const wrong = [ans-a,ans+b,ans-1,ans+a].filter(x=>x>0&&x!==ans);
        ops.push({q:`${a} × ${b} = ?`, ans, opts:shuffle([ans,...wrong.slice(0,3)])});
      } else {
        const a = Math.floor(Math.random()*50)+10;
        const b = Math.floor(Math.random()*20)+5;
        const ans = a + b;
        const wrong = [ans-5,ans+3,ans-2,ans+7].filter(x=>x>0&&x!==ans);
        ops.push({q:`${a} + ${b} = ?`, ans, opts:shuffle([ans,...wrong.slice(0,3)])});
      }
    }
    return ops;
  }

  function renderCarrera() {
    const op = state.ops[state.current];
    const progress = (state.position / state.totalLaps) * 100;
    if (!op) return endGame();
    CleoUI.renderGameView({
      title: '🏎️ Carrera de Números',
      progress: ((state.current)/state.ops.length)*100,
      lives: CleoGame.getLives(),
      content: `
        <div style="padding:20px;display:flex;flex-direction:column;gap:20px;">
          <!-- Track -->
          <div style="background:var(--c-surface);border-radius:16px;padding:16px;text-align:center;">
            <div style="font-size:2.5rem;">🏁${'▬'.repeat(Math.floor(state.position))}🏎️${'▬'.repeat(state.totalLaps-Math.floor(state.position))}🏁</div>
            <div style="height:8px;background:var(--c-border);border-radius:8px;margin-top:8px;overflow:hidden;">
              <div style="height:100%;width:${progress}%;background:var(--grad-btn);border-radius:8px;transition:width 0.5s;"></div>
            </div>
          </div>
          <div class="question-text animate-fadeInUp">${op.q}</div>
          <div class="options-grid">
            ${op.opts.map((opt,i)=>`
              <button class="option-btn" onclick="GameCarrera.answer(${opt})">${opt}</button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function answer(val) {
    const op = state.ops[state.current];
    if (val === op.ans) {
      state.position = Math.min(state.totalLaps, state.position + 0.5);
      const xp = 12;
      CleoGame.addXP(xp);
      state.score += xp;
      CleoSpeech.say('¡Correcto! ¡Acelera! 🚀');
    } else {
      CleoGame.loseLife();
      CleoSpeech.say('¡Incorrecto! Pero sigues en carrera 💪');
      if (CleoGame.getLives() <= 0) {
        CleoMonetization.watchAdForLives(() => renderCarrera());
        return;
      }
    }
    state.current++;
    setTimeout(() => renderCarrera(), 400);
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score:state.score, total:state.ops.length, correct:state.current, wrong:0,
      perfect:state.score >= state.ops.length*12,
      onReplay:()=>start(state.grade), onHome:()=>CleoRouter.navigate('home')
    });
  }

  function shuffle(arr) {
    for (let i=arr.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  return { start, answer };
})();

// ── LA SERPIENTE DE CLEO ──
window.GameSnake = (function() {
  let state = {};
  let canvas, ctx;
  let loopId;
  let keyHandler;

  function start(subject, grade) {
    state = {
      subject, grade,
      snake: [{x:10, y:10}, {x:9, y:10}, {x:8, y:10}],
      dir: {x:1, y:0},
      nextDir: {x:1, y:0},
      food: {x:15, y:15, val: 5}, // val is answer
      targetVal: 5,
      score: 0,
      gridSize: 20,
      width: 300,
      height: 300,
      question: "Atrapa el número: 5",
      speed: 150,
      lastRender: 0
    };
    generateFood();
    
    CleoUI.renderGameView({
      title: '🐍 Serpiente de Cleo',
      progress: 0,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:12px;">
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:800;color:var(--c-primary);margin-bottom:8px;" id="snake-q">${state.question}</div>
        <div style="display:flex;flex-direction:column;align-items:center;padding:10px;gap:12px;">
          <div id="snake-q" class="card" style="font-size:1.1rem;font-weight:900;color:var(--c-primary);padding:10px;width:100%;max-width:340px;text-align:center;">
            Preparando...
          </div>
          <div style="position:relative;width:${state.width}px;height:${state.height}px;">
            <canvas id="snake-canvas" width="${state.width}" height="${state.height}" style="background:#fff;border-radius:12px;border:3px solid var(--c-border);box-shadow:0 8px 24px rgba(0,0,0,0.1);touch-action:none;"></canvas>
            <div id="snake-overlay" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;">
              <button class="btn btn-primary btn-lg" onclick="GameSnake.play()" style="font-size:1.2rem;padding:12px 32px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">▶ ¡Empezar Juego!</button>
            </div>
          </div>
          <div style="display:flex;gap:10px;width:100%;max-width:340px;">
            <button class="btn btn-secondary" style="flex:1;height:60px;font-size:1.5rem;" onclick="GameSnake.turn(-1,0)">⬅️</button>
            <div style="display:flex;flex-direction:column;gap:10px;flex:1;">
              <button class="btn btn-secondary" style="height:60px;font-size:1.5rem;" onclick="GameSnake.turn(0,-1)">⬆️</button>
              <button class="btn btn-secondary" style="height:60px;font-size:1.5rem;" onclick="GameSnake.turn(0,1)">⬇️</button>
            </div>
            <button class="btn btn-secondary" style="flex:1;height:60px;font-size:1.5rem;" onclick="GameSnake.turn(1,0)">➡️</button>
          </div>
        </div>
      `,
      onBack: () => {
        cancelAnimationFrame(loopId);
        if (keyHandler) window.removeEventListener('keydown', keyHandler);
        CleoRouter.navigate('juegos');
      }
    });

    canvas = document.getElementById('snake-canvas');
    ctx = canvas.getContext('2d');
    
    keyHandler = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') turn(0,-1);
        else if (e.key === 'ArrowDown') turn(0,1);
        else if (e.key === 'ArrowLeft') turn(-1,0);
        else if (e.key === 'ArrowRight') turn(1,0);
      }
    };
    window.addEventListener('keydown', keyHandler);

    generateFood();
    draw();
  }

  function play() {
    let overlay = document.getElementById('snake-overlay');
    overlay.innerHTML = '<div style="font-size:4rem;color:#fff;font-weight:900;">3</div>';
    CleoSpeech.say("3");
    let count = 3;
    let inv = setInterval(() => {
      count--;
      if(count > 0) {
        overlay.innerHTML = `<div style="font-size:4rem;color:#fff;font-weight:900;">${count}</div>`;
        CleoSpeech.say(count.toString());
      } else {
        clearInterval(inv);
        overlay.style.display = 'none';
        state.running = true;
        loopId = requestAnimationFrame(loop);
        CleoSpeech.say("¡A jugar!");
      }
    }, 1000);
  }

  function generateFood() {
    state.food.x = Math.floor(Math.random() * (state.width / state.gridSize));
    state.food.y = Math.floor(Math.random() * (state.height / state.gridSize));
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    state.targetVal = a + b;
    state.food.val = state.targetVal;
    state.question = `Atrapa la suma: ${a} + ${b}`;
    const el = document.getElementById('snake-q');
    if (el) el.innerText = state.question;
  }

  function turn(x, y) {
    if (state.dir.x === 0 && x !== 0) { state.nextDir = {x, y:0}; }
    if (state.dir.y === 0 && y !== 0) { state.nextDir = {x:0, y}; }
  }

  function loop(timestamp) {
    if (!document.getElementById('snake-canvas')) return;
    if (!state.running) return;
    loopId = requestAnimationFrame(loop);
    
    if (timestamp - state.lastRender < state.speed) return;
    state.lastRender = timestamp;
    state.dir = state.nextDir;
    
    const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };
    
    if (head.x < 0 || head.x >= state.width/state.gridSize || head.y < 0 || head.y >= state.height/state.gridSize) {
      return gameOver();
    }
    for (let i = 0; i < state.snake.length; i++) {
      if (head.x === state.snake[i].x && head.y === state.snake[i].y) return gameOver();
    }

    state.snake.unshift(head);

    if (head.x === state.food.x && head.y === state.food.y) {
      CleoSpeech.say("¡Ñam!");
      CleoGame.addXP(5);
      state.score += 5;
      generateFood();
    } else {
      state.snake.pop();
    }

    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(state.food.x*state.gridSize + state.gridSize/2, state.food.y*state.gridSize + state.gridSize/2, state.gridSize/2-2, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.food.val, state.food.x*state.gridSize + state.gridSize/2, state.food.y*state.gridSize + state.gridSize/2 + 3);

    ctx.fillStyle = '#58CC02';
    for (let i = 0; i < state.snake.length; i++) {
      const p = state.snake[i];
      if (i===0) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(p.x*state.gridSize, p.y*state.gridSize, state.gridSize, state.gridSize);
      } else {
        ctx.fillStyle = '#89E219';
        ctx.fillRect(p.x*state.gridSize+1, p.y*state.gridSize+1, state.gridSize-2, state.gridSize-2);
      }
    }
  }

  function gameOver() {
    cancelAnimationFrame(loopId);
    state.running = false;
    CleoSpeech.say("¡Ups! Te chocaste");
    CleoGame.loseLife();
    CleoUI.showGameEnd({
      score: state.score, total: Math.floor(state.score/5), correct: Math.floor(state.score/5), wrong: 1, perfect: false,
      onReplay: () => start(state.subject, state.grade),
      onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, turn, play };
})();

// ── AVENTURA CAPIBARA ──
window.GameCapibara = (function() {
  let state = {};

  function start(subject, grade) {
    const questions = [
      { q: '¿Cuánto es 5 + 3?', opts: ['8', '10', '6'], ans: 0 },
      { q: '¿Cuánto es 9 - 4?', opts: ['3', '5', '7'], ans: 1 },
      { q: '¿Cuánto es 4 x 2?', opts: ['6', '9', '8'], ans: 2 },
      { q: '¿Cuánto es 10 ÷ 2?', opts: ['5', '4', '2'], ans: 0 },
      { q: '¿Cuánto es 7 + 6?', opts: ['12', '13', '14'], ans: 1 }
    ];
    state = { current: 0, score: 0, questions, lane: 1 };
    render();
  }

  function render() {
    if (state.current >= state.questions.length) return endGame();
    const q = state.questions[state.current];
    CleoUI.renderGameView({
      title: '🦦 Aventura Capibara',
      progress: (state.current / state.questions.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px;text-align:center;gap:16px;">
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.2rem;color:var(--c-primary);">
            ${q.q}
          </div>
          <div style="font-size:0.9rem;color:var(--c-text-muted);">Mueve al Capibara hacia la respuesta correcta:</div>
          
          <div style="font-size:4rem;margin:10px 0;animation:bounceIn 0.5s;">🦦</div>

          <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:320px;">
            ${q.opts.map((opt, idx) => `
              <button class="btn btn-primary btn-full" style="font-size:1.2rem;padding:14px;" onclick="GameCapibara.answer(${idx})">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function answer(idx) {
    const q = state.questions[state.current];
    if (idx === q.ans) {
      CleoGame.addXP(15);
      state.score += 15;
      CleoSpeech.say('¡Excelente! ¡Comiste la opción correcta!');
    } else {
      CleoGame.loseLife();
      CleoSpeech.say('¡Ups! Inténtalo en la próxima.');
    }
    state.current++;
    setTimeout(render, 400);
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: state.questions.length, correct: Math.floor(state.score/15), wrong: 0, perfect: true,
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, answer };
})();

// ── JUEGO DE DIFERENCIAS (3x3 Perfect Grid) ──
window.GameDiferencias = (function() {
  let state = {};
  const LEVELS = [
    { base: '🐶', diff: '🐺', desc: 'Encuentra al lobo entre los perritos' },
    { base: '🍎', diff: '🍏', desc: 'Encuentra la manzana verde entre las rojas' },
    { base: '🚗', diff: '🏎️', desc: 'Encuentra el auto de carreras' },
    { base: '⭐', diff: '🌟', desc: 'Encuentra la estrella brillante' },
    { base: '🐱', diff: '🐯', desc: 'Encuentra al tigre entre los gatos' }
  ];

  function start() {
    state = { current: 0, score: 0 };
    nextLevel();
  }

  function nextLevel() {
    if (state.current >= LEVELS.length) return endGame();
    const lvl = LEVELS[state.current];
    const grid = Array(12).fill(lvl.base);
    const diffIdx = Math.floor(Math.random() * 12);
    grid[diffIdx] = lvl.diff;
    state.diffIdx = diffIdx;

    CleoUI.renderGameView({
      title: '🔍 Diferencias Visuales',
      progress: (state.current / LEVELS.length) * 100,
      lives: CleoGame.getLives(),
      tip: lvl.desc,
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;height:100%;width:100%;padding:20px;box-sizing:border-box;background:#0F172A;color:#fff;">
          
          <div style="background:#1E293B;padding:16px 20px;border-radius:16px;border:2px solid #A855F7;width:100%;max-width:440px;text-align:center;box-shadow:0 8px 20px rgba(0,0,0,0.3);">
            <h3 style="margin:0;font-size:1.1rem;color:#F8FAFC;">🔍 ${lvl.desc}</h3>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;background:#1E293B;padding:20px;border-radius:20px;border:2px solid #334155;width:100%;max-width:340px;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
            ${grid.map((emoji, idx) => `
              <button onclick="GameDiferencias.check(${idx})" style="aspect-ratio:1;font-size:2.5rem;border:2px solid #475569;background:#0F172A;border-radius:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 #334155;">
                ${emoji}
              </button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function check(idx) {
    if (idx === state.diffIdx) {
      CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Excelente observación!");
      state.current++; setTimeout(nextLevel, 600);
    } else {
      CleoUI.toast("Ese no es el diferente", "❌", "error");
      window.handleWrongAnswerBase(
        () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.current++; nextLevel(); }), 500); },
        () => { /* continua buscando */ }
      );
    }
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: LEVELS.length, correct: state.score/20, wrong: LEVELS.length - (state.score/20), perfect: (state.score/20 === LEVELS.length),
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, check };
})();

// ── SOPA DE LETRAS ──
// ── ROMPECABEZAS VISUAL HD ──
window.GameRompecabezas = (function() {
  let state = {};
  const PUZZLE_IMAGES = [
    { title: '🐾 Animales Salvajes', icon: '🦁', emoji: '🐘 🦁 🦒 🦓', bg: 'linear-gradient(135deg, #059669, #10B981)', img: 'img/Logo_cleduca_transparente.png' },
    { title: '🏞️ Paisaje Natural', icon: '🌲', emoji: '🏔️ 🌲 🦅 🌊', bg: 'linear-gradient(135deg, #0284C7, #38BDF8)', img: 'img/Logo_cleduca_transparente.png' },
    { title: '🚀 Misión Espacial', icon: '🪐', emoji: '🚀 🪐 🌌 👩‍🚀', bg: 'linear-gradient(135deg, #7C3AED, #A855F7)', img: 'img/Logo_cleduca_transparente.png' },
    { title: '🏰 Castillo Fantástico', icon: '🏰', emoji: '👑 🏰 🐉 ⚔️', bg: 'linear-gradient(135deg, #D97706, #F59E0B)', img: 'img/Logo_cleduca_transparente.png' },
    { title: '🐶 Cleo y sus Amigos', icon: '🐶', emoji: '🐶 🎩 🕶️ ⭐', bg: 'linear-gradient(135deg, #BE185D, #EC4899)', img: 'img/Logo_cleduca_transparente.png' }
  ];

  function start() {
    CleoUI.renderGameView({
      title: '🧩 Rompecabezas',
      progress: 0,
      lives: CleoGame.getLives(),
      tip: "Elige una dificultad para comenzar a ordenar las piezas tocando una y luego otra.",
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;padding:20px;box-sizing:border-box;background:#0F172A;color:#fff;text-align:center;">
          <div style="font-size:4rem;margin-bottom:10px;">🧩</div>
          <h2 style="margin-bottom:20px;color:#38BDF8;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;">Elige la Dificultad</h2>
          <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px;">
            <button onclick="window._rompecabezasLvl=0; GameRompecabezas.playLevel()" style="background:#10B981;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #047857;cursor:pointer;">🟢 Fácil (3x3)</button>
            <button onclick="window._rompecabezasLvl=1; GameRompecabezas.playLevel()" style="background:#8B5CF6;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #6D28D9;cursor:pointer;">🟣 Medio (4x4)</button>
            <button onclick="window._rompecabezasLvl=2; GameRompecabezas.playLevel()" style="background:#EF4444;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #B91C1C;cursor:pointer;">🔴 Difícil (5x5)</button>
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function playLevel() {
    let currentLvl = window._rompecabezasLvl || 0;
    const s = Math.min(5, 3 + currentLvl);
    const numPieces = s * s;
    
    // Asegurar que las fichas queden desordenadas al inicio
    let p = Array.from({length: numPieces}, (_, i) => i);
    do {
      p = p.sort(() => Math.random() - 0.5);
    } while (p.every((v, i) => v === i));

    state = {
      level: currentLvl,
      size: s,
      pieces: p,
      selected: null,
      score: 0,
      moves: 0
    };
    render();
  }

  function render() {
    const pData = PUZZLE_IMAGES[state.level % PUZZLE_IMAGES.length];
    const isSolved = state.moves > 0 && state.pieces.every((val, idx) => val === idx);

    CleoUI.renderGameView({
      title: `🧩 ${pData.title}`,
      progress: isSolved ? 100 : Math.min(90, state.moves * 10),
      lives: CleoGame.getLives(),
      tip: "Toca una ficha y luego otra para intercambiar sus posiciones hasta armar la imagen.",
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;height:100%;width:100%;padding:16px;box-sizing:border-box;background:#0F172A;color:#fff;text-align:center;">
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1rem;color:#38BDF8;">
            ${pData.icon} Ordena la imagen (${state.size}x${state.size}) — ${pData.emoji}
          </div>

          <div style="display:grid;grid-template-columns:repeat(${state.size}, 1fr);gap:6px;background:#1E293B;padding:10px;border-radius:20px;border:3px solid #334155;width:100%;max-width:330px;box-shadow:0 8px 28px rgba(0,0,0,0.4);box-sizing:border-box;">
            ${state.pieces.map((pieceVal, gridIdx) => {
              const row = Math.floor(pieceVal / state.size);
              const col = pieceVal % state.size;
              const bgPosX = col * (100 / (state.size - 1));
              const bgPosY = row * (100 / (state.size - 1));
              const isSelected = state.selected === gridIdx;

              return `
                <div onclick="GameRompecabezas.clickTile(${gridIdx})"
                     style="aspect-ratio:1;border-radius:10px;border:2px solid ${isSelected ? '#F59E0B' : (isSolved ? '#10B981' : 'rgba(255,255,255,0.25)')};
                     background:${pData.bg};
                     background-image:url('${pData.img}');
                     background-size:${state.size * 100}% ${state.size * 100}%;
                     background-position:${bgPosX}% ${bgPosY}%;
                     background-repeat:no-repeat;
                     cursor:pointer;box-shadow:${isSelected ? '0 0 12px #F59E0B' : 'none'};
                     position:relative;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease;">
                  <div style="position:absolute;top:4px;left:4px;background:rgba(0,0,0,0.65);color:#fff;font-size:0.65rem;font-weight:800;padding:2px 6px;border-radius:4px;">
                    #${pieceVal + 1}
                  </div>
                  <div style="font-size:1.4rem;opacity:0.85;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                    ${['🦁','🐘','🦒','🦓','🌲','🦅','🪐','🚀','🏰','👑'][pieceVal % 10]}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex;gap:10px;width:100%;max-width:280px;margin-bottom:10px;">
            <button class="btn btn-ghost btn-sm" onclick="GameRompecabezas.showHint()" style="flex:1;font-weight:800;color:#F59E0B;background:#1E293B;">💡 Pista</button>
          </div>

          ${isSolved ? `
            <button class="btn btn-primary btn-full btn-lg" onclick="GameRompecabezas.finish()" style="margin-bottom:10px;background:linear-gradient(135deg,#22C55E,#16A34A);">
              🎉 ¡Rompecabezas Armado! (+20 XP)
            </button>
          ` : ''}
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function clickTile(idx) {
    if (state.selected === null) {
      state.selected = idx;
      render();
    } else {
      const prev = state.selected;
      const tmp = state.pieces[prev];
      state.pieces[prev] = state.pieces[idx];
      state.pieces[idx] = tmp;
      state.selected = null;
      state.moves++;

      if (state.pieces.every((v, i) => v === i)) {
        CleoGame.addXP(20);
        CleoAnimations.confetti();
        CleoSpeech.say('¡Excelente! Armaste el rompecabezas.');
      }
      render();
    }
  }

  function showHint() {
    CleoUI.toast(`Ordena las fichas del 1 al ${state.size * state.size}`, '💡', 'info');
  }

  function finish() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: 20, total: 1, correct: 1, wrong: 0, perfect: true,
      onReplay: () => start(),
      onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, playLevel, clickTile, showHint, finish };
})();

  function clickTile(idx) {
    if (state.selected === null) {
      state.selected = idx;
    } else {
      const prev = state.selected;
      const tmp = state.pieces[prev];
      state.pieces[prev] = state.pieces[idx];
      state.pieces[idx] = tmp;
      state.selected = null;
      if (state.pieces.every((v, i) => v === i)) {
        CleoSpeech.say('¡Excelente! Armaste la imagen.');
      }
    }
    render();
  }

  function showHint() {
    CleoUI.toast("Observa los números de cada pieza para colocarlos en orden de izquierda a derecha.", "💡", "info");
  }

  function finish() {
    CleoGame.addXP(20);
    CleoAnimations.confetti();
    CleoSpeech.say('¡Felicidades! Armaste el rompecabezas.');
    CleoUI.showGameEnd({
      score: 20, total: 1, correct: 1, wrong: 0, perfect: true,
      onReplay: () => { window._rompecabezasLvl = (window._rompecabezasLvl || 0) + 1; GameRompecabezas.playLevel(); }, onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, clickTile, showHint, finish, playLevel };
})();

// ── DETECTIVE CLEO (MISTERIOS Y LECTURA) ──
window.GameMisterio = (function() {
  let state = {};
  const CASES = [
    {
      title: "🕵️ Caso #1: El Diamante de la Selva",
      story: "Durante la fiesta de la selva, la medalla brillante de Cleo desapareció de la mesa de regalos. Tres sospechosos estuvieron cerca: el zorro Félix que llevaba un sombrero negro, el oso Bernardo que comía miel sin sombrero, y el loro Pepe que volaba por el techo. Cleo encontró una huella con forma de pluma blanca volando cerca del techo.",
      question: "¿Quién es el verdadero culpable?",
      suspects: [
        { name: "Loro Pepe", desc: "Tiene plumas blancas y vuela cerca del techo", icon: "🦜", isCulprit: true },
        { name: "Zorro Félix", desc: "Lleva sombrero negro y camina por tierra", icon: "🦊🎩", isCulprit: false },
        { name: "Oso Bernardo", desc: "Estaba en la mesa comiendo miel", icon: "🐻", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #2: El Misterio del Mapa Perdido",
      story: "Cleo y su equipo iban a buscar un tesoro en las montañas, pero el mapa de navegación desapareció del campamento. El sospechoso dejó tras de sí huellas húmedas con olor a pescado y sal marina. Félix el zorro estaba seco, pero el gato marinero Tom venía nadando del río con su caña de pescar.",
      question: "¿Quién se llevó el mapa?",
      suspects: [
        { name: "Gato Marinero Tom", desc: "Húmedo, olía a pescado y venía del río", icon: "🐱🎣", isCulprit: true },
        { name: "Zorro Félix", desc: "Estaba seco junto a la fogata", icon: "🦊", isCulprit: false },
        { name: "Conejo Saltarín", desc: "Estaba comiendo zanahorias", icon: "🐰", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #3: Las Zanahorias Robadas",
      story: "En el huerto de la escuela, alguien se llevó todas las zanahorias de la cosecha. En el suelo de tierra húmeda quedaron unas huellas de patas alargadas y grandes saltos. El oso Bernardo caminaba despacio, el perro Toby dejó huellas pequeñas, y el conejo Rabito andaba saltando de alegría.",
      question: "¿Quién se comió las zanahorias?",
      suspects: [
        { name: "Oso Bernardo", desc: "Camina despacio y pesado", icon: "🐻", isCulprit: false },
        { name: "Conejo Rabito", desc: "Tiene patas largas y avanza dando grandes saltos", icon: "🐰", isCulprit: true },
        { name: "Perro Toby", desc: "Dejó huellas pequeñas cerca de la reja", icon: "🐕", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #4: El Pastel Mordido",
      story: "El delicioso pastel de chocolate estaba en la ventana enfriándose, pero alguien le dio un gran mordisco. Solo había tres animales cerca, pero el mordisco dejó rastros de un hocico muy pequeño y dientes afilados que roen la madera. Toby es grande, el gato es carnívoro y el ratón Pérez adora los dulces.",
      question: "¿Quién mordió el pastel?",
      suspects: [
        { name: "Ratón Pérez", desc: "Hocico diminuto y dientes para roer", icon: "🐭", isCulprit: true },
        { name: "Perro Toby", desc: "Hocico grande y baboso", icon: "🐕", isCulprit: false },
        { name: "Gato Tom", desc: "Dientes de cazador y come pescado", icon: "🐱", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #5: El Jarrón Roto",
      story: "Un hermoso jarrón antiguo se rompió en el salón principal. Cerca de los cristales había unos pelos anaranjados y rayados de tigre. El perro es blanco, el ratón es gris y el gato Félix es el único felino anaranjado con rayas de la casa.",
      question: "¿Quién rompió el jarrón?",
      suspects: [
        { name: "Perro Blanco", desc: "Pelaje completamente blanco", icon: "🐕", isCulprit: false },
        { name: "Ratón Gris", desc: "Pequeño y de color gris", icon: "🐭", isCulprit: false },
        { name: "Gato Félix", desc: "Felino anaranjado con rayas de tigre", icon: "🐱", isCulprit: true }
      ]
    },
    {
      title: "🕵️ Caso #6: Las Gafas Desaparecidas",
      story: "El profesor Búho no puede encontrar sus gafas de lectura. Alguien las tomó y dejó un rastro brillante de baba viscosa que sube por la pared del árbol hasta una hoja mojada.",
      question: "¿Quién se llevó las gafas?",
      suspects: [
        { name: "Loro Pepe", desc: "Vuela rápido pero no deja rastro", icon: "🦜", isCulprit: false },
        { name: "Caracol Lento", desc: "Deja un rastro brillante y viscoso", icon: "🐌", isCulprit: true },
        { name: "Rana Saltarina", desc: "Salta pero no deja baba", icon: "🐸", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #7: El Misterio de la Bellota",
      story: "La bellota dorada del árbol central desapareció. El culpable trepó por el tronco ágilmente usando sus garras pequeñas y una cola muy tupida. El mapache es pesado, el pájaro vuela, pero la ardilla siempre guarda bellotas en sus mejillas.",
      question: "¿Quién escondió la bellota dorada?",
      suspects: [
        { name: "Pájaro Carpintero", desc: "Vuela y picotea la madera", icon: "🐦", isCulprit: false },
        { name: "Mapache Bandido", desc: "Pesado y lento para trepar", icon: "🦝", isCulprit: false },
        { name: "Ardilla Listada", desc: "Cola tupida y experta trepadora", icon: "🐿️", isCulprit: true }
      ]
    },
    {
      title: "🕵️ Caso #8: El Cuadro Manchado",
      story: "Alguien manchó el nuevo cuadro de la escuela con pintura negra. En el suelo quedaron marcas de ocho patas muy pequeñitas empapadas en tinta negra.",
      question: "¿Quién manchó el cuadro?",
      suspects: [
        { name: "Araña Tejedora", desc: "Tiene ocho patas pequeñitas", icon: "🕷️", isCulprit: true },
        { name: "Hormiga Obrera", desc: "Tiene seis patas pequeñas", icon: "🐜", isCulprit: false },
        { name: "Gusano Verde", desc: "Se arrastra sin patas", icon: "🐛", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #9: La Bufanda Enredada",
      story: "La bufanda de lana roja amaneció completamente desenredada. El culpable adora jugar con estambre y dejó un maullido grabado en la cinta de seguridad.",
      question: "¿Quién desenredó la bufanda?",
      suspects: [
        { name: "Perro Dálmata", desc: "Juega con pelotas, ladra", icon: "🐶", isCulprit: false },
        { name: "Gatito Travieso", desc: "Le encanta el estambre y maúlla", icon: "🐱", isCulprit: true },
        { name: "Ratón de Biblioteca", desc: "Lee libros en silencio", icon: "🐭", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #10: Las Huellas de Lodo",
      story: "El piso recién lavado tiene grandes manchas de lodo con forma de herradura. El perro tiene almohadillas suaves, el pato tiene patas palmeadas, y el caballo acaba de llegar del pantano.",
      question: "¿Quién ensució el piso?",
      suspects: [
        { name: "Perro Labrador", desc: "Huellas suaves de almohadillas", icon: "🐕", isCulprit: false },
        { name: "Caballo Veloz", desc: "Patas con herraduras", icon: "🐎", isCulprit: true },
        { name: "Pato Nadador", desc: "Patas palmeadas planas", icon: "🦆", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #11: El Nido Vacio",
      story: "Un huevo desapareció del nido alto del árbol. El ladrón no puede volar, pero es largo, se arrastra silenciosamente por las ramas y sisea.",
      question: "¿Quién se robó el huevo?",
      suspects: [
        { name: "Mono Tití", desc: "Trepa rápido y hace mucho ruido", icon: "🐒", isCulprit: false },
        { name: "Serpiente Sigilosa", desc: "Se arrastra y sisea en silencio", icon: "🐍", isCulprit: true },
        { name: "Halcón Cazador", desc: "Vuela por el cielo", icon: "🦅", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #12: La Manzana Desaparecida",
      story: "La manzana más jugosa de la canasta fue robada. Alrededor de la canasta quedaron pelos largos y una cáscara de plátano mordida.",
      question: "¿Quién tomó la manzana?",
      suspects: [
        { name: "Caballo Blanco", desc: "Come heno y manzanas, no plátanos", icon: "🐎", isCulprit: false },
        { name: "Mono Chimpancé", desc: "Peludo, adora las frutas y come plátanos", icon: "🐒", isCulprit: true },
        { name: "Conejo Blanco", desc: "Come zanahorias y lechuga", icon: "🐰", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #13: El Charco en la Sala",
      story: "Alguien entró a la sala mojado y dejó un charco de agua salada. Además, olvidó un hermoso caparazón duro sobre el sofá.",
      question: "¿Quién mojó el sofá?",
      suspects: [
        { name: "Tortuga Marina", desc: "Viene del mar y tiene caparazón", icon: "🐢", isCulprit: true },
        { name: "Sapo de Río", desc: "Viene del río de agua dulce, piel blanda", icon: "🐸", isCulprit: false },
        { name: "Gato Pescador", desc: "No le gusta el agua, no tiene caparazón", icon: "🐱", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #14: El Queso Rallado",
      story: "Una rueda de queso amarillo gigante fue mordisqueada. Quedaron pequeños túneles en el queso y un agujerito en la pared inferior por donde el ladrón escapó.",
      question: "¿Quién se comió el queso?",
      suspects: [
        { name: "Ratón Pequeñín", desc: "Vive en agujeros y ama el queso", icon: "🐭", isCulprit: true },
        { name: "Zorro Astuto", desc: "Demasiado grande para el agujero", icon: "🦊", isCulprit: false },
        { name: "Búho Nocturno", desc: "Vuela y come ratones", icon: "🦉", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #15: La Miel Robada",
      story: "El panal de abejas fue vaciado por completo. El ladrón es inmenso, de pelaje grueso y marrón, y dejó grandes garras pegajosas de miel en el tronco.",
      question: "¿Quién se comió la miel?",
      suspects: [
        { name: "Pájaro Carpintero", desc: "No come miel en grandes cantidades", icon: "🐦", isCulprit: false },
        { name: "Oso Goloso", desc: "Pelaje grueso, grande, ama la miel", icon: "🐻", isCulprit: true },
        { name: "Lobo Feroz", desc: "Come carne, no miel", icon: "🐺", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #16: Las Flores Pisoteadas",
      story: "El jardín de tulipanes fue aplastado. Quedaron huellas gigantes, circulares y profundas en el suelo, como columnas pesadas. También se escuchó un fuerte sonido de trompeta.",
      question: "¿Quién pisó el jardín?",
      suspects: [
        { name: "León Rey", desc: "Ruge fuerte, huellas de felino", icon: "🦁", isCulprit: false },
        { name: "Elefante Sabio", desc: "Huellas enormes como columnas, trompeta sonora", icon: "🐘", isCulprit: true },
        { name: "Caballo Salvaje", desc: "Relincha y tiene herraduras", icon: "🐎", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #17: La Lechuga Masticada",
      story: "En la granja, toda la lechuga fue devorada durante la noche. El culpable dejó rastros de lana blanca enredada en la cerca de madera y suena con un suave 'beee'.",
      question: "¿Quién se comió la lechuga?",
      suspects: [
        { name: "Cerdo Rosado", desc: "Piel sin lana, gruñe", icon: "🐷", isCulprit: false },
        { name: "Vaca Lechera", desc: "Hace muu, pelo corto", icon: "🐮", isCulprit: false },
        { name: "Oveja Esponjosa", desc: "Tiene lana blanca y hace beee", icon: "🐑", isCulprit: true }
      ]
    },
    {
      title: "🕵️ Caso #18: El Pez Desaparecido",
      story: "Un pez dorado desapareció de la cubeta. El culpable dejó plumas grandes, tiene un pico enorme como una bolsa y sus patas son palmeadas.",
      question: "¿Quién se llevó al pez?",
      suspects: [
        { name: "Gato Pescador", desc: "No tiene plumas ni pico", icon: "🐱", isCulprit: false },
        { name: "Pelícano Pescador", desc: "Plumas, pico de bolsa, come peces", icon: "🦤", isCulprit: true },
        { name: "Loro Verde", desc: "Pico pequeño, come semillas", icon: "🦜", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #19: Las Nueces Enterradas",
      story: "Alguien cavó agujeros en el patio trasero y enterró muchas nueces. El jardín está lleno de pequeños montículos y se vio una cola peluda moviéndose rápido.",
      question: "¿Quién enterró las nueces?",
      suspects: [
        { name: "Perro Cavador", desc: "Entierra huesos, no nueces", icon: "🐕", isCulprit: false },
        { name: "Ardilla Veloz", desc: "Entierra nueces, cola peluda", icon: "🐿️", isCulprit: true },
        { name: "Gato Solitario", desc: "Entierra otras cosas, no nueces", icon: "🐱", isCulprit: false }
      ]
    },
    {
      title: "🕵️ Caso #20: El Misterio de la Noche",
      story: "Durante la noche, un sonido agudo y chirriante despertó a Cleo. El animal que hacía el ruido volaba en la oscuridad usando sus grandes orejas de radar y dormía boca abajo durante el día.",
      question: "¿Quién hizo el ruido nocturno?",
      suspects: [
        { name: "Búho Sabio", desc: "Vuela pero ulula y duerme de pie", icon: "🦉", isCulprit: false },
        { name: "Murciélago Ciego", desc: "Vuela en la noche, radar, duerme boca abajo", icon: "🦇", isCulprit: true },
        { name: "Ratón Común", desc: "No vuela, hace ruido pero en el suelo", icon: "🐭", isCulprit: false }
      ]
    }
  ];

  function start() {
    state = { current: 0, score: 0 };
    render();
  }

  function render() {
    if (state.current >= CASES.length) return endGame();
    const c = CASES[state.current];
    try { CleoSpeech.say(c.title + '. ' + c.story); } catch(e) {}

    CleoUI.renderGameView({
      title: '🕵️ Detective Cleo',
      progress: (state.current / CASES.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px;text-align:center;gap:16px;width:100%;">
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:var(--c-primary);font-size:1.15rem;margin:0;">
            ${c.title}
          </h2>

          <div class="card" style="padding:16px;background:var(--c-surface);border:2px solid var(--c-primary);text-align:left;line-height:1.6;font-size:0.92rem;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
            <div style="font-weight:900;color:var(--c-primary);margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
              <span>📖 Historia Acompañada:</span>
              <button class="btn btn-sm btn-secondary" onclick="CleoSpeech.say('${c.story.replace(/'/g, "\\'")}')" style="font-size:0.75rem;padding:4px 8px;">
                🔊 Escuchar
              </button>
            </div>
            <div>${c.story}</div>
            <div style="margin-top:10px;font-weight:800;color:var(--c-text);">${c.question}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:340px;">
            ${c.suspects.map((s, idx) => `
              <button class="btn btn-secondary btn-full" style="font-size:0.95rem;padding:14px;display:flex;align-items:center;gap:12px;border-radius:16px;text-align:left;" onclick="GameMisterio.check(${idx})">
                <span style="font-size:2rem;flex-shrink:0;">${s.icon}</span>
                <div style="flex:1;">
                  <div style="font-weight:900;font-family:'Plus Jakarta Sans',sans-serif;">${s.name}</div>
                  <div style="font-size:0.75rem;color:var(--c-text-muted);margin-top:2px;">${s.desc}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function check(idx) {
    const c = CASES[state.current];
    const s = c.suspects[idx];
    if (s.isCulprit) {
      CleoGame.addXP(20);
      state.score += 20;
      CleoSpeech.say('¡Excelente lectura y deducción! Encontraste al culpable.');
      CleoUI.toast('¡Sospechoso correcto! 🎉', '🕵️', 'success');
      state.current++;
      setTimeout(render, 500);
    } else {
      CleoGame.loseLife();
      CleoSpeech.say('Ese sospechoso no coincide con la pista de la lectura. Lee con atención.');
      CleoUI.toast('No coincide con las pistas. ¡Lee de nuevo!', '❌', 'error');
    }
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: CASES.length, correct: CASES.length, wrong: 0, perfect: true,
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, check };
})();

// ── PUZZLES DE SECUENCIAS ──
window.GamePuzzle = (function() {
  let state = {};
  const PUZZLES = [
    { seq: ['2', '4', '6', '?'], ans: '8', opts: ['7', '8', '9', '10'] },
    { seq: ['5', '10', '15', '?'], ans: '20', opts: ['18', '20', '25', '30'] },
    { seq: ['🌱', '🌿', '🌳', '?'], ans: '🍎', opts: ['🍎', '🧱', '🚗', '⭐'] },
    { seq: ['🔴', '🔵', '🔴', '?'], ans: '🔵', opts: ['🟢', '🔵', '🟡', '🔴'] },
    { seq: ['10', '9', '8', '?'], ans: '7', opts: ['6', '7', '5', '4'] }
  ];

  function start() {
    state = { current: 0, score: 0 };
    render();
  }

  function render() {
    if (state.current >= PUZZLES.length) return endGame();
    const p = PUZZLES[state.current];
    CleoUI.renderGameView({
      title: '🧠 Puzzles de Secuencias',
      progress: (state.current / PUZZLES.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px;text-align:center;gap:20px;">
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.1rem;color:var(--c-primary);">
            ¿Qué elemento falta en la secuencia?
          </div>

          <div style="display:flex;gap:12px;justify-content:center;align-items:center;background:var(--c-surface);padding:20px;border-radius:20px;border:2px solid var(--c-border);width:100%;max-width:320px;">
            ${p.seq.map(item => `
              <div style="font-size:2rem;font-weight:900;background:var(--c-bg-card);padding:10px 14px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                ${item}
              </div>
            `).join('')}
          </div>

          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;width:100%;max-width:320px;">
            ${p.opts.map(opt => `
              <button class="btn btn-primary" style="font-size:1.4rem;padding:14px;" onclick="GamePuzzle.check('${opt}')">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function check(opt) {
    const p = PUZZLES[state.current];
    if (opt === p.ans) {
      CleoGame.addXP(15);
      state.score += 15;
      CleoSpeech.say('¡Excelente razonamiento!');
      state.current++;
      setTimeout(render, 400);
    } else {
      CleoGame.loseLife();
      CleoSpeech.say('Ese número no sigue el patrón. Inténtalo de nuevo.');
    }
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: PUZZLES.length, correct: state.current, wrong: 0, perfect: true,
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, check };
})();

// ── ANATOMÍA INTERACTIVA ──
window.GameAnatomia = (function() {
  let state = {};
  const ANATOMIA_DATA = [
    { organ: "🫀 Corazón", question: "¿Cuál es la función principal del Corazón?", opts: ["Bombar sangre a todo el cuerpo", "Digerir la comida", "Filtrar el aire", "Pensar y recordar"], ans: 0, tip: "Palpita en tu pecho y envía oxígeno a todas tus células." },
    { organ: "🧠 Cerebro", question: "¿Qué órgano controla los pensamientos y movimientos?", opts: ["Cerebro", "Estómago", "Huesos", "Piel"], ans: 0, tip: "Es el centro de mando de todo tu cuerpo." },
    { organ: "🫁 Pulmones", question: "¿Qué órgano nos permite respirar el oxígeno del aire?", opts: ["Pulmones", "Hígado", "Riñones", "Corazón"], ans: 0, tip: "Se inflan como globos cuando tomas aire." },
    { organ: "🦴 Huesos", question: "¿Qué estructura sostiene el cuerpo y protege los órganos?", opts: ["Esqueleto / Huesos", "Músculos", "Venas", "Uñas"], ans: 0, tip: "Son 206 piezas rígidas que forman tu esqueleto." },
    { organ: "👁️ Ojos", question: "¿Qué sentido nos permite captar la luz y los colores?", opts: ["Vista (Ojos)", "Oído", "Gusto", "Tacto"], ans: 0, tip: "Gracias a ellos puedes leer este texto." },
    { organ: "🦷 Dientes", question: "¿Para qué sirven los Dientes en la digestión?", opts: ["Triturar los alimentos", "Absorber agua", "Respirar", "Producir saliva"], ans: 0, tip: "Mastican la comida para facilitar la digestión." },
    { organ: "🦿 Músculos", question: "¿Qué parte del cuerpo nos permite movernos tirando de los huesos?", opts: ["Músculos", "Cabello", "Sangre", "Grasa"], ans: 0, tip: "Se contraen y relajan para hacer fuerza." }
  ];

  function start() {
    state = { current: 0, score: 0 };
    render();
  }

  function render() {
    if (state.current >= ANATOMIA_DATA.length) return endGame();
    const item = ANATOMIA_DATA[state.current];
    CleoUI.renderGameView({
      title: '🫀 Anatomía del Cuerpo',
      progress: (state.current / ANATOMIA_DATA.length) * 100,
      lives: CleoGame.getLives(),
      tip: item.tip,
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;height:100%;width:100%;padding:20px;box-sizing:border-box;background:#0F172A;color:#fff;">
          <div style="font-size:4.5rem;margin-top:10px;animation:floatBig 3s infinite ease-in-out;">${item.organ.split(' ')[0]}</div>
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;color:#38BDF8;font-size:1.3rem;margin:0 0 10px 0;text-align:center;">
            ${item.organ}
          </h2>
          <div style="background:#1E293B;padding:18px;border-radius:16px;border:2px solid #334155;width:100%;max-width:440px;text-align:center;box-shadow:0 8px 20px rgba(0,0,0,0.3);">
            ${item.question}
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:10px;width:100%;max-width:440px;margin-bottom:10px;">
            ${item.opts.map((opt, i) => `
              <button onclick="GameAnatomia.answer(${i})" style="background:#1E293B;color:#F8FAFC;border:2px solid #38BDF8;padding:14px;border-radius:14px;font-weight:800;font-size:1rem;cursor:pointer;text-align:center;">${opt}</button>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
    CleoSpeech.say(`${item.organ}. ${item.question}`);
  }

  function answer(idx) {
    const item = ANATOMIA_DATA[state.current];
    if (idx === item.ans) {
      CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Respuesta correcta!");
      state.current++; setTimeout(render, 800);
    } else {
      CleoUI.toast("Respuesta incorrecta", "❌", "error");
      window.handleWrongAnswerBase(
        () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.current++; render(); }), 500); },
        () => { state.current++; setTimeout(render, 1000); }
      );
    }
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: ANATOMIA_DATA.length, correct: state.score/20, wrong: ANATOMIA_DATA.length - (state.score/20), perfect: (state.score/20 === ANATOMIA_DATA.length),
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, answer };
})();

// ── DIBUJO Y PINTURA MONTESSORI ──
window.GamePintura = (function() {
  let isDrawing = false;
  let color = '#FF4757';

  function start() {
    CleoUI.renderGameView({
      title: '🎨 Estudio de Dibujo',
      progress: 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:10px;gap:12px;">
          <div style="display:flex;gap:10px;justify-content:center;background:var(--c-surface);padding:8px 16px;border-radius:20px;border:1px solid var(--c-border);">
            ${['#FF4757','#2ED573','#1E90FF','#FFA500','#2F3542','#8E44AD'].map(c => `
              <button onclick="GamePintura.setColor('${c}')" style="width:32px;height:32px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);cursor:pointer;"></button>
            `).join('')}
            <button onclick="GamePintura.clear()" style="background:#f0f0f0;border:none;border-radius:12px;padding:4px 10px;font-weight:bold;cursor:pointer;">🧹 Limpiar</button>
          </div>
          
          <canvas id="paint-canvas" width="320" height="340" style="background:#fff;border-radius:20px;box-shadow:0 8px 24px rgba(0,0,0,0.1);touch-action:none;cursor:crosshair;"></canvas>
          
          <button class="btn btn-primary btn-full" onclick="CleoGame.addXP(20); CleoSpeech.say('¡Qué hermoso dibujo!'); CleoAnimations.confetti(); CleoUI.toast('¡Dibujo guardado!', '🎨', 'success');">
            ✨ Guardar Obra de Arte (+20 XP)
          </button>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });

    setTimeout(() => {
      const cvs = document.getElementById('paint-canvas');
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';

      const getPos = (e) => {
        const rect = cvs.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const startDraw = (e) => { isDrawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
      const draw = (e) => { if (!isDrawing) return; const p = getPos(e); ctx.strokeStyle = color; ctx.lineTo(p.x, p.y); ctx.stroke(); };
      const stopDraw = () => { isDrawing = false; };

      cvs.onmousedown = startDraw; cvs.onmousemove = draw; window.onmouseup = stopDraw;
      cvs.ontouchstart = startDraw; cvs.ontouchmove = draw; window.ontouchend = stopDraw;
    }, 100);
  }

  function setColor(c) { color = c; }
  function clear() {
    const cvs = document.getElementById('paint-canvas');
    if (cvs) cvs.getContext('2d').clearRect(0,0,cvs.width,cvs.height);
  }

  return { start, setColor, clear };
})();

// ── VISTE A CLEO (CUSTOMIZADOR DE MASCOTA INTERACTIVO) ──
window.GameDressUp = (function() {
  let activeSkin = 'verde';
  let activeAcc = 'none';

  const ACCESSORIES = [
    { id: 'none', name: 'Sin Accesorio', emoji: '❌' },
    { id: 'corona', name: 'Corona Real', emoji: '👑' },
    { id: 'gafas', name: 'Gafas de Sol', emoji: '🕶️' },
    { id: 'gorra', name: 'Gorra Deportiva', emoji: '🧢' },
    { id: 'sombrero', name: 'Sombrero Elegante', emoji: '🎩' },
    { id: 'moño', name: 'Moño Rosado', emoji: '🎀' },
    { id: 'birrete', name: 'Birrete Graduado', emoji: '🎓' },
    { id: 'audifonos', name: 'Audífonos Dj', emoji: '🎧' }
  ];

  const SKINS = [
    { id: 'verde', name: 'Husky Clásico', emoji: '🐶' },
    { id: 'galaxia', name: 'Cleo Morado', emoji: '🔮' },
    { id: 'fuego', name: 'Cleo Fuego', emoji: '🔥' },
    { id: 'oceanica', name: 'Cleo Azul', emoji: '🌊' },
    { id: 'primavera', name: 'Cleo Rosado', emoji: '🌸' },
    { id: 'dorada', name: 'Cleo Dorado', emoji: '⭐' }
  ];

  function start() {
    const p = CleoAuth.getActive() || {};
    activeSkin = p.skin || 'verde';
    activeAcc = p.accessory || 'none';
    render();
  }

  function render() {
    CleoUI.renderGameView({
      title: '👗 Viste a Cleo',
      progress: 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px;gap:14px;text-align:center;width:100%;">
          
          <div id="cleo-dressup-preview" style="width:150px;height:150px;border-radius:50%;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.15);background:#fff;padding:10px;cursor:pointer;"
               onclick="CleoSpeech.say('¡Me encanta este nuevo look!'); CleoAnimations.confetti();">
            ${CleoChr.getSVG(activeSkin, 'happy', activeAcc).replace('class="cleo-svg"', 'class="cleo-svg" style="width:100%;height:100%;"')}
          </div>

          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.15rem;color:var(--c-primary);">
            ¡Personaliza y Viste a Cleo!
          </div>

          <div class="card" style="padding:14px;width:100%;max-width:340px;background:var(--c-surface);">
            <div style="font-weight:800;font-size:0.85rem;margin-bottom:10px;color:var(--c-text-muted);text-align:left;">🎩 Elige un Accesorio:</div>
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;">
              ${ACCESSORIES.map(a => `
                <button class="btn ${activeAcc === a.id ? 'btn-primary' : 'btn-secondary'}"
                        style="padding:10px 4px;display:flex;flex-direction:column;align-items:center;font-size:0.75rem;"
                        onclick="GameDressUp.setAcc('${a.id}')">
                  <span style="font-size:1.4rem;">${a.emoji}</span>
                  <span style="font-size:0.65rem;margin-top:2px;">${a.name.split(' ')[0]}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card" style="padding:14px;width:100%;max-width:340px;background:var(--c-surface);">
            <div style="font-weight:800;font-size:0.85rem;margin-bottom:10px;color:var(--c-text-muted);text-align:left;">🎨 Color de Cleo:</div>
            <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
              ${SKINS.map(s => `
                <button class="btn ${activeSkin === s.id ? 'btn-primary' : 'btn-secondary'}"
                        style="padding:10px 4px;font-size:0.78rem;"
                        onclick="GameDressUp.setSkin('${s.id}')">
                  <span>${s.emoji} ${s.name.split(' ')[1]||s.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display:flex;gap:10px;width:100%;max-width:340px;">
            <button class="btn btn-ghost btn-sm" onclick="GameDressUp.showHint()" style="flex:1;font-weight:800;">💡 Pista</button>
            <button class="btn btn-primary btn-lg" style="flex:2;" onclick="GameDressUp.saveToProfile()">
              💖 ¡Guardar en Mi Perfil!
            </button>
          </div>

        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function setAcc(accId) {
    activeAcc = accId;
    CleoSpeech.say('¡Me queda genial!');
    render();
  }

  function setSkin(skinId) {
    activeSkin = skinId;
    CleoSpeech.say('¡Qué lindo color!');
    render();
  }

  function showHint() {
    CleoUI.toast('💡 Selecciona cualquier accesorio o color y presiona "Guardar en Mi Perfil"', '💡', 'info');
    CleoSpeech.say('¡Prueba todos los accesorios para encontrar tu favorito!');
  }

  function saveToProfile() {
    const p = CleoAuth.getActive();
    if (p) {
      CleoAuth.updateProfile(p.id, { skin: activeSkin, accessory: activeAcc });
      CleoGame.addXP(20);
      CleoAnimations.confetti();
      CleoSpeech.say('¡Estilo guardado en tu perfil con éxito!');
      CleoUI.toast('¡Cleo actualizado en tu perfil! 💖', '✨', 'success');
    }
  }

  return { start, setAcc, setSkin, showHint, saveToProfile };
})();

// ── PIANO Y MÚSICA EDUCATIVA (MODOS DE JUEGO & NIVELES) ──
window.GameMusica = (function() {
  let state = {};

  const NOTES = [
    { note: 'Do', freq: 261.63, color: '#FF4757', key: 'C' },
    { note: 'Re', freq: 293.66, color: '#FFA500', key: 'D' },
    { note: 'Mi', freq: 329.63, color: '#2ED573', key: 'E' },
    { note: 'Fa', freq: 349.23, color: '#1E90FF', key: 'F' },
    { note: 'Sol', freq: 392.00, color: '#9B59B6', key: 'G' },
    { note: 'La', freq: 440.00, color: '#E67E22', key: 'A' },
    { note: 'Si', freq: 493.88, color: '#EC4899', key: 'B' }
  ];

  const SONGS = [
    { title: '⭐ Estrellita Dónde Estás', sequence: [0, 0, 4, 4, 5, 5, 4], desc: 'Do Do Sol Sol La La Sol' },
    { title: '🎂 Cumpleaños Feliz', sequence: [0, 0, 1, 0, 3, 2], desc: 'Do Do Re Do Fa Mi' },
    { title: '🐥 Los Pollitos Dicen', sequence: [0, 1, 2, 3, 4, 4], desc: 'Do Re Mi Fa Sol Sol' }
  ];

  function start() {
    CleoUI.renderGameView({
      title: '🎹 Piano de Cleo',
      progress: 0,
      lives: CleoGame.getLives(),
      tip: "Elige la modalidad que prefieras: Tocar canciones, responder quizzes de oído o practicar libremente.",
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;padding:20px;box-sizing:border-box;background:#0F172A;color:#fff;text-align:center;">
          <div style="font-size:4rem;margin-bottom:10px;">🎹</div>
          <h2 style="font-size:1.5rem;margin-bottom:20px;color:#F59E0B;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;">Elige tu Modo Musical</h2>
          <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px;">
            <button onclick="GameMusica.selectMode('partitura')" style="background:#38BDF8;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #0284C7;cursor:pointer;">🎼 Modo Canciones</button>
            <button onclick="GameMusica.selectMode('oido')" style="background:#EC4899;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #BE185D;cursor:pointer;">👂 Quiz de Oído</button>
            <button onclick="GameMusica.selectMode('libre')" style="background:#10B981;color:#fff;border:none;padding:16px;border-radius:16px;font-weight:900;font-size:1.1rem;box-shadow:0 4px 0 #047857;cursor:pointer;">🎹 Modo Libre</button>
          </div>
        </div>
      `,
      onBack: () => CleoRouter.navigate('juegos')
    });
  }

  function selectMode(mode) {
    state = {
      mode,
      currentLevel: 0,
      sequencePos: 0,
      targetNoteIdx: 0,
      score: 0,
      lives: CleoGame.getLives()
    };
    if (mode === 'oido') {
      nextEarTraining();
    } else {
      renderPiano();
    }
  }

  function playNote(index) {
    const n = NOTES[index];
    if (!n) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}

    if (state.mode === 'partitura') {
      const song = SONGS[state.currentLevel];
      if (song && index === song.sequence[state.sequencePos]) {
        state.sequencePos++;
        if (state.sequencePos >= song.sequence.length) {
          CleoGame.addXP(25); state.score += 25; CleoAnimations.confetti(); CleoSpeech.say("¡Excelente interpretación!");
          state.currentLevel++; state.sequencePos = 0;
          if (state.currentLevel >= SONGS.length) return endGame();
        }
        renderPiano();
      } else if (song) {
        CleoUI.toast("Nota incorrecta", "🎵", "error");
        window.handleWrongAnswerBase(
          () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { renderPiano(); }), 500); },
          () => { state.sequencePos = 0; renderPiano(); }
        );
      }
    } else if (state.mode === 'oido') {
      if (index === state.targetNoteIdx) {
        CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Excelente oído!");
        state.currentLevel++;
        if (state.currentLevel >= 5) return endGame();
        setTimeout(nextEarTraining, 1000);
      } else {
        CleoUI.toast("No era esa nota", "👂", "error");
        window.handleWrongAnswerBase(
          () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { nextEarTraining(); }), 500); },
          () => { setTimeout(nextEarTraining, 1000); }
        );
      }
    }
  }

  function nextEarTraining() {
    state.targetNoteIdx = Math.floor(Math.random() * NOTES.length);
    playNote(state.targetNoteIdx);
    renderPiano();
  }

  function renderPiano() {
    const song = SONGS[state.currentLevel];
    CleoUI.renderGameView({
      title: '🎹 Piano de Cleo',
      progress: (state.currentLevel / (state.mode === 'partitura' ? SONGS.length : 5)) * 100,
      lives: CleoGame.getLives(),
      tip: "Toca las teclas de colores para producir sonido y resolver los retos.",
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;height:100%;width:100%;padding:16px;box-sizing:border-box;background:#0F172A;color:#fff;">
          
          <div style="background:#1E293B;padding:16px;border-radius:16px;border:2px solid #38BDF8;width:100%;max-width:440px;text-align:center;">
            ${state.mode === 'partitura' && song ? `
              <div style="font-weight:900;color:#F59E0B;font-size:1.1rem;">${song.title}</div>
              <div style="font-size:0.9rem;color:#94A3B8;margin-top:4px;">${song.desc}</div>
              <div style="margin-top:8px;font-weight:800;color:#38BDF8;">Nota actual: ${NOTES[song.sequence[state.sequencePos]]?.note}</div>
            ` : (state.mode === 'oido' ? `
              <div style="font-weight:900;color:#EC4899;font-size:1.1rem;">👂 Escucha y adivina la nota</div>
              <button onclick="GameMusica.replayEar()" style="margin-top:8px;background:#EC4899;color:#fff;border:none;padding:8px 16px;border-radius:10px;font-weight:800;cursor:pointer;">🔊 Escuchar de nuevo</button>
            ` : `
              <div style="font-weight:900;color:#10B981;font-size:1.1rem;">🎹 Modo Piano Libre</div>
            `)}
          </div>

          <!-- Teclado del Piano -->
          <div style="display:flex;gap:6px;width:100%;max-width:440px;height:220px;background:#1E293B;padding:10px;border-radius:16px;box-sizing:border-box;box-shadow:0 8px 24px rgba(0,0,0,0.4);margin-bottom:10px;">
            ${NOTES.map((n, i) => `
              <div onclick="GameMusica.playNote(${i})" style="flex:1;background:${n.color};border-radius:0 0 12px 12px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:12px;cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,0.3);user-select:none;font-weight:900;font-size:1rem;color:#fff;">
                <span>${n.note}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      onBack: () => start()
    });
  }

  function replayEar() {
    playNote(state.targetNoteIdx);
  }

  function endGame() {
    CleoAnimations.confetti();
    CleoUI.showGameEnd({
      score: state.score, total: 5, correct: 5, wrong: 0, perfect: true,
      onReplay: () => start(), onHome: () => CleoRouter.navigate('home')
    });
  }

  return { start, selectMode, playNote, replayEar };
})();

// ── MOTOR INTERACTIVO TIPO DUOLINGO (IDIOMAS) ──
window.GameDuolingo = (function() {
  let state = {};

  function start(langKey, levelId) {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());
    const lang = CLEDUCA_DATA.idiomas[langKey] || CLEDUCA_DATA.idiomas.ingles;
    const lvl = lang.levels.find(l => l.id == levelId) || lang.levels[0];
    
    state = {
      langKey: langKey || 'ingles',
      levelId: levelId || 1,
      levelName: lvl.name,
      questions: lvl.quiz,
      current: 0,
      score: 0,
      selectedAnswer: null,
      wordSlots: [],
      wordBank: []
    };
    nextExercise();
  }

  function nextExercise() {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());
    if (state.current >= state.questions.length) return endGame();
    state.selectedAnswer = null;
    state.wordSlots = [];

    const q = state.questions[state.current];
    const isSentenceBuilder = q.q.includes("'") || q.q.includes("Traducción");

    if (isSentenceBuilder) {
      const targetAns = q.opts[q.ans];
      const words = targetAns.split(' ');
      const distractorWords = ['the', 'blue', 'is', 'a', 'la', 'un'];
      let bank = [...words, ...distractorWords.slice(0, 3)].sort(() => Math.random() - 0.5);
      state.wordBank = bank;
    }

    render();
  }

  function render() {
    const q = state.questions[state.current];
    const isSentenceBuilder = q.q.includes("'") || q.q.includes("Traducción");

    CleoUI.renderGameView({
      title: `🌎 ${state.levelName}`,
      progress: (state.current / state.questions.length) * 100,
      lives: CleoGame.getLives(),
      content: `
        <div style="display:flex;flex-direction:column;min-height:100%;padding:16px;gap:20px;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
            
            <div style="display:flex;align-items:center;gap:12px;background:var(--c-surface);padding:16px;border-radius:24px;border:2px solid var(--c-border);width:100%;max-width:360px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
              <div style="width:54px;height:54px;border-radius:50%;overflow:hidden;flex-shrink:0;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                <img src="img/cleo_logo.png" alt="Cleo" style="width:100%;height:100%;object-fit:cover;">
              </div>
              <div style="flex:1;text-align:left;">
                <div style="font-size:0.75rem;color:var(--c-primary);font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">Escribe / Selecciona:</div>
                <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.15rem;color:var(--c-text);margin-top:2px;">
                  ${q.q}
                </div>
              </div>
              <button onclick="CleoSpeech.say('${q.q}')" style="background:var(--c-bg-card);border:1px solid var(--c-border);width:40px;height:40px;border-radius:12px;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                🔊
              </button>
            </div>

            ${isSentenceBuilder ? `
              <div style="min-height:60px;width:100%;max-width:360px;background:var(--c-bg-card);border-bottom:3px solid var(--c-border);display:flex;flex-wrap:wrap;gap:8px;padding:10px;align-items:center;justify-content:center;">
                ${state.wordSlots.length === 0 ? `<span style="color:var(--c-text-muted);font-size:0.9rem;">Toca las palabras de abajo</span>` : ''}
                ${state.wordSlots.map((w, idx) => `
                  <button onclick="GameDuolingo.removeWord(${idx})" style="background:var(--c-primary);color:#fff;border:none;padding:8px 14px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1rem;box-shadow:0 4px 0 #3b82f6;cursor:pointer;">
                    ${w}
                  </button>
                `).join('')}
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:360px;margin-top:10px;">
                ${state.wordBank.map((w, idx) => `
                  <button onclick="GameDuolingo.pickWord(${idx})" style="background:var(--c-surface);color:var(--c-text);border:2px solid var(--c-border);padding:10px 16px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1rem;box-shadow:0 3px 0 var(--c-border);cursor:pointer;transition:all 0.1s;">
                    ${w}
                  </button>
                `).join('')}
              </div>
            ` : `
              <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:360px;margin-top:10px;">
                ${q.opts.map((opt, i) => `
                  <button class="btn btn-full ${state.selectedAnswer === i ? 'btn-primary' : 'btn-secondary'}"
                          style="font-size:1.1rem;padding:16px;display:flex;align-items:center;justify-content:space-between;border-width:2px;"
                          onclick="GameDuolingo.selectOption(${i})">
                    <span>${opt}</span>
                    <span style="font-size:1.2rem;opacity:0.7;">🔊</span>
                  </button>
                `).join('')}
              </div>
            `}

          </div>

          <div style="padding-top:16px;border-top:1px solid var(--c-border);width:100%;max-width:360px;margin:0 auto;">
            <button id="duo-check-btn" class="btn btn-primary btn-full btn-lg"
                    style="font-size:1.1rem;padding:16px;border-radius:16px;box-shadow:0 4px 0 #16a34a;background:#22c55e;"
                    onclick="GameDuolingo.checkAnswer()">
              COMPROBAR ▶
            </button>
          </div>
        </div>
      `,
      onBack: () => {
        document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());
        CleoRouter.navigate('idiomas');
      }
    });
  }

  function pickWord(idx) {
    const word = state.wordBank.splice(idx, 1)[0];
    state.wordSlots.push(word);
    CleoSpeech.say(word);
    render();
  }

  function removeWord(idx) {
    const word = state.wordSlots.splice(idx, 1)[0];
    state.wordBank.push(word);
    render();
  }

  function selectOption(idx) {
    state.selectedAnswer = idx;
    CleoSpeech.say(state.questions[state.current].opts[idx]);
    render();
  }

  function checkAnswer() {
    const q = state.questions[state.current];
    const isSentenceBuilder = q.q.includes("'") || q.q.includes("Traducción");
    let isCorrect = false;
    let expectedText = q.opts[q.ans];

    if (isSentenceBuilder) {
      const userText = state.wordSlots.join(' ').toLowerCase().trim();
      isCorrect = userText === expectedText.toLowerCase().trim();
    } else {
      isCorrect = state.selectedAnswer === q.ans;
    }

    showFeedbackSheet(isCorrect, expectedText);
  }

  function showFeedbackSheet(isCorrect, expectedText) {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());

    if (isCorrect) {
      CleoGame.addXP(15);
      state.score += 15;
      CleoSpeech.say('¡Excelente!');
    } else {
      CleoGame.loseLife();
      CleoSpeech.say('¡Respuesta incorrecta!');
    }

    const sheet = document.createElement('div');
    sheet.className = 'duolingo-sheet';
    sheet.style.cssText = `
      position:fixed;bottom:0;left:0;right:0;z-index:999999;
      background:${isCorrect ? '#dcfce7' : '#fee2e2'};
      border-top:4px solid ${isCorrect ? '#22c55e' : '#ef4444'};
      padding:24px 20px 32px;border-radius:24px 24px 0 0;
      box-shadow:0 -8px 30px rgba(0,0,0,0.25);
      animation:slideInUp 0.25s ease forwards;
      max-width:430px;margin:0 auto;
    `;

    sheet.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;text-align:left;">
        <div style="display:flex;align-items:center;gap:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.3rem;color:${isCorrect ? '#15803d' : '#b91c1c'};">
          <span>${isCorrect ? '🎉 ¡Excelente!' : '❌ Solución correcta:'}</span>
        </div>
        ${!isCorrect ? `<div style="font-weight:800;font-size:1.1rem;color:#b91c1c;">${expectedText}</div>` : ''}
        <button class="btn btn-full btn-lg" style="background:${isCorrect ? '#22c55e' : '#ef4444'};color:#fff;border:none;font-weight:900;font-size:1.1rem;padding:16px;border-radius:16px;box-shadow:0 4px 0 ${isCorrect ? '#15803d' : '#991b1b'};" onclick="GameDuolingo.nextStep(this)">
          ${isCorrect ? 'CONTINUAR ▶' : 'ENTENDIDO'}
        </button>
      </div>
    `;
    document.body.appendChild(sheet);
  }

  function nextStep(btnEl) {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());

    state.current++;
    if (state.current >= state.questions.length) {
      endGame();
    } else {
      nextExercise();
    }
  }

  function endGame() {
    document.querySelectorAll('.duolingo-sheet').forEach(s => s.remove());

    let profile = CleoAuth.getActive();
    if (!profile) {
      CleoAuth.createProfile({ name: 'Explorador', grade: 3 });
      profile = CleoAuth.getActive();
    }

    if (profile) {
      profile.gamesPlayed = profile.gamesPlayed || {};
      profile.gamesPlayed[`idiomas_${state.langKey}_${state.levelId}`] = true;
      CleoAuth.updateProfile(profile.id, {
        gamesPlayed: profile.gamesPlayed,
        xp: (profile.xp || 0) + state.score
      });
    }

    CleoAnimations.confetti();
    CleoSpeech.say('¡Felicidades! Completaste este nivel de idioma.');

    const nextLvlId = Number(state.levelId) + 1;

    CleoUI.showGameEnd({
      score: state.score, total: state.questions.length, correct: Math.floor(state.score/15), wrong: 0, perfect: true,
      onReplay: () => start(state.langKey, nextLvlId),
      onHome: () => CleoRouter.navigate('idiomas')
    });
  }

  return { start, pickWord, removeWord, selectOption, checkAnswer, nextStep };
})();
