const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const docs = require('../../modules/mongoDB/documents');

exports.api = (app) => {
    app.route('/api/dashboard/info').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        docs.add(req.body.doc).then(() => {
            res.status(200).send('You document was uploaded successfully!');
        }).catch((error) => {
            console.error(error);
            res.status(400).send('Failed to upload your document!');
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        docs.update(req.body.id, req.body.doc).then(() => {
            res.status(200).send('You document was updated successfully!');
        }).catch((error) => {
            console.error(error);
            res.status(400).send('Failed to update your document!');
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        let errors = 0;
        req.body.selected.map((id) => {
            docs.delete(id).catch((error) => {
                errors++;
                console.error(error);
            });
        });
        if (errors === 0) {
            res.status(200).send('All selected documents were deleted successfully!');
            return;
        }
        res.status(200).send(`${Number(req.body.selected.length - errors)} out of ${req.body.selected.length} were deleted successfully!`);
    });
}