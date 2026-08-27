// ── EXPANSIÓN DE JUEGOS: BLOQUE 2 ──
// Incluye: GameMagnetico, GameHacker, GameTowerDefense, GameAlquimia, GameCircuitos

// ── 4. IMANES EDUCATIVOS (GameMagnetico) ──
window.GameMagnetico = (function() {
    let state = {};
    
    function start(subject, grade) {
        CleoSpeech.say("¡Arrastra o toca la pieza magnética que encaja correctamente!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🧲 Imanes Educativos',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Identifica la opción que completa la oración o resuelve la pregunta.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0F172A;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;">
                    
                    <div style="background:#1E293B;padding:20px;border-radius:20px;border:2px solid #38BDF8;width:100%;max-width:440px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.3);">
                        <span style="color:#38BDF8;font-weight:900;font-size:0.85rem;display:block;margin-bottom:6px;">🧲 DESAFÍO MAGNÉTICO</span>
                        <h3 style="margin:0;font-size:1.2rem;color:#F8FAFC;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                    </div>
                    
                    <!-- Espacio Magnético objetivo -->
                    <div id="magnet-slot" style="width:100%;max-width:360px;height:100px;border:4px dashed #38BDF8;border-radius:22px;display:flex;align-items:center;justify-content:center;background:rgba(56,189,248,0.1);margin:20px 0;" ondragover="event.preventDefault()" ondrop="GameMagnetico.drop(event)">
                        <span style="color:#38BDF8;font-weight:800;font-size:1rem;font-family:'Plus Jakarta Sans',sans-serif;">⚡ Arrastra o Toca la pieza aquí</span>
                    </div>

                    <!-- Fichas magnéticas -->
                    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;width:100%;max-width:440px;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <div draggable="true" ondragstart="GameMagnetico.drag(event, '${opt.replace(/'/g,"\\'")}')" onclick="GameMagnetico.selectMagnet(${i})" style="background:linear-gradient(135deg, #EF4444, #B91C1C);color:#fff;padding:14px 24px;border-radius:16px;font-weight:900;font-size:1.15rem;box-shadow:0 6px 0 #7F1D1D, 0 8px 16px rgba(0,0,0,0.3);cursor:pointer;user-select:none;position:relative;border:2px solid #FCA5A5;font-family:'Plus Jakarta Sans',sans-serif;">
                                ${opt}
                                <div style="width:8px;height:8px;background:#fff;border-radius:50%;position:absolute;top:4px;right:4px;opacity:0.6;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function drag(ev, opt) { ev.dataTransfer.setData("text", opt); }

    function drop(ev) {
        ev.preventDefault();
        const opt = ev.dataTransfer.getData("text");
        const q = state.questions[state.currentQ];
        const idx = q.opts.indexOf(opt);
        selectMagnet(idx >= 0 ? idx : 0);
    }

    function selectMagnet(idx) {
        const q = state.questions[state.currentQ];
        if (idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Atracción magnética perfecta!");
            document.getElementById('magnet-slot').innerHTML = `<div style="background:#10B981;color:#fff;width:100%;height:100%;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.2rem;">✨ ${q.opts[q.ans]}</div>`;
            setTimeout(() => { state.currentQ++; render(); }, 1000);
        } else {
            CleoUI.toast("Esa pieza repela -1 ❤️", "🧲", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { /* continua jugando */ }
            );
        }
    }

    function endGame() {
        CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, drag, drop, selectMagnet };
})();

// ── 5. HACKEO LÓGICO (GameHacker) ──
window.GameHacker = (function() {
    let state = {};
    let timerInterval = null;

    function start(subject, grade) {
        CleoSpeech.say("¡Desencripta el código antes de que se agote el tiempo!");
        const questions = window.getProceduralQuestions(subject, grade, 8);
        state = { subject, grade, questions, currentQ: 0, score: 0, timeLeft: 15, isDone: false };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        state.timeLeft = 15;
        state.isDone = false;

        CleoUI.renderGameView({
            title: '💻 Hackeo Lógico',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Lee el enigma lógico y presiona el código de respuesta correcto antes de que el reloj llegue a 0.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#111827;color:#10B981;font-family:monospace;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;">
                    
                    <div style="width:100%;max-width:440px;display:flex;justify-content:space-between;align-items:center;background:#1F2937;padding:14px 18px;border-radius:14px;border:1px solid #374151;">
                        <div style="color:#EF4444;font-weight:900;font-size:1.4rem;">SYS.TIMER: <span id="hacker-timer">15</span>s</div>
                        <div style="font-size:0.95rem;color:#10B981;font-weight:bold;">LEVEL 0${state.currentQ+1}</div>
                    </div>
                    
                    <div style="background:#1F2937;padding:24px;border-radius:18px;border:2px solid #10B981;width:100%;max-width:440px;box-shadow:0 0 24px rgba(16,185,129,0.2);margin:16px 0;">
                        <div style="font-size:0.8rem;color:#6B7280;margin-bottom:8px;">> DECRYPTING SECURITY MODULE...</div>
                        <div style="font-size:1.2rem;line-height:1.5;color:#F9FAFB;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:440px;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <button id="hacker-opt-${i}" onclick="GameHacker.checkAnswer(${i})" style="background:#064E3B;color:#10B981;border:2px solid #10B981;padding:16px;border-radius:12px;font-family:monospace;font-size:1.05rem;font-weight:bold;cursor:pointer;transition:all 0.2s;">[ ${opt} ]</button>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => { clearInterval(timerInterval); CleoRouter.navigate('juegos'); }
        });

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            state.timeLeft--;
            const tEl = document.getElementById('hacker-timer');
            if(tEl) tEl.innerText = state.timeLeft;
            
            if(state.timeLeft <= 0) {
                clearInterval(timerInterval);
                if(state.isDone) return;
                state.isDone = true;
                disableButtons();
                CleoUI.toast("¡Tiempo agotado! -1 ❤️", "⏰", "error");
                window.handleWrongAnswerBase(
                    () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                    () => { state.currentQ++; setTimeout(render, 1000); }
                );
            }
        }, 1000);
    }

    function disableButtons() {
        for(let i=0; i<4; i++) {
            const b = document.getElementById(`hacker-opt-${i}`);
            if(b) { b.disabled = true; b.style.opacity = '0.4'; b.style.cursor = 'not-allowed'; }
        }
    }

    function checkAnswer(idx) {
        if(state.isDone || state.timeLeft <= 0) return;
        state.isDone = true;
        clearInterval(timerInterval);
        disableButtons();

        const q = state.questions[state.currentQ];
        if(idx === q.ans) {
            CleoGame.addXP(25); state.score += 25; CleoSpeech.say("¡Acceso concedido!");
            CleoUI.toast("¡Acceso concedido! XP +25", "🔓", "success");
            state.currentQ++; setTimeout(render, 1000);
        } else {
            CleoSpeech.say("Error de seguridad.");
            CleoUI.toast("Fallo de encriptación -1 ❤️", "🔒", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 1000); }
            );
        }
    }

    function endGame() {
        clearInterval(timerInterval); CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/25, wrong: state.questions.length - (state.score/25), perfect: (state.score/25 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, checkAnswer };
})();

// ── 6. DEFENSA DE LA BASE (GameTowerDefense) ──
window.GameTowerDefense = (function() {
    let state = {};
    let enemyInterval = null;

    function start(subject, grade) {
        CleoSpeech.say("¡Defiende la fortaleza activando el escudo correcto!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🛡️ Defensa de la Base',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Selecciona el escudo con la respuesta adecuada antes de que el invasor alcance la base.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#2E1065;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;position:relative;overflow:hidden;">
                    
                    <!-- Pregunta Arriba -->
                    <div style="background:rgba(255,255,255,0.95);padding:16px 20px;border-radius:18px;text-align:center;width:100%;max-width:440px;box-shadow:0 8px 20px rgba(0,0,0,0.3);z-index:10;">
                        <span style="color:#8B5CF6;font-weight:900;font-size:0.8rem;display:block;margin-bottom:4px;text-transform:uppercase;">🛡️ DEFENSA DE FORTALEZA</span>
                        <h3 style="margin:0;font-size:1.15rem;color:#1E293B;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                    </div>

                    <!-- Zona central de invasión -->
                    <div style="position:relative;flex:1;height:100%;width:100%;max-width:380px;display:flex;justify-content:center;align-items:flex-end;margin:16px 0;">
                        <!-- Invasor -->
                        <div id="td-enemy" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);width:75px;height:75px;background:#EF4444;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;box-shadow:0 0 24px rgba(239,68,68,0.8);transition:top 6.5s linear;z-index:5;">👾</div>

                        <!-- Fortaleza Protegida (Emoji de castillo) -->
                        <div style="font-size:5rem;z-index:4;filter:drop-shadow(0 10px 20px rgba(0,0,0,0.5));">🏰</div>
                    </div>

                    <!-- Botones de Escudo abajo -->
                    <div style="width:100%;max-width:440px;display:grid;grid-template-columns:1fr 1fr;gap:12px;z-index:10;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <button onclick="GameTowerDefense.deployShield(${i})" style="background:#4C1D95;color:#FFF;border:2px solid #8B5CF6;padding:16px 10px;border-radius:16px;font-weight:900;font-size:1rem;box-shadow:0 4px 0 #5B21B6;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;">🛡️ ${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => { clearTimeout(enemyInterval); CleoRouter.navigate('juegos'); }
        });

        setTimeout(() => {
            const enemy = document.getElementById('td-enemy');
            if(enemy) enemy.style.top = 'calc(100% - 150px)';
        }, 100);

        enemyInterval = setTimeout(() => {
            CleoUI.toast("¡Impacto a la fortaleza! -1 ❤️", "💥", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 600); }
            );
        }, 6600);
    }

    function deployShield(idx) {
        clearTimeout(enemyInterval);
        const q = state.questions[state.currentQ];
        const enemy = document.getElementById('td-enemy');
        
        if(idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Ataque repelido!");
            if(enemy) { enemy.innerText = '🛡️'; enemy.style.background = '#10B981'; }
            state.currentQ++; setTimeout(render, 800);
        } else {
            CleoUI.toast("Escudo incorrecto -1 ❤️", "⚠️", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 800); }
            );
        }
    }

    function endGame() {
        clearTimeout(enemyInterval); CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, deployShield };
})();

// ── 7. LABORATORIO QUÍMICO (GameAlquimia) ──
window.GameAlquimia = (function() {
    let state = {};
    
    function start(subject, grade) {
        CleoSpeech.say("¡Vierte el elemento correcto en el matraz!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🧪 Laboratorio Químico',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Mezcla el reactivo adecuado para crear la poción perfecta.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0F172A;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;">
                    
                    <div style="background:#1E293B;padding:18px 20px;border-radius:18px;text-align:center;width:100%;max-width:440px;border:2px solid #38BDF8;box-shadow:0 8px 20px rgba(0,0,0,0.3);">
                        <span style="color:#38BDF8;font-weight:900;font-size:0.8rem;display:block;margin-bottom:4px;text-transform:uppercase;">🧪 FÓRMULA QUÍMICA</span>
                        <h3 style="margin:0;font-size:1.15rem;color:#F8FAFC;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                    </div>

                    <!-- Matraz Químico dibujado en CSS -->
                    <div style="width:140px;height:180px;background:rgba(255,255,255,0.05);border:5px solid #94A3B8;border-top:none;border-radius:0 0 70px 70px;position:relative;display:flex;align-items:flex-end;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);margin:20px 0;" ondragover="event.preventDefault()" ondrop="GameAlquimia.drop(event)">
                        <div id="flask-liquid" style="width:100%;height:35%;background:#10B981;transition:all 0.6s ease;box-shadow:inset 0 10px 20px rgba(0,0,0,0.3);"></div>
                    </div>

                    <!-- Reactivos / Opciones -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:440px;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <button onclick="GameAlquimia.selectFlask(${i})" style="background:radial-gradient(circle, #38BDF8, #0284C7);color:#FFF;border:2px solid #BAE6FD;padding:16px 10px;border-radius:16px;font-weight:900;font-size:1.05rem;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;">🧪 ${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function drop(ev) {
        ev.preventDefault();
        selectFlask(0);
    }

    function selectFlask(idx) {
        const q = state.questions[state.currentQ];
        const liquid = document.getElementById('flask-liquid');
        
        if(idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Reacción perfecta!");
            if(liquid) { liquid.style.height = '85%'; liquid.style.background = '#F59E0B'; }
            state.currentQ++; setTimeout(render, 1200);
        } else {
            CleoUI.toast("¡La mezcla explotó! -1 ❤️", "💥", "error");
            if(liquid) { liquid.style.height = '100%'; liquid.style.background = '#EF4444'; }
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 1200); }
            );
        }
    }

    function endGame() {
        CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, drop, selectFlask };
})();

// ── 8. CONSTRUCTOR DE CIRCUITOS (GameCircuitos) ──
window.GameCircuitos = (function() {
    let state = {};
    
    function start(subject, grade) {
        CleoSpeech.say("¡Conecta el cable correcto para encender la luz!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🔌 Constructor de Circuitos',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Cierra el circuito eléctrico seleccionando la respuesta correcta.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#1E293B;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;color:#fff;">
                    
                    <!-- Bombillo centrado que se enciende -->
                    <div style="font-size:4rem;margin-top:10px;text-shadow:0 0 10px rgba(255,255,255,0.2);transition:all 0.5s;" id="circ-bulb">💡</div>

                    <div style="background:#0F172A;padding:18px 20px;border-radius:18px;width:100%;max-width:440px;text-align:center;border:2px solid #F59E0B;box-shadow:0 8px 20px rgba(0,0,0,0.4);">
                        <span style="color:#F59E0B;font-weight:900;font-size:0.8rem;display:block;margin-bottom:4px;text-transform:uppercase;">⚡ ENERGÍA DE CIRCUITO</span>
                        <h3 style="margin:0;font-size:1.15rem;color:#F8FAFC;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                    </div>

                    <!-- Cables de Opciones -->
                    <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:440px;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <div onclick="GameCircuitos.selectWire(${i})" style="display:flex;align-items:center;background:#0F172A;padding:16px;border-radius:16px;border:2px solid #475569;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                                <div style="width:24px;height:24px;border-radius:50%;background:#475569;margin-right:14px;border:2px solid #64748B;" id="circ-node-${i}"></div>
                                <div style="flex:1;font-weight:900;font-size:1.05rem;color:#E2E8F0;font-family:'Plus Jakarta Sans',sans-serif;">${opt}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function selectWire(idx) {
        const q = state.questions[state.currentQ];
        const node = document.getElementById(`circ-node-${idx}`);
        const bulb = document.getElementById('circ-bulb');
        
        if(idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoSpeech.say("¡Circuito encendido!");
            if(node) node.style.background = '#F59E0B';
            if(bulb) { bulb.style.textShadow = '0 0 40px #F59E0B, 0 0 80px #F59E0B'; bulb.style.transform = 'scale(1.2)'; }
            state.currentQ++; setTimeout(render, 1200);
        } else {
            CleoUI.toast("¡Cortocircuito! -1 ❤️", "⚡", "error");
            if(node) node.style.background = '#EF4444';
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 1000); }
            );
        }
    }

    return { start, selectWire };
})();

// ── 9. PROGRAMACIÓN Y ALGORITMOS (GameProgramacion) ──
window.GameProgramacion = (function() {
    let state = {};

    function start(subject, grade) {
        CleoSpeech.say("¡Toca las flechas para indicarle a Cleo cómo llegar a la estrella!");
        state = { subject, grade, currentLevel: 1, score: 0, code: [], isRunning: false };
        CleoGame.updateStreak();
        renderLevel();
    }

    function renderLevel() {
        const levels = [
            { start: { x: 0, y: 0 }, goal: { x: 3, y: 0 }, desc: "Lleva a Cleo 3 pasos a la Derecha ➡️" },
            { start: { x: 0, y: 0 }, goal: { x: 0, y: 3 }, desc: "Lleva a Cleo 3 pasos Abajo ⬇️" },
            { start: { x: 0, y: 0 }, goal: { x: 2, y: 2 }, desc: "Mueve a Cleo 2 pasos Derecha ➡️ y 2 pasos Abajo ⬇️" },
            { start: { x: 3, y: 0 }, goal: { x: 0, y: 3 }, desc: "Combina Abajo ⬇️ e Izquierda ⬅️ hasta la estrella ⭐" },
            { start: { x: 1, y: 3 }, goal: { x: 3, y: 0 }, desc: "¡Nivel Experto! Programa el camino completo 🚀" }
        ];

        const lvlData = levels[(state.currentLevel - 1) % levels.length];
        state.startPos = lvlData.start;
        state.goalPos = lvlData.goal;
        state.code = [];

        CleoUI.renderGameView({
            title: '👨‍💻 Programación con Cleo',
            progress: (state.currentLevel / 5) * 100,
            lives: CleoGame.getLives(),
            tip: "Toca las flechas para armar la secuencia de pasos y presiona ▶ EJECUTAR CÓDIGO.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0F172A;padding:16px;box-sizing:border-box;align-items:center;justify-content:space-between;color:#fff;">
                    
                    <div style="background:#1E293B;padding:12px;border-radius:16px;width:100%;max-width:440px;text-align:center;border:2px solid #6366F1;box-shadow:0 4px 16px rgba(99,102,241,0.2);">
                        <span style="color:#6366F1;font-weight:800;font-size:0.8rem;text-transform:uppercase;">NIVEL ${state.currentLevel} DE 5</span>
                        <div style="font-size:0.88rem;color:#F8FAFC;font-weight:700;margin-top:2px;">${lvlData.desc}</div>
                    </div>

                    <!-- Tablero Cuadrícula 4x4 -->
                    <div id="prog-grid" style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;width:100%;max-width:290px;height:290px;background:#020617;padding:12px;border-radius:22px;border:3px solid #334155;box-shadow:0 12px 32px rgba(0,0,0,0.5);box-sizing:border-box;">
                        ${Array.from({length: 16}).map((_, idx) => {
                            const x = idx % 4;
                            const y = Math.floor(idx / 4);
                            const isGoal = x === lvlData.goal.x && y === lvlData.goal.y;
                            const isStart = x === lvlData.start.x && y === lvlData.start.y;
                            return `
                                <div id="cell-${x}-${y}" style="background:${isGoal ? 'rgba(234,179,8,0.15)' : '#1E293B'};border:1px solid ${isGoal ? '#EAB308' : 'rgba(255,255,255,0.08)'};border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;position:relative;transition:all 0.2s ease;">
                                    ${isGoal ? '⭐' : ''}
                                    ${isStart ? '<span id="prog-cleo" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));">🐶</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Secuencia de Bloques de Código -->
                    <div style="width:100%;max-width:440px;">
                        <div style="font-size:0.78rem;font-weight:800;color:#94A3B8;margin-bottom:6px;display:flex;justify-content:space-between;">
                            <span>SECUENCIA DE PASOS:</span>
                            <span style="color:#6366F1;" id="code-count">0 pasos</span>
                        </div>
                        <div id="code-sequence" style="display:flex;gap:6px;min-height:52px;background:rgba(255,255,255,0.04);padding:8px;border-radius:14px;overflow-x:auto;align-items:center;border:1.5px dashed rgba(255,255,255,0.2);">
                            <span style="font-size:0.8rem;color:#64748B;">Toca las flechas abajo para armar la ruta...</span>
                        </div>
                    </div>

                    <!-- Paleta de Botones Direccionales -->
                    <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;width:100%;max-width:440px;">
                        <button class="btn" onclick="GameProgramacion.addCommand('RIGHT')" style="background:#6366F1;color:#fff;font-weight:800;border-radius:12px;padding:12px 6px;font-size:0.85rem;">➡️ Der</button>
                        <button class="btn" onclick="GameProgramacion.addCommand('DOWN')" style="background:#38BDF8;color:#0F172A;font-weight:800;border-radius:12px;padding:12px 6px;font-size:0.85rem;">⬇️ Abajo</button>
                        <button class="btn" onclick="GameProgramacion.addCommand('LEFT')" style="background:#8B5CF6;color:#fff;font-weight:800;border-radius:12px;padding:12px 6px;font-size:0.85rem;">⬅️ Izq</button>
                        <button class="btn" onclick="GameProgramacion.addCommand('UP')" style="background:#EC4899;color:#fff;font-weight:800;border-radius:12px;padding:12px 6px;font-size:0.85rem;">⬆️ Arriba</button>
                    </div>

                    <!-- Botones de Acción (Ejecutar y Borrar) -->
                    <div style="display:flex;gap:10px;width:100%;max-width:440px;">
                        <button class="btn" onclick="GameProgramacion.clearCode()" style="background:#EF4444;color:#fff;font-weight:800;border-radius:14px;padding:14px;flex:1;">🗑️ Borrar</button>
                        <button class="btn" onclick="GameProgramacion.runCode()" style="background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff;font-weight:900;border-radius:14px;padding:14px;flex:2;font-size:1.05rem;box-shadow:0 4px 16px rgba(34,197,94,0.3);">
                            ▶ EJECUTAR CÓDIGO
                        </button>
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function addCommand(cmd) {
        if (state.isRunning) return;
        if (state.code.length >= 10) {
            CleoUI.toast("¡Máximo 10 pasos por ruta!", "⚠️", "info");
            return;
        }
        state.code.push(cmd);
        updateCodeView();
    }

    function clearCode() {
        if (state.isRunning) return;
        state.code = [];
        updateCodeView();
        resetCleoPos();
    }

    function resetCleoPos() {
        document.querySelectorAll('[id^="cell-"]').forEach(c => {
            const isGoal = c.id === `cell-${state.goalPos.x}-${state.goalPos.y}`;
            c.innerHTML = isGoal ? '⭐' : '';
        });
        const startCell = document.getElementById(`cell-${state.startPos.x}-${state.startPos.y}`);
        if (startCell) startCell.innerHTML = `<span id="prog-cleo">🐶</span>`;
    }

    function updateCodeView() {
        const seq = document.getElementById('code-sequence');
        const countEl = document.getElementById('code-count');
        if (countEl) countEl.textContent = `${state.code.length} pasos`;
        if (!seq) return;
        
        if (state.code.length === 0) {
            seq.innerHTML = `<span style="font-size:0.8rem;color:#64748B;">Toca las flechas abajo para armar la ruta...</span>`;
            return;
        }
        const labels = { RIGHT:'➡️ Derecha', DOWN:'⬇️ Abajo', LEFT:'⬅️ Izquierda', UP:'⬆️ Arriba' };
        const colors = { RIGHT:'#6366F1', DOWN:'#38BDF8', LEFT:'#8B5CF6', UP:'#EC4899' };

        seq.innerHTML = state.code.map((c, i) => `
            <div id="code-step-${i}" style="background:${colors[c]};color:#fff;padding:6px 12px;border-radius:10px;font-size:0.8rem;font-weight:800;display:flex;align-items:center;gap:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
                ${labels[c]}
            </div>
        `).join('');
    }

    function runCode() {
        if (state.isRunning) return;
        if (state.code.length === 0) {
            CleoUI.toast("¡Agrega al menos una flecha antes de ejecutar!", "💡", "info");
            return;
        }

        state.isRunning = true;
        let step = 0;
        let posX = state.startPos.x;
        let posY = state.startPos.y;
        resetCleoPos();

        const interval = setInterval(() => {
            if (step >= state.code.length) {
                clearInterval(interval);
                state.isRunning = false;

                if (posX === state.goalPos.x && posY === state.goalPos.y) {
                    CleoGame.addXP(30);
                    state.score += 30;
                    CleoAnimations.confetti();
                    CleoSpeech.say("¡CÓDIGO PERFECTO! 🚀 ¡Cleo llegó a la estrella!");
                    CleoUI.toast("¡Camino correcto! +30 XP", "🎉", "success");
                    setTimeout(() => {
                        state.currentLevel++;
                        if (state.currentLevel > 5) endGame();
                        else renderLevel();
                    }, 1200);
                } else {
                    CleoUI.toast("Cleo no llegó a la estrella ⭐. ¡Prueba agregando más pasos!", "🐶", "info");
                }
                return;
            }

            const cmd = state.code[step];

            // Resaltar bloque actual en la secuencia
            document.querySelectorAll('[id^="code-step-"]').forEach(el => el.style.border = 'none');
            const stepEl = document.getElementById(`code-step-${step}`);
            if (stepEl) stepEl.style.border = '3px solid #10B981';

            if (cmd === 'RIGHT' && posX < 3) posX++;
            else if (cmd === 'LEFT' && posX > 0) posX--;
            else if (cmd === 'DOWN' && posY < 3) posY++;
            else if (cmd === 'UP' && posY > 0) posY--;

            CleoAudio.playPop();

            // Mover a Cleo visualmente en el tablero
            document.querySelectorAll('[id^="cell-"]').forEach(c => {
                const isGoal = c.id === `cell-${state.goalPos.x}-${state.goalPos.y}`;
                c.innerHTML = isGoal ? '⭐' : '';
            });
            const cell = document.getElementById(`cell-${posX}-${posY}`);
            if (cell) {
                const isGoal = posX === state.goalPos.x && posY === state.goalPos.y;
                cell.innerHTML = isGoal ? '⭐🐶' : '<span id="prog-cleo" style="animation:bounceIn 0.3s ease;">🐶</span>';
            }

            step++;
        }, 400);
    }

    function endGame() {
        CleoAnimations.confetti();
        CleoUI.showGameEnd({
            score: state.score, total: 5, correct: 5, wrong: 0, perfect: true,
            onReplay: () => start(state.subject, state.grade),
            onHome: () => CleoRouter.navigate('home')
        });
    }

    return { start, addCommand, clearCode, runCode };
})();

// ── 10. RECREAR DIBUJO ESTILO GARTIC (GameArteRecrear) ──
window.GameArteRecrear = (function() {
    let state = {};

    function start() {
        CleoSpeech.say("¡Mira la muestra e iguala tu lienzo pintando las casillas!");
        state = { currentPattern: 0, score: 0, userGrid: Array(16).fill('#1E293B'), activeColor: '#EF4444' };
        render();
    }

    const patterns = [
        { name:'Corazón Píxel', target: ['#1E293B','#EF4444','#EF4444','#1E293B','#EF4444','#EF4444','#EF4444','#EF4444','#EF4444','#EF4444','#EF4444','#EF4444','#1E293B','#EF4444','#EF4444','#1E293B'] },
        { name:'Estrella Dorada', target: ['#1E293B','#F59E0B','#F59E0B','#1E293B','#F59E0B','#F59E0B','#F59E0B','#F59E0B','#F59E0B','#F59E0B','#F59E0B','#F59E0B','#1E293B','#F59E0B','#F59E0B','#1E293B'] }
    ];

    function render() {
        const pat = patterns[state.currentPattern] || patterns[0];

        CleoUI.renderGameView({
            title: '🎨 Recrear Dibujo (Gartic)',
            progress: ((state.currentPattern + 1) / patterns.length) * 100,
            lives: CleoGame.getLives(),
            tip: "Selecciona un color e iguala la cuadrícula derecha con el patrón de la izquierda.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0F172A;padding:16px;box-sizing:border-box;align-items:center;justify-content:space-between;color:#fff;">
                    
                    <div style="text-align:center;">
                        <span style="color:#EC4899;font-weight:800;font-size:0.8rem;text-transform:uppercase;">RETO DE ARTE: ${pat.name}</span>
                    </div>

                    <div style="display:flex;gap:16px;align-items:center;justify-content:center;width:100%;max-width:400px;">
                        <div>
                            <div style="font-size:0.75rem;color:#94A3B8;margin-bottom:4px;text-align:center;">MUESTRA:</div>
                            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:120px;height:120px;background:#020617;padding:6px;border-radius:12px;border:2px solid #334155;">
                                ${pat.target.map(c=>`<div style="background:${c};border-radius:4px;"></div>`).join('')}
                            </div>
                        </div>

                        <div style="font-size:1.5rem;color:#EC4899;">➔</div>

                        <div>
                            <div style="font-size:0.75rem;color:#94A3B8;margin-bottom:4px;text-align:center;">TU LIENZO:</div>
                            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:120px;height:120px;background:#020617;padding:6px;border-radius:12px;border:2px solid #EC4899;">
                                ${state.userGrid.map((c, i)=>`
                                    <div onclick="GameArteRecrear.paintCell(${i})" style="background:${c};border-radius:4px;cursor:pointer;"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="display:flex;gap:10px;justify-content:center;">
                        ${['#EF4444','#F59E0B','#10B981','#38BDF8','#8B5CF6','#1E293B'].map(col => `
                            <div onclick="GameArteRecrear.setColor('${col}')" style="width:36px;height:36px;border-radius:50%;background:${col};cursor:pointer;border:${state.activeColor===col?'3px solid #fff':'2px solid rgba(255,255,255,0.2)'};box-shadow:0 4px 10px rgba(0,0,0,0.3);"></div>
                        `).join('')}
                    </div>

                    <button class="btn btn-primary btn-full" onclick="GameArteRecrear.checkResult()" style="max-width:400px;padding:14px;background:linear-gradient(135deg,#EC4899,#D946EF);">
                        🎨 VERIFICAR MI DIBUJO
                    </button>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function setColor(color) { state.activeColor = color; render(); }
    function paintCell(idx) { state.userGrid[idx] = state.activeColor; render(); }

    function checkResult() {
        const pat = patterns[state.currentPattern];
        const isMatch = state.userGrid.every((col, i) => col === pat.target[i]);

        if (isMatch) {
            CleoGame.addXP(25); state.score += 25; CleoAnimations.confetti(); CleoSpeech.say("¡Obra de arte perfecta!");
            CleoUI.toast("¡Igualaste la muestra exactamente! +25 XP", "🎨", "success");
            state.currentPattern++;
            if (state.currentPattern >= patterns.length) {
                setTimeout(() => CleoUI.showGameEnd({ score: state.score, total: patterns.length, correct: patterns.length, wrong: 0, perfect: true, onReplay: start, onHome: () => CleoRouter.navigate('home') }), 1000);
            } else {
                state.userGrid = Array(16).fill('#1E293B');
                setTimeout(render, 1000);
            }
        } else {
            CleoUI.toast("Casi lo logras. Revisa algunos cuadros y vuelve a verificar.", "🎨", "info");
        }
    }

    return { start, setColor, paintCell, checkResult };
})();

// ── 11. PESCA CAPIBARA EDUCATIONAL (GameCapibaraPesca) ──
window.GameCapibaraPesca = (function() {
    let state = {};

    function start(subject, grade) {
        CleoSpeech.say("¡Ayuda a la Capibara a pescar los peces con la respuesta correcta!");
        const questions = window.getProceduralQuestions(subject, grade, 5);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if (!q) return endGame();

        CleoUI.renderGameView({
            title: '🐟 Pesca Capibara Educativa',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: "Toca el pez que lleve la respuesta correcta para alimentar a la Capibara.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0284C7;padding:16px;box-sizing:border-box;align-items:center;justify-content:space-between;color:#fff;">
                    
                    <div style="text-align:center;">
                        <div style="font-size:3.5rem;animation:float 3s ease-in-out infinite;">🦦🎣</div>
                        <div style="background:#0F172A;padding:12px 18px;border-radius:16px;border:2px solid #38BDF8;max-width:400px;margin-top:6px;">
                            <span style="color:#38BDF8;font-weight:800;font-size:0.75rem;display:block;">RETO DE PESCA</span>
                            <h3 style="margin:4px 0 0;font-size:1.1rem;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:400px;">
                        ${q.opts.map((opt, i) => `
                            <div onclick="GameCapibaraPesca.catchFish(${i})" style="background:linear-gradient(135deg,#38BDF8,#0284C7);padding:14px 20px;border-radius:20px;border:2px solid #E0F2FE;cursor:pointer;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 16px rgba(0,0,0,0.2);">
                                <span style="font-weight:800;font-size:1rem;color:#fff;">🐟 ${opt}</span>
                                <span style="font-size:1.2rem;">🌊</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function catchFish(idx) {
        const q = state.questions[state.currentQ];
        if (idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Pez atrapado! ¡Capibara feliz!");
            CleoUI.toast("¡Atrapaste el pez correcto! +20 XP", "🐟", "success");
            state.currentQ++; setTimeout(render, 1000);
        } else {
            CleoUI.toast("Ese pez no era la respuesta. -1 ❤️", "🌊", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 1000); }
            );
        }
    }

    function endGame() {
        CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, catchFish };
})();

// ── 12. TEATRO Y ACTUACIÓN (GameTeatro) ──
window.GameTeatro = (function() {
    let state = {};

    function start(subject, grade) {
        CleoSpeech.say("¡Bienvenido al escenario teatral de Cleduca!");
        const questions = [
            { q: "¿Cómo expresarías sorpresa en una actuación?", opts: ["😱 Ojos abiertos y boca entreabierta", "😴 Ojos cerrados", "😠 Ceño fruncido", "🫲 Cruzar los brazos"], ans: 0 },
            { q: "¿Cuál es el rol de un director de teatro?", opts: ["Construir sillas", "Guiar a los actores e interpretar la obra", "Vender boletas", "Limpiar el escenario"], ans: 1 },
            { q: "Si actúas en un diálogo triste, ¿cómo debe ser el tono de voz?", opts: ["Gritando muy fuerte", "Suave, pausado y expresivo", "Rápido como un carro", "Sin hablar"], ans: 1 }
        ];
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if (!q) return endGame();

        CleoUI.renderGameView({
            title: '🎭 Taller de Teatro y Actuación',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: "Elige la mejor respuesta sobre expresión artística y actuación dramática.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#4C0519;padding:16px;box-sizing:border-box;align-items:center;justify-content:space-between;color:#fff;">
                    
                    <div style="text-align:center;">
                        <div style="font-size:3.5rem;">🎭🎬</div>
                        <div style="background:#881337;padding:14px 20px;border-radius:18px;border:2px solid #FB7185;max-width:400px;margin-top:8px;">
                            <span style="color:#FB7185;font-weight:800;font-size:0.75rem;display:block;">RETO TEATRAL</span>
                            <h3 style="margin:4px 0 0;font-size:1.1rem;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:400px;">
                        ${q.opts.map((opt, i) => `
                            <button class="btn btn-secondary btn-full" onclick="GameTeatro.act(${i})" style="text-align:left;padding:14px 18px;font-size:0.95rem;background:#881337;border:1px solid #FB7185;color:#fff;">
                                🎭 ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => CleoRouter.navigate('juegos')
        });
    }

    function act(idx) {
        const q = state.questions[state.currentQ];
        if (idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Excelente actuación en escena!");
            CleoUI.toast("¡Respuesta dramática perfecta! +20 XP", "🎭", "success");
            state.currentQ++; setTimeout(render, 1000);
        } else {
            CleoUI.toast("¡Sigue practicando la expresión corporal! -1 ❤️", "🎬", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 1000); }
            );
        }
    }

    function endGame() {
        CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, act };
})();
