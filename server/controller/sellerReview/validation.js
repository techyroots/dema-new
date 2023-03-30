const Joi = require('joi');

module.exports = {
    seller(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            name:  Joi.string().label("Name").error(new Error('"Name" is required and should be valid')),
            address: Joi.string().label("Address").error(new Error('"Address" is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            rating: Joi.number().required().label("rating").error(new Error('"Rating" is required and should be valid')),  
            productId:Joi.number().required().label("productId").error(new Error('"productId" is required and should be valid')),
        })
        return schema.validate(body);
    },

    sellerResponse(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            productId:Joi.number().required().label("productId").error(new Error('"productId" is required and should be valid')),
            buyerId:Joi.number().required().label("buyerId").error(new Error('"buyerId" is required and should be valid')),
            reviewerType:Joi.number().required().label("reviewerType").error(new Error('"reviewerType" is required and should be valid')),      
        })
        return schema.validate(body);
    }
};