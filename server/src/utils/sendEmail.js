const transporter = require('../config/nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SaaSPlatform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;