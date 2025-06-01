const db = require('../models');
const { User, Staff, Project, Task, } = db;
const { verifyEmail, verifyPassword, verifyUsername } = require('./auth.service');

// Create User
exports.createUser = async (userData, userId) => {
  try {
    const staffData = {
      userId: userId,
      department: userData.department || null,
      experience: userData.experience || null,
      skills: userData.skills || null,
      salary: userData.salary || null,
      appointmentDate: userData.appointmentDate || null,
      employmentType: userData.employmentType || 'Full-time',
      projectIds: userData.projectIds || [],
      taskIds: userData.taskIds || []
    };

    return await Staff.create(staffData);
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
