// Reference the elements that we will need
const status = document.getElementById('status');
const latexContainer = document.getElementById('latex');
const rawLatexContainer = document.getElementById('raw-latex');
const copyButton = document.getElementById('copy-button');


// Create a new worker
const worker = new Worker('worker.js', {type: 'module'});

// Handle messages from the worker
worker.onmessage = function (e) {
    if (e.data.status) {
        status.textContent = e.data.status;
    }
    if (e.data.latex) {
        latexContainer.textContent = e.data.latex;
        rawLatexContainer.textContent = e.data.latex;
        MathJax.typesetPromise([latexContainer]);
    }
};

// Load the model
worker.postMessage('loadModel');

// Function to detect objects in the image
export function detect(img) {
    worker.postMessage({ img: img });
}

// Copy to clipboard function
copyButton.addEventListener('click', () => {
    const text = rawLatexContainer.textContent;
    navigator.clipboard.writeText(text).then(() => {
        // alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});