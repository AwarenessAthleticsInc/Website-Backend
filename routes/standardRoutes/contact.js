const email = require('../../modules/mail/email');

exports.api = (app) => {
    app.post("/contact-us", (req, res) => {
        const html = "<h6> " + req.body.name + " asked: </h6>" +
            "<p>" + req.body.message + "</p>" +
            "<p>You can respond to this message at " + req.body.email + "</p>";
        const text = req.body.name + " asked: \n" +
            req.body.message + "\n" +
            "You can responsed to this message at " + req.body.email + "\n";
        email.sendEmail("info@spfacanada.ca", req.body.subject, text, html, req.body.email).then((email) => {
            res.status(200).send("Your message was send successfully!");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Your message failed to send. If this is important please contact us directly at info@spfacanada.ca");
        });
    });
}
