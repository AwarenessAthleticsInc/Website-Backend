const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: String,
  photo: String,
  category: {
    child: Array,
    parent: String
  },
  products: Array
});
const Category = new mongoose.model("Catagory", categorySchema);
exports.model = Category;

// create
const add = (data) => {
  return new Promise((resolve, reject) => {
    const newCategory = new Category(data);
    newCategory.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(newCategory);
  });
}
exports.add = add;
const uploads = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, "Category")
      .then((path) => {
        resolve(path);
      }).catch((error) => {
        reject(error);
      });
  });
}
exports.upload = uploads;

// read
const get = () => {
  return new Promise((resolve, reject) => {
    Category.find({}).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getAll = get;
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Category.findById(id).then((category) => {
      resolve(category);
    }).catch((error) => {
      resolve(error);
    });
  });
}
exports.getById = getById;
const getByProduct = (productId) => {
  return new Promise((resolve, reject) => {
    Category.find({}).then((category) => {
      const list = [];
      for(var i = 0; i < category.length; i++){
        for(var j = 0; j < category[i].products.length; j++){
          if(category[i].products[j] === productId) {
            list.push(category[i].name);
            j = category[i].products.length;
          }
        }
      }
      resolve(list);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByProduct = getByProduct;
const getByChild = (child) => {
  return new Promise((resolve, reject) => {
    Category.find({"category.child": child}).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByChild = getByChild;
const getByParent = (parent) => {
  return new Promise((resolve, reject) => {
    Category.find({"category.parent": parent}).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByParent = getByParent;

// update
const addProduct = (name, product) => {
  return new Promise((resolve, reject) => {
    Category.updateOne({name: name}, {
      $push: {products: product}
    }).then((product) => {
      resolve(product);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.addProduct = addProduct;
const updateImage = (name, path) => {
  return new Promise((resolve, reject) => {
    Category.updateOne({name: name}, {photo: path}).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateImage;
const updateByName = (name, image, child, parent) => {
  return new Promise((resolve, reject) => {
    Category.updateOne({name: name}, {
      photo: image,
      category: {
        child: child,
        parent: parent
      }
    }).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateByName = updateByName;
const updateById = (id, data) => {
  return new Promise((resolve, reject) => {
    Category.findByIdAndUpdate(id, data).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateById = updateById;

// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Category.findByIdAndDelete(id).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.delete = deletes;
const deleteProduct = (name, productId) => {
  return new Promise((resolve, reject) => {
    Category.updateOne({name: name}, {
      $pull: {products: productId}
    }).then((category) => {
      resolve(category);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.deleteProduct = deleteProduct;
