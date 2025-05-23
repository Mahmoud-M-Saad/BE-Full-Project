const { generateValidation, handleValidationErrors } = require('./validationUtils');

const projectSchema = {
    name: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid project name' },
        { type: 'notEmpty', message: 'Project name required' }
    ],
    status: [
        { type: 'notEmpty', message: 'Status required' }
    ],
    description: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid description' }
    ]
};

exports.validateProjectCreate = [
    ...generateValidation(projectSchema, false),
    handleValidationErrors
];

exports.validateProjectUpdate = [
    ...generateValidation(projectSchema, true),
    handleValidationErrors
];
