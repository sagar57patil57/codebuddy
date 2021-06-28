const connection = require("./connection");
exports.send = async (status, email) => {
    const approvalText = "Hooray!!! Your Editorial has been approved by our team. Thank you for your contribution. Your effort is really appriciated"
    const rejectionText = "Sorry. Your Editorial has not passed by by our team. Thank you for your contribution. Your effort is really appriciated. You are free to add more editorials"
    const postText = status === 'approved' ? approvalText : rejectionText;

    // send mail with defined transport object
    let info = await connection.transporter.sendMail({
        from: 'sagar57patil57@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Editorial approved", // Subject line
        text: postText, // plain text body
        html: `<p>${postText}</p>`, // html body
    });
}