const averageRating = require("./../common/avgRating")
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

    async allShopper(oldData, data, hash) { 
        console.log(oldData,"oldData, data, hash")  
        console.log( data, "data")
        console.log( hash,"hash")   
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
        else{
            oldData = [obj];
        }
        return oldData;
    },

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
        console.log(data,"fyghjkl")
        return data;
    },
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