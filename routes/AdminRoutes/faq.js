const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const faq = require('../../modules/mongoDB/faq');

exports.api = (app) => {
    app.route('/api/dashboard/faq').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        faq.add(req.body.faq).then(() => {
            res.status(200).send(`FAQ was added successfully!`);
        }).catch((error) => {
            console.error(error);
            res.status(200).send(`There was an error while trying to add this new FAQ`);
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        faq.update(req.body.id, req.body.faq).then(() => {
            res.status(200).send(`FAQ was updated successfully!`);
        }).catch((error) => {
            console.error(error);
            res.status(200).send(`There was an error while trying to add this new FAQ`);
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        let error = 0;
        req.body.selected.map((id) => {
            faq.delete(id).catch((error) => {
                error++;
                console.log(error);
            });
        });
        if (error === 0) {
            res.status(200).send('All select Faqs were deleted successfully!');
            return;
        }
        res.status(200).send(`${Number(req.body.selected.length - error)} out of ${Number(req.body.selected.length)} were deleted successfully!`);
    });
}