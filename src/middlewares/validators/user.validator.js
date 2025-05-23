const { generateValidation, handleValidationErrors } = require('./validationUtils');

const adminSchema = {
    username: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid username' },
        { type: 'notEmpty', message: 'username required' }
    ],
    email: [
        { type: 'isEmail', message: 'Invalid email' },
        { type: 'notEmpty', message: 'email required' }
    ],
    password: [
        { type: 'isLength', options: { min: 8 }, message: 'password length must be at least 8 chars' },
        { type: 'notEmpty', message: 'password required' }
    ]
};

const validateAdminCreate = [
    ...generateValidation(adminSchema, false),
    handleValidationErrors
];

const validateAdminUpdate = [
    ...generateValidation(adminSchema, true),
    handleValidationErrors
];

const customerSchema = {
    name: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid customer name' },
        { type: 'notEmpty', message: 'Customer name required' }
    ],
    email: [
        { type: 'isEmail', message: 'Invalid email' },
        { type: 'notEmpty', message: 'Email required' }
    ]
};

const validateCustomerCreate = [
    ...generateValidation(customerSchema, false),
    handleValidationErrors
];

const validateCustomerUpdate = [
    ...generateValidation(customerSchema, true),
    handleValidationErrors
];

module.exports = {
    validateAdminCreate,
    validateAdminUpdate,
    validateCustomerCreate,
    validateCustomerUpdate
};