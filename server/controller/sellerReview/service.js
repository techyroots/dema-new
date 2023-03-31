const sellerUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")


module.exports = {
    async create(id, name, address) {
        try {
            const seller = sellerUtils.create(id, name, address, 0);
            const [sellerHash, allSellerHash] = await common.uploadReview("Seller", seller, id);
            console.log(sellerHash, allSellerHash)
            const saveHash = await Contract.createSeller(id, sellerHash, allSellerHash);
            if (saveHash) {
                return { success: true, message: "Seller Created SuccessFully", data: saveHash, error: null };
            } else {
                return { success: false, message: "Unable to save seller hash to the blockchain", data: null, error: "ERROR Seller" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async addReview(sellerId, sellerOldJSON, revieweeId, reviewText, rating, shopperOldJSON, productId) {
        try {
            const [reviewAdded, shopperReviewAdded] = await Promise.all([sellerUtils.addReview(sellerOldJSON, revieweeId, reviewText, rating, shopperOldJSON.name, productId)
                , sellerUtils.addShopperReview(shopperOldJSON, sellerId, reviewText, rating, sellerOldJSON.name, productId)]);
            console.log(reviewAdded, shopperReviewAdded,"reviewAdded, shopperReviewAdded")
            const [sellerInfo, shopperInfo] = await Promise.all([
                common.uploadReview("Seller", reviewAdded, sellerId),
                common.uploadReview("Shopper", shopperReviewAdded, revieweeId)
            ]);

            const saveHash = await Contract.addSellerShopperReview(sellerId, revieweeId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);

            if (saveHash) {
                return { success: true, message: "Review Posted SuccessFully", data: saveHash, error: null};
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    }
    ,
    async addResponse(dataJSON, id, shopperId, responderId, responseText, responderType, productId) {
        try {

            const isIdExist = await (responderType == 1 ? Contract.viewShopperReview(Number(responderId)) : Contract.viewSellerReview(Number(responderId)));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJSON = JSON.parse(getOldJSON);

            const [sellerDataJSON, shopperDataJSON] = await Promise.all([
                sellerUtils.addResponse(dataJSON, shopperId, responderId, responseText, responderType, OldJSON.name),
                Contract.viewShopperReview(Number(shopperId)).then(shopperData => IpfsService.gateway(shopperData).then(getShopperJSON => sellerUtils.addShopperResponse(JSON.parse(getShopperJSON), id, responderId, responseText, responderType, OldJSON.name))),
            ]);
            console.log(sellerDataJSON, shopperDataJSON,"sellerDataJSON, shopperDataJSON")
            const [sellerInfo, shopperInfo] = await Promise.all([
                common.uploadReview("Seller", sellerDataJSON, id),
                common.uploadReview("Shopper", shopperDataJSON, shopperId)
            ]);
            const saveHash = await Contract.addReviewReply(productId, id, shopperId, "Product" + productId, sellerInfo[0], shopperInfo[0], 'AllProduct', sellerInfo[1], shopperInfo[1]);
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
        try {
            const sellerHash = await Contract.viewSellerReview(Number(id))
            if (sellerHash || sellerHash.length) {
                const sellerJSON = JSON.parse(await IpfsService.gateway(sellerHash));
                const URL = await IpfsService.getImageURL(sellerHash);
                return { success: true, message: "Seller Details Found", data: sellerJSON, URL: URL, error: null }
            } else {
                return { success: false, message: "Seller Id not exist", data: null, error: null }
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }

    },
    async getAllData() {
        try{
            const allSellerHash = await Contract.getAllSellerReview();
            if (allSellerHash || allSellerHash.length) {
                const allSellerJSON = JSON.parse(await IpfsService.gateway(allSellerHash));
                return { success: true, message: "All seller details found", data: allSellerJSON, error: null }
            } else {
                return { success: false, message: "All seller details not found", data: null, error: null }
            }
        }catch(error){
            return { success: false, message: error.message, data: null, error: error };
        }
    }
}