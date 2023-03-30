const productUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")

module.exports = {
    async create(id, name, image, desc, sellerId, sellerName) {
        try {
            const review = productUtils.create(id, name, image, desc, 0, sellerId, sellerName);
            const result = await common.uploadProduct(review, id);
            const saveHash = await Contract.createProduct(id, result[0], result[1]);
            if (saveHash) {
                return { success: true, message: "Created SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 01" };
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 01" };
        }
    },
    async addReview(id, productOldJson, reviewerId, reviewText, rating, buyerOldJson, sellerId, sellerOldJson) {
        try {
            const [isReviewAdded, isSellerReviewAdded, isShopperReviewAdded] = await Promise.all([
                productUtils.addReview(productOldJson, reviewerId, reviewText, rating, buyerOldJson.name),
                productUtils.addSellerBuyerReview(sellerOldJson, id, reviewerId, reviewText, rating, buyerOldJson.name),
                productUtils.addSellerBuyerReview(buyerOldJson, id, reviewerId, reviewText, rating, buyerOldJson.name)
            ]);
            console.log(isReviewAdded, isSellerReviewAdded, isShopperReviewAdded, "isReviewAdded, isSellerReviewAdded, isShopperReviewAdded")
            const [productInfo, sellerInfo, shopperInfo] = await Promise.all([
                common.uploadProduct(isReviewAdded, id),
                common.uploadSeller(isSellerReviewAdded, sellerId),
                common.uploadShopper(isShopperReviewAdded, reviewerId)
            ]);

            const saveHash = await Contract.addReviewReply(id, sellerId, reviewerId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            console.log(error)
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 12" };
        }
    }
    ,
    async response(dataJson, productId, reviewerId, raviewerText, reviewerType, buyerId) {
        try {
            const isBuyer = reviewerType == 1;
            const isIdExist = isBuyer ? await Contract.isBuyerIdExist(Number(reviewerId)) : await Contract.isSellerIdExist(Number(reviewerId));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const oldJson = JSON.parse(getOldJSON);
            const responseJson = await productUtils.addResponse(dataJson, reviewerId, raviewerText, reviewerType, buyerId, oldJson.name);
            const [productInfo, buyerDataJson, sellerDataJson] = await Promise.all([
                common.uploadProduct(responseJson, productId),
                Contract.isBuyerIdExist(Number(buyerId)).then(buyerData => IpfsService.gateway(buyerData).then(getBuyerJSON => JSON.parse(getBuyerJSON))),
                Contract.isSellerIdExist(Number(dataJson.sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => JSON.parse(getSellerJSON))),
            ]);

            const [buyerResponseData, sellerResponseData] = await Promise.all([productUtils.addBuyerSellerResponse(buyerDataJson, productId, raviewerText, reviewerType, oldJson.name, buyerId, reviewerId),
            productUtils.addBuyerSellerResponse(sellerDataJson, productId, raviewerText, reviewerType, oldJson.name, buyerId, reviewerId)]);

            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadShopper(buyerResponseData, buyerId),
                common.uploadSeller(sellerResponseData, dataJson.sellerId),
            ]);

            const saveHash = await Contract.addReviewReply(productId, dataJson.sellerId, buyerId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            console.log(error.message);
            return {
                success: false,
                message: "Can't process your request right now please try again later",
                data: "",
                error: "ERROR Product 01",
            };
        }
    },
    async getData(id) {
        const isIdExist = await Contract.isProductIdExist(Number(id))
        if (isIdExist !== "0" && isIdExist !== 0) {
            const data = JSON.parse(await IpfsService.gateway(isIdExist));
            console.log(data, "DSf")
            const URL = await IpfsService.getImageURL(data.productImage);
            return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
        } else {
            return { success: false, message: "Id not found", data: "", error: "" }
        }
    },
    async getAllData() {
        const hash = await Contract.getAllProductReview();
        if (hash !== 0 && hash !== "0") {
            const data = JSON.parse(await IpfsService.gateway(hash));
            return { success: true, message: "Data found", data: data, error: "" }
        } else {
            return { success: false, message: "Data not found", data: "", error: "" }
        }
    }
}