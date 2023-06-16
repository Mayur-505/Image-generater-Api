import { Request, Response } from "express";
import { SendErrorResponse, SendSuccessResponse } from "../services/response";
import { Repository } from "../repository/index.repository";

export class Controller {
    constructor() { }

    // Controller for minting a single nft
    public static mintSingleNFT = async (req: Request, res: Response) => {
        try {
            const results = await Repository.mintSingleNFT(req.body);
            return SendSuccessResponse(res, "Single NFT Minted Successfully!", results, 200);
        } catch (err) {
            return SendErrorResponse(res, "Something went wrong!", err, 500);
        }
    }

    // Controller for minting multiple nfts
    public static mintMultipleNFTs = async (req: Request, res: Response) => {
        try {
            const results = await Repository.mintMultipleNFTs(req.body);
            return SendSuccessResponse(res, "Multiple NFTs Minted Successfully!", results, 200);
        } catch (err) {
            return SendErrorResponse(res, "Something went wrong!", err, 500);
        }
    }

    // Controller for transfer nfts
    public static transferNFT = async (req: Request, res: Response) => {
        try {
            const results = await Repository.transferNFT(req.body);
            return SendSuccessResponse(res, "NFT Transferred Successfully!", results, 200);
        } catch (err) {
            return SendErrorResponse(res, "Something went wrong!", err, 500);
        }
    }

    // Controller for checking owner of nft
    public static ownerOfNFT = async (req: Request, res: Response) => {
        try {
            const results = await Repository.ownerOfNFT(req.body);
            return SendSuccessResponse(res, "Owner of NFT fetched Successfully!", results, 200);
        } catch (err) {
            return SendErrorResponse(res, "Something went wrong!", err, 500);
        }
    }

    // Controller for checking owner of nft
    public static imageGenerate = async (req: Request, res: Response) => {
        try {
            const results = await Repository.imageGenerate(req.body, req?.files);
            // let results = [{
            //     image_url: "https://gateway.pinata.cloud/ipfs/QmZt4PZyCaqyLfcKhziQGsm6nYJUcFY4kh8C3yrj9c5F9t"
            // }]
            res.render("images", { results })
            // return SendSuccessResponse(res, "Ipfs image url created Successfully!", results, 200);
        } catch (err) {
            console.log(err);
            return SendErrorResponse(res, "Something went wrong!", err, 500);
        }
    }
}