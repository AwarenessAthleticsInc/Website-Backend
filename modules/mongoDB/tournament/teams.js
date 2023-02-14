const mongoose = require('mongoose');
const teamsSchema = new mongoose.Schema({
  team: String,
  captain: String,
  cell: String,
  email: String,
  status: String
});
const Team = mongoose.model("Team", teamsSchema);

// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const team = new Team(data);
    team.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(team);
  });
}
exports.add = add;
exports.addWithUserId = (userId, team, captain, cell, email) => {
  return new Promise((resolve, reject) => {
    const newTeam = Team({
      userID: userId,
      team: team,
      captain: captain,
      cell: cell,
      email: email,
      status: "new"
    });
    newTeam.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(newTeam);
  })
}
// read
exports.get = (query) => {
  return new Promise((resolve, reject) => {
    Team.find({
      $or: [
        {
          team: {
            $regex: query,
            $options: "i"
          }
        },
        {
          captain: {
            $regex: query,
            $options: "i"
          }
        },
        {
          cell: {
            $regex: query,
            $options: "i"
          }
        },
        {
          email: {
            $regex: query,
            $options: "i"
          }
        },
        {
          status: {
            $regex: query,
            $options: "i"
          }
        },
      ]
    }).then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    })
  });
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("captain").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getAll = getAll;
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Team.findById(id).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getById = getById;

exports.getByCapCell = (captain, cell) => {
  var teamArray = [];
  return new Promise((resolve, reject) => {
    Team.findOne({captain: captain, cell: cell}).then((team) => {
      teamArray.push(team);
      resolve(teamArray);
    }).catch((error) => {
      console.log(error);
      resolve(teamArray);
    })
  })
}


exports.getByData = (data) => {
  return new Promise((resolve, reject) => {
    Team.findOne({
      captain: data.captain,
      cell: data.cell
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    })
  })
}

exports.find = (data) => {
  return new Promise((resolve, reject) => {
  Team.findOne({
    captain: data.captain,
    cell: data.cell
  }).then((list) => {
    if(list.length < 1) {
      resolve(false);
    }
    if(!list.userID) {
      resolve(list);
    }
    resolve(false);
  }).catch((error) => {
    reject(false);
  })
});
}
//sort
const getSortedByName = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("team").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getSortedByName = getSortedByName;
const getSortedByCaptain = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("captain").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getSortedByCaptain = getSortedByCaptain;
const getSortedByCell = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("cell").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getSortedByCell = getSortedByCell;
const getSortedByEmail = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("email").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getSortedByEmail = getSortedByEmail;
const getSortedByStatus = () => {
  return new Promise((resolve, reject) => {
    Team.find({}).sort("status").then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getSortedByStatus = getSortedByStatus;
const getByUser = (id) => {
  return new Promise((resolve, reject) => {
    Team.find({userID: id}).then((teams) => {
      resolve(teams);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.getByUser = getByUser;
// update
const update = (id, name, captain, cell, email, status) => {
  return new Promise((resolve, reject) => {
    Team.findByIdAndUpdate(id, {
      team: name,
      captain: captain,
      cell: cell,
      email: email,
      status: status
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.update = update;
const updateFeild = (id, field, value) => {
  return new Promise((resolve, reject) => {
    Team.findByIdAndUpdate(id, {
      field: value
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateFeild = updateFeild;
const updateStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    Team.findByIdAndUpdate(id, {
      status: status
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}
exports.updateStatus = updateStatus;
exports.updateUser = (id, user) => {
  return new Promise((resolve, reject) => {
    Team.findByIdAndUpdate(id, {
      userID: user
    }).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    })
  });
}
// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Team.findByIdAndDelete(id).then((team) => {
      resolve(team);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.delete = deletes
