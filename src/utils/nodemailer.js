const nodemailer = require('nodemailer');
const { user, pass } = require('../../config/config').email; // Ensure you have your email credentials in the config

const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const mailOptions = {
    from: user,
    to,
    subject: 'Password Reset Request',
    html: `<p>Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`
  };

  return transporter.sendMail(mailOptions);
};
