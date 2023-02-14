const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateConvner = require('../../modules/Oauth/jwt').authenticateConvener;

const Tournament = require('../../modules/mongoDB/tournament/tournaments');
const Registrations = require('../../modules/mongoDB/tournament/registrations');
const Payment = require('../../modules/mongoDB/payment');

exports.api = (app) => {
    app.route('/api/convener/data').get(checkAuthentication, authenticateToken, authenticateConvner, async (req, res) => {
        // get data
        const tournaments = await Tournament.getByConvener(req.session.passport.user).then((array) => {
            return Promise.all(array.map(async (tournament) => {
                const registrations = await Registrations.getByTournament(tournament._id);
                return { ...tournament, spots: Number(tournament.teams.Max) - registrations.length, registrations: registrations }
            }));
        });
        

        res.status(200).send({
            tournaments
        });
    })
}