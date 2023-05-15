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
        console.log(oldJson, "gcfhjbn")
        const index = oldJson.shopperReviews.findIndex(data => data.reviewerId === revieweeId);
        const newReview = {
            productId,
            revieweeId,
            revieweeName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        };
        if (index >= 0) {
            oldJson.shopperReviews[index] = newReview;
        } else {
            oldJson.shopperReviews.push(newReview);
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
        oldJson.sellerToShopperReviews.push({
            productId,
            reviewerId: id,
            reviewerName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: [],
        })
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
        console.log(data)
        const avgRating = data.avgRating;
        const totalReviews = data.sellerReviews.length;
        const totalProducts = data.productReviews.length;
        const obj = { id: data.id, totalProducts: totalProducts, rating: avgRating, totalReviews: totalReviews, IPFS: hash }
        if (Array.isArray(oldData)) {
            const index = oldData.findIndex(item => item.id === data.id);
            if (index >= 0) {
                oldData[index] = obj
            } else {
                oldData.push(obj)
            }
        } else {
            oldData = [obj]
        }

        return oldData;
    },

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
        const Index = dataJson.shopperReviews.findIndex((data) => { return data.revieweeId == shopperId });
        if (Index >= 0) {
            dataJson.shopperReviews[Index].responses.push({
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            })
        }
        return dataJson;
    },

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
        const Index = dataJson.sellerToShopperReviews.findIndex((data) => { return data.reviewerId == id });
        if (Index >= 0) {
            dataJson.sellerToShopperReviews[Index].responses.push({
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date(),
            })
        }
        return dataJson;
    },

    async addTxn(JSON, hash){
        JSON.txnHash = hash;
        return JSON;
    }
}