import {detect} from './index.js'

const width = 800;
const height = 300;

const stage = new Konva.Stage({
    container: 'canvas',
    width: width,
    height: height,
});

const layer = new Konva.Layer();
stage.add(layer);

let isDrawing = false;
let currentLine;

stage.on('mousedown touchstart', (e) => {
    isDrawing = true;
    const pos = stage.getPointerPosition();
    currentLine = new Konva.Line({
        stroke: 'black',
        strokeWidth: 2,
        globalCompositeOperation: 'source-over',
        lineCap: 'round',
        lineJoin: 'round',
        points: [pos.x, pos.y],
    });
    layer.add(currentLine);
});

stage.on('mousemove touchmove', (e) => {
    if (!isDrawing) return;
    const pos = stage.getPointerPosition();
    const newPoints = currentLine.points().concat([pos.x, pos.y]);
    currentLine.points(newPoints);
    layer.batchDraw();
});

stage.on('mouseup touchend', () => {
    isDrawing = false;
});

function createImage() {
    const whiteBackground = new Konva.Rect({
        width: stage.width(),
        height: stage.height(),
        fill: 'white',
    });

    // Add the white background and move it to the back
    layer.add(whiteBackground);
    whiteBackground.moveToBottom();
    const dataURL = stage.toDataURL({ pixelRatio: 3 });
    return dataURL;
}
document.getElementById('export').addEventListener('click', () => {
    const whiteBackground = new Konva.Rect({
        width: stage.width(),
        height: stage.height(),
        fill: 'white',
    });

    // Add the white background and move it to the back
    layer.add(whiteBackground);
    whiteBackground.moveToBottom();
    const dataURL = stage.toDataURL({ pixelRatio: 3 });
    // Remove the white background after exporting
    whiteBackground.remove();
    layer.draw();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('from-canvas').addEventListener('click', () => {
    const img = createImage();
    detect(img);
});

document.getElementById('clear').addEventListener('click', () => {
    layer.removeChildren();
    layer.draw();
});