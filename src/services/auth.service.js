const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const timestamp = new Date().toISOString();
const ctx = "src/auth.service.js";
const { encryptToken } = require('../utils/generateToken');
const { sendResetEmail } = require('../utils/nodemailer');
const { frontEndLink } = require('../../config/config');

const verifyEmail = (email) => {
  // const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

const verifyPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error('Password and confirm password do not match');
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
  }
}

exports.signup = async (userData) => {
  try {
    const { username, email, password, confirmPassword } = userData;
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return { error: 'Sorry, Your email or username already exists.' };
    }

    if (username.length < 3 || !/[A-Z]/.test(username)) {
      return { error: 'Username must be at least 3 characters long and include at least one uppercase letter' };
    }

    try {
      verifyEmail(email);
      verifyPassword(password, confirmPassword);
    } catch (validationError) {
      return { error: validationError.message };
    }

    userData.role = 'customer';
    userData.password = await bcrypt.hash(password, 10);
    const user = await User.create(userData);
    return user || { error: 'Failed to create user.' };
  } catch (err) {
    console.error(`[${timestamp} - ${ctx}] signup fn. Error: `, err.message);
    return { error: 'An unexpected error occurred during signup.' };
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email }, attributes: ['id', 'username', 'email', 'password', 'role'] });
    if (!user) return { error: 'Invalid email or password.' };
    
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: 'Invalid email or password.' };
    
    let payload = { id: user.id, username: user.username, role: user.role };
    
    if (user.role === 'super_admin') {
      user.secretKey = crypto.randomBytes(32).toString('hex');
      user.dataValues.message = 'Welcome back, Super Admin!';
      await user.save();
      payload.secretKey = user.secretKey;
    }

    const token = await encryptToken(payload);
    delete user.dataValues.password;
    
    return { user, token };
  } catch (err) {
    console.error(`[${timestamp} - ${ctx}] login fn. Error: `, err.message);
    return { error: 'An unexpected error occurred during login.' };
  }
};

exports.forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return { error: 'Email not found.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    const savedUser = await user.save();
    if (!savedUser) return { error: 'Failed to save reset token.' };

    const resetLink = `${frontEndLink}?resetToken=${resetToken}&email=${email}`;
    await sendResetEmail(email, resetLink);

    return { success: true };
  } catch (err) {
    console.error(`[forgotPassword Error]: `, err.message);
    return { error: 'An unexpected error occurred.' };
  }
};

exports.resetPassword = async ({ token, email, oldPassword, password, confirmPassword }) => {
  try {
    try {
      verifyPassword(password, confirmPassword);
    } catch (validationError) {
      return { error: validationError.message };
    }

    let user;

    if (token && email) {
      // Token-based reset (from email)
      const users = await User.findAll({ where: { email, resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() } } });
      for (const u of users) {
        const match = await bcrypt.compare(token, u.resetPasswordToken);
        if (match) {
          user = u;
          break;
        }
      }
      if (!user) return { error: 'Invalid or expired reset token.' };

    } else if (oldPassword && email) {
      // Authenticated change via old password
      user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return { error: 'Old password is incorrect.' };
      }
    } else {
      return { error: 'Invalid request.' };
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    const savedUser = await user.save();
    return savedUser ? { success: true } : { error: 'Failed to update password.' };
  } catch (err) {
    console.error(`[resetPassword Error]: `, err.message);
    return { error: 'An unexpected error occurred.' };
  }
};
