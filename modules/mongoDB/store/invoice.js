const email = require("../../mail/email");
const mongoose = require('mongoose');
const payments = require('../payment');

const invoiceSchema = new mongoose.Schema({
  date: Date,
  client: {
    account: {
      id: String,
      name: {
        givenName: String,
        middleName: String,
        familyName: String
      },
      username: String,
      cell: String
    },
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      province: String,
      Country: String,
      postal: String
    },
    billingAddress: {
      name: String,
      street: String,
      city: String,
      province: String,
      Country: String,
      postal: String
    },
    message: String
  },
  order: {
    items: Array,
    totalQty: Number,
    subtotal: Number
  },
  shipping: {
    carrier: String,
    weight: Number,
    total: String
  },
  OrderTotal: Number,
  status: String
});
const Invoice = new mongoose.model("Invoice", invoiceSchema);

exports.model = Invoice;

// create
const newOrder = (date, client, order, shipping, total, status) => {
  return new Promise((resolve, reject) => {
    const invoice = new Invoice({
      date: date,
      client: {
        account: {
          id: client.account.id,
          name: {
            givenName: client.account.name.givenName,
            middleName: client.account.name.middleName,
            familyName: client.account.name.familyName
          },
          username: client.account.username,
          cell: client.account.cell
        },
        shippingAddress: {
          name: `${client.shippingAddress.firstName} ${client.shippingAddress.lastName}`,
          street: client.shippingAddress.street,
          unit: client.shippingAddress.unit || '',
          city: client.shippingAddress.city,
          province: client.shippingAddress.province,
          country: client.shippingAddress.country,
          postal: client.shippingAddress.postal
        },
        billingAddress: {
          name: `${client.billingAddress.firstName} ${client.billingAddress.lastName}`,
          street: client.billingAddress.street,
          unit: client.billingAddress.unit || '',
          city: client.billingAddress.city,
          province: client.billingAddress.province,
          country: client.billingAddress.country,
          postal: client.billingAddress.postal
        }
      },
      order: {
        items: order.items,
        totalQty: order.totalQty,
        subtotal: order.subtotal
      },
      shipping: {
        carrier: shipping.carrier,
        weight: shipping.weight,
        total: shipping.total
      },
      OrderTotal: total,
      status: status
    });
    invoice.save((error) => {
      if(error) {
        reject(error);
      }
    });
    // email.EmailReceipt(invoice, client.account.username);
    // email.EmailStoreNotification(invoice);
    resolve(invoice);
  });
}
exports.create = newOrder;

// read
const getInvoices = () => {
  return new Promise((resolve, reject) => {
    Invoice.find({}).sort("date").then((invoices) => {
      resolve(invoices);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.get = getInvoices;
const getInvoicesById = (id) => {
  return new Promise((resolve, reject) => {
    Invoice.findById(id).then((invoices) => {
      resolve(invoices);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getById = getInvoicesById;
const getByClientsId = (id) => {
  return new Promise((resolve, reject) => {
    Invoice.find({"client.account.id": id}).then((invoices) => {
      resolve(invoices);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getByClientsId = getByClientsId;
const getByClientsUsername = (username) => {
  return new Promise((resolve, reject) => {
    Invoice.find({"client.account.username": username}).then((invoices) => {
      resolve(invoices);
    }).catch((error) => {
      reject(error);
    })
  })
}
exports.getByClientsUsername = getByClientsUsername;

// update
exports.updateStatus = (id, status) => {
  return new Promise((resolve, reject) => {
     Invoice.findByIdAndUpdate(id, {status: status}).then(() => {
      resolve(`Order #${id} status as been update to ${status}`);
     }).catch((error) => {
      console.log(error);
      reject(error);
     })
  });
}

// delete
exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    const orderErrors = 0;
    const paymentErrors = 0;
    Invoice.findByIdAndDelete(id).then((invoice) => {
      payments.deleteByOrder(invoice._id).catch((error) => {
        console.log(error);
        paymentErrors++;
      });
      if (orderErrors === 0 && paymentErrors === 0) {
        resolve("All Selected Orders and their payments were deleted successfully");
        return;
      }
      if (orderErrors === 0 && paymentErrors !== 0) {
        resolve(`All Selected Orders were deleted successfully. ${paymentErrors} payments where not deleted. Please manually delete those payments.`);
        return;
      }
      resolve(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where deleted successfilly please try again`);
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}


