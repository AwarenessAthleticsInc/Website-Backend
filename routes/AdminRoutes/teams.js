const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const teams = require('../../modules/mongoDB/tournament/teams');
//admin User Route
exports.api = (app) => {
    app.route('/api/dashboard/teams').get((req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        teams.get(req.body.query).then((teams) => {
            res.status(200).send(teams);
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Failed to search teams");
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        teams.update(req.body.id, req.body.team.team, req.body.team.captain, req.body.team.cell, req.body.team.email, req.body.team.status).then(() => {
            res.status(200).send(`The team ${req.body.team.team} was updated successfully!`);
        }).catch((error) => {
            console.error(error);
            res.status(400).send('There was an error while trying to update this team');
        })
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        try {
            req.body.teams.map((id) => {
                teams.delete(id).then(() => {
                    return;
                }).catch((error) => {
                    console.log(error);
                });
            });
            res.status(200).send('All selected team(s) were deleted successfully!');
        } catch (error) {
            res.status(400).send("Failed to delete all team(s) selected");
        }
    });
}