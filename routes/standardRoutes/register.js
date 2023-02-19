const Registration = require('../../modules/mongoDB/tournament/registrations');
const Tournament = require("../../modules/mongoDB/tournament/events");
const Payment = require('../../modules/mongoDB/payment');
const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const email = require('../../modules/mail/email');

exports.api = (app) => {
    app.route('/api/register').post(async (req, res) => {
        const data = req.body.data ? req.body.data : req.body;
        // add new registration
        const team = {
            team: data.team,
            captain: data.captain,
            cell: data.cell,
            email: data.email,
            status: data.status,
            message: data.comments,
            division: data.division,
            newTeam: data.newTeam
        }
        //does team exist ?
        const tournament = await Tournament.tournaments.getById(data.tournamentId);
        console.log(tournament);
        // false means not new true means new
        const check = await Tournament.registrations.getByEventAndTeam(tournament._id, team.cell).then((events) => {
            for (var i = 0; i < events.length; i++) {
                if (!events[i].team.division) {
                    return false;
                }
                if (events[i].team.division === team.division) {
                    return false;
                }
            }
            return true;
        }).catch((error) => {
            return true;
        });
        if (check === false) {
            res.status(412).send("Your team as already registered for this event(and/or division)");
        } else {
            // register the new team
            if (team.status.includes("new")) {
                const data_team = {
                    team: team.team,
                    captain: team.captain,
                    cell: team.cell,
                    email: team.email,
                    status: "Good",
                    message: team.message,
                    division: team.division,
                    startDate: new Date()
                }
                Tournament.teams.add(data_team);
            }
            Tournament.registrations.add(tournament, team).then((registration) => {
                try {
                    if (process.env.NODE_ENV !== 'development') {
                        email.EmailTournamentReceipt(registration);
                        email.EmailTournamentNotification(registration);
                    }
                } catch (error) {
                    console.log(error);
                }
                if (data.payment) {
                    // add payment
                    try {
                        Payment.add(registration._id, data.payment.id, data.payment.status, data.payment.purchase_units[0].amount.value, data.payment.purchase_units[0].amount.currency_code, data.payment.create_time, "paypal");
                    } catch (error) {
                        email.sendEmail("emma@spfacanada.ca", "Payment error on line 71 routes/registration.js", error, error);
                    }
                }
                res.status(200).send('"' + team.team + '" was registered ! Invoice: ' + registration._id);
            }).catch((error) => {
                console.log(error);
                res.status(400).send("There was an unexpected error while trying to register your team");
            });
        }
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update many registrations
        const idArray = req.body.registrations;
        idArray.map(async (id) => {
            //function here!!!*******************************************************
            Registration.update(id, req.body.data).then(() => {
                res.status(200).send("all registrations have been updated!");
            }).catch((error) => {
                res.status(401).send("There was and error while trying to complete this task");
            });
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete many registrations
        const idArray = req.body.tournaments;
        idArray.map(async (id) => {
            await istion.delete(id);
        });
        res.status(200).send("All selected registrations where deleted successfully!");
    });
    
    app.post('/api/registrationCheck/withoutDivision', (req, res) => {
        Registration.getByEventAndTeam(req.body.eventId, req.body.cell).then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            console.log(error);
            res.status(200).send(false);
        })
    });
    app.post('/api/registrationCheck/withDivision', (req, res) => {
        Registration.getByEventAndTeamDivision(req.body.eventId, req.body.cell, req.body.division).then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            console.log(error);
            res.status(200).send(false);
        })
    });

    app.post('/api/registrations/byUser', (req, res) => {
        Registration.getByTeam(req.body.captain, req.body.cell).then((events) => {
            res.status(200).send(events);
        }).catch((error) => {
            console.log(error);
            res.status(404).send("Nothing found");
        })
    });
}