const averageRating = require("./../common/avgRating")
module.exports = {
    /**
     * create - creates a seller object
     * @param {number} id - seller id
     * @param {string} name - seller name
     * @param {string} address - seller address
     * @param {number} avgRating - average rating of the seller
     * @returns {Object} seller object with id, name, address, average rating, product reviews, seller reviews, shopper reviews
     */
    create(id, name, address, avgRating) {
        return {
            id,
            name,
            address,
            avgRating,
            productReviews: [],
            sellerReviews: [],
            shopperReviews: []
        }
    },
    /**
     * addReview - adds a review from a shopper to the seller's shopper reviews
     * @param {Object} oldJson - old seller data
     * @param {number} revieweeId - id of the person being reviewed
     * @param {string} reviewText - text of the review
     * @param {number} rating - rating of the review
     * @param {string} name - name of the shopper
     * @param {number} productId - id of the product being reviewed
     * @returns {Object} updated seller data with the new review added to shopper reviews
     */
    async addReview(oldJson, revieweeId, reviewText, rating, name, productId) {
        const newReview = {
            productId,
            revieweeId,
            revieweeName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        };

        if (!oldJson.hasOwnProperty('shopperReviews') || typeof oldJson.shopperReviews !== 'object') {
            oldJson.shopperReviews = [];
        }

        
        if (oldJson.shopperReviews.length || Object.keys(oldJson.shopperReviews).length || Array.isArray(oldJson.shopperReviews)) {
            const newIndex = Object.keys(oldJson.shopperReviews).length;
            oldJson.shopperReviews[newIndex] = newReview
        } else {
            oldJson.shopperReviews = [newReview]
        }
        return oldJson;

    }
    ,
    /**
     * addShopperReview - adds a review from a seller to the shopper's seller to shopper reviews
     * @param {Object} oldJson - old shopper data
     * @param {number} id - id of the seller
     * @param {string} reviewText - text of the review
     * @param {number} rating - rating of the review
     * @param {string} name - name of the seller
     * @param {number} productId - id of the product being reviewed
     * @returns {Object} updated shopper data with the new review added to seller to shopper reviews
     */
    async addShopperReview(oldJson, id, reviewText, rating, name, productId) {
        if (oldJson.hasOwnProperty('sellerToShopperReviews') == false && !Array.isArray(oldJson.sellerToShopperReviews)) {
            oldJson.sellerToShopperReviews = [];
        }

        let obj = {
            productId,
            reviewerId: id,
            reviewerName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        };
        if (oldJson.sellerToShopperReviews.length || Object.keys(oldJson.sellerToShopperReviews).length || Array.isArray(oldJson.sellerToShopperReviews)) {
            const newIndex = Object.keys(oldJson.sellerToShopperReviews).length;
            oldJson.sellerToShopperReviews[newIndex] = obj
        } else {
            oldJson.sellerToShopperReviews = [obj]
        }

        oldJson.avgRating = await averageRating.getAverageRating(oldJson.sellerToShopperReviews)

        return oldJson
    },
    /**
     * allSeller() - This function updates the allSellers array by adding the data of a new seller or updating the existing data.
     * @param {Array} oldData - The existing array of all sellers data
     * @param {Object} data - The data of the seller to be added/updated
     * @param {String} hash - The IPFS hash of the seller data
     * @return {Array} - The updated array of all sellers data
     */
    allSeller(oldData, data, hash) {
        const avgRating = data.avgRating;
        let totalReviews = data.sellerReviews ? Object.keys(data.sellerReviews).length : 0;
        let totalProducts = data.productReviews ? Object.keys(data.productReviews).length : 0;

        const obj = {
            id: data.id,
            totalProducts: totalProducts,
            rating: avgRating,
            totalReviews: totalReviews,
            IPFS: hash
        };

        if (oldData.length || Object.keys(oldData).length) {
            let found = false;
            for (const index in oldData.pin.meta) {
                if (oldData.pin.meta[index].id === data.id) {
                    found = true;
                    // Replace the object at the current index
                    oldData.pin.meta[index] = obj;
                    break;
                }
            }
            if (!found) {
                const newIndex = Object.keys(oldData.pin.meta).length.toString();
                oldData.pin.meta[newIndex] = obj;
            }
        } else {
            oldData = [obj];
        }
        return oldData;
    }
    ,

    /**
     * addResponse() - This function adds a response to a shopper's review
     * @param {Object} dataJson - The existing JSON data of the seller
     * @param {String/Number} shopperId - The id of the shopper whose review is being responded to
     * @param {String/Number} responderId - The id of the responder
     * @param {String} responseText - The text of the response
     * @param {Number} responderType - The type of the responder (1 for shopper, 2 for seller)
     * @param {String} name - The name of the responder
     * @return {Object} - The updated JSON data of the seller with added response
     */
    addResponse(dataJson, shopperId, responderId, responseText, responderType, name) {
        let index;
        if (typeof dataJson.shopperReviews === 'object') {
            
            const matchingId = Object.keys(dataJson.shopperReviews).find((key) => dataJson.shopperReviews[key].revieweeId === shopperId);
            index = matchingId ? matchingId : -1;
        }
        
        if (index >= 0) {
            if (!dataJson.shopperReviews[index].hasOwnProperty('responses') || typeof dataJson.shopperReviews[index].responses !== 'object') {
                dataJson.shopperReviews[index].responses = [];
            }
            let newIndex = Object.keys(dataJson.shopperReviews[index].responses).length;
            dataJson.shopperReviews[index].responses[newIndex] = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            }
        }
        return dataJson;
    }

    ,

    /**
     * addShopperResponse() - This function adds a response to a seller's review made by a shopper
     * @param {Object} dataJson - The existing JSON data of the shopper
     * @param {String/Number} id - The id of the seller who made the review
     * @param {String/Number} responderId - The id of the responder
     * @param {String} responseText - The text of the response
     * @param {Number} responderType - The type of the responder (1 for shopper, 2 for seller)
     * @param {String} name - The name of the responder
     * @return {Object} - The updated JSON data of the shopper with added response
     */
    addShopperResponse(dataJson, id, responderId, responseText, responderType, name) {
        let index;
        if (typeof dataJson.sellerToShopperReviews === 'object') {
            
            const matchingId = Object.keys(dataJson.sellerToShopperReviews).find((key) => dataJson.sellerToShopperReviews[key].reviewerId === id);
            index = matchingId ? matchingId : -1;
        }
        if (index >= 0) {
            if (!dataJson.sellerToShopperReviews[index].hasOwnProperty('responses') || typeof dataJson.sellerToShopperReviews[index].responses !== 'object') {
                dataJson.sellerToShopperReviews[index].responses = [];
            }
            let newIndex = Object.keys(dataJson.sellerToShopperReviews[index].responses).length;
            dataJson.sellerToShopperReviews[index].responses[newIndex] = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            }
        }
        return dataJson;
    }

    ,
    /**
    * This function is used to add a txn hash to a review
    * @param {Object} JSON - The JSON object of seller data
    * @param {Number} hash - The transaction hash
    * @returns {Object} - Returns the updated JSON object of product data
    */
    async addTxn(JSON, hash) {
        JSON.txnHash = hash;
        return JSON;
    }
}