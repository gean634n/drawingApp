const canvas = document.getElementById('canvas');
const toolBtns = document.querySelectorAll('.tool');


const ctx = canvas.getContext('2d');

let isDrawing = false;
let prevMouseX;
let prevMouseY;

const setBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const draw = {
  start: (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passa a posição atual de X para a variavel prevMauseX
    prevMouseY = e.offsetY; // passa a posição atual de Y para a variavel prevMauseY
    ctx.beginPath(); // cria um novo caminho, ou seja, faz com que cada traço seja independente
    console.log();
  },
  drawing: (e) => {
    if(!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY); // cria linha seguindo o ponteiro do mause
    ctx.stroke(); // desenha a linha
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
    // selectedTool = btn.id;
    console.log(btn.id);
  })
})

canvas.addEventListener('mousedown', draw.start)
canvas.addEventListener('mousemove', draw.drawing)
canvas.addEventListener('mouseup', draw.stop)
