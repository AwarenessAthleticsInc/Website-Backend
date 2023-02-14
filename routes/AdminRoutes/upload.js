const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;

exports.api = (app) => {
    const multer = require("multer");
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    const uploadImage = require('../../upload'); //is for images
    const uploadDocument = require('../../docUpload'); //is for documents

    app.route('/api/uploadImage/:location').post(upload.single("filetoupload"), checkAuthentication, authenticateToken, (req, res) => {
        // get data
        uploadImage.upload(req.file, req.params.location, req).then((path) => {
            res.status(200).send(path);
            res.end();
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Couldn't upload your file");
        });
    });
    app.post("/api/uploadFile/:location", checkAuthentication, authenticateToken, (req, res) => {
        uploadDocument.upload(req, res, req.params.location).then((path) => {
            res.status(200).send(path);
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Couldn't upload your file");
        });
    });
}