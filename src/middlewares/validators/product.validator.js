const { generateValidation, handleValidationErrors } = require('./validationUtils');

const productSchema = {
    name: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid product name' },
        { type: 'notEmpty', message: 'Product name required' }
    ],
    price: [
        { type: 'notEmpty', message: 'Price required' }
    ],
    description: [
        { type: 'trim' },
        { type: 'isString', message: 'Invalid description' }
    ]
};

exports.validateProductCreate = [
    ...generateValidation(productSchema, false),
    handleValidationErrors
];

exports.validateProductUpdate = [
    ...generateValidation(productSchema, true),
    handleValidationErrors
];
