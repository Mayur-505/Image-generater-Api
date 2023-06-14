import express from "express";
import { Controller } from "../controller/index.controller";
import { validate } from "express-validation";
import { userValidation } from "../validation";
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
var ImageKit = require("imagekit");
const upload = multer();


router.get("/", (req, res) => {

    var imagekit = new ImageKit({
        publicKey: "public_dULmhg3SBiDBUzhjUeZXaBlkwDU=",
        privateKey: "private_2UE+5TwmrJ1O3u3rPakEJdoPRes=",
        urlEndpoint: "https://ik.imagekit.io/bgremove/"
    });


    fs.readFile('images.jpeg', function (err, data) {
        if (err) throw err; // Fail if the file can't be read.
        imagekit.upload({
            file: data, //required
            fileName: "my_file_name.jpeg", //required
            tags: ["tag1", "tag2"],
            // extensions: [
            //     {
            //         "name": "remove-bg",

            //     },

            // ]
        }, function (error, result) {
            if (error) console.log(error);
            else console.log(result);
        });
    })
    res.send("hello world")
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
// router.post("/ipfs/imageGenerate", upload.any(), validate(userValidation.imageGenerate), Controller.imageGenerate);

router.get('/image-generate', (req, res) => {
    res.render('index');
});

export default router;