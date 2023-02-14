const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  tracking: {
    sku: String,
    upc: String,
    partNumber: String
  },
  assets: {
    Image: String,
    gallery: Array
  },
  pricing: {
    cost: Number,
    price: Number,
    salePrice: Number,
    onSale: Boolean,
  },
  name: String,
  description: String,
  sizes: Array,
  colors: Array,
  shipping: {
    dementions: {
      width: Number,
      height: Number,
      length: Number
    },
    weight: Number
  }
});
const Product = new mongoose.model("Product", productSchema);
exports.model = Product;


// create
const add = (product) => {
  return new Promise((resolve, reject) => {
    const newProduct = new Product(product);
    newProduct.save((error) =>{
      if(error) {
        reject(error);
      }
    });
    resolve(newProduct);
  });
}
exports.add = add;

// read
const get = (query) => {
  return new Promise((resolve, reject) => {
    Product.find({
      $or: [
        {
          "tracking.sku": {
            $regex: query,
            $options: 'i'
          }
        },
        {
          "tracking.upc": {
            $regex: query,
            $options: 'i'
          }
        },
        {
          "tracking.partNumber": {
            $regex: query,
            $options: 'i'
          }
        },
        {
          name: {
            $regex: query,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: query,
            $options: 'i'
          }
        },
        {
          colors: {
            $regex: query,
            $options: 'i'
          }
        },
        {
          sizes: {
            $regex: query,
            $options: 'i'
          }
        },
      ]
    }).then((products) => {
      resolve(products);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.get = get;
const getAll = () => {
  return new Promise((resolve, reject) => {
    Product.find({}).then((products) => {
      resolve(products);
    }).catch((error) => {
      reject(error);
    });
  })
}
exports.getAll = getAll;
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Product.findById(id).then((product) => {
      resolve(product);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getById = getById;
// update
const update = (id, product) => {
  return new Promise((resolve, reject) => {
    Product.findByIdAndUpdate(id, product).then((product) => {
      resolve(product);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.update = update;
const updateProductImage = (id, path) => {
  Product.findByIdAndUpdate(id, {
    assets: {Image: path}
  }).then((product) => {
    resolve(product);
  }).catch((error) => {
    reject(error);
  })
}
// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Product.findByIdAndDelete(id).then((product) => {
      resolve(product);
    }).catch((error) => {
      reject(error);
    })
  });
}
exports.delete = deletes;

// sortby
const getByPrice = () =>{
  return new Promise((resolve, reject) => {
    Product.find({}).sort("price").then((products) => {
      resolve(price);
    }).catch((error) => {
      reject(error);
    });
  });
}

//findBy
const findByColor = (color) =>{
  return new Promise((resolve, reject) => {
    Product.find({}).then((products) => {
      const list = [];
      for(const product in proudcts){
        for(const color in product.colors) {
          if(color === color) {
            list.push(product);
          }
        }
      }
      resolve(list);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.findByColor = findByColor;
