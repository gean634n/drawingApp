const canvasProperties = {
    width: window.innerWidth,
    height: window.innerHeight,
};

myCanvas.width = canvasProperties.width;
myCanvas.height = canvasProperties.height;

const ctx = myCanvas.getContext('2d');
ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

const stageProperties = {
    width: 600,
    height: 480,
    left: canvasProperties.width / 2 - 300,
    top: canvasProperties.height / 2 - 240,
};

ctx.fillStyle = 'white';
ctx.fillRect(
    stageProperties.left,
    stageProperties.top,
    stageProperties.width,
    stageProperties.height,
);
