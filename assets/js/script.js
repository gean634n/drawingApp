const canvas = document.getElementById('canvas');
const toolBtns = document.querySelectorAll('.tool');


const ctx = canvas.getContext('2d');

let isDrawing = false;
let prevMouseX;
let prevMouseY;
let selectedTool = 'brush';

const setBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawRectangle = (e) => {
  ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
  ctx.beginPath(); // inicia um novo caminho para desenhar o circulo
  // encontrando o raio do circulo de acordo com a posição do mause utilizando 'pitagoras'
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // cria um circulo de acordo com as coordenadas do mause
  ctx.stroke(); // avalia a opção fillColor para saber se o circulo é preenchido ou não
}

const drawTriangle = (e) => {
  console.log('triangulo');
}

const draw = {
  start: (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passa a posição atual de X para a variavel prevMauseX
    prevMouseY = e.offsetY; // passa a posição atual de Y para a variavel prevMauseY
    ctx.beginPath(); // cria um novo caminho, ou seja, faz com que cada traço seja independente
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // copia a tela no exato momento em que o desenho comecar
  },
  drawing: (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); //adiciona a tela copiada a nosso tela (linha 35), necessario para as ferramentas de formas geometricas.

    switch (selectedTool) {
      case 'rectangle':
        drawRectangle(e);
        break;
      case 'circle':
        drawCircle(e);
        break;
      case 'triangle':
        drawTriangle(e);
        break;
      default:
         ctx.lineTo(e.offsetX, e.offsetY); // cria linha seguindo o ponteiro do mause
        ctx.stroke(); // desenha a linha
        break;
    }
  },
  stop: () => isDrawing = false,
}

window.addEventListener('load', () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  setBackground();
});

toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.tool-area .active').classList.remove('active');
    btn.classList.add('active');
    selectedTool = btn.id;
  })
})

canvas.addEventListener('mousedown', draw.start)
canvas.addEventListener('mousemove', draw.drawing)
canvas.addEventListener('mouseup', draw.stop)
