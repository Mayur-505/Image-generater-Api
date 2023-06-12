
const axios = require("axios");
// const FormData = require("form-data");
import sharp from 'sharp';

const Rembg = require("rembg-node").Rembg;
const fs = require("fs")



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


export const combineImages = async (images: Buffer[]): Promise<string> => {
    console.log("🚀 ~ file: imageProcess.ts:38 ~ combineImages ~ images:", images)
    let imageWidth: number = 800;
    let imageHeight: number = 600;
    let imageMeasurements = await Promise.all(
        images.map(async (item) => {
            try {
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
    console.log("🚀 ~ file: imageProcess.ts:54 ~ combineImages ~ imageMeasurements:", imageMeasurements)
    // let imageWidth: number = Math.ceil(Math.max(...imageMeasurements.map(image => image?.width))) + 300
    // let imageHeight: number = Math.ceil(Math.max(...imageMeasurements.map(image => image?.height)))

    let compositeArray: sharp.OverlayOptions[] = [];

    await Promise.all(
        imageMeasurements.map(async (element, i) => {
            // let imageBuffer = await sharp(element?.buffer)
            //     .resize(imageWidth, imageHeight)
            //     .toBuffer();
            let input = sharp(element?.buffer)

            const rembg = new Rembg({
                logging: true,
            });
            console.log("🚀 ~ file: imageProcess.ts:66 ~ imageMeasurements.map ~ input:", input)

            const output = await rembg.remove(input);
            console.log("🚀 ~ file: imageProcess.ts:72 ~ imageMeasurements.map ~ output:", output)
            // let imageRm = await output.webp().toBuffer()
            compositeArray.push({
                input: element?.buffer,
                gravity: 'north',
                top: i * imageHeight + 50,
                left: 100
            });
            console.log("🚀 ~ file: imageProcess.ts:81 ~ imageMeasurements.map ~ compositeArray:", compositeArray)
        })
    );

    console.log("🚀 ~ file: imageProcess.ts:59 ~ combineImages ~ compositeArray:", compositeArray)

    const compositeBuffer = await sharp({
        create: {
            width: imageWidth + 200,
            // height: imageMeasurements.reduce((sum, item) => sum + item?.height, 0) + 20 * images.length,
            height: imageHeight * images.length + 50 * images.length,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(compositeArray)
        .jpeg()
        .toBuffer();
    console.log("🚀 ~ file: imageProcess.ts:109 ~ combineImages ~ compositeArray:", compositeArray)

    return await new Promise<string>((resolve, reject) => {
        fs.writeFile("output.jpeg", compositeBuffer, (error) => {
            if (error) {
                console.log("🚀 ~ file: imageProcess.ts:103 ~ fs.writeFile ~ error:", error)
                reject(error);
            } else {
                resolve("output.webp");
            }
        });
    });
};
