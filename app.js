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

function renderizarPregunta() {
  if (indicePregunta >= preguntas.length) {
    document.getElementById("app").innerHTML = `<h2 class='text-xl font-bold'>Test finalizado</h2>
    <p class='mt-2'>Puntaje: ${puntaje}/${preguntas.length}</p>`;
    return;
  }

  let preguntaActual = preguntas[indicePregunta];
  let contenido = `<h2 class='text-lg font-bold mb-4'>${preguntaActual.pregunta}</h2>`;

  if (preguntaActual.codigo) {
    contenido += `<div class="codigo bg-gray-800 text-emerald-300 p-4 rounded-md w-full overflow-x-auto sm:overflow-x-hidden"><pre class="whitespace-pre-wrap break-words w-full"><code class="w-full">${preguntaActual.codigo.texto}</code></pre></div>`;
  }

  if (modo === "multiple") {
    preguntaActual.respuestas.forEach((resp, i) => {
      contenido += `<button onclick="seleccionarRespuesta(${resp.esCorrecto}, this)" class='w-full p-2 my-1 bg-blue-400 text-white rounded'>${resp.texto}</button>`;
    });
  } else {
    contenido += `<button onclick="mostrarRespuesta()" class='w-full p-2 bg-green-500 text-white rounded'>Ver respuesta</button>`;
  }

  document.getElementById("app").innerHTML = contenido;
}


function seleccionarRespuesta(correcto, selectedButton) {
  const buttons = document.querySelectorAll("#app button");
  buttons.forEach(button => button.disabled = true);

  const respuestaCorrecta = preguntas[indicePregunta].respuestas.find(r => r.esCorrecto).texto;

  buttons.forEach(button => {
    if (button.textContent === respuestaCorrecta) {
      button.classList.add("bg-emerald-500"); 
    } else if (button === selectedButton && !correcto) {
      button.classList.add("bg-rose-500"); 
    }
  });

  if (correcto) puntaje++;

  const avanzarButton = `<button onclick="avanzarSiguientePregunta()" class='w-full p-2 mt-4 bg-blue-500 text-white rounded'>Siguiente pregunta</button>`;
  document.getElementById("app").innerHTML += avanzarButton;
}

function avanzarSiguientePregunta() {
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
