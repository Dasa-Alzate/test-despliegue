let preguntas = [];
let modo = "";
let indicePregunta = 0;
let puntaje = 0;

fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    preguntas = data.tema.sort(() => Math.random() - 0.5).slice(0, 20);
  });


function startTest(selectedMode) {
  modo = selectedMode;
  indicePregunta = 0;
  puntaje = 0;
  renderizarPregunta();
}

function renderizarPregunta(tipo) {
  if (indicePregunta >= preguntas.length) {
    document.getElementById("app").innerHTML = `<h2 class='text-xl font-bold'>Test finalizado</h2>
    ${ modo === "multiple" ? `<p class='mt-2'>Puntaje: ${puntaje}/${preguntas.length}</p><p class='mt-2'>${(10*puntaje/preguntas.length).toFixed(2)}</p><br/>` : '' }
    <button onclick="recargarApp()" class='w-full p-2 my-1 bg-amber-400 text-white rounded'>Volver a empezar</button>`;
    return;
  }

  let preguntaActual = preguntas[indicePregunta];
  let contenido = `<h2 class='text-lg font-bold mb-4'>${preguntaActual.pregunta}</h2>`;

  if (modo === "multiple") {
    preguntaActual.respuestas.forEach((resp, i) => {
      contenido += `<button onclick="seleccionarRespuesta(${resp.esCorrecto})" class='w-full p-2 my-1 bg-blue-400 text-white rounded'>${resp.texto}</button>`;
    });
  } else {
    contenido += `<button onclick="mostrarRespuesta()" class='w-full p-2 bg-green-500 text-white rounded'>Ver respuesta</button>`;
  }

  document.getElementById("app").innerHTML = contenido;
}

function seleccionarRespuesta(correcto) {
  if (correcto) puntaje++;
  indicePregunta++;
  renderizarPregunta();
}

function mostrarRespuesta() {
  let respuesta = preguntas[indicePregunta].respuestas.find(r => r.esCorrecto).texto;
  document.getElementById("app").innerHTML = `<h2 class='text-lg font-bold mb-4'>${respuesta}</h2>
  <button onclick="renderizarPregunta()" class='w-full p-2 bg-gray-500 text-white rounded'>Ver pregunta</button>
  <button onclick="siguientePregunta()" class='w-full p-2 mt-2 bg-green-500 text-white rounded'>Siguiente</button>`;
}

function siguientePregunta() {
  indicePregunta++;
  renderizarPregunta();
}

function recargarApp() {
  location.reload();
}