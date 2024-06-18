import { detect } from './index.js';

const width = 300;
const height = 300;
let stage;
let layer;


// Create stage and layer
stage = new Konva.Stage({
    container: 'canvas',
    width: width,
    height: height,
});
layer = new Konva.Layer();
stage.add(layer);

let canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

let context = canvas.getContext('2d', { willReadFrequently: true });
context.strokeStyle = '#000000';
context.lineJoin = 'round';
context.lineWidth = 3;

// Create a white background rectangle
const whiteBackground = new Konva.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: 'white',
});
layer.add(whiteBackground);

let image = new Konva.Image({
    image: canvas,
    x: 0,
    y: 0,
});
layer.add(image);


let isPaint = false;
let lastPointerPosition;
let mode = 'brush';

// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
image.on('mousedown touchstart', function () {
    isPaint = true;
    lastPointerPosition = stage.getPointerPosition();
});

// will it be better to listen move/end events on the window?

stage.on('mouseup touchend', function () {
    isPaint = false;
});

// and core function - drawing
stage.on('mousemove touchmove', function () {
    if (!isPaint) {
        return;
    }

    if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
    }
    if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
    }
    context.beginPath();

    let localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y(),
    };
    context.moveTo(localPos.x, localPos.y);
    let pos = stage.getPointerPosition();
    localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y(),
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();

    lastPointerPosition = pos;
    // redraw manually
    layer.batchDraw();
});

// var select = document.getElementById('tool');
// select.addEventListener('change', function () {
//     mode = select.value;
// });
// Export canvas as image
document.getElementById('export').addEventListener('click', () => {
    const dataURL = stage.toDataURL({ pixelRatio: 3 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Process canvas image
document.getElementById('from-canvas').addEventListener('click', () => {
    const img = stage.toDataURL({ pixelRatio: 3 });
    detect(img);
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // layer.removeChildren();
    layer.draw();
});