const email = require("../../mail/email");
const mongoose = require('mongoose');
const payments = require('../payment');
const registrationSchema = new mongoose.Schema({
  date: Date,
  tournament: {
    _id: String,
    assets: {
      poster: String
    },
    location: {
      city: String,
      diamond: String,
      province: String,
      FullAddress: String
    },
    dateTime: {
      start: {
        date: String,
        time: String
      },
      end: {
        date: String,
        time: String
      }
    },
    variation: String,
    cost: String,
    tournamentType: String,
    notes: String
  },
  team: {
    team: String,
    captain: String,
    cell: String,
    email: String,
    status: String,
    message: String,
    division: String,
    newTeam: Boolean
  },
  OrderTotal: String
});
const Registration = new mongoose.model("registration", registrationSchema);
exports.model = Registration;

exports.add = (tournament, team) => {
  return new Promise((resolve, reject) => {
    const registration = new Registration({
      date: new Date(),
      tournament: tournament,
      team: team,
      OrderTotal: tournament.cost
    });
    registration.save((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(registration);
      }
    });
  });
}
exports.updateTeamInfo = (id, data) => {
  return new Promise((resolve, reject) => {
    Registration.findByIdAndUpdate(id, {
      "team.team": data.team,
      "team.captain": data.captain,
      "team.cell": data.cell,
      "team.email": data.email,
      "team.message": data.message,
      "team.division": data.division
    }).then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}

// read
  exports.getAll = () => {
    return new Promise((resolve, reject) => {
      Registration.find({}).lean().then((registrations) => {
        resolve(registrations);
      }).catch((error) => {
        reject(error);
      });
    });
  }
exports.get = (query) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      $or: [{
        "tournament.location.city": {
          $regex: query,
          $options: "i"
        }
      },
      {
        "tournament.location.diamond": {
          $regex: query,
          $options: "i"
        }
      },
      {
        "team.team": {
          $regex: query,
          $options: "i"
        }
      },
      {
        "team.captain": {
          $regex: query,
          $options: "i"
        }
      },
      {
        "team.cell": {
          $regex: query,
          $options: "i"
        }
      }
      ]
    }).lean().then((registrations) => {
      resolve(registrations);
    }).catch((error) => {
      reject(error);
    });
  });
}
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Registration.findById(id).then((registration) => {
      resolve(registration);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getById = getById;

exports.getByTournament = (id) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      "tournament._id": id
    }).then((regs) => {
      resolve(regs);
    }).catch((error) => {
      reject(error);
    })
  });
}
const getByUser = (userId) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      "account._id": userId
    }).then((registrations) => {
      resolve(registrations);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByUser = getByUser;
exports.getByTeam = (captain, cell) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      "team.captain": captain,
      "team.cell": cell
    }).then((registrations) => {
      if(registrations.length < 1) {
        resolve([]);
      }
      resolve(registrations);
    }).catch((error) => {
      reject(error);
    });
  });
}



exports.getByEventAndTeam = (eventID, TeamID) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      "tournament._id": eventID,
      "team.cell": TeamID
    }).then((registration) => {
      if (registration.length > 0) {
        resolve(true);
      }
      resolve(false);
    }).catch((error) => {
      reject(error);
    });
  });
}

exports.getByEventAndTeamDivision = (eventId, cell, division) => {
  return new Promise((resolve, reject) => {
    Registration.find({
      "tournament._id": eventId,
      "team.cell": cell,
      "team.division": division 
    }).then((registration) => {
      if (registration.length > 0) {
        resolve(true);
      }
      resolve(false);
    }).catch((error) => {
      reject(error);
    });
  });
}
// update
exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    Registration.findByIdAndUpdate(id, data).then((registration) => {
      resolve(registration);
    }).catch((error) => {
      reject(error);
    })
  });
}

// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Registration.findByIdAndDelete(id).then((registrtaion) => {
      resolve(registrtaion);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.delete = deletes;

exports.deleteByTournamentWithPayments = (id) => {
  return new Promise((resolve, reject) => {
     Registration.find({'tournament._id': id}).then((list) => {
       var error = 0;
       var paymentErrors = 0;
       try {
         list.map(async (reg) => {
           Registration.findByIdAndDelete(reg._id).catch((error) => {
             console.log(error);
             error === true
           });
           try {
            payments.deleteByOrder(reg._id).catch((error) => {
              console.log(error);
              paymentErrors++;
            });
           } catch(error) {
             console.log(error);
           }
         });
         if (error === 0 && paymentErrors === 0) {
           resolve("All registrations and their payments for this tournament were deleted successfully");
           return;
         }
         if (error === 0 && paymentErrors !== 0) {
           resolve(`All registrations for this tournament were deleted successfully. ${paymentErrors} payments where not deleted. Please manually delete those.`);
           return;
         }
         resolve(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where deleted successfilly please try again`);
       } catch (error) {
         reject(`There was an error while trying to delete registrations for this tournament. ${error}`);
       }
     }).catch((error) => {
      reject(error);
     });
  });
}

exports.CheckRegistered = (userId, eventId) => {
  return new Promise((resolve, reject) => {
    Registration.findOne({ 'account._id': userId, 'tournament._id': eventId }).then((reg) => {
      resolve(reg);
    }).catch((error) => {
      reject(error);
    })
  });
}