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

        oldJson.avgRating = await this.getAverageRating(oldJson.reviews);
        return oldJson;
    },

    async addSellerBuyerReview(oldJson, id, reviewerId, reviewText, rating, reviewerName) {
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

    async addResponse(dataJson, reviewerId, reviewerText, reviewerType, buyerId, name) {
        console.log(dataJson, reviewerId, reviewerText, reviewerType, buyerId, name, "tfytguhj")
        const index = dataJson.reviews.findIndex((data) => data.reviewerId === buyerId);
        if (index >= 0) {
            dataJson.reviews[index].responses.push({
                reviewerId,
                reviewerName: name,
                reviewerType,
                responseText: reviewerText,
                timestamp: new Date(),
            });
        }
        return dataJson;
    },

    async addBuyerSellerResponse(dataJson, productId, reviewerText, reviewerType, name, buyerId, reviewerId) {
        const index = dataJson.productReviews.findIndex((data) => Number(data.productId) === Number(productId));
        const responseIndex = dataJson.productReviews[index].reviews.findIndex((data) => data.reviewerId === buyerId);

        dataJson.productReviews[index].reviews[responseIndex].responses.push({
            reviewerId,
            reviewerName: name,
            reviewerType,
            responseText: reviewerText,
            timestamp: new Date(),
        });
        return dataJson;
    },

    async getAverageRating(reviews) {
        const len = reviews.length;
        if (len === 0) return 0;
        if (len === 1) return Number(reviews[0].rating);

        const maxReviews = Math.min(len, 4);
        let ratings = 0;

        for (let i = 1; i <= maxReviews; i++) {
            ratings += Number(reviews[len - i].rating);
        }
        return (ratings / maxReviews).toFixed(2);
    }
};
