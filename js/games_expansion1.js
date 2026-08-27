// ── EXPANSIÓN DE JUEGOS: BLOQUE 1 ──
// Incluye: Generador Procedural por Grado, GameCinta, GameBurbujas, GameRunner

window.getProceduralQuestions = function(subject, grade, count = 10) {
    const g = parseInt(grade) || 3;
    const questions = [];

    for (let i = 0; i < count; i++) {
        if (subject === 'matematicas') {
            if (g <= 2) {
                const isAdd = Math.random() > 0.5;
                if (isAdd) {
                    const a = Math.floor(Math.random() * 10) + 1;
                    const b = Math.floor(Math.random() * 9) + 1;
                    const ans = a + b;
                    const opts = shuffleArray([ans, ans + 1, Math.max(1, ans - 2), ans + 3]);
                    questions.push({ q: `¿Cuánto es ${a} + ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: "Suma contando hacia adelante desde el número más grande." });
                } else {
                    const a = Math.floor(Math.random() * 10) + 5;
                    const b = Math.floor(Math.random() * a) + 1;
                    const ans = a - b;
                    const opts = shuffleArray([ans, ans + 2, Math.max(0, ans - 1), ans + 3]);
                    questions.push({ q: `¿Cuánto es ${a} - ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: "A le quitas B. Cuenta cuántos te quedan." });
                }
            } else if (g === 3) {
                const type = Math.floor(Math.random() * 2);
                if (type === 0) {
                    const a = Math.floor(Math.random() * 8) + 2;
                    const b = Math.floor(Math.random() * 8) + 2;
                    const ans = a * b;
                    const opts = shuffleArray([ans, ans + a, ans - 2, ans + 4]);
                    questions.push({ q: `¿Cuánto es ${a} × ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: `Multiplicar ${a} × ${b} es sumar ${a} veces el número ${b}.` });
                } else {
                    const a = Math.floor(Math.random() * 40) + 10;
                    const b = Math.floor(Math.random() * 20) + 5;
                    const ans = a - b;
                    const opts = shuffleArray([ans, ans + 4, ans - 3, ans + 2]);
                    questions.push({ q: `¿Cuánto es ${a} - ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: "Resta las unidades primero y luego las decenas." });
                }
            } else {
                const isDiv = Math.random() > 0.5;
                if (isDiv) {
                    const b = Math.floor(Math.random() * 8) + 2;
                    const ans = Math.floor(Math.random() * 9) + 2;
                    const a = b * ans;
                    const opts = shuffleArray([ans, ans + 1, Math.max(1, ans - 2), ans + 3]);
                    questions.push({ q: `¿Cuánto es ${a} ÷ ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: `Busca qué número multiplicado por ${b} te da ${a}.` });
                } else {
                    const a = Math.floor(Math.random() * 12) + 3;
                    const b = Math.floor(Math.random() * 9) + 3;
                    const ans = a * b;
                    const opts = shuffleArray([ans, ans + 3, ans - 4, ans + 10]);
                    questions.push({ q: `¿Cuánto es ${a} × ${b}?`, opts: opts.map(String), ans: opts.indexOf(ans), tip: "Recuerda las tablas de multiplicar." });
                }
            }
        } else if (subject === 'lenguaje') {
            if (g <= 2) {
                const item = LANG_G1[i % LANG_G1.length];
                questions.push({ q: item.q, opts: item.opts, ans: item.ans, tip: item.tip });
            } else {
                const item = LANG_G3[i % LANG_G3.length];
                questions.push({ q: item.q, opts: item.opts, ans: item.ans, tip: item.tip });
            }
        } else if (subject === 'ciencias') {
            const item = CIENCIAS_DATA[i % CIENCIAS_DATA.length];
            questions.push({ q: item.q, opts: item.opts, ans: item.ans, tip: item.tip });
        } else if (subject === 'sociales') {
            const SOCIALES_DATA = [
                { q: "¿Cuál es la capital de Colombia?", opts: ["Bogotá", "Medellín", "Cali", "Cartagena"], ans: 0, tip: "Bogotá D.C. está ubicada en la sabana andina." },
                { q: "¿Cuáles son los colores de la bandera de Colombia?", opts: ["Amarillo, Azul y Rojo", "Verde, Blanco y Rojo", "Azul, Blanco y Rojo", "Amarillo y Negro"], ans: 0, tip: "El amarillo ocupa la mitad superior." },
                { q: "¿En qué continente está ubicada Colombia?", opts: ["América del Sur", "Europa", "Asia", "África"], ans: 0, tip: "Colombia está al noroeste de Sudamérica." },
                { q: "¿Cuál es el río más largo que pasa por Colombia?", opts: ["Río Magdalena", "Río Amazonas", "Río Cauca", "Río Atrato"], ans: 0, tip: "El Magdalena recorre el país de sur a norte." }
            ];
            const item = SOCIALES_DATA[i % SOCIALES_DATA.length];
            questions.push({ q: item.q, opts: item.opts, ans: item.ans, tip: item.tip });
        } else if (subject === 'programacion') {
            const PROG_DATA = [
                { q: "¿Qué es un ALGORITMO?", opts: ["Paso a paso de instrucciones", "Un juego de fútbol", "Un tipo de animal", "Una pintura"], ans: 0, tip: "Un algoritmo es una secuencia de instrucciones para resolver un problema." },
                { q: "Si quieres repetir una instrucción 5 veces, usas un:", opts: ["Bucle / Repetir", "Botón de apagar", "Semáforo", "Tijeras"], ans: 0, tip: "Los bucles evitan repetir código manualmente." },
                { q: "¿Qué hace la instrucción 'Avanzar'?", opts: ["Mueve al personaje un paso adelante", "Gira a la izquierda", "Salta hacia atrás", "Borra la pantalla"], ans: 0, tip: "Avanzar mueve la posición en la dirección actual." }
            ];
            const item = PROG_DATA[i % PROG_DATA.length];
            questions.push({ q: item.q, opts: item.opts, ans: item.ans, tip: item.tip });
        } else {
            const a = (i + 1) * 2;
            const b = a + 2;
            const ans = b + 2;
            const opts = shuffleArray([ans, ans + 1, ans - 1, ans + 4]);
            questions.push({ q: `¿Qué número sigue? ${a}, ${b}, ...`, opts: opts.map(String), ans: opts.indexOf(ans), tip: "Fíjate de cuánto en cuánto va aumentando la secuencia." });
        }
    }
    return questions;
};

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

const LANG_G1 = [
    { q: "¿Cuál de estas palabras es una VOCAL?", opts: ["A", "B", "M", "P"], ans: 0, tip: "Las vocales son A, E, I, O, U." },
    { q: "¿Qué palabra empieza con 'S'?", opts: ["Sol", "Luna", "Gato", "Perro"], ans: 0, tip: "Escucha el sonido 'ssss' al inicio de Sol." },
    { q: "¿Cuál es el plural de 'Flor'?", opts: ["Flores", "Flors", "Florcita", "Floreta"], ans: 0, tip: "Cuando termina en consonante agregamos -es para formar plural." },
    { q: "Completa: La ____ brilla en la noche.", opts: ["Luna", "Lápiz", "Mesa", "Zapato"], ans: 0, tip: "Pensamos en los astros del cielo nocturno." },
    { q: "¿Cuál palabra tiene 2 sílabas?", opts: ["Mesa", "Sol", "Mariposa", "Elefante"], ans: 0, tip: "Mesa se divide en Me-sa (2 golpes de voz)." }
];

const LANG_G3 = [
    { q: "¿Cuál de estas palabras es un SUSTANTIVO?", opts: ["Perro", "Correr", "Bonito", "Rápidamente"], ans: 0, tip: "Un sustantivo nombra personas, animales o cosas." },
    { q: "¿Cuál de estas palabras es un VERBO?", opts: ["Cantar", "Manzana", "Rojo", "Grande"], ans: 0, tip: "Un verbo expresa una acción o algo que se hace." },
    { q: "¿Cuál de estas palabras es un ADJETIVO?", opts: ["Brillante", "Sol", "Volar", "Ayer"], ans: 0, tip: "Un adjetivo describe cómo es o cómo está un sustantivo." },
    { q: "El sinónimo de 'Hermoso' es:", opts: ["Bello", "Feo", "Grande", "Triste"], ans: 0, tip: "Los sinónimos son palabras con significado parecido." },
    { q: "El antónimo de 'Alto' es:", opts: ["Bajo", "Grande", "Fuerte", "Largo"], ans: 0, tip: "Los antónimos son palabras con significado opuesto." }
];

const CIENCIAS_DATA = [
    { q: "¿Qué necesitan las plantas para hacer fotosíntesis?", opts: ["Luz solar y agua", "Jugo y pan", "Fuego y viento", "Leche y tierra"], ans: 0, tip: "La luz del sol provee la energía para alimentar las plantas." },
    { q: "¿Cuál de los siguientes es un SER VIVO?", opts: ["Árbol", "Roca", "Coche", "Teléfono"], ans: 0, tip: "Los seres vivos nacen, crecen, se reproducen y responden al entorno." },
    { q: "¿En qué estado está el hielo?", opts: ["Sólido", "Líquido", "Gaseoso", "Plasma"], ans: 0, tip: "El hielo mantiene su forma firme por lo que es sólido." },
    { q: "¿Cuál es el órgano que bombea la sangre?", opts: ["Corazón", "Cerebro", "Pulmón", "Estómago"], ans: 0, tip: "El corazón late sin parar en el centro de tu pecho." },
    { q: "¿Qué animal es un MAMÍFERO?", opts: ["Vaca", "Tiburón", "Águila", "Serpiente"], ans: 0, tip: "Los mamíferos se alimentan de leche materna al nacer." }
];

// Helper global para vidas
window.handleWrongAnswerBase = function(onNoLives, onHasLife) {
    navigator.vibrate && navigator.vibrate(200);
    const hasLife = CleoGame.loseLife();
    if (!hasLife) {
        onNoLives();
    } else {
        onHasLife();
    }
};

// ── 1. CINTA TRANSPORTADORA (GameCinta) ──
window.GameCinta = (function() {
    let state = {};
    let gameInterval = null;

    function start(subject, grade) {
        CleoSpeech.say("¡Clasifica los elementos en la caja correcta antes de que caigan!");
        const questions = window.getProceduralQuestions(subject, grade, 8);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '⚙️ Cinta Transportadora',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Toca o arrastra la caja con la respuesta correcta antes de que el paquete caiga.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#0F172A;color:#fff;padding:20px 16px;box-sizing:border-box;justify-content:space-between;align-items:center;position:relative;">
                    
                    <!-- Pregunta / Objetivo -->
                    <div style="background:#1E293B;padding:16px 20px;border-radius:18px;text-align:center;border:2px solid #38BDF8;width:100%;max-width:440px;box-shadow:0 8px 20px rgba(0,0,0,0.4);">
                        <span style="color:#38BDF8;font-weight:900;font-size:0.8rem;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">🎯 OBJETIVO DE CLASIFICACIÓN</span>
                        <h3 style="margin:0;font-size:1.2rem;color:#F8FAFC;font-family:'Plus Jakarta Sans',sans-serif;">${q.q}</h3>
                    </div>

                    <!-- Cinta Transportadora 3D / Animada -->
                    <div style="width:100%;max-width:440px;height:110px;background:#334155;border-radius:18px;position:relative;overflow:hidden;border:4px solid #475569;display:flex;align-items:center;box-shadow:inset 0 0 20px rgba(0,0,0,0.6);margin:16px 0;">
                        <div style="position:absolute;width:200%;height:100%;background:repeating-linear-gradient(90deg, #1E293B 0px, #1E293B 24px, #334155 24px, #334155 48px);animation:cintaMove 2s linear infinite;"></div>
                        
                        <!-- Elemento transportado -->
                        <div id="cinta-item" draggable="true" ondragstart="GameCinta.drag(event)" style="position:absolute;left:5%;background:linear-gradient(135deg, #F59E0B, #D97706);color:#fff;padding:14px 22px;border-radius:16px;font-weight:900;font-size:1.2rem;box-shadow:0 8px 16px rgba(0,0,0,0.4);cursor:grab;user-select:none;border:2px solid #FCD34D;z-index:5;">
                            📦 ${q.opts[q.ans]}
                        </div>
                    </div>

                    <!-- Cajas de Destino (Opciones) -->
                    <div style="width:100%;max-width:440px;display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:10px;">
                        ${q.opts.map((opt, i) => `
                            <div ondragover="event.preventDefault()" ondrop="GameCinta.drop(event, ${i})" onclick="GameCinta.selectBox(${i})" style="background:#1E293B;border:3px dashed #475569;border-radius:18px;padding:16px 10px;text-align:center;cursor:pointer;transition:all 0.2s;box-shadow:0 6px 16px rgba(0,0,0,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;">
                                <div style="font-size:1.8rem;margin-bottom:4px;">📥</div>
                                <div style="font-weight:900;font-size:1.05rem;color:#E2E8F0;font-family:'Plus Jakarta Sans',sans-serif;">${opt}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            onBack: () => { clearInterval(gameInterval); CleoRouter.navigate('juegos'); }
        });

        startItemAnimation(q);
    }

    function startItemAnimation(q) {
        clearInterval(gameInterval);
        let pos = 5;
        gameInterval = setInterval(() => {
            const item = document.getElementById('cinta-item');
            if (!item) return clearInterval(gameInterval);
            pos += 1.5;
            item.style.left = pos + '%';
            if (pos > 82) {
                clearInterval(gameInterval);
                CleoUI.toast("¡Se escapó el paquete! -1 ❤️", "💨", "error");
                window.handleWrongAnswerBase(
                    () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                    () => { state.currentQ++; setTimeout(render, 800); }
                );
            }
        }, 70);
    }

    function drag(ev) { ev.dataTransfer.setData("text", "item"); }

    function drop(ev, idx) {
        ev.preventDefault();
        selectBox(idx);
    }

    function selectBox(idx) {
        clearInterval(gameInterval);
        const q = state.questions[state.currentQ];
        if (idx === q.ans) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Clasificación perfecta!");
            CleoUI.toast("¡Excelente!", "🎉", "success");
            state.currentQ++; setTimeout(render, 800);
        } else {
            CleoUI.toast("Caja incorrecta -1 ❤️", "❌", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 800); }
            );
        }
    }

    function endGame() {
        clearInterval(gameInterval); CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, drag, drop, selectBox };
})();

// ── 2. ESTALLIDO DE RESPUESTAS (GameBurbujas) ──
window.GameBurbujas = (function() {
    let state = {};
    let bubbleInterval = null;

    function start(subject, grade) {
        CleoSpeech.say("¡Toca solo las burbujas con la respuesta correcta!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🎈 Estallido de Respuestas',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Revienta las burbujas flotantes tocándolas antes de que se eleven al cielo.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:linear-gradient(to top, #87CEEB, #E0F6FF);position:relative;overflow:hidden;box-sizing:border-box;justify-content:space-between;padding:16px;">
                    
                    <div style="background:rgba(255,255,255,0.95);padding:16px 20px;border-radius:20px;font-weight:900;font-size:1.15rem;text-align:center;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.12);color:#1E293B;border:2px solid #BAE6FD;width:100%;max-width:440px;margin:0 auto;">
                        ${q.q}
                    </div>

                    <!-- Contenedor donde flotan las burbujas -->
                    <div id="bubbles-container" style="flex:1;height:100%;position:relative;width:100%;overflow:hidden;min-height:300px;"></div>
                </div>
            `,
            onBack: () => { stopGame(); CleoRouter.navigate('juegos'); }
        });

        spawnBubbles(q);
    }

    function spawnBubbles(q) {
        clearInterval(bubbleInterval);
        const containerEl = document.getElementById('bubbles-container');
        if(!containerEl) return;

        const options = [...q.opts];
        const colors = [
            'radial-gradient(circle at 30% 30%, #38BDF8, #0284C7)',
            'radial-gradient(circle at 30% 30%, #4ADE80, #16A34A)',
            'radial-gradient(circle at 30% 30%, #A855F7, #7E22CE)',
            'radial-gradient(circle at 30% 30%, #FB923C, #EA580C)'
        ];

        bubbleInterval = setInterval(() => {
            const curContainer = document.getElementById('bubbles-container');
            if(!curContainer) return stopGame();
            
            const opt = options[Math.floor(Math.random() * options.length)];
            const isCorrect = opt === q.opts[q.ans];
            const b = document.createElement('div');
            const size = 90;
            const left = Math.floor(Math.random() * 65) + 10;
            const bgGradient = colors[Math.floor(Math.random() * colors.length)];
            const speed = (3.5 + Math.random() * 1.5).toFixed(1);

            b.style.cssText = `position:absolute;bottom:-100px;left:${left}%;width:${size}px;height:${size}px;background:${bgGradient};border-radius:50%;border:4px solid rgba(255,255,255,0.9);box-shadow:0 10px 25px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.1rem;text-align:center;padding:10px;color:#FFFFFF;cursor:pointer;animation:floatUp ${speed}s linear forwards;z-index:5;user-select:none;font-family:'Plus Jakarta Sans',sans-serif;text-shadow:0 2px 4px rgba(0,0,0,0.5);`;
            b.innerText = opt;
            
            b.onclick = () => {
                CleoAudio.playPop();
                b.style.animation = 'none';
                b.style.transform = 'scale(1.4)';
                b.style.opacity = '0';
                b.style.transition = 'all 0.15s ease-out';
                setTimeout(() => b.remove(), 150);

                if(isCorrect) {
                    CleoGame.addXP(20);
                    state.score += 20;
                    CleoAnimations.confetti();
                    CleoSpeech.say("¡Excelente respuesta!");
                    clearInterval(bubbleInterval);
                    state.currentQ++;
                    setTimeout(render, 800);
                } else {
                    CleoUI.toast("¡Burbuja incorrecta! -1 ❤️", "💥", "error");
                    window.handleWrongAnswerBase(
                        () => { clearInterval(bubbleInterval); setTimeout(() => CleoMonetization.watchAdForLives(() => { render(); }), 500); },
                        () => { /* continua jugando */ }
                    );
                }
            };

            b.addEventListener('animationend', () => {
                if (b.parentNode) b.remove();
            });
            curContainer.appendChild(b);
        }, 1200);
    }

    function stopGame() { clearInterval(bubbleInterval); }
    function endGame() {
        stopGame(); CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start };
})();

// ── 3. RUNNER EDUCATIVO (GameRunner) ──
window.GameRunner = (function() {
    let state = {};
    let runnerInterval = null;

    function start(subject, grade) {
        CleoSpeech.say("¡Desliza o toca las flechas para esquivar e ir por la respuesta correcta!");
        const questions = window.getProceduralQuestions(subject, grade, 6);
        state = { subject, grade, questions, currentQ: 0, score: 0, lane: 1 };
        CleoGame.updateStreak();
        render();
    }

    function render() {
        const q = state.questions[state.currentQ];
        if(!q) return endGame();

        CleoUI.renderGameView({
            title: '🏃 Runner Educativo',
            progress: (state.currentQ / state.questions.length) * 100,
            lives: CleoGame.getLives(),
            tip: q.tip || "Mueve al personaje al carril que tenga la respuesta correcta.",
            content: `
                <div style="display:flex;flex-direction:column;height:100%;min-height:100%;flex:1;width:100%;background:#4C1D95;position:relative;overflow:hidden;box-sizing:border-box;justify-content:space-between;align-items:center;padding:16px;">
                    
                    <!-- Pregunta -->
                    <div style="background:rgba(255,255,255,0.95);padding:14px 20px;border-radius:20px;font-weight:900;font-size:1.1rem;z-index:10;box-shadow:0 8px 20px rgba(0,0,0,0.3);color:#1E293B;text-align:center;width:100%;max-width:440px;">
                        ${q.q}
                    </div>

                    <!-- Pista 3D Runner -->
                    <div style="position:relative;flex:1;height:100%;width:100%;max-width:380px;display:flex;justify-content:center;align-items:flex-end;overflow:hidden;margin:16px 0;">
                        <div style="position:absolute;bottom:0;width:100%;height:100%;background:linear-gradient(#6D28D9, #4C1D95);border-left:4px solid #F59E0B;border-right:4px solid #F59E0B;display:flex;justify-content:space-around;">
                            <div style="width:2px;height:100%;background:rgba(255,255,255,0.3);"></div>
                            <div style="width:2px;height:100%;background:rgba(255,255,255,0.3);"></div>
                        </div>

                        <!-- Obstáculos avanzando -->
                        <div id="runner-obstacles" style="position:absolute;top:20px;width:100%;display:flex;justify-content:space-around;transition:top 2.5s linear;z-index:5;">
                            ${generateObstacles(q)}
                        </div>

                        <!-- Jugador -->
                        <div id="runner-player" style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);width:64px;height:64px;background:url('img/cleo_logo.png') center/contain no-repeat;transition:left 0.2s ease;z-index:10;"></div>
                    </div>

                    <!-- Controles táctiles -->
                    <div style="width:100%;max-width:440px;padding:12px;display:flex;justify-content:center;gap:30px;background:rgba(0,0,0,0.3);border-radius:16px;z-index:20;">
                        <button onclick="GameRunner.move(-1)" style="padding:16px 32px;border-radius:16px;font-size:1.3rem;background:#F59E0B;color:#fff;border:none;box-shadow:0 4px 0 #D97706;cursor:pointer;font-weight:900;">◀ IZQ</button>
                        <button onclick="GameRunner.move(1)" style="padding:16px 32px;border-radius:16px;font-size:1.3rem;background:#F59E0B;color:#fff;border:none;box-shadow:0 4px 0 #D97706;cursor:pointer;font-weight:900;">DER ▶</button>
                    </div>
                </div>
            `,
            onBack: () => { stopGame(); CleoRouter.navigate('juegos'); }
        });

        setTimeout(() => { 
            const obs = document.getElementById('runner-obstacles'); 
            if(obs) obs.style.top = 'calc(100% - 120px)'; 
        }, 100);

        runnerInterval = setTimeout(() => { checkCollision(q); }, 2500);
    }

    function generateObstacles(q) {
        let opts = [...q.opts].sort(() => Math.random() - 0.5).slice(0, 3);
        if(!opts.includes(q.opts[q.ans])) opts[Math.floor(Math.random()*3)] = q.opts[q.ans];
        state.currentOptions = opts;
        return opts.map((opt) => `
            <div style="width:95px;background:#FFF;color:#0F172A;font-weight:900;text-align:center;padding:12px 6px;border-radius:14px;box-shadow:0 8px 16px rgba(0,0,0,0.4);font-size:0.95rem;border:3px solid #38BDF8;font-family:'Plus Jakarta Sans',sans-serif;">
                ${opt}
            </div>
        `).join('');
    }

    function move(dir) {
        state.lane = Math.max(0, Math.min(2, state.lane + dir));
        const player = document.getElementById('runner-player');
        if(player) { 
            const positions = ['18%', '50%', '82%']; 
            player.style.left = positions[state.lane]; 
        }
    }

    function checkCollision(q) {
        if(state.currentOptions[state.lane] === q.opts[q.ans]) {
            CleoGame.addXP(20); state.score += 20; CleoAnimations.confetti(); CleoSpeech.say("¡Meta alcanzada!");
            state.currentQ++; setTimeout(render, 600);
        } else {
            CleoUI.toast("¡Respuesta incorrecta! -1 ❤️", "⚠️", "error");
            window.handleWrongAnswerBase(
                () => { setTimeout(() => CleoMonetization.watchAdForLives(() => { state.currentQ++; render(); }), 500); },
                () => { state.currentQ++; setTimeout(render, 800); }
            );
        }
    }

    function stopGame() { clearTimeout(runnerInterval); }
    function endGame() {
        stopGame(); CleoAnimations.confetti();
        CleoUI.showGameEnd({ score: state.score, total: state.questions.length, correct: state.score/20, wrong: state.questions.length - (state.score/20), perfect: (state.score/20 === state.questions.length), onReplay: () => start(state.subject, state.grade), onHome: () => CleoRouter.navigate('home') });
    }

    return { start, move };
})();
