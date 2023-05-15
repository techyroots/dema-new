const averageRating = require("./../common/avgRating")
/**
 * This module exports functions to manipulate product review data
 * @module ProductService
 */
module.exports = {
    /**
     * Creates an object with product review information
     * @function create
     * @param {number} productId - ID of the product
     * @param {string} productName - Name of the product
     * @param {string} productImage - Image URL of the product
     * @param {string} productDescription - Description of the product
     * @param {number} avgRating - Average rating of the product
     * @param {number} sellerId - ID of the seller
     * @param {string} sellerName - Name of the seller
     * @returns {Object} Product review object
     */
    create(productId, productName, productImage, productDescription, avgRating, sellerId, sellerName) {
        return {
            productId,
            productName,
            productImage,
            productDescription,
            sellerId,
            sellerName,
            avgRating,
            txnHash : 0,
            reviews: [],
        };
    },

    /**
     * Adds a new review to the product review object
     * @function addReview
     * @async
     * @param {Object} oldJson - Old product review object
     * @param {number} reviewerId - ID of the reviewer
     * @param {string} reviewText - Text of the review
     * @param {number} rating - Rating of the product
     * @param {string} reviewerName - Name of the reviewer
     * @returns {Object} Updated product review object
     */
    async addReview(oldJson, reviewerId, reviewText, rating, reviewerName) {
        oldJson.reviews.push({
            reviewerId,
            reviewerName,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        });

        oldJson.avgRating = await averageRating.getAverageRating(oldJson.reviews);
        return oldJson;
    },

    /**
     * Adds a new review to the product review object
     * @function addReview
     * @async
     * @param {Object} oldJson - Old product review object
     * @param {number} reviewerId - ID of the reviewer
     * @param {string} reviewText - Text of the review
     * @param {number} rating - Rating of the product
     * @param {string} reviewerName - Name of the reviewer
     * @returns {Object} Updated product review object
     */
    async addSellerShopperReview(oldJson, id, reviewerId, reviewText, rating, reviewerName) {
        const index = oldJson.productReviews.findIndex((Obj) => Obj.productId === id);
        const reviewObj = {
            reviewerId,
            reviewerName,
            reviewText,
            rating,
            Date: new Date(),
            responses: [],
        }
        if (index >= 0) {
            oldJson.productReviews[index].reviews.push(reviewObj);
        } else {
            oldJson.productReviews.push({
                productId: id,
                reviews: [
                    reviewObj,
                ],
            });
        }
        return oldJson;
    },

    /**
     * This function is used to merge the existing data with new product data
     * @param {Array} oldData - The existing product data
     * @param {Object} data - The new product data
     * @param {String} hash - The hash of the product data stored in IPFS
     * @returns {Array} - Returns an array of merged product data
     */
    allProduct(oldData, data, hash) {
        const totalReviews = data.reviews.length;
        const obj = { id: data.productId, rating: data.avgRating, totalReviews: totalReviews, IPFS: hash };
        if (Array.isArray(oldData)) {
            const index = oldData.findIndex((item) => item.id === data.productId);
            if (index >= 0) {
                oldData[index] = obj;
            } else {
                oldData.push(obj);
            }
        } else {
            oldData = [obj];
        }
        return oldData;
    },

    /**
     * This function is used to add a response to a review
     * @param {Object} dataJson - The JSON object of product data
     * @param {Number} responderId - The id of the responder
     * @param {String} responseText - The text of the response
     * @param {Number} responderType - The type of the responder (Seller/Shopper)
     * @param {Number} shopperId - The id of the shopper who wrote the original review
     * @param {String} name - The name of the responder
     * @returns {Object} - Returns the updated JSON object of product data
     */
    async addResponse(dataJson, responderId, responseText, responderType, shopperId, name) {
        const index = dataJson.reviews.findIndex((data) => data.reviewerId === shopperId);
        if (index >= 0) {
            dataJson.reviews[index].responses.push({
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            });
        }
        return dataJson;
    },

    /**
     * This function is used to add a response to a review by a shopper or a seller
     * @param {Object} dataJson - The JSON object of product data
     * @param {Number} productId - The id of the product
     * @param {String} name - The name of the responder
     * @param {Number} shopperId - The id of the shopper who wrote the original review
     * @param {Number} responderId - The id of the responder
     * @param {String} responseText - The text of the response
     * @param {Number} responderType - The type of the responder (Seller/Shopper)
     * @returns {Object} - Returns the updated JSON object of product data
     */
    async addShopperSellerResponse(dataJson, productId, name, shopperId, responderId, responseText, responderType) {
        const index = dataJson.productReviews.findIndex((data) => Number(data.productId) === Number(productId));
        const responseIndex = dataJson.productReviews[index].reviews.findIndex((data) => data.reviewerId === shopperId);

        dataJson.productReviews[index].reviews[responseIndex].responses.push({
            responderId,
            responderName: name,
            responderType,
            responseText,
            timestamp: new Date(),
        });
        return dataJson;
    },
    async addTxn(productJSON, hash){
        console.log(productJSON.txnHash, hash, "product")
        productJSON.txnHash = hash;
        return productJSON;
    }
};
