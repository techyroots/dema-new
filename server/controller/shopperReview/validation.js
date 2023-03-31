const Joi = require('joi');

module.exports = {
    create(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            name:  Joi.string().label("Name").error(new Error('"Name" is required and should be valid')),
            address: Joi.string().label("Address").error(new Error('"Address" is required and should be valid')),
        });
        return schema.validate(body);
    },
    review(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            revieweeId: Joi.number().required().label("RevieweeId").error(new Error('"RevieweeId Id" is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),   
            rating: Joi.number().required().label("rRating").error(new Error('"Rating" is required and should be valid')),  
            productId:Joi.number().required().label("ProductId").error(new Error('"productId" is required and should be valid')),
        })
        return schema.validate(body);
    },
    sellerResponse(body){
        const schema = Joi.object({
            shopperId: Joi.number().required().label("ShopperId").error(new Error('"ShopperId" is required and should be valid')),    
            sellerId:Joi.number().required().label("SellerId").error(new Error('"sellerId" is required and should be valid')),
            responderId: Joi.number().required().label("ResponderId").error(new Error('"ResponderId" is required and should be valid')), 
            responseText: Joi.string().required().label("ResponseText").error(new Error('"ResponseText" is required and should be valid')),
            responderType:Joi.number().required().label("ResponderType").error(new Error('"ResponderType" is required and should be valid')),       
            productId:Joi.number().required().label("ProductId").error(new Error('"productId" is required and should be valid')),          
        });
        return schema.validate(body);
    }
};