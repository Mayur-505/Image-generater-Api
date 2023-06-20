
const axios = require("axios");
// const FormData = require("form-data");
import sharp from 'sharp';

const Rembg = require("rembg-node").Rembg;
const fs = require("fs")
const path = require('path');
const FormData = require('form-data');
const { createCanvas, loadImage } = require('canvas');



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


export const combineImages = async (images: Buffer[], outputPath: String, color: any): Promise<string> => {
    const image = await sharp(images[0]);
    const metadata = await image.metadata();
    let imageWidth: number = metadata?.width;
    // let imageHeight: number = Math.ceil(500 / images.length);
    let imageHeight: number = metadata?.height;
    let imageMeasurements = await Promise.all(
        images.map(async (item, index) => {
            try {

                // const image = await sharp(item, { width: 500, height: 150 });
                const image = await sharp(item);
                const metadata = await image.metadata();
                // let imageBuffer = await image.resize(imageWidth, imageHeight).toBuffer() // .resize(600, 400) .toBuffer();
                let imageBuffer = await image.toBuffer() // .resize(600, 400) .toBuffer();
                // fs.writeFileSync(`bgremove${index}.jpeg`, imageBuffer);
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
            const formData = new FormData();
            // formData.append('size', 'full');
            // formData.append('image_file', fs.createReadStream(`bgremove${i}.jpeg`), path.basename(`bgremove${i}.jpeg`));
            // let removedBgImage = await removeBackground(formData, `bgremove${i}.jpeg`)
            // let buffer = await removeBackgrounds(element?.buffer)

            // console.log("🚀 ~ file: imageProcess.ts:72 ~ imageMeasurements.map ~ removedBgImage:", removedBgImage)
            // let imageBuffer = await sharp(element?.buffer)
            //     .resize(imageWidth, imageHeight)
            // //     .toBuffer();
            // let input = sharp(element?.buffer)
            // const image = await sharp(element?.buffer)
            //     .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
            //     .toFile("outputImagePath.png");


            // const rembg = new Rembg({
            //     logging: true,
            // });

            // const output = await rembg.remove(input);
            // let imageRm = await output.webp().toBuffer()
            compositeArray.push({
                input: element?.buffer,
                gravity: 'north',
                // top: i > 0 ? i * imageHeight - 40 : i * imageHeight,
                top: 0,
                left: 0
            });
        })
    );


    const compositeBuffer = await sharp({
        create: {
            width: imageWidth,
            // height: imageMeasurements.reduce((sum, item) => sum + item?.height, 0) + 20 * images.length,
            height: imageHeight,
            // height: 500,
            channels: 4,
            background: color
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


export const removeBackground = (formData, outputPath, apiKey) => {
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
            'X-Api-Key': apiKey,
            ...formData.getHeaders(),
        },
        encoding: null
    };

    return axios.request(config)
        .then((response) => {
            if (response.status != 200) return console.error('Error:', response.status, response.statusText);
            return response.data
        })
        .catch((error) => {
            throw error
            return console.error('Request failed:', error);
        });
}



export async function removeBackgrounds(buffer) {
    // Load the image using 'node-canvas'
    const image = await loadImage(buffer);

    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const { data, width, height } = imageData;

    // Define the background color to remove
    const redThreshold = 200;
    const greenThreshold = 200;
    const blueThreshold = 200;
    const alphaThreshold = 100;

    // Iterate over each pixel and check if it falls within the background color range
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        // Check if the pixel color is within the background color range
        if (
            red >= redThreshold &&
            green >= greenThreshold &&
            blue >= blueThreshold &&
            alpha >= alphaThreshold
        ) {
            // Set the alpha value (transparency) to 0 for background pixels
            data[i + 3] = 0;
        }
    }

    // Update the image data with the modified pixel values
    ctx.putImageData(imageData, 0, 0);
    const imageBuffer = canvas.toBuffer('image/png');

    return imageBuffer;
    // Save the modified image to a file
    // const outputStream = fs.createWriteStream(`outputImagePath${Math.random()}.png`);
    // const stream = canvas.createPNGStream();
    // stream.pipe(outputStream);

    // return new Promise((resolve, reject) => {
    //     outputStream.on('finish', resolve);
    //     outputStream.on('error', reject);
    // });
}

