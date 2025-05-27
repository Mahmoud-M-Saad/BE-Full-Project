const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { user, pass } = require('../../config/config').email; // Ensure you have your email credentials in the config

exports.sendResetEmail = async (to, resetLink, username) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
  
  const emailTemplatePath = path.join(__dirname, 'resetPasswordTemplate.html');
  let htmlTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  htmlTemplate = htmlTemplate
    .replace('{{username}}', username)
    .replace('{{resetLink}}', resetLink)
    .replace('{{date}}', new Date().toDateString());

  const mailOptions = {
    from: user,
    to,
    subject: 'Password Reset Request',
    html: htmlTemplate,
  };

  return transporter.sendMail(mailOptions);
};
