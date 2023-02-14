const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  ItemID: String,
  name: String,
  size: String,
  color: String,
  stock: Number
});
const Stock = new mongoose.model("Stock", stockSchema);
exports.model = Stock;

// create
const add = (id, name, size, color, qty) => {
  return new Promise((resolve, reject) => {
    const stock = new Stock({
      ItemID: id,
      name: name,
      size: size,
      color: color,
      stock: qty
    });
    stock.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(stock);
  });
}
exports.add = add;

// read
const get = () => {
  return new Promise((resolve, reject) => {
    Stock.find({}).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getAll = get;
const getByProduct = (productID) => {
  return new Promise((resolve, reject) => {
    Stock.find({ItemID: productID}).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByProduct = getByProduct;
const getById = (id) => {
  return new Promise((resolve, reject) => {
    Stock.findById(id).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getById = getById;
const getByQty = (qty) => {
  return new Promise((resolve, reject) => {
    Stock.find({stock: {$lte: Number(qty + 1)}}).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByQty = getByQty;

// update
const update = (id, ProductId, name, size, color, qty) => {
  return new Promise((resolve, reject) => {
    Stock.findByIdAndUpdate(id, {
      ItemID: ProductId,
      name: name,
      size: size,
      color: color,
      stock: qty
    })
  })
}
exports.update = update;
const updateQty = (id, qty) => {
  return new Promise((resolve, reject) => {
    Stock.findByIdAndUpdate(id, {
      stock: qty
    }).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.updateQty = updateQty;
const sell = (color, size, name, qty) => {
  return new Promise((resolve, reject) => {
    Stock.updateOne({
      name: name,
      size: size,
      color: color
    }, {
      $inc: {
        stock:  - Number(qty)
      }
    }).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.sell = sell;
const returnOne = (id, qty) => {
  return new Promise((resolve, reject) => {
    Stock.updateOne({ _id: id }, {
      $inc: {
        stock: Number(qty)
      }
    }).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.returnOne = returnOne;
exports.updateStock = (id, size, color, data) => {
  return new Promise((resolve, reject) => {
    Stock.updateOne({ItemID: id, size: size, color: color}, {
      name: data.name,
      size: data.size,
      color: data.color,
      stock: Number(data.stock)
    }).then((stock) =>{
      resolve(stock);
    }).catch((error) => {
      reject(error);
    })
  })
}
// delete
const deletes = (id) => {
  return new Promise((resolve, reject) => {
    Stock.findByIdAndDelete(id).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.delete = deletes;

const deleteByProduct = (productId) => {
  return new Promise((resolve, reject) => {
    Stock.deleteMany({ItemID: productId}).then((stock) => {
      resolve(stock);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.deleteByProduct = deleteByProduct;
