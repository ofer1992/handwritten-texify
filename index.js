import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

async function tex() {

    // Generate LaTeX from image
    const image = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/latex2.png';
    console.log(latex);
    return latex;
}

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;

// Reference the elements that we will need
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const latexContainer = document.getElementById('latex');

// Create a new object detection pipeline
status.textContent = 'Loading model...';
// const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
const texify = await pipeline('image-to-text', 'Xenova/texify');
status.textContent = 'Ready';

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    // Set up a callback when the file is loaded
    reader.onload = function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        imageContainer.appendChild(image);
        detect(e2.target.result);
        // detect(image);
    };
    reader.readAsDataURL(file);
});


// Detect objects in the image
async function detect(img) {
    status.textContent = 'Analysing...';
    const latex = await texify(img, { max_new_tokens: 384 });
    status.textContent = '';
    latexContainer.textContent = latex[0].generated_text;
    console.log(latex);
}

