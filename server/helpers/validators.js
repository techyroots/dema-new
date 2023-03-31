/**
 * Module for input validation
 * @module helpers/validators
 */
const validator = require("validator")

module.exports = {
    /**
   * Middleware function to check input validation for request body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next middleware function
   */
    checkValidation(req,res, next){
        let errors = [];
        console.log(req.body)
        if (req.body) {
            for (var [key, value] of Object.entries(req.body)) {
                if(typeof(value) == "string"){
                    value = validator.trim(value);
                    value = validator.escape(value);
                    if (validator.isEmpty(value) || value == null || value == undefined || value == "null" || value == "undefined" || value == "") {
                        errors.push(`Invalid Input Data for ${key}`);
                    }
                }
            }
            if (errors.length) {
                return res.status(400).json({ success: false, msg: "Missing field", data: req.body, errors: errors.join(',') });
            } else {
                next();
            }
        } else {
            return res.status(400).json({ success: false, msg: "Missing field", data: "", errors: "" });
        }
    }
}

