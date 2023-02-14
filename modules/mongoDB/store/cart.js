function cartTotal(req) {
  try {
    var cart = req.session.cart.totalQty;
    return cart;
  } catch {
    var cart = "0";
    return cart;
  }
}
exports.getTotal = cartTotal;

exports.get = (req) => {
  return new Promise((resolve, reject) => {
    try {
      var cart = req.session.cart;
      resolve(cart);
    } catch {
      var cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0,
        totalWeight: 0
      };
      resolve(cart);
    }
  });
}

const AddToCart = (cart, id, name, price, size, color, images, weight, qty) => {
  const weightTotal = Number(weight * qty);
  const priceTotal = Number(price * qty);
  return new Promise((resolve, reject) => {
    var newCart = {
      items: [],
      totalQty: 0,
      totalPrice: 0,
      totalWeight: 0
    }
    if (!cart) {
      const newItem = {
        qty: qty,
        id: id,
        image: images,
        name: name,
        price: price,
        size: size,
        color: color,
        weight: weight
      }
      var items = [];
      items.push(newItem);
      newCart.items = items;
      newCart.totalQty = Number(qty);
      newCart.totalPrice = priceTotal;
      newCart.totalWeight = weightTotal;
      resolve(newCart);
    } else {
      newCart.items = cart.items;
      newCart.totalPrice = cart.totalPrice;
      newCart.totalQty = cart.totalQty;
      newCart.totalWeight = cart.totalWeight;
      var found = false;
      newCart.items.find(function (founditem, index) {
        if (founditem.id === id && founditem.price === price && founditem.size === size && founditem.color === color) {
          newCart.items[index].qty = Number(newCart.items[index].qty) + Number(qty);
          newCart.totalPrice = Number(newCart.totalPrice) + priceTotal;
          newCart.totalWeight = Number(newCart.totalWeight) + weightTotal;
          newCart.totalQty = Number(newCart.totalQty) + Number(qty);
          found = true;
        }
      });
      if (found === false) {
        const newItem = {
          qty: qty,
          id: id,
          image: images,
          name: name,
          price: price,
          size: size,
          color: color,
          weight: weight
        }
        newCart.items.push(newItem);
        newCart.totalPrice = Number(newCart.totalPrice) + priceTotal;
        newCart.totalWeight = Number(newCart.totalWeight) + weightTotal;
        newCart.totalQty = Number(newCart.totalQty) + Number(qty);
      }
      resolve(newCart);
    }
  });
}
exports.add = AddToCart;

exports.updateCount = (id, price, size, color, qty, req) => {
  return new Promise((resolve, reject) => {
    req.session.cart.items.find(function (founditem, index) {
      if (founditem.id === id && founditem.price === price && founditem.size === size && founditem.color === color) {
        const originalPrice = Number(founditem.price * founditem.qty);
        const newPrice = Number(founditem.price * qty);
        const cartPrice = Number(req.session.cart.totalPrice);

        const originalWeight = Number(founditem.weight * founditem.qty);
        const newWeight = Number(founditem.weight * qty);
        const cartWeight = Number(req.session.cart.totalWeight);

        const originalQty = Number(founditem.qty);
        const newQty = Number(qty);
        const cartQty = Number(req.session.cart.totalQty);
        if (Number(qty) > 0) {
          console.log(cartQty)
          console.log(originalQty);
          console.log(newQty);
          req.session.cart.items[index].qty = Number(qty);
          req.session.cart.totalWeight = Number((cartWeight - originalWeight) + newWeight);
          req.session.cart.totalQty = Number((cartQty - originalQty) + newQty);
          req.session.cart.totalPrice = Number((req.session.cart.totalPrice - originalPrice) + newPrice);
        } else {
          req.session.cart.items.splice(index, 1);
          req.session.cart.totalWeight = Number(cartWeight - originalWeight);
          req.session.cart.totalQty = Number(cartQty - originalQty);
          req.session.cart.totalPrice = Number(req.session.cart.totalPrice - originalPrice);
        }
        req.session.save();
        resolve(true);
      }
    });
    reject(false);
  });
}

const RemoveFromCart = (id, price, size, color, req) => {
  return new Promise((resolve, reject) => {
    req.session.cart.items.find(function (founditem, index) {
      if (founditem.id === id && founditem.price === price && founditem.size === size && founditem.color === color) {
        if (founditem.qty > 1) {
          var weightOfOne = Number(founditem.weight) / Number(founditem.qty);
          req.session.cart.items[index].qty--;
          req.session.cart.totalWeight = Number(req.session.cart.totalWeight) - Number(weightOfOne);
        } else {
          if (index > -1) {
            req.session.cart.items.splice(index, 1);
            req.session.cart.totalWeight = Number(req.session.cart.totalWeight) - Number(founditem.weight);
          }
        }
        req.session.cart.totalQty--;
        req.session.cart.totalPrice = req.session.cart.totalPrice - founditem.price;
        resolve(true);
      }
    });
    reject(false);
  });
}
exports.remove = RemoveFromCart;
