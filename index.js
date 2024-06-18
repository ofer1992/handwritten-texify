// Reference the elements that we will need
const status = document.getElementById('status');
const latexContainer = document.getElementById('latex');

// Create a new worker
const worker = new Worker('worker.js', {type: 'module'});

// Handle messages from the worker
worker.onmessage = function (e) {
    if (e.data.status) {
        status.textContent = e.data.status;
    }
    if (e.data.latex) {
        latexContainer.textContent = e.data.latex;
        MathJax.typesetPromise([latexContainer]);
    }
};

// Load the model
worker.postMessage('loadModel');

// Function to detect objects in the image
export function detect(img) {
    worker.postMessage({ img: img });
}