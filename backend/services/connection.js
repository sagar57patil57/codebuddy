const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'Gmail',
    //host: "smtp.gmail.com",
    //port: 465,
    //secure: true, // true for 465, false for other ports
    auth: {
        user: "USERNAME_HERE",
        pass: "PASSWORD_HERE",
    },
});

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// exports.auth = new google.auth.JWT(
//     CREDENTIALS.client_email,
//     null,
//     CREDENTIALS.private_key,
//     SCOPES
// );
