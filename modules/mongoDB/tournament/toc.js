const mongoose = require("mongoose");
const TOCpageSchema = new mongoose.Schema({
  year: String,
  poster: String,
  dates: Array,
  sections: Array
});
const TOC = new mongoose.model("Tournament Of Champ", TOCpageSchema);
exports.model = TOC;

// create
const add = (year, poster, dates, sections) => {
  return new Promise((resolve, reject) => {
    const toc = new TOC({
      year: year,
      poster: poster,
      dates: dates,
      sections: sections
    });
    toc.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(toc);
  });
}
exports.add = add;

//read
const getAll = () => {
  return new Promise((resolve, reject) => {
    TOC.find({}).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getAll = getAll;
const getCurrent = () => {
  return new Promise((resolve, reject) => {
    const year = new Date().getFullYear();
    TOC.find({year: year}).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getCurrent = getCurrent;
const getByYear = (year) => {
  return new Promise((resolve, reject) => {
    TOC.find({year: year}).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByYear = getByYear;
const get = (id) => {
  return new Promise((resolve, reject) => {
    TOC.findById(id).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.get = get;
//update
const update = (id, data) => {
  return new Promise((resolve, reject) => {
    TOC.findByIdAndUpdate(id, {
      year: data.year,
      poster: data.poster,
      dates: data.dates,
      sections: data.sections
    }).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.update = update;
const updatePoster = (id, path) => {
  return new Promise((resolve, reject) => {
    TOC.findByIdAndUpdate(id, {
      poster: path
    }).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.updatePoster = updatePoster;

//delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    TOC.findByIdAndDelete(id).then((toc) => {
      resolve(toc);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.delete = deletes;

// crud page sections
const addSection = (id, sectionArray) => {
  return new Promise((resolve, reject) => {
    TOC.findByIdAndUpdate(id, {
      $push: {sections: sectionArray}
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
    TOC.findById(id).then((tournament) => {
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
    TOC.findByIdAndUpdate(id, {
      sections: newSectionsArray
    }).then((tournament) => {
      resolve(tournament);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.updateAllSections = updateAllSections;

const updateOneSection = (id, index, array) => {
  return new Promise((resolve, reject) => {
    TOC.findById(id).then((toc) => {
      const sections = toc.sections;
      sections[index] = array;
      TOC.findByIdAndUpdate(id, {
        sections: sections
      }).then((tournaments) => {
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
    TOC.findById(id).then((toc) => {
      const sections = toc.sections;
      sections.splice(index, 1);
      TOC.findByIdAndUpdate(id, {
        sections: sections
      }).then((tournaments) => {
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
