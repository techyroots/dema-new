const Joi = require('joi');

module.exports = {
    product(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            name:  Joi.string().label("Name").error(new Error('"Name" is required and should be valid')),
            image: Joi.string().required().label("Image").error(new Error('"Image" is required and should be valid')),
            desc: Joi.string().required().label("Description").error(new Error('"Description" is required and should be valid')),
            sellerId: Joi.number().required().label("Seller Id").error(new Error('Seller Id is required and should be valid')),
            sellerName: Joi.string().required().label("Seller Name").error(new Error('Seller Name is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            rating: Joi.number().required().label("rating").error(new Error('"Rating" is required and should be valid')),   
        });

        return schema.validate(body);
    },

    productResponse(body){
        const schema = Joi.object({
            id: Joi.number().required().label("Id").error(new Error('"Id" is required and should be valid')),
            buyerId: Joi.number().required().label("buyerId").error(new Error('buyerId is required and should be valid')),
            reviewText: Joi.string().required().label("Review").error(new Error('"Review" is required and should be valid')),
            reviewerId: Joi.number().required().label("Reviewer").error(new Error('"Reviewer Id" is required and should be valid')),
            reviewerType: Joi.number().required().label("rating").error(new Error('"Rating" is required and should be valid')),   
        });

        return schema.validate(body);
    },
};