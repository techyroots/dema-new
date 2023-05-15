const averageRating = require("./../common/avgRating")
module.exports = {
    /**
     * create
     * This function creates a new shopper object with the given parameters.
     * 
     * @param {Number} id - The unique identifier for the shopper.
     * @param {String} name - The name of the shopper.
     * @param {String} address - The address of the shopper.
     * @param {Number} avgRating - The average rating of the shopper.
     * 
     * @returns {Object} - The created shopper object.
     */
    create(id, name, address, avgRating) {
        console.log(avgRating)
        return {
            id: id,
            name: name,
            address: address,
            avgRating: avgRating,
            productReviews: [],
            sellerReviews: [],
            sellerToShopperReviews: []
        }
    },

    /**
     * addReview
     * This function adds a review for a seller to an existing shopper object.
     * 
     * @param {Object} oldJson - The existing shopper object.
     * @param {Number} revieweeId - The unique identifier of the seller being reviewed.
     * @param {String} reviewText - The text of the review.
     * @param {Number} rating - The rating of the review (from 1 to 5).
     * @param {String} name - The name of the seller being reviewed.
     * @param {Number} productId - The identifier of the product being reviewed.
     * 
     * @returns {Object} - The updated shopper object.
     */
    addReview(oldJson, revieweeId, reviewText, rating, name, productId) {
        const index = oldJson.sellerReviews.findIndex(sellerReview => sellerReview.reviewerId === revieweeId);
        const obj = {
            productId,
            revieweeId,
            revieweeName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: []
        }
        if (index >= 0) {
            oldJson.sellerReviews[index] = obj;
        } else {
            oldJson.sellerReviews.push(obj);
        }
        return oldJson;
    },
    /**
    addSellerReview - Function to add seller review to the shopper JSON
    @param {object} oldJson Old JSON data of the shopper
    @param {number} id ID of the shopper who is adding the review
    @param {string} reviewText Text of the review
    @param {number} rating Rating given by the shopper
    @param {string} name Name of the shopper
    @param {string} productId ID of the product being reviewed
    @returns {object} JSON object with the updated review
    */
    async addSellerReview(oldJson, id, reviewText, rating, name, productId) {
        oldJson.sellerReviews.push({
            productId,
            reviewerId: id,
            reviewerName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: []
        });
        oldJson.avgRating = await averageRating.getAverageRating(oldJson.sellerReviews);
        return oldJson;
    },

    /**
    allShopper - Function to update the IPFS hash of all shopper data
    @param {array} oldData Old JSON data of all shopper
    @param {object} data JSON data of the current shopper
    @param {string} hash IPFS hash of the current shopper
    @returns {array} Array with updated shopper data
    */
    async allShopper(oldData, data, hash) {
        const avgRating = await averageRating.getAverageRating(data.sellerToShopperReviews)
        const totalReviews = data.sellerToShopperReviews.length;
        const totalProducts = data.productReviews.length;
        const obj = { id: data.id, totalProducts, totalReviews, rating: avgRating, IPFS: hash };
        if (Array.isArray(oldData)) {
            const index = oldData.findIndex((item) => item.id === data.id);
            if (index >= 0) {
                oldData[index] = obj;
            } else {
                oldData.push(obj);
            }
        }
        else {
            oldData = [obj];
        }
        return oldData;
    },

    /**
     * addResponse - Function to add response to a review
     * 
     * @param {Object} data - JSON data of the reviewer
     * @param {Number} sellerId - Id of the seller who is being reviewed
     * @param {Number} responderId - Id of the responder
     * @param {String} responseText - Response text
     * @param {Number} responderType - Type of responder (shopper or seller)
     * @param {String} name - Name of the responder
     * 
     * @returns {Object} - JSON data of the reviewer with added response
     */
    addResponse(data, sellerId, responderId, responseText, responderType, name) {
        const responseIndex = data.sellerReviews.findIndex(review => review.reviewerId === sellerId);
        if (responseIndex >= 0) {
            const response = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date()
            };
            data.sellerReviews[responseIndex].responses.push(response);
        }
        return data;
    },

    /**
     * addResponse - Function to add response to a review
     * 
     * @param {Object} data - JSON data of the reviewer
     * @param {Number} sellerId - Id of the seller who is being reviewed
     * @param {Number} responderId - Id of the responder
     * @param {String} responseText - Response text
     * @param {Number} responderType - Type of responder (shopper or seller)
     * @param {String} name - Name of the responder
     * 
     * @returns {Object} - JSON data of the reviewer with added response
     */
    addShopperResponse(data, sellerId, responderId, responseText, responderType, name) {
        const responseIndex = data.sellerReviews.findIndex(review => review.revieweeId === sellerId);
        if (responseIndex >= 0) {
            const response = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date()
            };
            data.sellerReviews[responseIndex].responses.push(response);
        }
        console.log(data, "fyghjkl")
        return data;
    },
    async addTxn(JSON, hash){
        JSON.txnHash = hash;
        return JSON;
    }
}