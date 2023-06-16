
const axios = require("axios");
// const FormData = require("form-data");
import sharp from 'sharp';

const Rembg = require("rembg-node").Rembg;
const fs = require("fs")
const path = require('path');



export const uploadToPinata = (data) => {
    // const formData = new FormData();
    // var formData = multipart();

    const JWT = `Bearer ${process.env.PINATA_JWT_SECRET}`

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.PINATA_API_URL}pinning/pinFileToIPFS`,
        headers: {
            'Authorization': JWT,
            ...data.getHeaders()
        },
        data: data
    };

    return axios.request(config)
        .then((response) => response?.data)
        .catch((error) => {
            console.log(error);
            throw error
        });
}


export const combineImages = async (images: Buffer[], outputPath: String): Promise<string> => {
    let imageWidth: number = 500;
    // let imageHeight: number = Math.ceil(500 / images.length);
    let imageHeight: number = 400
    let imageMeasurements = await Promise.all(
        images.map(async (item) => {
            try {
                // const image = await sharp(item, { width: 500, height: 150 });
                const image = await sharp(item);
                const metadata = await image.metadata();
                let imageBuffer = await image.resize(imageWidth, imageHeight).toBuffer() // .resize(600, 400) .toBuffer();
                return { width: metadata.width, height: metadata.height, buffer: imageBuffer };
            } catch (error) {
                console.error(error);
                return null;
            }
        })
    );
    // let imageWidth: number = Math.ceil(Math.max(...imageMeasurements.map(image => image?.width))) + 300
    // let imageHeight: number = Math.ceil(Math.max(...imageMeasurements.map(image => image?.height)))

    let compositeArray: sharp.OverlayOptions[] = [];

    await Promise.all(
        imageMeasurements.map(async (element, i) => {
            // let imageBuffer = await sharp(element?.buffer)
            //     .resize(imageWidth, imageHeight)
            //     .toBuffer();
            let input = sharp(element?.buffer)
            const image = await sharp(element?.buffer)
                .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toFile("outputImagePath.png");


            // const rembg = new Rembg({
            //     logging: true,
            // });

            // const output = await rembg.remove(input);
            // let imageRm = await output.webp().toBuffer()
            compositeArray.push({
                input: element?.buffer,
                gravity: 'north',
                top: i * imageHeight + 50,
                left: 100
            });
        })
    );


    const compositeBuffer = await sharp({
        create: {
            width: imageWidth + 200,
            // height: imageMeasurements.reduce((sum, item) => sum + item?.height, 0) + 20 * images.length,
            height: imageHeight * images.length + 50 * images.length,
            // height: 500,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(compositeArray)
        .jpeg()
        .toBuffer();

    return await new Promise<string>((resolve, reject) => {
        fs.writeFile(outputPath, compositeBuffer, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve("output.webp");
            }
        });
    });
};


export const removeBackground = (formData, outputPath) => {
    // const inputPath = '/path/to/file.jpg';



    // axios({
    //     method: 'post',
    //     url: process.env.BGREMOVE_API_URL,
    //     data: formData,
    //     responseType: 'arraybuffer',
    //     headers: {
    //         ...formData.getHeaders(),
    //         'X-Api-Key': process.env.BGREMOVE_API_KEY
    //     },
    //     encoding: null
    // })

    let config = {
        method: 'post',
        url: process.env.BGREMOVE_API_URL,
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            'X-Api-Key': process.env.BGREMOVE_API_KEY,
            ...formData.getHeaders(),
        },
        encoding: null
    };

    return axios.request(config)
        .then((response) => {
            if (response.status != 200) return console.error('Error:', response.status, response.statusText);
            fs.writeFileSync(outputPath, response.data);
            return response.data
        })
        .catch((error) => {
            return console.error('Request failed:', error);
        });
}