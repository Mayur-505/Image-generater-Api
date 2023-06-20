import express from "express";
import { Controller } from "../controller/index.controller";
import { validate } from "express-validation";
import { userValidation } from "../validation";
import { removeBackgrounds } from "../services/imageProcess";
// import { cutImageBackground } from "../services/imageProcess";
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');


const upload = multer();
// const upload = multer({ dest: 'uploads/' });


// Load the pre-trained U-Net model
// async function loadModel() {
//     model = await tf.loadLayersModel(`file://${MODEL_PATH}`);
// }

// // Remove the background from the input image
// async function removeBackground(imageBuffer) {
//     // Load the input image using Sharp
//     const inputImage = await sharp(imageBuffer).toBuffer();

//     // Create a canvas and load the input image onto it
//     const canvas = createCanvas();
//     const ctx = canvas.getContext('2d');
//     const image = await loadImage(inputImage);
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0);

//     // Preprocess the image for input to the U-Net model
//     const inputTensor = tf.browser.fromPixels(canvas).expandDims();
//     const preprocessedInput = inputTensor.div(255.0);

//     // Perform background removal using the U-Net model
//     const segmentation = await model.predict(preprocessedInput);
//     const mask = segmentation.argMax(-1).squeeze();
//     const maskedImage = inputTensor.mul(mask);
//     const outputCanvas = createCanvas();
//     tf.browser.toPixels(maskedImage, outputCanvas);

//     // Convert the output canvas to a Buffer
//     const outputBuffer = await sharp(outputCanvas.toBuffer()).toBuffer();

//     return outputBuffer;
// }

// // Load the model when the server starts
// loadModel().catch(console.error);

// router.post('/remove-background', upload.single('image'), async (req, res) => {
//     try {
//         const { path } = req.file;
//         console.log("🚀 ~ file: index.ts:60 ~ router.post ~ req.file:", req.file)

//         // Read the input image file
//         const inputBuffer = fs.readFileSync(path);

//         // Remove the background from the input image
//         const outputBuffer = await removeBackground(inputBuffer);

//         // Set the appropriate content type and send the response
//         res.type('png').send(outputBuffer);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while removing the background.');
//     }
// });
const { createCanvas, loadImage } = require('canvas');

router.get('/remove-background', async (req, res) => {
    // Get the base64-encoded image data from the request body
    // const { imageData } = req.body;

    // Create a new buffer from the base64-encoded image data
    // const imageBuffer = Buffer.from(imageData, 'base64');

    // try {
    //     // Load the image using `sharp`
    //     const image = sharp("ORANGE1.jpeg");

    //     // Extract the alpha channel of the image
    //     const alphaImage = await image.ensureAlpha().toBuffer();

    //     // Create a new canvas with the same dimensions as the image
    //     const canvas = createCanvas(image.width, image.height);
    //     const context = canvas.getContext('2d');

    //     // Load the alpha image onto the canvas
    //     const img = await loadImage(alphaImage);
    //     context.drawImage(img, 0, 0);

    //     // Set the background color to transparent
    //     context.globalCompositeOperation = 'destination-out';
    //     context.fillStyle = 'rgba(0, 0, 0, 0)';
    //     context.fillRect(0, 0, image.width, image.height);

    //     // Convert the modified canvas back to a buffer
    //     const resultBuffer = canvas.toBuffer("image/png");

    //     // Send the modified image buffer as a response
    //     // res.set('Content-Type', 'image/png');
    //     fs.writeFileSync("outputPath.png", resultBuffer);
    //     // res.send(resultBuffer);

    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('An error occurred during image processing');
    // }
    // try {
    //     // const imagePath = './public/your-image.jpg'; // Update the path to your image file

    //     // Load the image using 'node-canvas'
    //     const image = await loadImage("ORANGE1.jpeg");

    //     // Create a canvas with the same dimensions as the image
    //     const canvas = createCanvas(image.width, image.height);
    //     const ctx = canvas.getContext('2d');

    //     // Draw the image on the canvas
    //     ctx.drawImage(image, 0, 0, image.width, image.height);

    //     // Apply any background removal logic here
    //     // You can use various image processing techniques or libraries for this step

    //     // Example: Set the background to transparent using the 'ctx.globalCompositeOperation' property
    //     ctx.globalCompositeOperation = 'destination-out';
    //     ctx.fillRect(0, 0, image.width, image.height);
    //     const buffer = canvas.toBuffer("image/png");
    //     fs.writeFileSync("./image.png", buffer);
    //     // Convert the modified canvas to a base64-encoded PNG image
    //     const modifiedImage = canvas.toDataURL('image/png');

    //     res.send(`<img src="${modifiedImage}" alt="Modified Image" />`);
    // } catch (error) {
    //     console.error('An error occurred:', error);
    //     res.status(500).send('An error occurred');
    // }
    // removeBackgrounds()
    //     .then(() => {
    //         console.log('Background removed successfully.');
    //     })
    //     .catch((error) => {
    //         console.error('An error occurred:', error);
    //     });
});


router.get("/", (req, res) => {
    // cutImageBackground("strwaberry2.jpeg", "cut.png")
    res.send("hello worlds")
});

// Route for minting a single nft
router.post("/mint/single-nft", Controller.mintSingleNFT);

// Route for minting multiple nfts
router.post("/mint/multi-nft", Controller.mintMultipleNFTs);

// Route for transfering nft
router.post("/transferNFT", Controller.transferNFT);

// Route for checking nft owner
router.post("/ownerOfNFT", Controller.ownerOfNFT);

// Route for ipfs image url generatiom
router.post("/ipfs/imageGenerate", upload.any(), Controller.imageGenerate);

router.get('/image-generate', (req, res) => {
    res.render('index');
});

export default router;