const { generateValidation, handleValidationErrors } = require('./validationUtils');

const allowedStatuses = ['Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold', 'Done'];
const projectSchema = {
    name: [
        { type: 'trim' },                                     // Remove leading/trailing spaces
        { type: 'isString', message: 'Invalid project name' },
        { type: 'notEmpty', message: 'Project name required' }
    ],
    description: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid description' },
        { type: 'notEmpty', message: 'Description required' }
    ],
    status: [
        {
            type: 'isIn',
            values: allowedStatuses,
            message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
        }
    ],
};

exports.validateProjectCreate = [
    ...generateValidation(projectSchema, false),
    handleValidationErrors
];

exports.validateProjectUpdate = [
    ...generateValidation(projectSchema, true),
    handleValidationErrors
];
