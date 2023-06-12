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
        const obj = {
            productId,
            revieweeId,
            revieweeName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: []
        };
        if (!oldJson.hasOwnProperty('sellerReviews') && !Array.isArray(oldJson.sellerReviews)) {
            oldJson.sellerReviews = [];
        } 
        if (oldJson.sellerReviews.length || Object.keys(oldJson.sellerReviews).length || Array.isArray(oldJson.sellerReviews)) {
            const newIndex = Object.keys(oldJson.sellerReviews).length;
            oldJson.sellerReviews[newIndex] = obj
        } else {
            oldJson.sellerReviews = [obj]
        }
        return oldJson;
    }
    ,
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
        if (oldJson.hasOwnProperty('sellerReviews') == false && !Array.isArray(oldJson.sellerReviews)) {
            oldJson.sellerReviews = [];
        }

        let obj = {
            productId,
            reviewerId: id,
            reviewerName: name,
            reviewText,
            rating,
            timestamp: new Date(),
            responses: []
        };
    
        if (oldJson.sellerReviews.length || Object.keys(oldJson.sellerReviews).length || Array.isArray(oldJson.sellerReviews)) {
            const newIndex = Object.keys(oldJson.sellerReviews).length;
            oldJson.sellerReviews[newIndex] = obj
        } else {
            oldJson.sellerReviews = [obj]
        }

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
        const totalReviews = data.sellerToShopperReviews ? Object.keys(data.sellerToShopperReviews).length : 0;
        let avgRating = data.sellerToShopperReviews ? await averageRating.getAverageRating(data.sellerToShopperReviews) : 0;
        let totalProducts = data.productReviews? Object.keys(data.productReviews).length : 0;
        const obj = {
            id: data.id,
            totalProducts,
            totalReviews,
            rating: avgRating,
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
        let index;
        if (typeof data.sellerReviews === 'object') {
            const matchingId = Object.keys(data.sellerReviews).find((key) => data.sellerReviews[key].reviewerId === sellerId);
            index = matchingId ? matchingId : -1;
        }
        if (index >= 0) {
            if (!data.sellerReviews[index].hasOwnProperty('responses') || typeof data.sellerReviews[index].responses !== 'object') {
                data.sellerReviews[index].responses = [];
            }
            let newIndex = Object.keys(data.sellerReviews[index].responses).length;
            
            const response = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date()
            };
            data.sellerReviews[index].responses[newIndex] = (response);
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
        let index;
        if (typeof data.sellerReviews === 'object') {
            console.log("inside")
            const matchingId = Object.keys(data.sellerReviews).find((key) => data.sellerReviews[key].revieweeId === sellerId);
            index = matchingId ? matchingId : -1;
        }
        if (index >= 0) {
            if (!data.sellerReviews[index].hasOwnProperty('responses') || typeof data.sellerReviews[index].responses !== 'object') {
                data.sellerReviews[index].responses = [];
            }
            let newIndex = Object.keys(data.sellerReviews[index].responses).length;
            const response = {
                responderId,
                responderName: name,
                responderType,
                responseText,
                timestamp: new Date()
            };
            data.sellerReviews[index].responses[newIndex] = (response);
        }
        console.log(data, "fyghjkl")
        return data;
    },

    /**
    * This function is used to add a txn hash to a review
    * @param {Object} JSON - The JSON object of shopper data
    * @param {Number} hash - The transaction hash
    * @returns {Object} - Returns the updated JSON object of product data
    */
    async addTxn(JSON, hash) {
        JSON.txnHash = hash;
        return JSON;
    }
}