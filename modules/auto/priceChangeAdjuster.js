const Tournament = require("../mongoDB/tournament/events");
const Payment = require("../mongoDB/payment");
const Registration = require('../mongoDB/tournament/registrations');


const adjustPrice = () => {
    Tournament.tournaments.getPastTournaments(3).then((tournaments) => {
        tournaments.map(async (tournament) => {
            if (tournament.status !== 'active') {
                return;
            }
            //active old tournament
            const registrations = await Registration.getByTournament(tournament._id);
            //map registrations to get all related payments and check balances
            registrations.map(async (registration) => {
                if(registration.tournament.cost === tournament.cost) {
                    return;
                }
                let updatedReg = registration;
                updatedReg.cost = tournament.cost
                Registration.update(registration._id, updatedReg).catch((error) => {
                    console.log(error);
                });
            });
            tournament.status = 'Archived';
            await Tournament.tournaments.update(tournament._id, tournament);

        });
        setTimeout(adjustPrice, millisecondsUntilMidnight());
    }).catch((error) => {
        console.error(error);
    });
}

exports.startPriceAdjustTimer = () => {
    setTimeout(adjustPrice, millisecondsUntilMidnight());
}

const millisecondsUntilMidnight = () => {
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return (midnight.getTime() - new Date().getTime()) / 1000 / 60 * 1000;
}