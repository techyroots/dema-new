const validator = require("validator");
const Joi = require('joi');

module.exports = {
    checkValidation(res, req, next){
        let errors = [];
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
                // return { success: false, msg: 'Fields are missing', data: data, errors: errors.join(',') };
                return res.status(400).json({ success: false, msg: "Missing field", data: req.body, errors: errors.join(',') });
            } else {
                next();
            }
        } else {
            return res.status(400).json({ success: false, msg: "Missing field", data: "", errors: "" });
        }
    },
    varCharVerification(value){
        if(typeof(value) == "string"){
            let field = validator.trim(value);
            field = validator.escape(value);
            if (field != null && field != undefined && field != '') {
                const valRegex = /^[a-zA-Z0-9 ]*$/;
                const isValidString = valRegex.test(field);
                if(isValidString){
                    return true;
                }else{
                    return false
                }
            }else{
                return false;
            }
        }else {
            return false
        }
    }

}

exports.createSellerValidation = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      address: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
        error: error,
      });
    }
  
    next();
  };

  exports.createProductValidation = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
        error: error,
      });
    }
  
    next();
  };

  exports.createShopperValidation = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      address: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
        error: error,
      });
    }
  
    next();
  };