const averageRating = require("./../common/avgRating")
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
    async addReview(oldJson, revieweeId, reviewText, rating, name, productId) {
        console.log(oldJson,"gcfhjbn")
        const index = oldJson.shopperReviews.findIndex(data => data.reviewerId ===  revieweeId);
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
        }else{
            oldData = [obj]
        }
       
        return oldData;
    },
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