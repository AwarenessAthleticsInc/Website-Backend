const mongoose = require("mongoose");
const payments = new mongoose.Schema({
  Invoice: String,
  id: String,
  status: String,
  amount: Number,
  currency: String,
  date: String,
  type: String
});
const Payment = new mongoose.model("Payment", payments);
exports.model = Payment;

// create
exports.add = (InvoiceID, id, status, amount, currency, date, type) => {
  return new Promise((resolve, reject) => {
    const payment = new Payment({
      Invoice: InvoiceID,
      id, id,
      status: status,
      amount: amount,
      currency: currency,
      date: date,
      type: type
    });
    payment.save((error) => {
      if(error) {
        reject(error);
      }
    });
    resolve(payment);
  });
}

// read
exports.get = () => {
  return new Promise((resolve, reject) => {
    Payment.find({}).then((payments) => {
      resolve(payments);
    }).catch((error) => {
      reject(error);
    });
  });
}

exports.getById = (paymentId) => {
  return new Promise((resolve, reject) => {
    Payment.findById(paymentId).then((payment) => {
      resolve(payment);
    }).catch((error) => {
      reject(error);
    })
  });
}

exports.getByOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    Payment.find({Invoice: orderId}).then((payments) => {
      resolve(payments);
    }).catch((error) => {
      reject(error);
    });
  });
};
const getByDate = (date) => {
  return new Promise((resolve, reject) => {
    Payments.find({date: date}).then((payments) => {
      resolve(payments);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getByDate = getByDate;
const getPaymentTotalByOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    Payment.find({Invoice: orderId}).then((payments) => {
      if(payments.length < 1) {
        resolve("0");
        return;
      }
      var total = 0;
      for(var i = 0; i < payments.length; i++){
        total += Number(payments[i].amount);
      }
      resolve(total.toString());
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.getPaymentTotalByOrder = getPaymentTotalByOrder;
// update
exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    Payment.findByIdAndUpdate(id, data).then((payment) => {
      resolve(payment);
    }).catch((error) => {
      reject(error);
    })
  });
}


// payments cant be updated only places and deleted

// delete
const deletePaymentByInvoice = (invoiceId) => {
  return new Promise((resolve, reject) => {
    Payment.deleteMany({Invoice: invoiceId})
    .then((payment) => {
      resolve(payment);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.deleteByOrder = deletePaymentByInvoice;
const deletePayment = (id) => {
  return new Promise((resolve, reject) => {
    Payment.findByIdAndDelete(id).then((payment) => {
      resolve(payment);
    }).catch((error) => {
      reject(error);
    });
  });
}
exports.delete = deletePayment;
