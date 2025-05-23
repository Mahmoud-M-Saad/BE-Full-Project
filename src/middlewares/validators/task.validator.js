const { generateValidation, handleValidationErrors } = require('./validationUtils');

const taskSchema = {
    userId: [
        { type: 'notEmpty', message: 'User ID required' }
    ],
    items: [
        { type: 'notEmpty', message: 'Task items required' }
    ]
};

exports.validateTaskCreate = [
    ...generateValidation(taskSchema, false),
    handleValidationErrors
];

exports.validateTaskUpdate = [
    ...generateValidation(taskSchema, true),
    handleValidationErrors
];
