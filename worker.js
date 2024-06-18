// worker.js
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;

let texify;
self.onmessage = async function (e) {
    if (e.data === 'loadModel') {
        self.postMessage({ status: 'Loading model...' });
        texify = await pipeline('image-to-text', 'Xenova/texify', { device: 'webgpu' });
        self.postMessage({ status: 'Model loaded' });
    } else if (e.data.img) {
        self.postMessage({ status: 'Analysing...' });
        const latex = await texify(e.data.img, { max_new_tokens: 384 });
        self.postMessage({ status: 'Done', latex: latex[0].generated_text });
    }
};