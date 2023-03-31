const productUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")

module.exports = {
    async create(id, name, image, desc, sellerId, sellerName) {
        try {
            const product = productUtils.create(id, name, image, desc, 0, sellerId, sellerName);
            console.log(product,"product")
            const [productHash, allProductHash] = await common.uploadReview("Product", product, id);
            console.log(productHash, allProductHash,"productHash, allProductHash")
            const saveHash = await Contract.createProduct(id, productHash, allProductHash);
            if (saveHash) {
                return { success: true, message: "Product Created SuccessFully", data: saveHash, error: null };
            } else {
                return { success: false, message: "Unable to save product hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async addReview(id, productOldJSON, reviewerId, reviewText, rating, shopperOldJSON, sellerId, sellerOldJSON) {
        try {
            const [productReviewAdded, sellerReviewAdded, shopperReviewAdded] = await Promise.all([
                productUtils.addReview(productOldJSON, reviewerId, reviewText, rating, shopperOldJSON.name),
                productUtils.addSellerShopperReview(sellerOldJSON, id, reviewerId, reviewText, rating, shopperOldJSON.name),
                productUtils.addSellerShopperReview(shopperOldJSON, id, reviewerId, reviewText, rating, shopperOldJSON.name)
            ]);
            console.log(shopperReviewAdded,"shopperReviewAdded")
            console.log(sellerReviewAdded,"sellerReviewAdded")
            const [productInfo, sellerInfo, shopperInfo] = await Promise.all([
                common.uploadReview("Product", productReviewAdded, id),
                common.uploadReview("Seller" , sellerReviewAdded, sellerId),
                common.uploadReview("Shopper" , shopperReviewAdded, reviewerId)
            ]);

            console.log( shopperInfo, "productInfo, sellerInfo, shopperInfo")
            const saveHash = await Contract.addReviewReply(id, sellerId, reviewerId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

            if (saveHash) {
                return { success: true, message: "Review Posted SuccessFully", data: saveHash, error: null};
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async addResponse(productJSON, productId, responderId, responseText, responderType, shopperId) {
        try {
            const isShopper = responderType == 1;
            const hash = isShopper ? await Contract.viewShopperReview(Number(responderId)) : await Contract.viewSellerReview(Number(responderId));
            const getOldJSON = await IpfsService.gateway(hash);
            const oldJSON = JSON.parse(getOldJSON);
            const responseJSON = await productUtils.addResponse(productJSON, responderId, responseText, responderType, shopperId, oldJSON.name);
            const [productInfo, shopperDataJSON, sellerDataJSON] = await Promise.all([
                common.uploadReview("Product", responseJSON, productId),
                Contract.viewShopperReview(Number(shopperId)).then(shopperData => IpfsService.gateway(shopperData).then(getShopperJSON => JSON.parse(getShopperJSON))),
                Contract.viewSellerReview(Number(productJSON.sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => JSON.parse(getSellerJSON))),
            ]);
            console.log(productInfo, shopperDataJSON, sellerDataJSON,"productInfo, shopperDataJSON, sellerDataJSON")
            const [shopperResponseData, sellerResponseData] = await Promise.all([productUtils.addShopperSellerResponse(shopperDataJSON, productId, oldJSON.name, shopperId, responderId, responseText, responderType),
            productUtils.addShopperSellerResponse(sellerDataJSON, productId, oldJSON.name, shopperId, responderId, responseText, responderType)]);

            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadReview("Shopper" , shopperResponseData, shopperId),
                common.uploadReview("Seller", sellerResponseData, productJSON.sellerId),
            ]);

            const saveHash = await Contract.addReviewReply(productId, productJSON.sellerId, shopperId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

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
            const productHash = await Contract.viewProductReview(Number(id))
            if (productHash || productHash.length) {
                const productJSON = JSON.parse(await IpfsService.gateway(productHash));
                const productImageURL = await IpfsService.getImageURL(productJSON.productImage);
                const hash = await IpfsService.getImageURL(productHash);
                return { success: true, message: "Product Details found", data: productJSON, URL: hash, imageURL: productImageURL, error: null }
            } else {
                return { success: false, message: "Product Id not exist", data: null, error: null }
            }
        }catch(error){
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    async getAllData() {
        try{
            const allProductHash = await Contract.getAllProductReview();
            if (allProductHash || allProductHash.length) {
                const allProductJSON = JSON.parse(await IpfsService.gateway(allProductHash));
                return { success: true, message: "All product details found", data: allProductJSON, error: null }
            } else {
                return { success: false, message: "All product details not found", data: null, error: null }
            }
        }catch(error){
            return { success: false, message: error.message, data: null, error: error };
        }
    }
}