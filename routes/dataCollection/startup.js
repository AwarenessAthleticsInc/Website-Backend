const Tournament = require('../../modules/mongoDB/tournament/tournaments');
const Registration = require('../../modules/mongoDB/tournament/registrations');
const Product = require('../../modules/mongoDB/store/products');
const Stock = require('../../modules/mongoDB/store/stock');
const Staff = require('../../modules/mongoDB/staff');
const Toc = require('../../modules/mongoDB/tournament/toc');
const Document = require('../../modules/mongoDB/documents');
const Faq = require('../../modules/mongoDB/faq');
const Cart = require('../../modules/mongoDB/store/cart');

exports.api = (app) => {
    app.route('/api/startup').get(async (req, res) => {
        //get all tournaments

        const tournaments = await Tournament.get('all').then(async (array) => {
            const current = array.filter((item) => {
                const eventDate = new Date(item.dateTime.start.date);
                const today = new Date();
                return eventDate >= today;
            });
            const newArray = await Promise.all(current.map(async (tournament) => {
                const registrations = await Registration.getByTournament(tournament._id);
                return {
                    _id: tournament._id,
                    images: tournament.assets.images,
                    poster: tournament.assets.poster,
                    city: tournament.location.city,
                    diamond: tournament.location.diamond,
                    province: tournament.location.province,
                    address: tournament.location.FullAddress,
                    variation: tournament.variation,
                    cost: tournament.cost,
                    tournamentType: tournament.tournamentType,
                    start: {
                        time: tournament.dateTime.start.time,
                        date: tournament.dateTime.start.date
                    },
                    end: {
                        time: tournament.dateTime.end.time,
                        date: tournament.dateTime.end.date
                    },
                    teams: {
                        min: tournament.teams.Min,
                        max: tournament.teams.Max
                    },
                    EntryDeadline: tournament.dateTime.EntryDeadline,
                    cancellationDate: tournament.dateTime.cancellationDate,
                    Notes: tournament.Notes,
                    status: tournament.status || '',
                    divisions: tournament.divisions,
                    externalLink: tournament.externalLink,
                    convener: tournament.convener,
                    spots: Number(tournament.teams.Max) - Number(registrations.length)
                };
            }));
            return newArray
        });
        const products = await Product.getAll();
        const stock = await Stock.getAll();
        const staff = await Staff.getAll();
        const toc = await Toc.getAll();
        const cart = await Cart.get(req);
        const documents = await Document.getAll();
        const faq = await Faq.getAll();

        res.status(200).send({
            tournaments,
            products,
            stock,
            staff,
            toc,
            cart,
            documents,
            faq
        })
    });
}