const canvas = document.getElementById('canvas');
const toolBtns = document.querySelectorAll('.tool');
const colorBtns = document.querySelectorAll('.options .option');
// const colorPicker = document.getElementById('color-picker');
// const choiceBtn = document.getElementById('choice');
const clearButton = document.getElementById('clear');
const sizeSlider = document.getElementById('size-slider');
const erazer = document.getElementById('eraser');
const save = document.getElementById('save');

// choiceBtn.style.backgroundColor = '#008000';

// const ctx = canvas.getContext('2d');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let history = [];
let historyStep = -1;
let snapshot = null;
let isDrawing = false;
let prevMouseX;
let prevMouseY;
let selectedTool = 'brush';
let selectedColor = 'Black';
let backgroundColor = '#fff'


const setBackground = () => {
  ctx.fillStyle = backgroundColor;
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
  ctx.beginPath(); // inicia um novo caminho para desenhar o triangulo
  ctx.moveTo(prevMouseX, prevMouseY) // move o mause para o inicio do triangulo
  ctx.lineTo(e.offsetX, e.offsetY); // cria a primeira linha de acordo com a posição do mause
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // cria a linha de baixo do triangulo
  ctx.closePath(); // fecha altomaticamento o triangulo
  ctx.stroke();
}

const draw = {
  start: (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passa a posição atual de X para a variavel prevMauseX
    prevMouseY = e.offsetY; // passa a posição atual de Y para a variavel prevMauseY
    ctx.strokeStyle = selectedColor
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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
  stop: () => {
    if (!isDrawing) return;
    isDrawing = false;

    // Salvar estado no histórico
    history = history.slice(0, historyStep + 1);  // limpa redo
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyStep++;
  },
}

window.addEventListener('load', () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  setBackground();

  // Salvar estado inicial
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  historyStep = 0;
});

toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.tool-area .active').classList.remove('active');
    btn.classList.add('active');
    selectedTool = btn.id;
    console.log(toolBtns[4]);
    
  })
})

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.selected').classList.remove('selected');
    toolBtns[4].classList.remove('active');
    toolBtns[3].classList.add('active');
    btn.classList.add('selected');
    if (btn.id != 'choice') {
      selectedColor = btn.id;
      console.log(btn.id);
    } else {
      selectedColor = document.getElementById('color-picker').value;
    }
  })
})

// const chanceByColorPiker = (e) => {
//   selectedColor = colorPicker.value;

//   // Remover selected dos botões e deixar "choice" como selecionado
//   document.querySelector('.options .selected')?.classList.remove('selected');

//   choiceBtn.classList.add('selected');
//   choiceBtn.style.backgroundColor = colorPicker.value;
// }

const undo = (e) => {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    if (historyStep <= 0) return; // nada para desfazer

    historyStep--;
    ctx.putImageData(history[historyStep], 0, 0);
  }
}

const exportPNG = () => {
  const link = document.createElement('a');

  // Nome do arquivo — você pode personalizar
  link.download = 'desenho.png';

  // Converte o canvas em URL base64
  link.href = canvas.toDataURL('image/png');

  // Aciona o download
  link.click();
}


canvas.addEventListener('mousedown', draw.start)
canvas.addEventListener('mousemove', draw.drawing)
document.addEventListener('mouseup', draw.stop)
clearButton.addEventListener('click', setBackground)
// colorPicker.addEventListener('input', chanceByColorPiker)
sizeSlider.addEventListener('input', (e) => ctx.lineWidth = e.target.value)
document.addEventListener('keydown', undo)
erazer.addEventListener('click', () => selectedColor = backgroundColor)
save.addEventListener('click', exportPNG)
