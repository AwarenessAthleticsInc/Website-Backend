const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;

const tournaments = require('../../modules/mongoDB/tournament/tournaments');
const registrations = require('../../modules/mongoDB/tournament/registrations');

//admin User Route
exports.api = (app) => {
    app.route('/api/dashboard/tournaments').get((req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // search for tournaments and return
        tournaments.get(req.body.query).then((array) => {
            const current = array.filter((item) => {
                const eventDate = new Date(item.dateTime.start.date);
                const today = new Date();
                return eventDate > today;
            })
            res.status(200).send(current);
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new tournament
        tournaments.add(req.body).then((data) => {
            res.status(200).send(`Your tournament in ${data.location.city} at ${data.location.diamond} on ${data.dateTime.start.date} was added successfully!`);
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        var error = 0;
        try {
            req.body.tournaments.map((id) => {
                tournaments.delete(id).catch((err) => {
                    console.log(err);
                    err++
                });
                try {
                    registrations.deleteByTournamentWithPayments(id).catch((err) => {
                        console.log(err);
                        err++
                    });
                } catch (err) {
                    console.log(err);
                }
            });
            if (error === 0) {
                res.status(200).send("All selected tournaments were deleted successfully");
                return;
            }
            res.status(200).send(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where deleted successfilly please try again`);
        } catch (error) {
            res.status(400).send(`There was an error while trying to delete these tournaments. ${error}`);
        }
    });

    app.put('/api/dashboard/tournaments/:id', checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        //update a tournament
        tournaments.update(req.params.id, req.body).then((data) => {
            res.status(200).send(`Your tournament in ${data.location.city} at ${data.location.diamond} on ${data.dateTime.start.date} was updated successfully!`);
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    });
}