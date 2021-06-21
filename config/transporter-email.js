const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
    user: 'lagimakan92@gmail.com', 
    pass: 'password', 
    },
});

module.exports = { transporter}