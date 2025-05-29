module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.DECIMAL(10, 2), // YEAR.MONTH format
      allowNull: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employmentType: {
      type: DataTypes.STRING, // e.g., 'full-time', 'part-time', 'contract'
      allowNull: true,
    },
    projectIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of project IDs
      allowNull: true,
    },
    taskIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of task IDs
      allowNull: true,
    }
  }, {
    tableName: 'staff',
    timestamps: true,
  });

  // // Function to dynamically add new department options
  // Staff.addDepartmentOption = async function (newOption) {
  //   if (!this.rawAttributes.department.values.includes(newOption)) {
  //     this.rawAttributes.department.values.push(newOption);
  //     await sequelize.queryInterface.changeColumn('staff', 'department', {
  //       type: DataTypes.ENUM(...this.rawAttributes.department.values),
  //     });
  //   }
  // };

  return Staff;
};
