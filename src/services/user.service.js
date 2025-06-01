const db = require('../models');
const { User, Staff, Project, Task, } = db;
const { verifyEmail, verifyPassword, verifyUsername } = require('../services/auth.service');

exports.checkPermission = async (req, res, userId, action) => {
  const userPermission = req.user.permissions;
  const userToUpdate = await getUserById(userId);
  if (!userToUpdate) return responseHandler.error(res, new Error("User not found"), 404);

  const targetRole = userToUpdate.role;
  if (targetRole === "admin" && !userPermission.writeAdmin) {
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an admin user. Ask your Admin.`), 403);
  }
  if (targetRole === "employee" && !userPermission.writeEmployee) {
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an employee user. Ask your Admin.`), 403);
  }
  if (targetRole === "super_admin" && (!req.user.secretKey || req.user.secretKey !== req.body.secretKey)) {
    return responseHandler.error(res, new Error(`You do not have permission or invalid secret key to ${action}.`), 403);
  }
};

// Create User
exports.createUser = async (userData) => {
  try {
    const { username, email, password, confirmPassword, role } = userData;

    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });
    if (existingUser) return { error: 'Sorry, This email or username already exists.' };

    verifyEmail(email);
    verifyUsername(username);
    verifyPassword(password, confirmPassword);

    if (role === 'super_admin') userData.secretKey = crypto.randomBytes(32).toString('hex');
    userData.role = role || 'customer';
    userData.password = await bcrypt.hash(password, 10);

    return await User.create(userData);
  } catch (error) {
    return { error: error.message };
  }
};

//~ 100%  Get All Users
exports.getUsers = async () => {
  return await User.findAll({ attributes: ['id', 'username', 'email', 'phone', 'address', 'secAddress', 'role'] });
};

//~ 100% Get User by ID 
exports.getUserById = async (id) => {
  try {
    const user = await User.findOne({where:{ id }, attributes:{exclude:['password', 'resetPasswordToken', 'resetPasswordExpires']}});
    if (!user) throw new Error('User not found');

    const staffData = await Staff.findOne({where:{ userId: id }, attributes:{exclude:['id', 'createdAt', 'updatedAt', 'userId']}});
    if (!staffData) return user;
    
    const [ projects, tasks ] = await Promise.all([
      staffData.projectIds ? Project.findAll({ where: { id: staffData.projectIds } }) : [],
      staffData.taskIds ? Task.findAll({ where: { id: staffData.taskIds } }) : []
    ]);
    delete staffData.dataValues.projectIds;
    delete staffData.dataValues.taskIds;

    return { ...user.dataValues, ...staffData.dataValues, projects, tasks };
  } catch (error) {
    return { error: error.message };
  }
};

// Update User
exports.updateUser = async (id, userData) => {
  await User.update(userData, { where: { id } });
  return await getUserById(id);
};

// Delete User
exports.deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};
