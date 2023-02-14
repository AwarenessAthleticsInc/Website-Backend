const mongoose = require("mongoose");
const publicDocsSchema = new mongoose.Schema({
  documentLocations: Array,
  previewLocations: Array,
  title: String,
  description: String
});
const Documents = new mongoose.model("Document", publicDocsSchema);
exports.model = Documents;

// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new Documents(data);
    doc.save((error) => {
      reject(error);
    });
    resolve(doc);
  });
}
exports.add = add;

// read
const getAll = () => {
  return new Promise((resolve, reject) => {
    Documents.find({}).then((docs) => {
      resolve(docs);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.getAll = getAll;
exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    Documents.findById(id).then((doc) => {
      resolve(doc);
    }).catch((error) => {
      reject(error);
    })
  });
}
// update
const update = (id, data) => {
  return new Promise((resolve, reject) => {
    Documents.findByIdAndUpdate(id, data).then((docs) => {
      resolve(docs);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.update = update;

// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Documents.findByIdAndDelete(id).then((docs) => {
      resolve(docs);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.delete = deletes;

// asset manager
