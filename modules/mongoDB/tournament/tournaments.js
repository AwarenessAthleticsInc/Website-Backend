const mongoose = require('mongoose');
const tournamentSchema = new mongoose.Schema({
  assets: {
    poster: String,
    schedule: String,
    images: Array
  },
  location: {
    city: String,
    diamond: String,
    province: String,
    FullAddress: String
  },
  variation: String,
  cost: String,
  tournamentType: String,
  dateTime: {
    start: {
      time: String,
      date: Date
    },
    end: {
      date: Date,
      time: String
    },
    EntryDeadline: Date,
    cancellationDate: Date
  },
  teams: {
    Min: Number,
    Max: Number
  },
  Notes: String,
  status: String,
  divisions: Array,
  externalLink: String,
  convener: Object,
  sections: Array
});
const Tournament = new mongoose.model("Tournament", tournamentSchema);
const Registration = require('./registrations');
// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const tournament = new Tournament({
      assets: {
        poster: data.assets.poster,
        images: data.assets.images
      },
      location: {
        city: data.location.city,
        diamond: data.location.diamond,
        province: data.location.province,
        FullAddress: data.location.FullAddress
      },
      variation: data.variation,
      cost: data.cost,
      tournamentType: data.tournamentType,
      dateTime: {
        start: {
          time: data.dateTime.start.time,
          date: data.dateTime.start.date
        },
        end: {
          date: data.dateTime.end.date,
          time: data.dateTime.end.time
        },
        EntryDeadline: data.dateTime.EntryDeadline,
        cancellationDate: data.dateTime.cancellationDate
      },
      teams: {
        Min: data.teams.Min,
        Max: data.teams.Max
      },
      Notes: data.Notes,
      status: data.status,
      divisions: data.divisions,
      externalLink: data.externalLink,
      convener: data.convener
    });
    tournament.save((err) => {
      if (err) {
        reject(err);
      }
    });
    resolve(tournament);
  });
}
exports.add = add;

// read
const get = (query) => {
  return new Promise((resolve, reject) => {
    if (query === "all") {
      Tournament.find({}).sort("dateTime.start.date").then((tournaments) => {
        resolve(tournaments);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    } else {
      Tournament.find({
        $or: [
          {
            "location.city": {
              $regex: query,
              $options: 'i'
            }
          }, {
            "location.diamond": {
              $regex: query,
              $options: 'i'
            }
          }, {
            "location.province": {
              $regex: query,
              $options: 'i'
            }
          }, {
            tournamentType: {
              $regex: query,
              $options: 'i'
            }
          }, {
            "location.FullAddress": {
              $regex: query,
              $options: 'i'
            }
          }
        ]
      }).sort("dateTime.start.date").then(async (tournaments) => {
        const current = tournaments.filter((item) => {
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
        resolve(newArray);
      }).catch((error) => {
        reject(error);
      });
    }
  });
}
exports.get = get;
exports.getCurrent = () => {
  return new Promise((resolve, reject) => {
    Tournament.find({
      dateTime: {
        start: {
          date: {
            $gte: new Date()
          }
        }
      }
    }).sort("dateTime.start.date").then(async (tournaments) => {
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
      resolve(newArray);
    }).catch((error) => {
      reject(error);
    })
  });
}

const getPast = () => {
  return new Promise((resolve, reject) => {
    Tournament.find({
      dateTime: {
        start: {
          date: {
            $lte: new Date()
          }
        }
      }
    }).then(async (tournaments) => {
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
      resolve(newArray);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.getPast = getPast;
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((events) => {
      resolve(events);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getById = getById;
// update
const update = (id, data) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, {
      assets: {
        poster: data.assets.poster,
        images: data.assets.images
      },
      location: {
        city: data.location.city,
        diamond: data.location.diamond,
        province: data.location.province,
        FullAddress: data.location.FullAddress
      },
      variation: data.variation,
      cost: data.cost,
      tournamentType: data.tournamentType,
      dateTime: {
        start: {
          time: data.dateTime.start.time,
          date: data.dateTime.start.date
        },
        end: {
          date: data.dateTime.end.date,
          time: data.dateTime.end.time
        },
        EntryDeadline: data.dateTime.EntryDeadline,
        cancellationDate: data.dateTime.cancellationDate
      },
      teams: {
        Min: data.teams.Min,
        Max: data.teams.Max
      },
      Notes: data.Notes,
      status: data.status,
      divisions: data.divisions,
      externalLink: data.externalLink,
      convener: data.convener
    }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.update = update;

// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndDelete(id).then((tournament) => {
      resolve(tournament.location.city + ", " + tournament.location.diamond + " on" + tournament.dateTime.StartDate + ", was deleted successfully!");
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.delete = deletes;

// check if a team can register
const checkTeam = (id, team) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const teams = tournament.Teams;
      for (var i = 0; i < teams.length; i++) {
        try {
          if (tournament.divisions.length > 0 && teams[i].cell === team.cell && teams[i].division === team.division) {
            reject("This team is already register for this division");
          }
        } catch (error) {
          console.log(error);
          if (teams[i].cell === team.cell) {
            reject("This team is already register for this event");
          }
        }
      }
      resolve("Team can register for this event");
    }).catch((error) => {
      reject(error)
    });
  });
}
exports.checkTeam = checkTeam;

// register a team for this tournament
const register = (id, team) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, {
      $push: {
        teams: {
          list: team
        }
      }
    }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.register = register;

const getTeams = (id) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const teams = tournament.teams.list;
      resolve(teams);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.getTeams = getTeams;

const updateTeam = (id, team) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const teams = tournament.teams.list;
      var index = 0;
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].cell !== team.cell) {
          index++
        } else {
          i = teams.length;
        }
      }
      teams[index].name = team.name;
      teams[index].captain = team.captain;
      teams[index].cell = team.cell;
      teams[index].email = team.email;
      teams[index].division = team.division;
      teams[index].notes = team.notes;
      teams[index].paid = team.paid;
      Tournament.findByIdAndUpdate(id, {
        teams: {
          list: teams
        }
      }).then((tournament) => {
        resolve(tournament);
      }).catch((error) => {
        reject(error)
      });
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateTeam = updateTeam;

const deleteTeam = (id, teamCell) => {
  return new Promise((resolve, reject) => {
    var index = 0;
    Tournament.findById(id).then((tournament) => {
      var teams = tournament.teams.list;
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].cell !== teamCell) {
          index++
        } else if (teams[i].cell === teamCell) {
          teams.splice(index, 1);
          i = teams.length;
        }
      }
      Tournament.findByIdAndUpdate(id, {
        teams: {
          list: teams
        }
      }).then((tournaments) => {
        resolve(tournaments);
      }).catch((error) => {
        reject(error);
      });
    });
  });
}
exports.deleteTeam = deleteTeam;

// crud page sections
const addSection = (id, sectionArray) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, {
      $push: {
        sections: sectionArray
      }
    }).then(() => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.addSection = addSection;

const getSections = (id) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const sections = tournament.sections;
      resolve(sections);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getSections = getSections;

const updateAllSections = (id, newSectionsArray) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, { sections: newSectionsArray }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.updateAllSections = updateAllSections;

const updateOneSection = (id, index, array) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const sections = tournament.sections;
      sections[index] = array;
      tournament.findByIdAndUpdate(id, { sections: sections }).then((tournaments) => {
        resolve(tournaments);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  })
}
exports.updateOneSection = updateOneSection;

const deleteOneSection = (id, index) => {
  return new Promise((resolve, reject) => {
    Tournament.findById(id).then((tournament) => {
      const sections = tournament.sections;
      sections.splice(index, 1);
      tournament.findByIdAndUpdate(id, { sections: sections }).then((tournaments) => {
        resolve(tournaments);
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  })
}
exports.deleteOneSection = deleteOneSection;

// manage assets
const setSchedulePath = (id, path) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, {
      assets: {
        schedule: path
      }
    }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.setSchedulePath = setSchedulePath;

const setPosterPath = (id, path) => {
  return new Promise((resolve, reject) => {
    Tournament.findByIdAndUpdate(id, {
      assets: {
        poster: path
      }
    }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.setPosterPath = setPosterPath;

// sorting code
const formatDateString = (str) => {
  var array = str.split("-");
  return array[1] + "-" + array[2] + "-" + array[0];
}
function merge(left, right) {
  let arr = []
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays
    const leftDate = new Date(formatDateString(left[0].dateTime.start.date));
    const rightDate = new Date(formatDateString(right[0].dateTime.start.date));
    if (leftDate < rightDate) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return [
    ...arr,
    ...left,
    ...right
  ]
}

function mergeSort(array) {
  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  return merge(mergeSort(left), mergeSort(array));
}


function dateSort(array) {
  var arr = [];
  for (var i = 1; i < 13; i++) {
    months = [];
    // get the current month and populate the month array
    for (const j in array) {
      const dateOne = array[j].dateTime.start.date.split("-");
      if (Number(dateOne[1]) === i) {
        months.push(array[j])
      }
    }
    // sort each date in the month array
    months.sort(function (a, b) {
      var dateA = new Date(a.dateTime.start.date),
        dateB = new Date(b.dateTime.start.date)
      return dateA - dateB
    });
    arr.push(...months);
  }

  return arr;
}


exports.getByConvener = (id) => {
  return new Promise((resolve, reject) => {
    Tournament.find({ 'convener._id': id }).then((tournaments) => {
      resolve(tournaments);
    }).catch((error) => {
      reject(error);
    })
  });
}

exports.getPastTournaments = (dayDelay) => {
  return new Promise((resolve, reject) => {
    Tournament.find({}).then((tournaments) => {
      const pastTournaments = tournaments.filter((tournament) => {
        return new Date(tournament.dateTime.start.date).toDateString() < new Date().toDateString() + dayDelay;
      });
      resolve(pastTournaments);
    }).catch((error) => {
      reject(error);
    })
  });
}