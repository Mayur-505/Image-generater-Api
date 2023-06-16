import express from "express";
import { Controller } from "../controller/index.controller";
import { validate } from "express-validation";
import { userValidation } from "../validation";
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
var ImageKit = require("imagekit");
const path = require('path');

const { createCanvas, loadImage } = require('canvas');
// const tf = require('@tensorflow/tfjs');

const upload = multer();
// const upload = multer({ dest: 'uploads/' });

router.post('/remove-background', upload.any(), (req, res) => {
    const inputFilePath = req.files[0].path; // Assuming the file path is passed in the request body

    removeBackground(inputFilePath)
        .then(outputFilePath => {
            res.sendFile(outputFilePath);
        })
        .catch(error => {
            console.error('Error removing background:', error);
            res.status(500).send('Error removing background');
        });
});
async function removeBackground(imagePath) {
    const image = await loadImage(imagePath);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        if (red > 200 && green > 200 && blue > 200 && alpha > 200) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const outputFilePath = path.join(__dirname, 'output.png');
    const outputStream = fs.createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(outputStream);

    return outputFilePath;
}

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


router.get("/s", (req, res) => {

    // var imagekit = new ImageKit({
    //     publicKey: "public_dULmhg3SBiDBUzhjUeZXaBlkwDU=",
    //     privateKey: "private_2UE+5TwmrJ1O3u3rPakEJdoPRes=",
    //     urlEndpoint: "https://ik.imagekit.io/bgremove/"
    // });


    // fs.readFile('images.jpeg', function (err, data) {
    //     if (err) throw err; // Fail if the file can't be read.
    //     imagekit.upload({
    //         file: data, //required
    //         fileName: "my_file_name.jpeg", //required
    //         tags: ["tag1", "tag2"],
    //         // extensions: [
    //         //     {
    //         //         "name": "remove-bg",

    //         //     },

    //         // ]
    //     }, function (error, result) {
    //         if (error) console.log(error);
    //         else console.log(result);
    //     });
    // })
    // let results = [{
    //     image_url: "https://gateway.pinata.cloud/ipfs/QmZt4PZyCaqyLfcKhziQGsm6nYJUcFY4kh8C3yrj9c5F9t",
    //     blockchain: "ggg"
    // }]
    // res.render('images', { results })
    res.send("")
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
// router.post("/ipfs/imageGenerate", Controller.imageGenerate);
// router.post("/ipfs/imageGenerate", upload.any(), validate(userValidation.imageGenerate), Controller.imageGenerate);

router.get('/', (req, res) => {
    res.render('index');
});

export default router;