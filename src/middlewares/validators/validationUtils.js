const { body, validationResult } = require('express-validator');

function generateValidation(schema, isUpdate = false) {
    return Object.entries(schema).map(([field, rules]) => {
        let chain = body(field);
        if (isUpdate) chain = chain.optional();
        for (const rule of rules) {
            if (rule.type === 'isString') chain = chain.isString().withMessage(rule.message);
            if (rule.type === 'isEmail') chain = chain.isEmail().withMessage(rule.message);
            if (rule.type === 'isLength') chain = chain.isLength(rule.options).withMessage(rule.message);
            if (rule.type === 'notEmpty') chain = chain.notEmpty().withMessage(rule.message);
            if (rule.type === 'trim') chain = chain.trim();
        }
        return chain;
    });
}

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

module.exports = { generateValidation, handleValidationErrors };
