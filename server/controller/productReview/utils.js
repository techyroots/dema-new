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
            txnHash: 0,
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
    async addReview(productOldJson, reviewerId, reviewText, rating, reviewerName) {
        if (productOldJson.hasOwnProperty('reviews') == false && !Array.isArray(productOldJson.reviews)) {
            productOldJson.reviews = [];
        }

        let obj = {
            reviewerId,
            reviewerName,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        };
        if (productOldJson.reviews.length || Object.keys(productOldJson.reviews).length || Array.isArray(productOldJson.reviews)) {
            const newIndex = Object.keys(productOldJson.reviews).length;
            productOldJson.reviews[newIndex] = obj
        } else {
            productOldJson.reviews = [obj]
        }
        productOldJson.avgRating = await averageRating.getAverageRating(productOldJson.reviews);

        return productOldJson;
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
        const reviewObj = {
            reviewerId,
            reviewText,
            reviewerName,
            rating,
            timestamp: new Date(),
            responses: [],
        };

        if (!oldJson.hasOwnProperty('productReviews') || typeof oldJson.productReviews !== 'object') {
            oldJson.productReviews = {};
        }

        let index;
        if (typeof oldJson.productReviews === 'object') {
            const matchingId = Object.keys(oldJson.productReviews).find((key) => oldJson.productReviews[key].productId === id);
            index = matchingId ? matchingId : -1;
        }
        if (index !== -1) {
            const reviews = oldJson.productReviews[index].reviews;
            let newIndex = Object.keys(oldJson.productReviews[index].reviews).length
            if (!Array.isArray(reviews)) {

                oldJson.productReviews[index].reviews[newIndex] = reviewObj;
            } else {
                reviews[newIndex] = (reviewObj);
            }
        } else {
            oldJson.productReviews[id] = {
                productId: id,
                reviews: [reviewObj],
            };
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
        const totalReviews = Object.keys(data.reviews).length;
        const obj = { id: data.productId, rating: data.avgRating, totalReviews: totalReviews, IPFS: hash };
        if (oldData.length != 0 && Object.keys(oldData).length) {
            let found = false;
            for (const index in oldData.pin.meta) {
                if (oldData.pin.meta[index].id === data.productId) {
                    found = true;
                    // Replace the object at the current index
                    oldData.pin.meta[index] = obj
                    break;
                }
            }
            if (!found) {
                const newIndex = Object.keys(oldData.pin.meta).length.toString();
                oldData.pin.meta[newIndex] = obj
            }
        } else {
            oldData = [obj]
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
        let index;
        if (typeof dataJson.reviews === 'object') {
            const matchingId = Object.keys(dataJson.reviews).find((key) => dataJson.reviews[key].reviewerId === shopperId);
            index = matchingId ? matchingId : -1;
        }
        if (index >= 0) {
            if (!dataJson.reviews[index].hasOwnProperty('responses') || typeof dataJson.reviews[index].responses !== 'object') {
                dataJson.reviews[index].responses = [];
            }
            let newIndex = Object.keys(dataJson.reviews[index].responses).length;
            dataJson.reviews[index].responses[newIndex] = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            };
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
        let index, reviewIndex;
        if (typeof dataJson.productReviews === 'object') {
            const matchingId = Object.keys(dataJson.productReviews).find((key) => dataJson.productReviews[key].productId === productId);
            index = matchingId ? matchingId : -1;        
        }
        if (typeof dataJson.productReviews[index].reviews === 'object') {
            const matchingId = Object.keys(dataJson.productReviews[index].reviews).find((key) =>dataJson.productReviews[index].reviews[key].reviewerId === shopperId);
            reviewIndex = matchingId ? matchingId : -1;        
        }
        if (reviewIndex >= 0) {
            if (!dataJson.productReviews[index].reviews[reviewIndex].hasOwnProperty('responses') || typeof dataJson.productReviews[index].reviews[reviewIndex].responses !== 'object') {
                dataJson.productReviews[index].reviews[reviewIndex].responses = [];
            }
            let newIndex = Object.keys(dataJson.productReviews[index].reviews[reviewIndex].responses).length;
            dataJson.productReviews[index].reviews[reviewIndex].responses[newIndex] = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            };
        }
        return dataJson;
    },

    // /**
    //  * This function is used to add a txn hash to a review
    //  * @param {Object} productJSON - The JSON object of product data
    //  * @param {Number} hash - The transaction hash
    //  * @returns {Object} - Returns the updated JSON object of product data
    //  */
    async addTxn(productJSON, hash) {

        // Update the txnHash property of the productJSON with the new hash
        productJSON.txnHash = hash;

        // Return the updated productJSON
        return productJSON;

    }
}
