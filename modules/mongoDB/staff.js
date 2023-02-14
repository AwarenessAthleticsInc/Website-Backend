const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
  assets: {
    profileImage: String,
    images: Array,
  },
  details: {
    name: {
      givenName: String,
      middleName: String,
      familyName: String
    },
    username: String
  },
  work: {
    title: String,
    description: String,
    date: {
      start: String,
      end: String
    }
  }
});
const Staff = new mongoose.model("Staff", staffSchema);
exports.model = Staff;

// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const staff = new Staff(data)
    staff.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(staff);
  });
}
exports.add = add;
const addEndDate = (id, date) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndUpdate(id, {
      "work.date.end": date
    }).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.addEndDate = addEndDate;

// read
const getAll = () => {
  return new Promise((resolve, reject) => {
    Staff.find({}).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getAll = getAll;
const get = (query) => {
  return new Promise((resolve, reject) => {
    Staff.find({
      $or: [
        {
          "details.name.givenName": {
            $regex: query,
            $options: "i"
          }
        },
        {
          "details.name.middleName": {
            $regex: query,
            $options: "i"
          }
        },
        {
          "details.name.familyName": {
            $regex: query,
            $options: "i"
          }
        },
        {
          "details.username": {
            $regex: query,
            $options: "i"
          }
        },
        {
          "work.title": {
            $regex: query,
            $options: "i"
          }
        },
      ]
    }).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.get = get;
exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    Staff.findById(id).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    })
  });
}
// update
const update = (id, data) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndUpdate(id, data).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.update = update;
const updateProfileImage = (id, path) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndUpdate(id, {
      "assets.profileImage": path
    }).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateProfileImage = updateProfileImage;
const updateImages = (id, path) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndUpdate(id, {
      $push: {"assets.images": path }
    }).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateImages = updateImages;

// delete
const removeImage = (id, path) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndUpdate(id, {
      $pull: {"assets.images": path }
    }).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.removeImage = removeImage;
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Staff.findByIdAndDelete(id).then((staff) => {
      resolve(staff);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.delete = deletes;
