const averageRating = require("./../common/avgRating")
module.exports = {
    create(productId, productName, productImage, productDescription, avgRating, sellerId, sellerName) {
        return {
            productId,
            productName,
            productImage,
            productDescription,
            sellerId,
            sellerName,
            avgRating,
            reviews: [],
        };
    },

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
    }
};
