const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require('fs');
const formidable = require('formidable');

exports.upload = (file, location, req) => {
    const sizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    return new Promise((resolve, reject) => {
        // used for images 
        try {
            const name = req.file.originalname.split('.');
            fs.access("./assets/" + location, (error) => {
                if (error) {
                    fs.mkdirSync("./assets/" + location);
                }
            });
            fs.access("./assets/" + location + "/" + name[0], (error) => {
                if (error) {
                    fs.mkdirSync("./assets/" + location + "/" + name[0]);
                }
            });
            sizes.map((size) => {
                fs.access("./assets/" + location + "/" + name[0] + '/' + size, (error) => {
                    if (error) {
                        fs.mkdirSync("./assets/" + location + "/" + name[0] + '/' + size);
                    }
                });
                sharp(file.buffer).resize(size).jpeg({ mozjpeg: true }).toBuffer().then(data => {
                    const path = `./assets/${location}/${name[0]}/${size}/${name[0]}.jpeg`;
                    const stream = fs.createWriteStream(path);
                    stream.on('open', () => {
                        sharp(data).pipe(stream).on('error', err => {
                            console.log(err);
                        });
                    });
                });
                sharp(file.buffer).resize(size).webp().toBuffer().then(data => {
                    const path = `./assets/${location}/${name[0]}/${size}/${name[0]}.webp`;
                    const stream = fs.createWriteStream(path);
                    stream.on('open', () => {
                        sharp(data).pipe(stream).on('error', err => {
                            console.log(err);
                        });
                    });
                });
                sharp(file.buffer).resize(size).png().toBuffer().then(data => {
                    const path = `./assets/${location}/${name[0]}/${size}/${name[0]}.png`;
                    const stream = fs.createWriteStream(path);
                    stream.on('open', () => {
                        sharp(data).pipe(stream).on('error', err => {
                            console.log(err);
                        });
                    });
                });
            });
            resolve(`${location}/${name[0]}`);
        } catch(error) {
          reject(error);
        }
    });
}