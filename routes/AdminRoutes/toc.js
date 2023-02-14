const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;

const Tournament = require('../../modules/mongoDB/tournament/events');
//admin User Route
exports.api = (app) => {
    app.route('/api/dashboard/toc').get((req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(authenticateToken, async (req, res) => {
        // add new TOC
        var dates = [];
        for (const i in req.body.dates) {
            const tournament = await Tournament.tournaments.getById(req.body.dates[i]).then((events) => {
                return events;
            });
            dates.push(tournament)
        }
        const year = new Date(dates[0].dateTime.start.date).getFullYear();

        Tournament.toc.add(year, req.body.poster, dates, req.body.sections).then((toc) => {
            res.status(200).send("Tournament of champions for the year " + toc.year + " was added successfully!");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to add this Tournament of Champions");
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        Tournament.toc.update(req.body.id, req.body.data).then((toc) => {
            res.status(200).send("This Tournament of Champians was updated successfully");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to get Tournament of champions.")
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        var error = 0;
        try {
            req.body.ids.map((id) => {
                Tournament.toc.delete(id).catch((error) => {
                    console.log(error);
                    error++
                });
            });
            if (error === 0) {
                res.status(200).send("All selected TOCs were deleted successfully");
                return;
            }
            res.status(200).send(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where deleted successfilly please try again`);
        } catch (error) {
            console.log(error);
            res.status(400).send(`There was an error while trying to delete these TOC(s). ${error}`);
        }
    });
}