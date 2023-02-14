const cart = require('../../modules/mongoDB/store/cart');

exports.api = (app) => {
    app.route('/api/cart').get((req, res) => {
        // get cart count
        cart.get().then((cart) => {
            res.status(200).send(cart);
        }).catch((error) => {
            res.status(404).send("Cart not found");
        });
    }).post(async (req, res) => {
        // add a new items to the cart
        req.session.cart = await cart.add(req.session.cart,
            req.body.product.id,
            req.body.product.name,
            req.body.product.price,
            req.body.product.size,
            req.body.product.color,
            req.body.product.image,
            req.body.product.weight,
            req.body.product.qty
        ).then((cart) => {
            return cart;
        });
        res.status(200).send(req.session.cart);
    }).put((req, res) => {
        // update cart item count
        cart.updateCount(req.body.product.id, req.body.product.price, req.body.product.size, req.body.product.color, req.body.product.qty, req).then(() => {
            res.status(200).send(req.session.cart);
        }).catch((error) => {
            console.log(error);
            res.status(400).send('There was an error while trying to update this qty');
        });
    }).delete((req, res) => {
        // remove an item from the cart
        cart.remove(req.body.id, req.body.price, req.body.size, req.body.color, req).then(() => {
            res.status(200).send("Item removed successsfully!");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to delete this item from your cart");
        });
    });
}