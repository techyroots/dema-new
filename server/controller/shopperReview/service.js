const shopperUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("../common/common")


module.exports = {
    async create(id, name, address) {
        try {
            const shopper = shopperUtils.create(id, name, address, 0);          
            const [shopperHash, allShopperHash] = await common.uploadReview( "Shopper", shopper, id)
            const saveHash = await Contract.createShopper(id, shopperHash, allShopperHash);
            if (saveHash) {
                return { success: true, message: "Shopper Created SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Unable to save shopper hash to the blockchain", data: "", error: "ERROR Shopper" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async addReview(shopperId, shopperOldJSON, revieweeId, reviewText, rating, sellerOldJSON, productId) {
        try {
            const [reviewAdded, sellerReviewAdded] = await Promise.all([shopperUtils.addReview(shopperOldJSON, revieweeId, reviewText, rating, sellerOldJSON.name, productId),
            shopperUtils.addSellerReview(sellerOldJSON, shopperId, reviewText, rating, shopperOldJSON.name, productId)])

            console.log(reviewAdded, sellerReviewAdded, "dtfyguhijo")
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadReview("Shopper", reviewAdded, shopperId),
                common.uploadReview("Seller", sellerReviewAdded, revieweeId)
            ]);

            const saveHash = await Contract.addSellerShopperReview(revieweeId, shopperId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);
            if (saveHash) {
                return { success: true, message: "Review Posted SuccessFully", data: saveHash, error: null};
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async addResponse(dataJSON, id, sellerId, responderId, responseText, responderType, productId) {
        try {
            const isIdExist = await (responderType == 1 ? Contract.viewShopperReview(Number(responderId)) : Contract.viewSellerReview(Number(responderId)));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJSON = JSON.parse(getOldJSON);

            const [responsedataJSON, sellerDataJSON] = await Promise.all([
                shopperUtils.addShopperResponse(dataJSON, sellerId, responderId, responseText, responderType, OldJSON.name),
                Contract.viewSellerReview(Number(sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => shopperUtils.addResponse(JSON.parse(getSellerJSON), id,  responderId, responseText, responderType, OldJSON.name))),
            ]);
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadReview("Shopper", responsedataJSON, id),
                common.uploadReview("Seller", sellerDataJSON, sellerId)
            ]);

            const saveHash = await Contract.addReviewReply(productId, sellerId, id, "Product" + productId, sellerInfo[0], shopperInfo[0], 'AllProduct', sellerInfo[1], shopperInfo[1]);
            if (saveHash) {
                return { success: true, message: "Response Posted SuccessFully", data: saveHash, error: null };
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async getData(id) {
        try{
            const shopperHash = await Contract.viewShopperReview(Number(id))
            if (shopperHash || shopperHash.length) {
                const shopperJSON = JSON.parse(await IpfsService.gateway(shopperHash));
                const URL = await IpfsService.getImageURL(shopperHash);
                return { success: true, message: "Shopper Details Found", data: shopperJSON, URL: URL, error: null }
            } else {
                return { success: false, message: "Shopper Id not exist", data: null, error: null }
            }
        }catch(error){
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async getAllData() {
        try{
            const allShopperHash = await Contract.getAllShopperReview();
            if (allShopperHash || allShopperHash.length) {
                const allShopperJSON = JSON.parse(await IpfsService.gateway(allShopperHash));
                const URL = await IpfsService.getImageURL(allShopperHash);
                return { success: true, message: "All shopper details found", data: allShopperJSON, URL: URL, error: null }
            } else {
                return { success: false, message: "All shopper details not found", data: null, error: null }
            }
        }catch(error){
            return { success: false, message: error.message, data: null, error: error };
        }
    },
  



}