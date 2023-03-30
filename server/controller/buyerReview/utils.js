
module.exports = {
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

    addReview(oldJson, reviewerId, review, rating, name, productId) {
        const index = oldJson.sellerReviews.findIndex(sellerReview => sellerReview.reviewerId === reviewerId);
        const obj = {
            productId: productId,
            reviewerId: reviewerId,
            reviewerName: name,
            review: review,
            rating: rating,
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

    async addSellerReview(oldJson, id, reviewText, rating, name, productId) {      
        oldJson.sellerReviews.push({
            productId: productId,
            reviewerId: id,
            reviewerName: name,
            reviewText: reviewText,
            rating: rating,
            timestamp: new Date(),
            responses: []
        });
        oldJson.avgRating = await this.getAverageRating(oldJson.sellerReviews);
        return oldJson;
    },

    async allBuyer(oldData, data, hash) {
       
        let avgRating = await this.getAverageRating(data.sellerToShopperReviews)
       
        const totalReviews = data.sellerToShopperReviews.length;
        const totalProducts = data.productReviews.length;
        const obj = { id: data.id, totalProducts, totalReviews, rating: avgRating, IPFS: hash };
        console.log(oldData,"olddta")
        if(oldData.length){
            const index = oldData.findIndex((item) => item.id === data.id);
            if (index >= 0) {
                oldData[index] = obj;
            } else {
                oldData.push(obj);
            }
        }else{
            oldData = [(obj)];
        }
        return oldData;
    },

    addResponseToSellerReview(data, sellerId, reviewText, reviewerType, reviewerId, name) {
        const reviewIndex = data.sellerReviews.findIndex(review => review.reviewerId === sellerId);
        if (reviewIndex >= 0) {
            const response = {
                reviewerId,
                reviewerName: name,
                reviewerType,
                responseText: reviewText,
                timestamp: new Date()
            };
            data.sellerReviews[reviewIndex].responses.push(response);
        }
        console.log(data,"fyghjkl")
        return data;
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