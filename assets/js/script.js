const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const setBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('load', () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  setBackground();
});

