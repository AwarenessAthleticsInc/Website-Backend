const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
});
const Faq = new mongoose.model("faq", faqSchema);
exports.model = Faq;

// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const faq = new Faq(data);
    faq.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(faq);
  });
}
exports.add = add;

// read
const getAll = () => {
  return new Promise((resolve, reject) => {
    Faq.find({}).then((faq) => {
      resolve(faq);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.getAll = getAll;
exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    Faq.findById(id).then((faq) => {
      resolve(faq);
    }).catch((error) => {
      reject(error);
    })
  });
}
// update
const update = (id, data) => {
  return new Promise((resolve, reject) => {
    Faq.findByIdAndUpdate(id, data).then((faq) => {
      resolve(faq);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.update = update;

// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Faq.findByIdAndDelete(id).then((faq) => {
      resolve(faq);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.delete = deletes;
