/* ===========================
   CLEDUCA — Datos Curriculares
   Colombia MEN - Todos los Grados
   =========================== */
window.CLEDUCA_DATA = {

  grades: [
    { id:1, name:"1° Primaria", emoji:"🌱", ages:"6 a 7 años", color:"#58CC02" },
    { id:2, name:"2° Primaria", emoji:"🌿", ages:"7 a 8 años", color:"#1CB0F6" },
    { id:3, name:"3° Primaria", emoji:"🌳", ages:"8 a 9 años", color:"#FF9800" },
    { id:4, name:"4° Primaria", emoji:"⭐", ages:"9 a 10 años", color:"#A855F7" },
    { id:5, name:"5° Primaria", emoji:"🚀", ages:"10 a 11 años", color:"#EF4444" }
  ],

  subjects: [
    { id:"matematicas", name:"Matemáticas",       emoji:"🔢", color:"#FF9800", desc:"Números, sumas, formas y más" },
    { id:"lenguaje",    name:"Lenguaje",           emoji:"📖", color:"#1CB0F6", desc:"Lectura, escritura y vocabulario" },
    { id:"ciencias",    name:"Ciencias Naturales", emoji:"🌿", color:"#58CC02", desc:"Animales, plantas y cuerpo humano" },
    { id:"sociales",    name:"Ciencias Sociales",  emoji:"🗺️", color:"#A855F7", desc:"Colombia, mapas e historia" },
    { id:"programacion",name:"Programación",       emoji:"👨‍💻", color:"#6366F1", desc:"Algoritmos, código y secuencias de movimiento" },
    { id:"logica",      name:"Pensamiento Lógico", emoji:"🧩", color:"#EF4444", desc:"Patrones, puzzles y secuencias" },
    { id:"arte",        name:"Arte y Creatividad", emoji:"🎨", color:"#EC4899", desc:"Dibujo, colores y expresión" },
    { id:"teatro",      name:"Teatro y Expresión", emoji:"🎭", color:"#F43F5E", desc:"Actuación, emociones y dramatización" },
    { id:"idiomas",     name:"Idiomas del Mundo",  emoji:"🌎", color:"#38BDF8", desc:"Aprende Inglés y Portugués", isSpecial:true }
  ],

  idiomas: {
    ingles: {
      name: "Inglés",
      emoji: "🇺🇸",
      category: "Idiomas Populares",
      levels: [
        {
          id: 1, name: "Vocabulario: Colores y Animales",
          quiz: [
            { q:"¿Cómo se dice 'Rojo' en inglés?", opts:["Blue","Red","Green","Yellow"], ans:1, xp:15 },
            { q:"¿Qué animal es un 'Dog'?", opts:["Gato","Pájaro","Perro","Pez"], ans:2, xp:15 },
            { q:"¿Cómo se dice 'Azul'?", opts:["Blue","Black","White","Red"], ans:0, xp:15 },
            { q:"¿Qué animal es un 'Cat'?", opts:["Gato","Perro","Vaca","Cerdo"], ans:0, xp:15 },
            { q:"¿Cómo se dice 'Amarillo'?", opts:["Yellow","Orange","Pink","Green"], ans:0, xp:15 }
          ]
        },
        {
          id: 2, name: "Saludos y Cortesía",
          quiz: [
            { q:"¿Cómo se dice 'Hola'?", opts:["Goodbye","Hello","Please","Sorry"], ans:1, xp:15 },
            { q:"¿Qué significa 'Thank you'?", opts:["De nada","Por favor","Gracias","Adiós"], ans:2, xp:15 },
            { q:"¿Cómo se dice 'Buenos días'?", opts:["Good night","Good morning","Good afternoon","Hello"], ans:1, xp:15 },
            { q:"¿Qué significa 'Please'?", opts:["Gracias","Perdón","Por favor","Hola"], ans:2, xp:15 },
            { q:"¿Cómo se dice 'Adiós'?", opts:["Hello","Good","Goodbye","Morning"], ans:2, xp:15 }
          ]
        },
        {
          id: 3, name: "Frases Básicas y Oraciones",
          quiz: [
            { q:"Traducción: 'The dog is red'", opts:["El perro es rojo","El gato es azul","Un pájaro rojo","Mi perro"], ans:0, xp:20 },
            { q:"¿Qué significa 'I am happy'?", opts:["Tengo hambre","Estoy triste","Estoy feliz","Tengo frío"], ans:2, xp:20 },
            { q:"¿Cómo se dice 'Me llamo...'?", opts:["I am...","My name is...","You are...","He is..."], ans:1, xp:20 },
            { q:"¿Qué es 'How are you?'?", opts:["¿Dónde estás?","¿Cómo estás?","¿Qué hora es?","¿Quién eres?"], ans:1, xp:20 },
            { q:"Traducción: 'The apple is green'", opts:["La fresa es roja","La manzana es verde","La manzana es roja","El plátano"], ans:1, xp:20 }
          ]
        },
        {
          id: 4, name: "Familia y Objetos",
          quiz: [
            { q:"¿Cómo se dice 'Madre'?", opts:["Mother","Father","Sister","Brother"], ans:0, xp:20 },
            { q:"¿Qué es 'Father'?", opts:["Hermano","Papá","Abuelo","Tío"], ans:1, xp:20 },
            { q:"¿Cómo se dice 'Escuela'?", opts:["House","School","Park","Car"], ans:1, xp:20 },
            { q:"¿Qué significa 'Book'?", opts:["Libro","Lápiz","Mesa","Silla"], ans:0, xp:20 },
            { q:"Traducción: 'I love my family'", opts:["Amo a mi familia","Me gusta la escuela","Mi casa es grande","Buenos días"], ans:0, xp:20 }
          ]
        }
      ]
    },
    portugues: {
      name: "Portugués",
      emoji: "🇧🇷",
      category: "América Latina",
      levels: [
        {
          id: 1, name: "Cores e Animais",
          quiz: [
            { q:"Como dizer 'Rojo' em português?", opts:["Azul","Vermelho","Preto","Branco"], ans:1, xp:15 },
            { q:"O que é um 'Cachorro'?", opts:["Gato","Pájaro","Perro","Pez"], ans:2, xp:15 },
            { q:"Como dizer 'Azul'?", opts:["Azul","Verde","Amarelo","Branco"], ans:0, xp:15 },
            { q:"O que é um 'Gato'?", opts:["Perro","Pájaro","Gato","Rato"], ans:2, xp:15 },
            { q:"Como dizer 'Verde'?", opts:["Amarelo","Verde","Vermelho","Rosa"], ans:1, xp:15 }
          ]
        },
        {
          id: 2, name: "Saudações e Cortesias",
          quiz: [
            { q:"Como dizer 'Hola'?", opts:["Oi / Olá","Tchau","Bom dia","Obrigado"], ans:0, xp:15 },
            { q:"O que significa 'Obrigado'?", opts:["De nada","Por favor","Gracias","Adiós"], ans:2, xp:15 },
            { q:"Como dizer 'Buenos días'?", opts:["Boa noite","Boa tarde","Bom dia","Oi"], ans:2, xp:15 },
            { q:"O que significa 'Por favor'?", opts:["Gracias","Por favor","De nada","Olá"], ans:1, xp:15 },
            { q:"Como dizer 'Adiós'?", opts:["Olá","Tchau","Bom dia","Oi"], ans:1, xp:15 }
          ]
        }
      ]
    },
    frances: {
      name: "Francés",
      emoji: "🇫🇷",
      category: "Europa",
      levels: [
        {
          id: 1, name: "Couleurs et Salutations",
          quiz: [
            { q:"¿Cómo se dice 'Hola' en francés?", opts:["Bonjour","Au revoir","Merci","S'il vous plaît"], ans:0, xp:15 },
            { q:"¿Qué significa 'Merci'?", opts:["Hola","Por favor","Gracias","Adiós"], ans:2, xp:15 },
            { q:"¿Cómo se dice 'Rojo' en francés?", opts:["Bleu","Rouge","Vert","Jaune"], ans:1, xp:15 },
            { q:"¿Qué es 'Oui'?", opts:["No","Sí","Tal vez","Gracias"], ans:1, xp:15 },
            { q:"¿Cómo se dice 'Adiós' en francés?", opts:["Bonjour","Au revoir","Merci","Oui"], ans:1, xp:15 }
          ]
        }
      ]
    },
    aleman: {
      name: "Alemán",
      emoji: "🇩🇪",
      category: "Europa",
      levels: [
        {
          id: 1, name: "Wörter und Zahlen",
          quiz: [
            { q:"¿Cómo se dice 'Hola' en alemán?", opts:["Hallo","Tschüss","Danke","Bitte"], ans:0, xp:15 },
            { q:"¿Qué significa 'Danke'?", opts:["Por favor","Gracias","Hola","Adiós"], ans:1, xp:15 },
            { q:"¿Cómo se dice 'Uno' en alemán?", opts:["Eins","Zwei","Drei","Vier"], ans:0, xp:15 },
            { q:"¿Qué significa 'Ja'?", opts:["No","Sí","Gracias","Hola"], ans:1, xp:15 },
            { q:"¿Cómo se dice 'Adiós' en alemán?", opts:["Hallo","Tschüss","Danke","Bitte"], ans:1, xp:15 }
          ]
        }
      ]
    }
  },

  content: {
    // ═══════════════════════════════════════════
    // GRADO 1
    // ═══════════════════════════════════════════
    1: {
      matematicas: {
        topics: ["Números del 1 al 100","Conteo y cardinalidad","Sumas básicas","Restas básicas","Figuras geométricas","Medidas"],
        quiz: [
          { q:"¿Cuánto es 2 + 3?", opts:["4","5","6","7"], ans:1, xp:10, tip:"Imagina 2 manzanas, luego agrega 3 manzanas más." },
          { q:"¿Cuánto es 5 - 2?", opts:["2","3","4","1"], ans:1, xp:10, tip:"Abre tu mano completa (5 dedos) y esconde 2 dedos." },
          { q:"¿Cuántos lados tiene un triángulo?", opts:["2","3","4","5"], ans:1, xp:10, tip:"Tri- significa tres, como los lados de una pirámide." },
          { q:"¿Cuál número va después del 9?", opts:["8","11","10","12"], ans:2, xp:10, tip:"Es el número con un uno y un cero." },
          { q:"¿Cuánto es 4 + 4?", opts:["6","7","8","9"], ans:2, xp:10 },
          { q:"¿Cuál es el número más grande? 3, 7, 1, 5", opts:["3","1","5","7"], ans:3, xp:10 },
          { q:"¿Cuánto es 10 - 3?", opts:["6","7","8","5"], ans:1, xp:10 },
          { q:"¿Cuántos lados tiene un cuadrado?", opts:["3","5","4","6"], ans:2, xp:10 },
          { q:"¿Cuánto es 6 + 2?", opts:["7","8","9","6"], ans:1, xp:10 },
          { q:"¿Qué número es la mitad de 10?", opts:["4","5","6","3"], ans:1, xp:10 }
        ],
        sopa: {
          words: ["SUMA","DOS","TRES","OCHO","DIEZ","CUBO","CIRCULO","CUATRO"],
          size: 8
        }
      },
      lenguaje: {
        topics: ["Vocales y consonantes","Sílabas","Palabras","Oraciones simples","Cuentos cortos","Escritura"],
        quiz: [
          { q:"¿Cuál de estas es una vocal?", opts:["B","M","A","T"], ans:2, xp:10 },
          { q:"¿Cuántas vocales tiene el español?", opts:["3","4","5","6"], ans:2, xp:10 },
          { q:"¿Qué sílaba va al inicio de 'mapa'?", opts:["pa","ap","ma","am"], ans:2, xp:10 },
          { q:"¿Cuál es la primera letra del abecedario?", opts:["B","A","C","D"], ans:1, xp:10 },
          { q:"¿Cuántas letras tiene la palabra GATO?", opts:["3","5","4","6"], ans:2, xp:10 },
          { q:"¿Cuál de estas es una consonante?", opts:["A","E","I","B"], ans:3, xp:10 },
          { q:"¿Cuántas sílabas tiene 'mariposa'?", opts:["3","4","5","6"], ans:1, xp:10 },
          { q:"Completa: 'El perro ___ en el jardín'", opts:["corre","come","duerme","salta"], ans:0, xp:15 },
          { q:"¿Qué es un sustantivo?", opts:["Una acción","Un nombre de cosa o persona","Un color","Un número"], ans:1, xp:15 },
          { q:"¿Cuál palabra rima con 'sol'?", opts:["luna","col","cielo","mar"], ans:1, xp:10 }
        ],
        sopa: {
          words: ["VOCAL","LETRA","LIBRO","CUENTO","FRASE","MAMA","PAPA","GATO"],
          size: 8
        }
      },
      ciencias: {
        topics: ["Los seres vivos","Animales domésticos y salvajes","Las plantas","El cuerpo humano","El agua","El clima"],
        quiz: [
          { q:"¿Cuál de estos animales vive en el agua?", opts:["Perro","Gato","Pez","Caballo"], ans:2, xp:10 },
          { q:"¿Qué necesitan las plantas para vivir?", opts:["Agua y luz solar","Solo agua","Solo tierra","Nada"], ans:0, xp:10 },
          { q:"¿Cuántas patas tiene un perro?", opts:["2","3","4","6"], ans:2, xp:10 },
          { q:"¿De dónde proviene la leche?", opts:["La vaca","El pollo","El cerdo","El caballo"], ans:0, xp:10 },
          { q:"¿Qué parte de la planta recibe la luz del sol?", opts:["La raíz","El tallo","Las hojas","La semilla"], ans:2, xp:10 },
          { q:"¿Qué órgano usamos para respirar?", opts:["El corazón","Los pulmones","El estómago","El hígado"], ans:1, xp:10 },
          { q:"¿Qué órgano bombea la sangre?", opts:["El cerebro","Los riñones","El corazón","El hígado"], ans:2, xp:10 },
          { q:"¿Cuál de estos es un animal mamífero?", opts:["Serpiente","Pez","Perro","Mariposa"], ans:2, xp:10 },
          { q:"¿Qué produce el sol?", opts:["Lluvia","Luz y calor","Viento","Frío"], ans:1, xp:10 },
          { q:"¿Cuántos sentidos tiene el ser humano?", opts:["3","4","5","6"], ans:2, xp:10 }
        ],
        sopa: { words:["PLANTA","ANIMAL","AGUA","SOL","RAIZ","HOJA","PECES","TIERRA"], size:8 }
      },
      sociales: {
        topics: ["Mi familia","Mi escuela","Mi barrio","Colombia","Las normas","Los oficios"],
        quiz: [
          { q:"¿Cómo se llama la capital de Colombia?", opts:["Medellín","Cali","Bogotá","Barranquilla"], ans:2, xp:10 },
          { q:"¿Cuántos colores tiene la bandera de Colombia?", opts:["2","3","4","5"], ans:1, xp:10 },
          { q:"¿Qué colores tiene la bandera de Colombia?", opts:["Rojo, blanco y verde","Azul, blanco y rojo","Amarillo, azul y rojo","Verde, blanco y azul"], ans:2, xp:10 },
          { q:"¿Quién trabaja enseñando en la escuela?", opts:["El médico","El maestro","El policía","El chef"], ans:1, xp:10 },
          { q:"¿Qué hace un médico?", opts:["Cocina comida","Enseña a los niños","Cuida la salud","Arregla carros"], ans:2, xp:10 },
          { q:"¿Cuál es el río más largo de Colombia?", opts:["El Nilo","El Magdalena","El Amazonas","El Cauca"], ans:1, xp:10 },
          { q:"¿En qué continente está Colombia?", opts:["Europa","Asia","América del Sur","África"], ans:2, xp:10 },
          { q:"¿Cuántas regiones tiene Colombia?", opts:["4","5","6","7"], ans:2, xp:10 },
          { q:"¿Cuál animal es símbolo de Colombia?", opts:["El tigre","El cóndor","El puma","El jaguar"], ans:1, xp:10 },
          { q:"¿Qué celebramos el 20 de julio?", opts:["La Navidad","El cumpleaños del presidente","La Independencia de Colombia","El día del niño"], ans:2, xp:10 }
        ],
        sopa: { words:["FAMILIA","BARRIO","COLOMBIA","BOGOTA","ESCUELA","PATRIA","NACION","MAPA"], size:8 }
      },
      logica: {
        topics:["Clasificación","Semejanzas y diferencias","Secuencias simples","Comparaciones","Patrones con colores"],
        quiz:[
          { q:"¿Cuál no es igual? 🔵🔵🔵🔴🔵", opts:["El primero","El segundo","El rojo","El quinto"], ans:2, xp:10 },
          { q:"¿Qué sigue? 1, 2, 3, 4, ___", opts:["6","5","7","8"], ans:1, xp:10 },
          { q:"¿Qué sigue? 🌕🌑🌕🌑___", opts:["🌕","🌑","⭐","🌟"], ans:1, xp:10 },
          { q:"¿Cuál es el más alto? Árbol, flores, hierba", opts:["Hierba","Flores","Árbol","Todos iguales"], ans:2, xp:10 },
          { q:"¿Qué sigue? 2, 4, 6, 8, ___", opts:["9","10","11","12"], ans:1, xp:10 },
          { q:"Si hay 5 manzanas y como 2, ¿cuántas quedan?", opts:["2","3","4","5"], ans:1, xp:10 },
          { q:"¿Cuál figura tiene 4 lados iguales?", opts:["Triángulo","Círculo","Cuadrado","Rectángulo"], ans:2, xp:10 },
          { q:"¿Qué sigue? A, B, A, B, ___", opts:["C","A","B","D"], ans:0, xp:10 },
          { q:"María tiene más fichas que Juan. Juan tiene 3. ¿María tiene?", opts:["1","2","3","4 o más"], ans:3, xp:15 },
          { q:"¿Cuál grupo tiene más? ⭐⭐⭐ vs 🌙🌙🌙🌙", opts:["Las estrellas","Las lunas","Igual","No se puede saber"], ans:1, xp:10 }
        ],
        sopa:{ words:["PATRON","ORDEN","IGUAL","MAYOR","MENOR","SERIE","FORMA","CLASE"], size:8 }
      }
    },

    // ═══════════════════════════════════════════
    // GRADO 2
    // ═══════════════════════════════════════════
    2: {
      matematicas: {
        topics:["Números hasta 1000","Sumas con llevada","Restas con préstamo","Multiplicación introducción","Fracciones simples","Medición"],
        quiz:[
          { q:"¿Cuánto es 15 + 27?", opts:["32","42","41","43"], ans:1, xp:10 },
          { q:"¿Cuánto es 50 - 23?", opts:["27","28","26","29"], ans:0, xp:10 },
          { q:"¿Cuánto es 3 × 4?", opts:["10","11","12","13"], ans:2, xp:10 },
          { q:"¿Cuánto es 2 × 5?", opts:["7","8","10","12"], ans:2, xp:10 },
          { q:"¿Qué fracción representa la mitad?", opts:["1/3","1/4","1/2","2/3"], ans:2, xp:10 },
          { q:"¿Cuánto es 100 - 45?", opts:["55","65","45","75"], ans:0, xp:10 },
          { q:"¿Cuánto mide un metro en centímetros?", opts:["10 cm","100 cm","1000 cm","50 cm"], ans:1, xp:10 },
          { q:"¿Cuánto es 6 × 2?", opts:["10","11","12","14"], ans:2, xp:10 },
          { q:"¿Cuántos días tiene una semana?", opts:["5","6","7","8"], ans:2, xp:10 },
          { q:"¿Cuánto es 35 + 48?", opts:["83","82","84","81"], ans:0, xp:10 }
        ],
        sopa:{ words:["SUMA","RESTA","MITAD","METRO","CUARTO","NUMERO","FIGURA","DATOS"], size:8 }
      },
      lenguaje: {
        topics:["Tipos de texto","Verbos","Adjetivos","Sustantivos","Signos de puntuación","Poesía"],
        quiz:[
          { q:"¿Qué es un verbo?", opts:["Una persona","Una acción","Un lugar","Un color"], ans:1, xp:10 },
          { q:"'Bonito' es un...", opts:["sustantivo","verbo","adjetivo","artículo"], ans:2, xp:10 },
          { q:"¿Cuántas sílabas tiene 'cocodrilo'?", opts:["3","4","5","6"], ans:1, xp:10 },
          { q:"¿Qué signo se pone al final de una pregunta?", opts:["Punto","Coma","Signo de interrogación","Exclamación"], ans:2, xp:10 },
          { q:"¿Cuál de estas palabras es un sustantivo?", opts:["Correr","Mesa","Bonito","Rápido"], ans:1, xp:10 },
          { q:"¿Cuál es el plural de 'flor'?", opts:["flores","flors","floras","flori"], ans:0, xp:10 },
          { q:"¿Qué tipo de texto cuenta una historia?", opts:["Receta","Cuento","Noticia","Carta"], ans:1, xp:10 },
          { q:"¿Cuál es el antónimo de 'grande'?", opts:["Alto","Largo","Pequeño","Gordo"], ans:2, xp:10 },
          { q:"¿Qué es una oración?", opts:["Una sola letra","Un grupo de palabras con sentido","Un párrafo completo","Un libro"], ans:1, xp:10 },
          { q:"¿Cuál es el sinónimo de 'feliz'?", opts:["Triste","Contento","Enojado","Asustado"], ans:1, xp:10 }
        ],
        sopa:{ words:["VERBO","NOMBRE","CUENTO","FRASE","LETRA","VOCAL","PUNTO","COMA"], size:8 }
      },
      ciencias: {
        topics:["Estados del agua","El sistema solar","Los ecosistemas","La cadena alimentaria","La materia","La energía"],
        quiz:[
          { q:"¿Cuáles son los estados del agua?", opts:["Líquido, sólido, gaseoso","Frío, caliente, tibio","Grande, mediano, pequeño","Azul, verde, incoloro"], ans:0, xp:10 },
          { q:"¿Cuál es el planeta más cercano al sol?", opts:["Venus","Tierra","Mercurio","Marte"], ans:2, xp:10 },
          { q:"¿Cuántos planetas tiene nuestro sistema solar?", opts:["7","8","9","10"], ans:1, xp:10 },
          { q:"¿Qué produce la fotosíntesis?", opts:["Agua","Oxígeno","Dióxido de carbono","Tierra"], ans:1, xp:10 },
          { q:"¿Qué son los herbívoros?", opts:["Animales que comen carne","Animales que comen plantas","Animales que comen todo","Animales que no comen"], ans:1, xp:10 },
          { q:"¿Cómo se llama el proceso de las mariposas al cambiar?", opts:["Evolución","Metamorfosis","Reproducción","Adaptación"], ans:1, xp:10 },
          { q:"¿Cuál planeta tiene anillos famosos?", opts:["Júpiter","Marte","Saturno","Urano"], ans:2, xp:10 },
          { q:"¿Qué son los carnívoros?", opts:["Comen solo plantas","Comen solo frutas","Comen carne","Comen todo"], ans:2, xp:10 },
          { q:"¿Qué fuente de energía viene del sol?", opts:["Eólica","Solar","Hidráulica","Nuclear"], ans:1, xp:10 },
          { q:"¿Cuántos huesos tiene el cuerpo humano aproximadamente?", opts:["100","206","350","50"], ans:1, xp:10 }
        ],
        sopa:{ words:["AGUA","PLANETA","SOLAR","PLANTA","ANIMAL","TIERRA","ENERGIA","CUERPO"], size:8 }
      },
      sociales: {
        topics:["Las regiones de Colombia","La diversidad cultural","Los medios de transporte","El comercio","El tiempo histórico","Los derechos"],
        quiz:[
          { q:"¿Cuántas regiones naturales tiene Colombia?", opts:["4","5","6","7"], ans:2, xp:10 },
          { q:"¿En qué región está el desierto de la Tatacoa?", opts:["Amazonia","Andina","Caribe","Orinoquía"], ans:1, xp:10 },
          { q:"¿Cuál es el río más largo de Colombia?", opts:["Cauca","Magdalena","Amazonas","Meta"], ans:1, xp:10 },
          { q:"¿Cómo se llama el presidente que firmó la Independencia?", opts:["Simón Bolívar","Antonio Nariño","Francisco de Paula Santander","Policarpa Salavarrieta"], ans:0, xp:10 },
          { q:"¿Qué idioma oficial habla Colombia?", opts:["Inglés","Portugués","Español","Francés"], ans:2, xp:10 },
          { q:"¿Cuál es la moneda de Colombia?", opts:["Dólar","Euro","Peso","Real"], ans:2, xp:10 },
          { q:"¿En qué mes se celebra la Independencia de Colombia?", opts:["Agosto","Septiembre","Julio","Junio"], ans:2, xp:10 },
          { q:"¿Cuál ciudad es conocida como 'La Ciudad Eterna de la Salsa'?", opts:["Medellín","Bogotá","Cali","Cartagena"], ans:2, xp:10 },
          { q:"¿Cuál región tiene la mayor diversidad de fauna?", opts:["Andina","Amazónica","Caribe","Pacífico"], ans:1, xp:10 },
          { q:"¿Cuál es el derecho más importante de los niños?", opts:["Trabajar","Vivir con dignidad","Pagar impuestos","Votar"], ans:1, xp:10 }
        ],
        sopa:{ words:["REGION","COLOMBIA","MAPA","CULTURA","HISTORIA","DERECHO","PATRIA","BANDERA"], size:8 }
      },
      logica: {
        topics:["Secuencias numéricas","Tablas de verdad básicas","Clasificación avanzada","Analogías simples","Problemas de lógica"],
        quiz:[
          { q:"¿Qué sigue? 5, 10, 15, 20, ___", opts:["22","25","24","30"], ans:1, xp:10 },
          { q:"Si Ana es más alta que Luis, y Luis es más alto que Pedro, ¿quién es el más bajo?", opts:["Ana","Luis","Pedro","Todos iguales"], ans:2, xp:15 },
          { q:"¿Qué sigue? 1, 3, 5, 7, ___", opts:["8","9","10","11"], ans:1, xp:10 },
          { q:"Perro es a cachorro como gato es a ___", opts:["gatito","kitten","gata","felino"], ans:0, xp:10 },
          { q:"¿Qué sigue? A, C, E, G, ___", opts:["H","I","J","K"], ans:1, xp:10 },
          { q:"Si 2+3=5 y 3+4=7, entonces 4+5=___", opts:["8","9","10","11"], ans:1, xp:10 },
          { q:"¿Cuántos triángulos hay? △△□△△□△", opts:["4","5","6","7"], ans:1, xp:10 },
          { q:"Día es a noche como blanco es a ___", opts:["gris","claro","negro","oscuro"], ans:2, xp:10 },
          { q:"¿Qué sigue? 100, 90, 80, 70, ___", opts:["55","60","65","50"], ans:1, xp:10 },
          { q:"Si cada caja tiene 3 pelotas y hay 4 cajas, ¿cuántas pelotas hay?", opts:["7","10","12","14"], ans:2, xp:10 }
        ],
        sopa:{ words:["LOGICA","PATRON","RAZON","SERIE","ORDEN","TABLA","MAYOR","IGUAL"], size:8 }
      }
    },

    // ═══════════════════════════════════════════
    // GRADO 3
    // ═══════════════════════════════════════════
    3: {
      matematicas: {
        topics:["Multiplicación tablas 1-10","División exacta","Números hasta 10.000","Fracciones","Perímetro y área","Estadística básica"],
        quiz:[
          { q:"¿Cuánto es 7 × 8?", opts:["54","56","58","64"], ans:1, xp:10 },
          { q:"¿Cuánto es 6 × 9?", opts:["52","54","56","58"], ans:1, xp:10 },
          { q:"¿Cuánto es 48 ÷ 6?", opts:["6","7","8","9"], ans:2, xp:10 },
          { q:"¿Cuánto es 9 × 9?", opts:["79","80","81","82"], ans:2, xp:10 },
          { q:"¿Cuánto es 72 ÷ 8?", opts:["7","8","9","10"], ans:2, xp:10 },
          { q:"¿Qué fracción es mayor: 1/2 o 1/4?", opts:["1/4","1/2","Son iguales","No se puede comparar"], ans:1, xp:10 },
          { q:"¿Cuánto es el perímetro de un cuadrado de lado 5cm?", opts:["15cm","20cm","25cm","10cm"], ans:1, xp:10 },
          { q:"¿Cuánto es 5 × 6 + 3?", opts:["30","32","33","34"], ans:2, xp:15 },
          { q:"¿Cuánto es 1.000 + 2.500?", opts:["3000","3500","4000","2500"], ans:1, xp:10 },
          { q:"Si divido 36 entre 4, ¿cuánto obtengo?", opts:["8","9","10","7"], ans:1, xp:10 }
        ],
        sopa:{ words:["TABLA","DIVISION","FRACCION","PERIMETRO","AREA","DATOS","DECENA","CENTENA"], size:9 }
      },
      lenguaje: {
        topics:["Tipos de oraciones","El párrafo","Clases de palabras","Ortografía básica","Comprensión lectora","Tipos de texto"],
        quiz:[
          { q:"¿Cuál es el sinónimo de 'alegre'?", opts:["Triste","Contento","Enojado","Asustado"], ans:1, xp:10 },
          { q:"¿Qué tipo de oración es: '¡Qué bonito día!'?", opts:["Interrogativa","Declarativa","Exclamativa","Imperativa"], ans:2, xp:10 },
          { q:"¿Cómo se divide una palabra en sílabas?", opts:["Por letras","Por vocales","Por golpes de voz","Por consonantes"], ans:2, xp:10 },
          { q:"¿Cuál es el antónimo de 'rápido'?", opts:["Veloz","Ligero","Lento","Ágil"], ans:2, xp:10 },
          { q:"¿Qué es un párrafo?", opts:["Una sola oración","Un conjunto de oraciones sobre un tema","Un capítulo de libro","Una página completa"], ans:1, xp:10 },
          { q:"¿Cuál de estas palabras lleva tilde?", opts:["casa","arbol","mesa","silla"], ans:1, xp:10 },
          { q:"¿Qué es un adverbio?", opts:["Nombre de cosa","Acción","Modifica al verbo","Describe al sustantivo"], ans:2, xp:10 },
          { q:"¿Cuántas sílabas tiene 'extraordinario'?", opts:["5","6","7","8"], ans:1, xp:10 },
          { q:"¿Qué tiempo verbal es 'jugué'?", opts:["Presente","Futuro","Pasado","Condicional"], ans:2, xp:10 },
          { q:"¿Cuál es el plural de 'lápiz'?", opts:["lápizs","lápices","lápizes","lápizas"], ans:1, xp:10 }
        ],
        sopa:{ words:["SINONIMO","ANTONIMO","PARRAFO","ORACION","VERBO","SUJETO","PREDICADO","TILDE"], size:9 }
      },
      ciencias: {
        topics:["La célula","Los sistemas del cuerpo","Las plantas y reproducción","Los ecosistemas colombianos","La materia y sus cambios","Fuerza y movimiento"],
        quiz:[
          { q:"¿Cuál es la unidad básica de vida?", opts:["El átomo","La célula","El tejido","El órgano"], ans:1, xp:10 },
          { q:"¿Qué sistema del cuerpo se encarga de la digestión?", opts:["Respiratorio","Circulatorio","Digestivo","Nervioso"], ans:2, xp:10 },
          { q:"¿Cuántas vértebras tiene la columna vertebral aproximadamente?", opts:["20","23","33","40"], ans:2, xp:10 },
          { q:"¿Cuál es el ecosistema más biodiverso?", opts:["Desierto","Selva tropical","Tundra","Pradera"], ans:1, xp:10 },
          { q:"¿Qué es la fotosíntesis?", opts:["Respiración de animales","Proceso de las plantas para hacer comida con luz","Digestión de insectos","Reproducción de hongos"], ans:1, xp:10 },
          { q:"¿Cómo se reproducen las plantas con flores?", opts:["Por esporas","Por semillas","Por división celular","Por brotes"], ans:1, xp:10 },
          { q:"¿Qué es la cadena alimentaria?", opts:["Un tipo de tienda","La relación de quién come a quién","Una cadena de metal","Un juego de palabras"], ans:1, xp:10 },
          { q:"¿Cuántas cámaras tiene el corazón humano?", opts:["2","3","4","5"], ans:2, xp:10 },
          { q:"¿Qué sentido usa el murciélago para ubicarse?", opts:["Vista","Olfato","Ecolocalización","Tacto"], ans:2, xp:10 },
          { q:"¿Qué es la gravedad?", opts:["Fuerza que atrae objetos hacia la Tierra","Fuerza que empuja hacia arriba","La presión del agua","La velocidad del viento"], ans:0, xp:10 }
        ],
        sopa:{ words:["CELULA","SISTEMA","CUERPO","PLANTA","ANIMAL","ECOSISTEMA","CELULA","ENERGIA"], size:9 }
      },
      sociales: {
        topics:["Historia de Colombia","Los indígenas colombianos","La Conquista","La Colonia","La Independencia","El gobierno"],
        quiz:[
          { q:"¿Quién fue el Libertador de Colombia?", opts:["Antonio Nariño","Simón Bolívar","Francisco de Paula Santander","Policarpa Salavarrieta"], ans:1, xp:10 },
          { q:"¿En qué año fue la Independencia de Colombia?", opts:["1776","1810","1819","1830"], ans:1, xp:10 },
          { q:"¿Cómo se llama el documento que protege los derechos en Colombia?", opts:["El Código Civil","La Constitución Política","El Código Penal","La Declaración"], ans:1, xp:10 },
          { q:"¿Quién fue Policarpa Salavarrieta?", opts:["Una reina española","Una heroína de la Independencia","Una pintora famosa","Una poeta colombiana"], ans:1, xp:10 },
          { q:"¿Cuál pueblo indígena habitó la región Muisca?", opts:["Los aztecas","Los mayas","Los muiscas","Los incas"], ans:2, xp:10 },
          { q:"¿En qué año se firmó la Constitución actual de Colombia?", opts:["1886","1910","1991","2000"], ans:2, xp:10 },
          { q:"¿Cómo se llama el órgano legislativo de Colombia?", opts:["El Congreso","El Presidente","La Corte","El Ministerio"], ans:0, xp:10 },
          { q:"¿Cuál fue la primera capital de Colombia?", opts:["Bogotá","Cartagena","Tunja","Santa Fe"], ans:3, xp:10 },
          { q:"¿Qué conquistador llegó a Colombia en el siglo XVI?", opts:["Cristóbal Colón","Gonzalo Jiménez de Quesada","Hernán Cortés","Francisco Pizarro"], ans:1, xp:10 },
          { q:"¿Cuántos municipios tiene Colombia aproximadamente?", opts:["500","850","1100","1400"], ans:2, xp:10 }
        ],
        sopa:{ words:["HISTORIA","COLOMBIA","BOLIVAR","NACION","INDEPENDENCIA","MUISCA","REPUBLICA","GOBIERNO"], size:9 }
      },
      logica: {
        topics:["Problemas de dos pasos","Razonamiento deductivo","Patrones numéricos","Lógica proposicional básica","Diagramas de Venn"],
        quiz:[
          { q:"Si un tren parte a las 8am y llega 3h 30min después, ¿a qué hora llega?", opts:["10:30am","11:00am","11:30am","12:00pm"], ans:2, xp:15 },
          { q:"¿Qué número sigue? 2, 6, 18, 54, ___", opts:["108","162","108","216"], ans:1, xp:15 },
          { q:"Todos los gatos tienen bigotes. Michi es un gato. Por lo tanto...", opts:["Michi no tiene bigotes","Michi puede tener bigotes","Michi tiene bigotes","No se sabe"], ans:2, xp:15 },
          { q:"¿Qué sigue? 1, 4, 9, 16, ___", opts:["20","25","22","24"], ans:1, xp:10 },
          { q:"Si Andrés tiene 12 canicas y pierde 1/4, ¿cuántas le quedan?", opts:["3","6","9","8"], ans:2, xp:15 },
          { q:"¿Qué sigue? 64, 32, 16, 8, ___", opts:["2","4","6","3"], ans:1, xp:10 },
          { q:"En una fila hay 7 personas. Luisa es la 4ª. ¿Cuántas hay detrás de ella?", opts:["2","3","4","5"], ans:1, xp:10 },
          { q:"Si A > B y B > C, entonces...", opts:["C > A","A > C","B > A","C = A"], ans:1, xp:10 },
          { q:"Un cuadrado tiene perímetro de 20cm. ¿Cuánto mide cada lado?", opts:["4cm","5cm","6cm","10cm"], ans:1, xp:10 },
          { q:"¿Cuántos cuadrados hay en un tablero de 3x3?", opts:["9","12","14","13"], ans:0, xp:15 }
        ],
        sopa:{ words:["LOGICA","PROBLEMA","RAZON","DEDUCCION","PATRON","SECUENCIA","DIAGRAMA","CONJUNTO"], size:9 }
      }
    },

    // ═══════════════════════════════════════════
    // GRADO 4
    // ═══════════════════════════════════════════
    4: {
      matematicas: {
        topics:["Números hasta millones","Múltiplos y divisores","Fracciones avanzadas","Decimales","Estadística y probabilidad","Álgebra básica"],
        quiz:[
          { q:"¿Cuánto es 345 × 12?", opts:["4130","4140","4200","4340"], ans:1, xp:10 },
          { q:"¿Cuál es el MCM de 4 y 6?", opts:["12","8","24","6"], ans:0, xp:15 },
          { q:"¿Cuánto es 3/4 + 1/4?", opts:["4/8","1","3/8","2/4"], ans:1, xp:10 },
          { q:"¿Cuánto es 2.5 + 1.75?", opts:["3.25","4.25","4.75","3.75"], ans:1, xp:10 },
          { q:"¿Cuál es el MCD de 12 y 18?", opts:["3","4","6","9"], ans:2, xp:15 },
          { q:"¿Cuánto es 1.000 × 0.1?", opts:["10","100","1000","0.1"], ans:1, xp:10 },
          { q:"¿Qué es un número primo?", opts:["Divisible solo por 2","Divisible solo por 1 y por sí mismo","Divisible entre 3","Múltiplo de 10"], ans:1, xp:10 },
          { q:"¿Cuánto es el 25% de 200?", opts:["25","50","75","100"], ans:1, xp:10 },
          { q:"Si x + 5 = 12, ¿cuánto es x?", opts:["5","6","7","8"], ans:2, xp:10 },
          { q:"¿Cuánto es 2³?", opts:["6","8","9","12"], ans:1, xp:10 }
        ],
        sopa:{ words:["FRACCION","DECIMAL","PORCENTAJE","MULTIPLO","DIVISOR","PRIMO","ALGEBRA","ECUACION"], size:9 }
      },
      lenguaje: {
        topics:["Literatura colombiana","Figuras literarias","Conectores","Tipos de textos","Conjugación verbal","Comunicación"],
        quiz:[
          { q:"¿Quién escribió 'Cien años de soledad'?", opts:["Álvaro Mutis","Gabriel García Márquez","Tomás González","Piedad Bonnett"], ans:1, xp:10 },
          { q:"¿Qué es una metáfora?", opts:["Comparación con 'como'","Comparación directa sin 'como'","Una pregunta retórica","Una exageración"], ans:1, xp:10 },
          { q:"¿Qué es un símil?", opts:["Comparación usando 'como' o 'cual'","Comparación directa","Un tipo de cuento","Una rima"], ans:0, xp:10 },
          { q:"¿Cuál conector indica causa?", opts:["Pero","Porque","Además","Sin embargo"], ans:1, xp:10 },
          { q:"¿Qué tiempo verbal es 'estudiaré'?", opts:["Presente","Pasado","Futuro","Condicional"], ans:2, xp:10 },
          { q:"¿Qué es la hipérbole?", opts:["Un tipo de metáfora","Una exageración intencional","Una pregunta sin respuesta","Un tipo de rima"], ans:1, xp:10 },
          { q:"¿Cuál es la estructura de un cuento?", opts:["Introducción y final","Inicio, nudo y desenlace","Solo el nudo","Solo el final"], ans:1, xp:10 },
          { q:"¿Cuál texto da instrucciones paso a paso?", opts:["Cuento","Poema","Procedimiento/receta","Noticia"], ans:2, xp:10 },
          { q:"¿Qué es la personificación?", opts:["Describir colores","Dar cualidades humanas a animales o cosas","Un tipo de comparación","Exagerar algo"], ans:1, xp:10 },
          { q:"¿Cuál escritora colombiana escribió 'La vorágine'?", opts:["Tomás Carrasquilla","José Eustasio Rivera","Laura Restrepo","Marvel Moreno"], ans:1, xp:10 }
        ],
        sopa:{ words:["METAFORA","SIMIL","CUENTO","NOVELA","GARCIA","MARQUEZ","COLOMBIA","TEXTO"], size:9 }
      },
      ciencias: {
        topics:["Los seres vivos y clasificación","Genética básica","Reacciones químicas","Energía y sus formas","El universo","Ecología"],
        quiz:[
          { q:"¿Cuántos reinos tiene la clasificación de los seres vivos?", opts:["3","4","5","6"], ans:2, xp:10 },
          { q:"¿Qué es la fotosíntesis?", opts:["Digestión de animales","Proceso para producir alimento usando luz solar","Respiración de plantas","Reproducción de hongos"], ans:1, xp:10 },
          { q:"¿Qué es el ADN?", opts:["Un tipo de proteína","El material genético de los seres vivos","Un tipo de vitamina","Una célula especial"], ans:1, xp:10 },
          { q:"¿Cuántos cromosomas tiene el ser humano?", opts:["23","44","46","48"], ans:2, xp:10 },
          { q:"¿Qué tipo de mezcla es el agua con sal?", opts:["Mezcla heterogénea","Elemento puro","Mezcla homogénea","Compuesto"], ans:2, xp:10 },
          { q:"¿Qué es la energía cinética?", opts:["Energía almacenada","Energía en movimiento","Energía eléctrica","Energía solar"], ans:1, xp:10 },
          { q:"¿Cuántos años luz dista la estrella más cercana (Próxima Centauri)?", opts:["1","2","4","10"], ans:2, xp:10 },
          { q:"¿Qué es la cadena trófica?", opts:["Un tipo de collar","La secuencia de quién come a quién en un ecosistema","Un experimento de química","Un tipo de red"], ans:1, xp:10 },
          { q:"¿Cuál es el gas más abundante en la atmósfera?", opts:["Oxígeno","Dióxido de carbono","Nitrógeno","Hidrógeno"], ans:2, xp:10 },
          { q:"¿Qué es la deforestación?", opts:["Plantar árboles","Tala masiva de bosques","Regar plantas","Sembrar semillas"], ans:1, xp:10 }
        ],
        sopa:{ words:["ECOSISTEMA","ENERGIA","CELULA","GENETICS","PLANETA","ATOMO","ESPECIE","CLIMA"], size:9 }
      },
      sociales: {
        topics:["La economía colombiana","Los derechos humanos","El sistema político","Geografía de Colombia","América Latina","Las civilizaciones antiguas"],
        quiz:[
          { q:"¿Cuántos departamentos tiene Colombia?", opts:["30","32","35","38"], ans:1, xp:10 },
          { q:"¿Cuál es el producto más exportado por Colombia históricamente?", opts:["Petróleo","Esmeraldas","Café","Flores"], ans:2, xp:10 },
          { q:"¿Cuántas ramas del poder público tiene Colombia?", opts:["2","3","4","5"], ans:1, xp:10 },
          { q:"¿Cuál civilización construyó Machu Picchu?", opts:["Azteca","Inca","Maya","Muisca"], ans:1, xp:10 },
          { q:"¿Cuál es el lago navegable más alto del mundo?", opts:["Lago Maracaibo","Lago Titicaca","Laguna de la Cocha","Lago Michigan"], ans:1, xp:10 },
          { q:"¿Qué ciudad de Colombia es Patrimonio de la Humanidad?", opts:["Medellín","Bogotá","Cartagena","Cali"], ans:2, xp:10 },
          { q:"¿Cuántos países limitan con Colombia?", opts:["3","4","5","6"], ans:2, xp:10 },
          { q:"¿Cuál es la cadena montañosa principal de Colombia?", opts:["Los Andes","La Sierra Nevada","La Serranía","El Macizo"], ans:0, xp:10 },
          { q:"¿Qué animal nativo es símbolo de la biodiversidad colombiana?", opts:["El cóndor","La piraña","El jaguar","El tapir"], ans:0, xp:10 },
          { q:"¿Cuál es el PIB principal de Colombia?", opts:["Turismo","Servicios, industria y minería","Solo agricultura","Solo comercio"], ans:1, xp:10 }
        ],
        sopa:{ words:["COLOMBIA","DEPARTAMENTO","CULTURA","ECONOMIA","POLITICA","AMERICA","HISTORIA","TERRITORIO"], size:9 }
      },
      logica: {
        topics:["Álgebra lógica","Problemas complejos","Probabilidad básica","Tablas y gráficas","Razonamiento espacial","Argumentación"],
        quiz:[
          { q:"¿Cuántos cuadrados pequeños hay en un tablero de 4×4?", opts:["12","14","16","18"], ans:2, xp:10 },
          { q:"Si lanzo un dado, ¿cuál es la probabilidad de sacar 6?", opts:["1/3","1/4","1/6","1/2"], ans:2, xp:10 },
          { q:"¿Cuántas diagonales tiene un hexágono?", opts:["6","7","9","12"], ans:2, xp:15 },
          { q:"Si A implica B y B implica C, entonces A implica...", opts:["Solo B","Solo C","A y B","C"], ans:3, xp:10 },
          { q:"¿Qué sigue? 3, 6, 12, 24, ___", opts:["36","42","48","30"], ans:2, xp:10 },
          { q:"Si una bolsa tiene 3 rojas y 2 azules, ¿cuál es la probabilidad de sacar azul?", opts:["1/5","2/5","3/5","1/3"], ans:1, xp:15 },
          { q:"¿Cuántos ángulos tiene un triángulo?", opts:["2","3","4","6"], ans:1, xp:10 },
          { q:"La suma de ángulos de un triángulo es...", opts:["90°","180°","270°","360°"], ans:1, xp:10 },
          { q:"¿Cuántos lados tiene un dodecágono?", opts:["10","11","12","13"], ans:2, xp:10 },
          { q:"¿Qué sigue? F, I, L, O, ___", opts:["P","Q","R","S"], ans:3, xp:10 }
        ],
        sopa:{ words:["ALGEBRA","PROBABILIDAD","DIAGONAL","ANGULO","GRAFICA","DEDUCCION","ARGUMENTO","PATRON"], size:9 }
      }
    },

    // ═══════════════════════════════════════════
    // GRADO 5
    // ═══════════════════════════════════════════
    5: {
      matematicas: {
        topics:["Números enteros","Fracciones complejas","Proporciones y porcentajes","Geometría plana","Estadística","Introducción al álgebra"],
        quiz:[
          { q:"¿Cuánto es -5 + 8?", opts:["-3","3","-13","13"], ans:1, xp:10 },
          { q:"¿Cuánto es 2/3 × 3/4?", opts:["5/7","1/2","6/12","5/12"], ans:1, xp:10 },
          { q:"¿Cuánto es el 30% de 150?", opts:["30","40","45","50"], ans:2, xp:10 },
          { q:"¿Cuánto es -3 × -4?", opts:["-12","12","-7","7"], ans:1, xp:10 },
          { q:"¿Cuánto es la raíz cuadrada de 144?", opts:["10","11","12","13"], ans:2, xp:10 },
          { q:"Si a:b = 3:5 y a=12, ¿cuánto es b?", opts:["15","18","20","25"], ans:2, xp:15 },
          { q:"¿Cuánto mide el área de un triángulo de base 8 y altura 5?", opts:["13","20","40","80"], ans:1, xp:10 },
          { q:"¿Cuánto es 4² + 3²?", opts:["25","12","49","14"], ans:0, xp:10 },
          { q:"¿Cuál es la media de 4, 8, 6, 10?", opts:["6","7","8","9"], ans:1, xp:10 },
          { q:"Resuelve: 2x - 4 = 10", opts:["x=5","x=6","x=7","x=8"], ans:2, xp:15 }
        ],
        sopa:{ words:["ENTERO","FRACCION","PROPORCION","PORCENTAJE","GEOMETRIA","ESTADISTICA","ALGEBRA","ECUACION"], size:10 }
      },
      lenguaje: {
        topics:["Géneros literarios","Literatura latinoamericana","Argumentación","Textos expositivos","Ortografía avanzada","Medios de comunicación"],
        quiz:[
          { q:"¿Cuáles son los tres géneros literarios principales?", opts:["Cuento, novela, poema","Narrativa, lírica, dramática","Historia, ficción, realismo","Comedia, tragedia, cuento"], ans:1, xp:10 },
          { q:"¿Qué es el realismo mágico?", opts:["Un tipo de terror","Literatura donde lo mágico coexiste con lo real","Ciencia ficción latinoamericana","Cuentos de hadas modernos"], ans:1, xp:10 },
          { q:"¿Cuál premio ganó García Márquez?", opts:["Oscar","Nobel de Literatura","Pulitzer","Booker"], ans:1, xp:10 },
          { q:"¿Qué es un texto argumentativo?", opts:["Cuenta una historia","Explica un proceso","Defiende un punto de vista con razones","Describe un lugar"], ans:2, xp:10 },
          { q:"¿Cuándo se usa 'haber' y no 'a ver'?", opts:["Para llamar la atención","Como verbo auxiliar o sustantivo","Como preposición","Para indicar lugar"], ans:1, xp:10 },
          { q:"¿Qué diferencia hay entre 'porque', 'por qué' y 'porqué'?", opts:["No hay diferencia","Causa, pregunta, y sustantivo respectivamente","Solo hay dos formas","Son siempre intercambiables"], ans:1, xp:15 },
          { q:"¿Cuál figura literaria es 'la luna sonríe'?", opts:["Metáfora","Símil","Personificación","Hipérbole"], ans:2, xp:10 },
          { q:"¿Qué es el narrador omnisciente?", opts:["Personaje principal","Narrador que sabe todo sobre los personajes","Narrador que solo cuenta lo que ve","Autor del libro"], ans:1, xp:10 },
          { q:"¿Qué tipo de texto es una noticia?", opts:["Literario","Informativo","Argumentativo","Narrativo de ficción"], ans:1, xp:10 },
          { q:"¿Cuál fue el primer periódico de Colombia?", opts:["El Tiempo","El Colombiano","La Gaceta de Santafé","El Espectador"], ans:2, xp:10 }
        ],
        sopa:{ words:["NARRATIVA","LIRICA","DRAMA","ARGUMENTO","GENERO","LITERATURA","ESCRITURA","COMUNICACION"], size:10 }
      },
      ciencias: {
        topics:["Evolución","Genética y herencia","Química orgánica básica","Física: fuerzas y movimiento","El universo y cosmología","Cambio climático"],
        quiz:[
          { q:"¿Quién propuso la Teoría de la Evolución?", opts:["Isaac Newton","Charles Darwin","Albert Einstein","Louis Pasteur"], ans:1, xp:10 },
          { q:"¿Qué determina el color de ojos?", opts:["La dieta","Los genes heredados","La luz solar","El clima"], ans:1, xp:10 },
          { q:"¿Cuál es la fórmula del agua?", opts:["H2O2","CO2","H2O","NaCl"], ans:2, xp:10 },
          { q:"¿Qué es la inercia?", opts:["La velocidad de un objeto","La tendencia de un objeto a mantener su estado de movimiento","La fuerza de gravedad","La aceleración"], ans:1, xp:10 },
          { q:"¿Qué es un año luz?", opts:["365 días","La distancia que recorre la luz en un año","La velocidad de la luz","La edad de una estrella"], ans:1, xp:10 },
          { q:"¿Cuál es el gas causante principal del efecto invernadero?", opts:["Oxígeno","Nitrógeno","CO2","Hidrógeno"], ans:2, xp:10 },
          { q:"¿Cuántos elementos tiene la tabla periódica actualmente?", opts:["108","110","118","120"], ans:2, xp:10 },
          { q:"¿Qué es la fusión nuclear?", opts:["División de átomos","Unión de núcleos atómicos que libera energía","Mezcla de elementos","Combustión química"], ans:1, xp:10 },
          { q:"¿A qué velocidad viaja la luz?", opts:["300.000 km/s","30.000 km/s","3.000.000 km/s","300 km/s"], ans:0, xp:10 },
          { q:"¿Qué es la biodiversidad?", opts:["Número de países","Variedad de seres vivos en un ecosistema","Tipos de clima","Variedad de minerales"], ans:1, xp:10 }
        ],
        sopa:{ words:["EVOLUCION","GENETICA","QUIMICA","FISICA","UNIVERSO","CLIMA","ESPECIE","CELULA"], size:10 }
      },
      sociales: {
        topics:["La globalización","El desarrollo sostenible","Los conflictos mundiales","La ciudadanía","Colombia en el mundo","Los derechos humanos"],
        quiz:[
          { q:"¿Qué es la globalización?", opts:["La división del mundo en países","La interconexión económica, cultural y política mundial","Solo el comercio internacional","Solo la internet"], ans:1, xp:10 },
          { q:"¿Cuántos países miembros tiene la ONU?", opts:["150","185","193","200"], ans:2, xp:10 },
          { q:"¿Cuál es el objetivo del desarrollo sostenible?", opts:["Desarrollar solo industria","Crecer económicamente sin dañar el planeta","Solo proteger el medioambiente","Solo mejorar la tecnología"], ans:1, xp:10 },
          { q:"¿En qué año se firmaron los Acuerdos de Paz en Colombia?", opts:["2012","2014","2016","2018"], ans:2, xp:10 },
          { q:"¿Cuántos ODS (Objetivos de Desarrollo Sostenible) hay?", opts:["10","15","17","20"], ans:2, xp:10 },
          { q:"¿Qué es la democracia?", opts:["Gobierno de un solo líder","Gobierno del pueblo mediante el voto","Gobierno militar","Gobierno religioso"], ans:1, xp:10 },
          { q:"¿Cuándo se celebra el Día de los Derechos Humanos?", opts:["10 de octubre","10 de noviembre","10 de diciembre","20 de julio"], ans:2, xp:10 },
          { q:"¿Cuál organización internacional vela por los derechos de los niños?", opts:["UNESCO","OMS","UNICEF","FAO"], ans:2, xp:10 },
          { q:"¿Qué es el PIB?", opts:["Promedio de Ingreso Básico","Producto Interno Bruto","Plan de Inversión Básica","Porcentaje de Impuesto Bruto"], ans:1, xp:10 },
          { q:"¿Cuál continente tiene más países?", opts:["América","Asia","Europa","África"], ans:3, xp:10 }
        ],
        sopa:{ words:["GLOBALIZACION","DEMOCRACIA","CIUDADANO","COLOMBIA","NACIONES","DERECHOS","SOSTENIBLE","MUNDO"], size:10 }
      },
      logica: {
        topics:["Lógica formal","Probabilidad","Combinatoria","Geometría analítica","Algoritmos","Pensamiento computacional"],
        quiz:[
          { q:"¿Cuántos resultados posibles tiene lanzar 2 dados?", opts:["12","24","36","30"], ans:2, xp:10 },
          { q:"¿De cuántas formas se pueden ordenar 3 libros?", opts:["3","5","6","9"], ans:2, xp:10 },
          { q:"Si P(A) = 0.4, ¿cuánto es P(no A)?", opts:["0.4","0.5","0.6","0.7"], ans:2, xp:10 },
          { q:"¿Cuántos subconjuntos tiene un conjunto de 3 elementos?", opts:["6","7","8","9"], ans:2, xp:10 },
          { q:"¿Qué es un algoritmo?", opts:["Un tipo de número","Una secuencia de pasos para resolver un problema","Un tipo de geometría","Una fórmula matemática"], ans:1, xp:10 },
          { q:"¿Cuántos cuadrados distintos hay en un tablero de ajedrez 8×8?", opts:["64","100","204","128"], ans:2, xp:15 },
          { q:"¿Cuál es la negación de 'Todos los perros son negros'?", opts:["Ningún perro es negro","Algunos perros no son negros","Los perros son blancos","Todos los perros son blancos"], ans:1, xp:15 },
          { q:"¿Cuántos triángulos hay en un triángulo dividido en 4 partes iguales?", opts:["4","5","6","7"], ans:0, xp:10 },
          { q:"Si hay 5 chicos y 4 chicas, ¿de cuántas formas se puede elegir un equipo de 1 chico y 1 chica?", opts:["9","16","20","24"], ans:2, xp:15 },
          { q:"¿Qué es la inducción matemática?", opts:["Adivinar un resultado","Probar que algo es cierto para todos los casos","Sumar varios números","Dividir en partes"], ans:1, xp:10 }
        ],
        sopa:{ words:["ALGORITMO","PROBABILIDAD","COMBINACION","LOGICA","CONJUNTO","DEDUCCION","PATRON","PROGRAMA"], size:10 }
      }
    }
  },

  achievements: [
    { id:"first_game",    name:"Primera Aventura",   emoji:"🌟", desc:"Completa tu primer juego",           xp:50,  type:"game" },
    { id:"streak_3",      name:"En Racha",            emoji:"🔥", desc:"3 días seguidos estudiando",         xp:100, type:"streak" },
    { id:"streak_7",      name:"Semana Perfecta",     emoji:"⚡", desc:"7 días seguidos estudiando",         xp:250, type:"streak" },
    { id:"streak_30",     name:"Imparable",           emoji:"💎", desc:"30 días seguidos",                   xp:1000,type:"streak" },
    { id:"perfect_quiz",  name:"Perfecto",            emoji:"💯", desc:"100% en un quiz",                    xp:75,  type:"score" },
    { id:"speed_demon",   name:"Rayo",                emoji:"⚡", desc:"Responde en menos de 5 segundos",    xp:50,  type:"speed" },
    { id:"all_subjects",  name:"Explorador",          emoji:"🗺️", desc:"Prueba las 5 materias",             xp:150, type:"explore" },
    { id:"cleo_custom",   name:"Amigo de Cleo",       emoji:"🐶", desc:"Personaliza a Cleo la husky",        xp:30,  type:"custom" },
    { id:"xp_100",        name:"Aprendiz",            emoji:"📚", desc:"Gana 100 XP",                        xp:20,  type:"xp" },
    { id:"xp_500",        name:"Estudiante",          emoji:"🎒", desc:"Gana 500 XP",                        xp:50,  type:"xp" },
    { id:"xp_1000",       name:"Brillante",           emoji:"✨", desc:"Gana 1.000 XP",                      xp:100, type:"xp" },
    { id:"xp_5000",       name:"Genio",               emoji:"🧠", desc:"Gana 5.000 XP",                      xp:500, type:"xp" },
    { id:"first_chest",   name:"Tesoro Encontrado",   emoji:"🏴‍☠️", desc:"Abre tu primer cofre pirata",        xp:40,  type:"chest" },
    { id:"math_master",   name:"Matemático",          emoji:"🔢", desc:"Completa 10 juegos de Matemáticas",  xp:200, type:"subject" },
    { id:"reading_master",name:"Lector Voraz",        emoji:"📖", desc:"Completa 10 juegos de Lenguaje",     xp:200, type:"subject" },
    { id:"science_master",name:"Científico",          emoji:"🔬", desc:"Completa 10 juegos de Ciencias",     xp:200, type:"subject" },
    { id:"night_owl",     name:"Búho Nocturno",       emoji:"🦉", desc:"Estudia después de las 8pm",         xp:30,  type:"time" },
    { id:"early_bird",    name:"Madrugador",          emoji:"🌅", desc:"Estudia antes de las 8am",           xp:30,  type:"time" },
    { id:"premium_user",  name:"VIP Cleduca",         emoji:"👑", desc:"Activa Premium",                     xp:200, type:"premium" },
    { id:"all_grades",    name:"Maestro Total",       emoji:"🏆", desc:"Completa lecciones en 5 grados",     xp:500, type:"special" }
  ],

  skins: [
    { id:"verde",     name:"Cleo Original",   emoji:"🟢", locked:false,  xpRequired:0,    color:"#58CC02" },
    { id:"galaxia",   name:"Cleo Galaxia",    emoji:"💜", locked:true,   xpRequired:200,  color:"#7C3AED" },
    { id:"oceanica",  name:"Cleo Oceánica",   emoji:"🔵", locked:true,   xpRequired:500,  color:"#1CB0F6" },
    { id:"fuego",     name:"Cleo Fuego",      emoji:"🔥", locked:true,   xpRequired:1000, color:"#FF4500" },
    { id:"artica",    name:"Cleo Ártica",     emoji:"❄️", locked:true,   xpRequired:1500, color:"#0EA5E9" },
    { id:"primavera", name:"Cleo Primavera",  emoji:"🌸", locked:true,   xpRequired:2000, color:"#FF6B9D" },
    { id:"dorada",    name:"Cleo Dorada",     emoji:"⭐", locked:true,   xpRequired:5000, color:"#F59E0B" },
    { id:"oscura",    name:"Cleo Sombra",     emoji:"🖤", locked:true,   xpRequired:3000, color:"#374151" }
  ],

  accessories: [
    // Cabeza
    { id:"none",         category:"cabeza", name:"Sin Accesorio",     emoji:"✨", locked:false, xpRequired:0 },
    { id:"hat",          category:"cabeza", name:"Sombrero de Copa",  emoji:"🎩", locked:true,  xpRequired:300 },
    { id:"crown",        category:"cabeza", name:"Corona Real",       emoji:"👑", locked:true,  xpRequired:2500 },
    { id:"pirate",       category:"cabeza", name:"Sombrero Pirata",   emoji:"🏴‍☠️", locked:true, xpRequired:900 },
    { id:"beanie",       category:"cabeza", name:"Gorro de Lana",     emoji:"🧶", locked:true,  xpRequired:450 },
    { id:"ninja",        category:"cabeza", name:"Cinta Ninja",       emoji:"🥷", locked:true,  xpRequired:1500 },

    // Cara
    { id:"glasses",      category:"cara",   name:"Gafas de Sol",      emoji:"🕶️", locked:true,  xpRequired:600 },
    { id:"smart_glasses",category:"cara",   name:"Gafas Sabias",      emoji:"👓", locked:true,  xpRequired:750 },
    { id:"hero_mask",    category:"cara",   name:"Antifaz de Héroe",  emoji:"🎭", locked:true,  xpRequired:1100 },
    { id:"monocle",      category:"cara",   name:"Monóculo",          emoji:"🧐", locked:true,  xpRequired:1800 },
    { id:"star_glasses", category:"cara",   name:"Gafas Estrella",    emoji:"🤩", locked:true,  xpRequired:2000 },

    // Cuerpo
    { id:"bowtie",       category:"cuerpo", name:"Corbatín",          emoji:"🎀", locked:true,  xpRequired:800 },
    { id:"cape",         category:"cuerpo", name:"Capa Mágica",       emoji:"🦸", locked:true,  xpRequired:1200 },
    { id:"explorer",     category:"cuerpo", name:"Chaleco Explorador",emoji:"🦺", locked:true,  xpRequired:1000 },
    { id:"armor",        category:"cuerpo", name:"Armadura Dorada",   emoji:"🛡️", locked:true,  xpRequired:3500 },
    { id:"tutu",         category:"cuerpo", name:"Tutú de Danza",     emoji:"🩰", locked:true,  xpRequired:1600 }
  ],

  themes: [
    { id:"selva",    name:"Selva Verde",    emoji:"🌿", colors:["#58CC02","#89E219"] },
    { id:"oceano",   name:"Océano Azul",    emoji:"🌊", colors:["#1CB0F6","#5ECFFF"] },
    { id:"jardin",   name:"Jardín Rosa",    emoji:"🌸", colors:["#FF6B9D","#FF9DC0"] },
    { id:"volcan",   name:"Volcán Rojo",    emoji:"🔥", colors:["#FF4500","#FF7043"] },
    { id:"noche",    name:"Noche Mágica",   emoji:"🌙", colors:["#7C3AED","#EC4899"] },
    { id:"galaxia",  name:"Galaxia",        emoji:"⭐", colors:["#6366F1","#818CF8"] },
    { id:"desierto", name:"Desierto",       emoji:"🏜️", colors:["#D97706","#F59E0B"] },
    { id:"artico",   name:"Ártico",         emoji:"❄️", colors:["#0EA5E9","#38BDF8"] }
  ],

  cleoMessages: {
    welcome:    ["¡Hola! Soy Cleo, ¡tu husky inteligente! 🐶","¡Bienvenid@ de vuelta! ¡Hoy aprenderemos cosas increíbles! ✨","¡Estaba esperándote! ¿Listo para ser más sabio? 🧠"],
    correct:    ["¡INCREÍBLE! ¡Lo sabías! 🎉","¡Eso estuvo GENIAL! ⭐","¡Correcto! ¡Eres muy inteligente! 🏆","¡PERFECTO! ¡Sigue así! 💪","¡Wow, qué rápido! 🚀"],
    wrong:      ["¡No te preocupes, a seguir intentando! 💪","¡Casi! La respuesta correcta te sorprenderá 🤔","¡Error es parte del aprendizaje! Sigamos 🌟","¡Tranquilo/a! ¡La próxima sí! 😊"],
    levelUp:    ["¡SUBISTE DE NIVEL! ¡Eres una estrella! 🌟⬆️","¡INCREÍBLE! ¡Nuevo nivel desbloqueado! 🏆","¡Lo lograste! ¡Eres más sabio/a que antes! 🧠✨"],
    streak:     ["¡Tu racha sigue! ¡No pares! 🔥🔥","¡Un día más de racha! ¡Imparable! ⚡","¡Estás en fuego! ¡Sigue así! 🔥"],
    noLives:    ["¡Ups! Se acabaron las vidas. ¡Descansa un poco o mira un video! ❤️","¡No te rindas! ¡Recarga tus vidas y vuelve más fuerte! 💪"],
    morning:    ["¡Buenos días! ¡Empecemos el día aprendiendo! ☀️"],
    evening:    ["¡Buenas noches! ¿Una última lección antes de dormir? 🌙"],
    chest:      ["¡Has ganado un cofre del tesoro! ¡Ábrelo para ver tu sorpresa! 🏴‍☠️✨"]
  }
};
