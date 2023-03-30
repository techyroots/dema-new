const Joi = require('joi');

module.exports = {
    shopper(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            rating: Joi.number().required().label("rating").error(new Error('"Rating" is required and should be valid')),  
            productId:Joi.number().required().label("productId").error(new Error('"productId" is required and should be valid')),
        })
        return schema.validate(body);
    },

    shopperResponse(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            productId:Joi.number().required().label("productId").error(new Error('"productId" is required and should be valid')),
            shopperId:Joi.number().required().label("shopperId").error(new Error('"shopperId" is required and should be valid')),
            reviewerType:Joi.number().required().label("reviewerType").error(new Error('"reviewerType" is required and should be valid')),      
        })
        return schema.validate(body);
    }
};