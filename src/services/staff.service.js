const db = require('../models');
const { Staff, Project, Task } = db;

exports.createStaffData = async (userData, userId, options = {}) => {
  try {
    const staffData = {
      userId,
      department: userData.department || null,
      experience: userData.experience || null,
      skills: userData.skills || null,
      salary: userData.salary || null,
      appointmentDate: userData.appointmentDate || null,
      employmentType: userData.employmentType || 'Full-time',
      projectIds: userData.projectIds || [],
      taskIds: userData.taskIds || []
    };

    const staff = await Staff.create(staffData, { transaction: options.transaction });
    if (!staff) throw new Error('Staff creation failed');

    return staff;
  } catch (error) {
    return { error: error.message };
  }
};

exports.getStaffByUserIdWithProjectsTasks = async (userId) => {
  try {
    const staff = await Staff.findOne({
      where: { userId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId', 'projectIds', 'taskIds'] },
      include: [{
        model: Project,
        as: 'projects',
        through: { attributes: [] },
        include: [{
          model: Task,
          as: 'tasks'
          // through: { attributes: { exclude: [ 'projectId' ] } },
        }]
      }]
    });
    if (!staff) return { error: 'Staff not found' };

    return staff;
  } catch (error) {
    return { error: error.message };
  }
};


exports.updateStaffData = async (id, userData) => {
  try {
    const staffUpdated = await Staff.update(userData, { where: { id } });
    if (!staffUpdated[0]) return { error: 'Staff not found or no changes made' };

    return await Staff.findByPk(id, { attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] } });
  } catch (error) {
    return { error: error.message };
  }
};