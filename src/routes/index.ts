import express from "express";
import { Controller } from "../controller/index.controller";
import { validate } from "express-validation";
import { userValidation } from "../validation";
const router = express.Router();
const multer = require('multer');
const upload = multer();


router.get("/", (req, res) => {
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