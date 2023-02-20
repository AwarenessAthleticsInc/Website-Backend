/**
 * Middleware Imports
 */
const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;

/**
 * MongoDB Imports
 */
const Registrations = require('../../modules/mongoDB/tournament/registrations');
const Team = require('../../modules/mongoDB/tournament/teams');
const Order = require('../../modules/mongoDB/store/invoice');
const User = require('../../modules/mongoDB/Users');
const Payment = require('../../modules/mongoDB/payment');

exports.api = (app) => {
    app.route('/api/admin/data').get(checkAuthentication, authenticateToken, authenticateAdmin, async (req, res) => {
        // get data
        const registrations = await Registrations.getAll();
        const teams = await Team.getAll();
        const orders = await Order.get();
        const users = await User.getAll();
        const payments = await Payment.get();
        const registrationGrowth = await calculateRegistrationGrowth(registrations);
        const siteUserGrowth = await calculateSiteUserGrowth(users);
        const teamGrowth = await calculateTeamGrowth(teams);
        res.status(200).send({
            registrations,
            teams,
            orders,
            users,
            payments,
            registrationGrowth,
            siteUserGrowth,
            teamGrowth
        });

    });

    
}
const calculateRegistrationGrowth = (reg) => {
    return new Promise(async (resolve, reject) => {
        // get data
        const year = new Date().getFullYear();
        try {
            const years = [];
            for (var i = 0; i < 5; i++) {
                years.push({
                    0: [], //Jan
                    1: [], // Feb
                    2: [], //Mar
                    3: [], //Apr
                    4: [], //May
                    5: [], //June
                    6: [], //July
                    7: [], //Aug
                    8: [], //Sept
                    9: [], //Oct
                    10: [], //Nov
                    11: [], //Dev
                    12: [] //Other
                });
            }
            const allowedYears = [];
            for (var i = 0; i < 5; i++) {
                const yearDifferance = new Date().getFullYear() - i;
                allowedYears.push(yearDifferance);
            }
            allowedYears.map((yearArray) => {
                reg.map((registration) => {
                    const regStartingDate = new Date(registration.date);
                    const yearIndex = new Date().getFullYear() - yearArray;
                    if (regStartingDate.toDateString() === 'Invalid Date' && yearArray === 2022) {
                        years[yearIndex][12].push(registration);
                        return;
                    }
                    if (regStartingDate.getFullYear() !== yearArray) {
                        return;
                    }
                    years[yearIndex][regStartingDate.getMonth()].push(registration);
                });
            });
            resolve(years)
        } catch (error) {
            reject(error);
        }
    });
};

const calculateSiteUserGrowth = (users) => {
    return new Promise((resolve, reject) => {
        try {
            const years = [];
            for (var i = 0; i < 5; i++) {
                years.push({
                    0: [], //Jan
                    1: [], // Feb
                    2: [], //Mar
                    3: [], //Apr
                    4: [], //May
                    5: [], //June
                    6: [], //July
                    7: [], //Aug
                    8: [], //Sept
                    9: [], //Oct
                    10: [], //Nov
                    11: [], //Dev
                    12: [] //Other
                });
            }
            //get a list of the last 5 years
            const lastFiveYears = [];
            for (var i = 0; i < 5; i++) {
                const yearDifferance = new Date().getFullYear() - i;
                lastFiveYears.push(yearDifferance);
            }
            
            lastFiveYears.map((selectedYear) => {
                users.map((user) => {
                    const StartingDate = new Date(user.startDate);
                    const yearIndex = new Date().getFullYear() - selectedYear;
                    //for all users that were added before this matric was put in place
                    if (StartingDate.toDateString() === 'Invalid Date' && selectedYear === 2022) {
                        years[yearIndex][12].push(user);
                        return;
                    }
                    if (StartingDate.getFullYear() !== selectedYear) {
                        return;
                    }
                    years[yearIndex][StartingDate.getMonth()].push(user);
                });
            });
            resolve(years);
        } catch (error) {
            reject(error);
        }
    });
}

const calculateTeamGrowth = (teams) => {
    return new Promise((resolve, reject) => {
        try {
            const years = [];
            for (var i = 0; i < 5; i++) {
                years.push({
                    0: [], //Jan
                    1: [], // Feb
                    2: [], //Mar
                    3: [], //Apr
                    4: [], //May
                    5: [], //June
                    6: [], //July
                    7: [], //Aug
                    8: [], //Sept
                    9: [], //Oct
                    10: [], //Nov
                    11: [], //Dev
                    12: [] //Other
                });
            }
            //get a list of the last 5 years
            const lastFiveYears = [];
            for (var i = 0; i < 5; i++) {
                const yearDifferance = new Date().getFullYear() - i;
                lastFiveYears.push(yearDifferance);
            }
            
            lastFiveYears.map((selectedYear) => {
                teams.map((team) => {
                    const StartingDate = new Date(team.startDate);
                    const yearIndex = new Date().getFullYear() - selectedYear;
                    if (StartingDate.toDateString() === 'Invalid Date' && selectedYear === 2022) {
                        years[yearIndex][12].push(team);
                        return;
                    }
                    if (StartingDate.getFullYear() !== selectedYear) {
                        return;
                    }
                    years[yearIndex][StartingDate.getMonth()].push(team);
                });
            });
            resolve(years)
        } catch (error) {
            reject(error);
        }
    });
}