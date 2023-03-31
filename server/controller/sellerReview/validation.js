const Joi = require('joi');

module.exports = {
    /**
     * Validates the request body for creating a shopper response object.
     * @param {Object} body - The request body to be validated.
     * @returns {Object} - An object containing the validation results.
     */
    shopperResponse(body){
        const schema = Joi.object({
            sellerId: Joi.number().required().label("Id").error(new Error('"SellerId" is required and should be valid')),    
            shopperId:Joi.number().required().label("ShopperId").error(new Error('"ShopperId" is required and should be valid')),
            responderId: Joi.number().required().label("ResponderId").error(new Error('"ResponderId" is required and should be valid')), 
            responseText: Joi.string().required().label("ResponseText").error(new Error('"ResponseText" is required and should be valid')),
            responderType:Joi.number().required().label("ResponderType").error(new Error('"ResponderType" is required and should be valid')),       
            productId:Joi.number().required().label("ProductId").error(new Error('"ProductId" is required and should be valid')),          
        });
        return schema.validate(body);
    }
};