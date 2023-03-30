const validator = require("validator")

module.exports = {
    checkValidation(data){
        let errors = [];
        if (data) {
            for (var [key, value] of Object.entries(data)) {
                if(typeof(value) == "string"){
                    value = validator.trim(value);
                    value = validator.escape(value);
                    if (validator.isEmpty(value) || value == null || value == undefined || value == "null" || value == "undefined" || value == "") {
                        errors.push(`Invalid Input Data for ${key}`);
                    }
                }
            }
            if (errors.length) {
                return { success: false, msg: 'Fields are missing', data: data, errors: errors.join(',') };
            } else {
                return { success: true, msg: 'Fields are valid', data: data, errors: "" };
            }
        } else {
            return { success: false, msg: 'Fields are missing', data: data, errors: 'Fields are missing' };
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

