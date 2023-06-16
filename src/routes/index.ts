import express from "express";
import { Controller } from "../controller/index.controller";
import { validate } from "express-validation";
import { userValidation } from "../validation";
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


router.get("/", (req, res) => {
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