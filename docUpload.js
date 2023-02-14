const formidable = require('formidable');
const fs = require('fs');

const uploadFile = (req, res, location) => {
  try {
    var folder = String(location);
    return new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, feilds, files) {
        if (err) {
          reject(err);
        }
        var Folderlocation = __dirname + "/assets/" + folder;
        if (!fs.existsSync(Folderlocation)) {
          fs.mkdirSync(Folderlocation, function (err) {
            if (err) {
              reject(err);
            }
          });
        }
        var oldPath = files.filetoupload.filepath;
        var newPath = __dirname + "/assets/" + folder + "/" + files.filetoupload.originalFilename;
        const stream = fs.createWriteStream(newPath);
        const location = fs.createReadStream(oldPath);
        // With the open - event, data will start being written
        // from the request to the stream's destination path
        stream.on('open', () => {
          // res.write(0);
          location.pipe(stream);
        });

        // Drain is fired whenever a data chunk is written.
        // When that happens, print how much data has been written yet.
        stream.on('drain', () => {
          const written = parseInt(stream.bytesWritten);
          const total = parseInt(req.headers['content-length']);
          const pWritten = ((written / total) * 100).toFixed(2);
          // res.write(pWritten);
        });

        // When the stream is finished, print a final message
        // Also, resolve the location of the file to calling function
        stream.on('close', () => {
          // res.write(100);
          resolve(folder + "/" + files.filetoupload.originalFilename);
        });
        // If something goes wrong, reject the primise
        stream.on('error', err => {
          console.log(err);
          reject(err);
        });
      });
    });
  } catch(error) {
    console.log(error);
  }
}
exports.upload = uploadFile;
