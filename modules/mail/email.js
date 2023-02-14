require("dotenv").config();
const nodemailer = require('nodemailer');
var domain = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "https://spfacanada.ca";

async function Email(sender, subject, text, html, email) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "to2.fcomet.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NO_REPLY_EMAIL, // generated ethereal user
      pass: process.env.NO_REPLY_PASS, // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'no-reply@spfacanada.ca', // sender address
    to: sender, // list of receivers
    subject: subject, // Subject line
    replyTo: email || sender,
    text: text, // plain text body
    html: html, // html body
  });
  return "Message sent: %s", info.messageId;
}
exports.sendEmail = Email;

function resetPassowrdEmail(token, email, Firstname) {
  var text = "Hello " + Firstname + ", \n\n" +
    'Your request has been recieved to change the password for your Slo-Pitch for Awareness Account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process\n\n' +
    domain + '/reset/' + token + '\n\n' +
    'If you did not request this, please contact use immediately at info@spfacanada.ca. By ingnoring this email, your password will remain unchanged.\n';
  var html = "<h3>Hello " + Firstname + ",</h3>" +
    "<h6>Your request has been recieved to change the password for your Slo-Pitch for Awareness Account.<h6>" +
    "<p>Please click on the following link, or paste this into your browser to complete the process</p>" +
    "<a href= '" + domain + '/reset/' + token + "'>reset password now</a>" +
    "<br>" +
    "<p>If you did not request this, please contact use immediately at info@spfacanada.ca. By ingnoring this email, your password will remain unchanged.</p>" +
    "<br>" +
    "<p>Thank you,</p>" +
    "<p>SPFA Support Team</p>" +
    Email(email, "Password Reset", text, html);
}

exports.sendConfirmationToken = (token, email, firstName) => {
  var text = "Hello " + firstName + ", \n\n" +
    'Thank you for creating an account with us.\n\n' +
    'Please click on the following link, or paste this into your browser to confirm your account\n\n' +
    domain + '/confirm/' + token + '\n\n' +
    'Thank you, \n' +
    'SPFA Support Team';
  var html = "<h3>Hello " + firstName + ",</h3>" +
    "<h6>Thank you for creating an account with us.<h6>" +
    "<p>Please click on the following link, or paste this into your browser to confirm your account</p>" +
    "<br>" +
    "<a href= '" + domain + '/confirm/' + token + "'>Confirm Now</a>" +
    "<br>" +
    "<br>" +
    "<p>Thank you,</p>" +
    "<p>SPFA Support Team</p>";

  Email(email, "Account Confirmation", text, html);
}
exports.resetPassowrdEmail = resetPassowrdEmail;

function generateItemsHTML(items) {
  var itemStrings = "";
  for (var i = 0; i < items.length; i++) {
    var item = "<p>" + items[i].qty + "x " + items[i].size + " " + items[i].name + "</p>";
    itemStrings = itemStrings + item;
  }
  return itemStrings;
}
function generateItemsText(items) {
  var itemStrings = "";
  for (var i = 0; i < items.length; i++) {
    var item = items[i].qty + "x " + items[i].size + " " + items[i].name + "\n";
    itemStrings = itemStrings + item;
  }
  return itemStrings;
}
function EmailReceipt(invoice, sender) {
  var shippingAddress = invoice.client.shippingAddress.street + " " + invoice.client.shippingAddress.city + ", " + invoice.client.shippingAddress.province + ", " + invoice.client.shippingAddress.country + " " + invoice.client.shippingAddress.postal;
  var billingAddress = invoice.client.billingAddress.street + " " + invoice.client.billingAddress.city + ", " + invoice.client.billingAddress.province + ", " + invoice.client.billingAddress.country + " " + invoice.client.billingAddress.postal;
  var text = "Hello " + invoice.client.account.name.givenName + ", \n\n" +
    "Your Order placed on " + invoice.date + " for " + invoice.order.totalQty + " items has been recieved. \n" +
    "Shipping Address: " + shippingAddress + "\n" +
    "Billing Address: " + billingAddress + "\n\n" +
    "HST : 717849715RT0001 \n\n" +
    "Your items are as follows:\n\n" +
    generateItemsText(invoice.order.items) +
    "\n subtotal: $" + Number(invoice.order.subtotal).toFixed(2) + "\n" +
    "tax: All items are tax inclusive \n" +
    "Shipping(" + invoice.shipping.carrier + "): $" + Number(invoice.shipping.total).toFixed(2) + "\n\n" +
    "Order Total: $" + Number(invoice.OrderTotal).toFixed(2) + "\n\n\n" +
    'If needed, to make payments whether it be for deposit or full payment please follow the EMT(Electronic Money Transfter) instructions below \n' +
    'Send the EMT to: info@spfacanada.ca \n' +
    'Please use password: softball \n' +
    'For any assistance in making a payment please email us at info@spfacanada.ca and we will be happy to help. \n\n' +
    "Thank you for being a valued customer, \n" +
    "Slo-pitch for Awareness Team \n";
  var html = "<h4>Hello " + invoice.client.account.name.givenName + ",</h4>" +
    "<p>Your Order placed on " + invoice.date + " for " + invoice.order.totalQty + " items has been recieved.</p>" +
    "<p><em>Shipping Address: " + shippingAddress + "</em></p>" +
    "<p><em>Billing Address: " + billingAddress + "</em></p><br>" +
    "<p>HST : 717849715RT0001</p>" +
    "<p><strong>Your items are as follows:</strong></p>" +
    generateItemsHTML(invoice.order.items) +
    "<br><p>subtotal: $" + Number(invoice.order.subtotal).toFixed(2) + "</p>" +
    "<p>tax: <em>All items are tax inclusive</em></p>" +
    "<p>Shipping(" + invoice.shipping.carrier + "): <em>$" + invoice.shipping.total + "</em></p>" +
    "<p>Order Total: <em>$" + Number(invoice.OrderTotal).toFixed(2) + "</em></p>" +
    '<p>If needed, to make payments whether it be for deposit or full payment please follow the EMT(Electronic Money Transfter) instructions below</p>' +
    '<p>Send the EMT to: <span style="color: red;">info@spfacanada.ca</span></p>' +
    '<p>Please use password: <span style="color: green;">softball</span></p>' +
    '<p>For any assistance in making a payment please email us at info@spfacanada.ca and we will be happy to help.</p>' +
    "<p>Thank you for being a valued customer,</p>" +
    "<p>Slo-pitch for Awareness Team</p>";;
  Email(sender, "Order: " + invoice._id, text, html);
}
exports.EmailReceipt = EmailReceipt;

function EmailTournamentReceipt(registration) {
  const tournament = registration.tournament;
  const team = registration.team;
  const time = formatTime(tournament.dateTime.start.time);
  var text = 'Hello ' + team.captain + ', \n\n' +
    'Thank you for registering for one of our amazing events! \n' +
    'HST : 717849715RT0001 \n\n' +
    'Your team ' + team.team + ' was registered for our tournament in ' + renderDivision(registration) + tournament.location.city + ' at ' + tournament.location.diamond + ' on ' + tournament.dateTime.start.date + ' at ' + time + '. \n' +
    '\n You will be contacted with a schedule the Wednesday before the event.\n\n' +
    'If needed, to make payments whether it be for deposit or full payment please follow the EMT(Electronic Money Transfter) instructions below \n' +
    'All new teams are required to pay a $100.00 non-refundable deposit. In the event that the tournament cancels deposits will be refunded at that time. \n' +
    'Send the EMT to: info@spfacanada.ca \n' +
    'Please use password: softball \n' +
    'For any assistance in making a payment please email us at info@spfacanada.ca and we will be happy to help. \n\n' +
    'Thank you for being a valued customer, \n' +
    'Slo-pitch For Awareness Team \n';
  var html = '<h4>Hello ' + team.captain + ',</h4>' +
    '<p>Thank you for registering for one of our amazing events!.</p>' +
    '<p>HST : 717849715RT0001</p>' +
    '<p>Your team ' + team.team + ' was registered for our tournament in ' + renderDivision(registration) + tournament.location.city + ' at ' + tournament.location.diamond + ' on ' + tournament.dateTime.start.date + ' at ' + time + '.</p>' +
    '<p>If needed, to make payments whether it be for deposit or full payment please follow the EMT(Electronic Money Transfter) instructions below</p>' +
    '<p>All new teams are required to pay a $100.00 non-refundable deposit. In the event that the tournament cancels deposits will be refunded at that time.</p>' +
    '<p>Send the EMT to: <span style="color: red;">info@spfacanada.ca</span></p>' +
    '<p>Please use password: <span style="color: green;">softball</span></p>' +
    '<p>For any assistance in making a payment please email us at info@spfacanada.ca and we will be happy to help.</p>' +
    '<p>Thank you for being a valued customer,</p>' +
    '<p>Slo-pitch For Awareness Team</p>';
  Email(team.email, "Tournament Registration Confirmation", text, html);
}
exports.EmailTournamentReceipt = EmailTournamentReceipt;

function EmailTournamentNotification(registration) {
  const tournament = registration.tournament;
  const team = registration.team;
  const time = formatTime(registration.tournament.dateTime.start.time);
  var text = 'The team ' + team.team + ' captained by ' + team.captain + ' has registered for ' + renderDivision(registration) + tournament.location.city + ' at ' + tournament.location.diamond + ' on ' + tournament.dateTime.start.date + ' at ' + time + '. You can contact ' + team.captain + ' at ' + team.cell + '. \n' +
    'The invoice number is ' + registration._id + ' \n\n';
  var html = '<p>The team ' + team.team + ' captained by ' + team.captain + ' has registered for ' + renderDivision(registration) + tournament.location.city + ' at ' + tournament.location.diamond + ' on ' + tournament.dateTime.start.date + ' at ' + time + '. You can contact ' + team.captain + ' at ' + team.cell + '.</p>' +
    '<p>The registration number is ' + registration._id + '</p>';
  Email("info@spfacanada.ca", "Tournament Registration Notification", text, html);
}
exports.EmailTournamentNotification = EmailTournamentNotification;

function EmailStoreNotification(invoice) {
  var shippingAddress = invoice.client.shippingAddress.street + " " + invoice.client.shippingAddress.city + ", " + invoice.client.shippingAddress.province + ", " + invoice.client.shippingAddress.country + " " + invoice.client.shippingAddress.postal;
  var billingAddress = invoice.client.billingAddress.street + " " + invoice.client.billingAddress.city + ", " + invoice.client.billingAddress.province + ", " + invoice.client.billingAddress.country + " " + invoice.client.billingAddress.postal;
  var text = "An order was placed in your store on " + invoice.date + ". \n" +
    "Shipping Address: " + shippingAddress + "\n" +
    "Billing Address: " + billingAddress + "\n\n" +
    "Items ordered are as follows:\n\n" +
    generateItemsText(invoice.order.items) +
    "The invoice number is " + invoice._id + " \n\n" +
    "Please check your dashboard for more information";
  var html = "<h5>An order was placed in your store on " + invoice.date + ".</h5>" +
    "<p>Shipping Address: " + shippingAddress + "</p>" +
    "<p>Billing Address: " + billingAddress + "</p><br>" +
    "<p>Items ordered are as follows:<p>" +
    generateItemsText(invoice.order.items) +
    "<p>The invoice number is " + invoice._id + "<p><br>" +
    "<p>Please check your dashboard for more information</p>";
  Email("info@spfacanada.ca", "Store Order", text, html);
}
exports.EmailStoreNotification = EmailStoreNotification;

const formatDate = (dates) => {
  const dateformat = new Date(dates);
  const date = new Date(dateformat.toString().replace(/-/g, '\/'));
  return monthNamesFull[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

const formatTime = (time) => {
  var ampm = "AM";
  const timing = time.split(":");
  var hours = timing[0];
  const minutes = timing[1];
  if (Number(hours) > 12) {
    hours = Number(hours / 2);
    ampm = "PM";
  }
  return hours + ":" + minutes + ampm
}

const renderDivision = (reg) => {
  try {
    if (reg.team.division.length > 1) {
      return "the " + reg.team.division + " division at ";
    }
    return "the co-ed division at ";
  } catch (error) {
    console.log(error);
    return "the co-ed division at ";
  }
}
