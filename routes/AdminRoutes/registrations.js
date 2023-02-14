const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const users = require('../../modules/mongoDB/Users');
const registrations = require('../../modules/mongoDB/tournament/registrations');

//admin User Route
exports.api = (app) => {
    app.route('/api/dashboard/registrations').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        registrations.get(req.body.query).then((registrations) => {
            res.status(200).send(registrations);
        }).catch((error) => {
            res.status(400).send('There was an error while trying to search registrations');
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        registrations.updateTeamInfo(req.body.id, req.body.team).then((response) => {
            let reg = response;
            reg.team = req.body.team;
            console.log(reg);
            res.status(200).send(reg);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        try {
            req.body.registrations.map((id) => {
                registrations.delete(id).catch(() => {
                    return;
                });
            });
            res.status(200).send('All selected registrations deleted successfully!');
        } catch {
            res.status(400).send('Failed to delete all selected registrations');
        }
    });
}