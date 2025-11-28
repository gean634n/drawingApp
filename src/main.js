function menuOnClick() {
  document.getElementById("menu-bar").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
  document.getElementById("menu-bg").classList.toggle("change-bg");
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const areaUtil = [
  canvas.width / 2 - 300,
  canvas.height / 2 - 200,
  canvas.width / 2 + 300,
  canvas.height / 2 + 200,
]

const setBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
setBackground()