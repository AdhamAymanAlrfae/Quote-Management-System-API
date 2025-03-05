const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

async function emailSender({subject, userEmail, html}) {
  const info = await transporter.sendMail({
    from: `"Quote app" <${process.env.EMAIL_USER_NAME}>`,
    to: userEmail,
    subject: subject,
    html: html,
  });

  console.log("Message sent: %s", info);
}

module.exports = emailSender;
