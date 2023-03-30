module.exports = {
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
    async addReview(oldJson, reviewerId, review, rating, name, productId) {
        const index = oldJson.shopperReviews.findIndex(data => data.reviewerId === reviewerId);
        const newReview = {
            productId,
            reviewerId,
            reviewerName: name,
            review,
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
    async addShopperReview(oldJson, id, reviewText, rating, name, productId) {      
        oldJson.sellerToShopperReviews.push({
            productId: productId,
            reviewerId: id,
            reviewerName: name,
            reviewText: reviewText,
            rating: rating,
            timestamp: new Date(),
            responses: [],
        })
        oldJson.avgRating = await this.getAverageRating(oldJson.sellerToShopperReviews)
        return oldJson
    },

    allSeller(oldData, data, hash) {
        console.log(data)
        const avgRating = data.avgRating;
        const totalReviews = data.sellerReviews.length;
        const totalProducts = data.productReviews.length;
        const obj = { id: data.id, totalProducts: totalProducts, rating: avgRating, totalReviews: totalReviews, IPFS: hash }
        const index = oldData.findIndex(item => item.id === data.id);
        if (index >= 0) {
            oldData[index] = obj
        } else {
            oldData.push(obj)
        }
        return oldData;
    },
    addResponse(dataJson, shopperId, reviewText, reviewerType, reviewerId, name) {
        const Index = dataJson.shopperReviews.findIndex((data) => { return data.reviewerId == shopperId });
        if (Index >= 0) {
            dataJson.shopperReviews[Index].responses.push({
                reviewerId: reviewerId,
                reviewerName: name,
                reviewerType: reviewerType,
                responseText: reviewText,
                timestamp: new Date()
            })
        }
        return dataJson;
    },
    addShopperResponse(dataJson, id, reviewText, reviewerType, reviewerId, name) {
        const Index = dataJson.sellerToShopperReviews.findIndex((data) => { return data.reviewerId == id });
        if (Index >= 0) {
            dataJson.sellerToShopperReviews[Index].responses.push({
                reviewerId: reviewerId,
                reviewerName: name,
                reviewerType: reviewerType,
                responseText: reviewText,
                timestamp: new Date()
            })
        }
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
}