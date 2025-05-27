const { signup, login, forgotPassword, resetPassword } = require('../services/auth.service');
const responseHandler = require('../utils/responseHandler');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return responseHandler.error(res, "Username, Email, Password, and Confirm Password are required.", 400);
    }

    const user = await signup(req.body);
    if (user.error) return responseHandler.error(res, user.error, 400);
    return responseHandler.created(res, user, "User registered successfully.");
  } catch (err) {
    console.error("File: auth.controller.js, Function: signup, Error:", err.message);
    return responseHandler.error(res, "An unexpected error occurred.", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseHandler.error(res, "Email and password are required.", 400);
    }

    const result = await login(email, password);
    if (result.error) return responseHandler.error(res, result.error, 401);

    return responseHandler.success(res, result, "Login successful.");
  } catch (err) {
    console.error("File: auth.controller.js, Function: login, Error:", err.message);
    return responseHandler.error(res, "An unexpected error occurred.", 500);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return responseHandler.error(res, "Email is required.", 400);
    }

    const result = await forgotPassword(email);
    if (result.error) return responseHandler.error(res, result.error, 400);
    return responseHandler.success(res, "Please Check you email.", "Password reset email sent.");
  } catch (err) {
    console.error("File: auth.controller.js, Function: forgotPassword, Error:", err.message);
    return responseHandler.error(res, "An unexpected error occurred.", 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (!resetToken || !newPassword || !confirmPassword) {
      return responseHandler.error(res, "Token, new password, and confirm password are required.", 400);
    }

    const result = await resetPassword(resetToken, newPassword, confirmPassword);
    if (result.error) return responseHandler.error(res, result.error, 400);
    return responseHandler.success(res, null, "Password reset successful.");
  } catch (err) {
    console.error("File: auth.controller.js, Function: resetPassword, Error:", err.message);
    return responseHandler.error(res, "An unexpected error occurred.", 500);
  }
};
