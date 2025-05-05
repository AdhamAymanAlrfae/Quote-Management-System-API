const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

async function emailSender({ subject, userEmail, html }) {
  try {
    await transporter.sendMail({
      from: `"Quote app" <${process.env.EMAIL_USER_NAME}>`,
      to: userEmail,
      subject: subject,
      html: html,
    });

    logger.info(`Email sent successfully to ${userEmail}`);
    return true; // Indicate success
  } catch (error) {
    logger.error(`Error sending email to ${userEmail}: ${error.message}`);
    throw new Error(`Failed to send email to ${userEmail}`); // Propagate the error
  }
}

module.exports = emailSender;
