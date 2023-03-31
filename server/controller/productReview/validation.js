const Joi = require('joi');

module.exports = {
    /**
     * Validates the request body for creating a product
     * @param {Object} body - The request body to be validated
     * @returns {Object} Returns a Joi validation object
     */
    create(body) {
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            name: Joi.string().label("Name").error(new Error('"Name" is required and should be valid')),
            image: Joi.string().required().label("Image").error(new Error('"Image" is required and should be valid')),
            desc: Joi.string().required().label("Description").error(new Error('"Description" is required and should be valid')),
            sellerId: Joi.number().required().label("Seller Id").error(new Error('Seller Id is required and should be valid')),
            sellerName: Joi.string().required().label("Seller Name").error(new Error('Seller Name is required and should be valid')),
        });

        return schema.validate(body);
    },
    /**
    * Validates the request body for adding a product review
    * @param {Object} body - The request body to be validated
    * @returns {Object} Returns a Joi validation object
    */
    product(body) {
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            sellerId: Joi.number().required().label("Seller Id").error(new Error('Seller Id is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            rating: Joi.number().required().label("rating").error(new Error('"Rating" is required and should be valid')),
        });

        return schema.validate(body);
    },
    
    /**
     * Validates the request body for adding a product review response
     * @param {Object} body - The request body to be validated
     * @returns {Object} Returns a Joi validation object
     */
    productResponse(body) {
        const schema = Joi.object({
            productId: Joi.number().required().label("ProductId").error(new Error('"ProductId" is required and should be valid')),
            shopperId: Joi.number().required().label("ShopperId").error(new Error('ShopperId is required and should be valid')),
            responseText: Joi.string().required().label("ResponseText").error(new Error('"Response" is required and should be valid')),
            responderId: Joi.number().required().label("ResponderId").error(new Error('"Responder Id" is required and should be valid')),
            responderType: Joi.number().required().label("ResponderType").error(new Error('"ResponderType" is required and should be valid')),
        });

        return schema.validate(body);
    },
};