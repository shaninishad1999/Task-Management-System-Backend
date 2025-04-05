const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shahwalcomputer18@gmail.com",
        pass: "rbgs loyg nskm qyif" // Consider moving this to environment variables
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email service:", error);
    } else {
        console.log("Email service ready to send messages");
    }
});

module.exports = transporter;
