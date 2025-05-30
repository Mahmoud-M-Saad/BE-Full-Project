const db = require('../models');
const { User, Staff, Project, Task } = db;
const { verifyEmail, verifyPassword } = require('../services/auth.service');
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
    if (username.length < 3 || !/[A-Z]/.test(username)) {
      return { error: 'Username must be at least 3 characters long and include at least one uppercase letter' };
    }
    try {
      verifyEmail(email);
      verifyPassword(password, confirmPassword);
    } catch (validationError) {
      return { error: validationError.message };
    }
    if (role) {
      userData.role = role;
      const key = await User.findOne({ where: { role: 'super_admin', secretKey: userData.superAdminKey } });
      if (!key) return { error: 'Invalid super admin key.' };

      if (role === 'super_admin') {
        userData.secretKey = crypto.randomBytes(32).toString('hex');
      }
    } else {
      userData.role = 'customer';
    }
    userData.password = await bcrypt.hash(password, 10);
    return await User.create(userData);
  } catch (error) {
    
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
