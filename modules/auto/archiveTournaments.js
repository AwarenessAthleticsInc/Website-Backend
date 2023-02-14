const Tournament = require("../mongoDB/tournament/events");
const Payment = require("../mongoDB/payment");
const Registration = require('../mongoDB/tournament/registrations');


const archiveTournaments = () => {
    Tournament.tournaments.getPastTournaments(3).then((tournaments) => {
        tournaments.map(async (tournament) => {
            if (tournament.status !== 'active') {
                return;
            }
            //active old tournament
            const registrations = await Registration.getByTournament(tournament._id);
            //map registrations to get all related payments and check balances
            registrations.map(async (registration) => {
                const payments = await Payment.getByOrder(registration._id);
                let balance = Number(registration.OrderTotal);
                payments.map((payment) => {
                    balance -= payment.amount
                });
                if (balance === 0) {
                    return;
                }
                //add a payment for the remaining balance
                await Payment.add(registration._id, `Archive-${registration._id}`, 'PAID', balance, 'CAD', new Date().toTimeString(), 'Cash').then((payment) => {
                    return
                }).catch((error) => {
                    console.error(error);
                });
            });
            tournament.status = 'Archived';
            await Tournament.tournaments.update(tournament._id, tournament);
            
        });
        setTimeout(archiveTournaments, millisecondsUntilMidnight());
    }).catch((error) => {
        console.error(error);
    }); 
}

exports.startArchiveTimer = () => {
    setTimeout(archiveTournaments, millisecondsUntilMidnight());
}

const millisecondsUntilMidnight = () => {
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return (midnight.getTime() - new Date().getTime()) / 1000 / 60 * 1000;
}