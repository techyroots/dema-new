const productUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")

module.exports = {
    async create(id, name, image, desc, sellerId, sellerName) {
        try {
            const product = productUtils.create(id, name, image, desc, 0, sellerId, sellerName);
            const result = await common.uploadProduct(product, id);
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
    async addReview(id, productOldJson, reviewerId, reviewText, rating, shopperOldJson, sellerId, sellerOldJson) {
        try {
            const [isReviewAdded, isSellerReviewAdded, isShopperReviewAdded] = await Promise.all([
                productUtils.addReview(productOldJson, reviewerId, reviewText, rating, shopperOldJson.name),
                productUtils.addSellerShopperReview(sellerOldJson, id, reviewerId, reviewText, rating, shopperOldJson.name),
                productUtils.addSellerShopperReview(shopperOldJson, id, reviewerId, reviewText, rating, shopperOldJson.name)
            ]);

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
    async response(dataJson, productId, reviewerId, raviewerText, reviewerType, shopperId) {
        try {
            const isShopper = reviewerType == 1;
            const isIdExist = isShopper ? await Contract.viewShopperReview(Number(reviewerId)) : await Contract.viewSellerReview(Number(reviewerId));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const oldJson = JSON.parse(getOldJSON);
            const responseJson = await productUtils.addResponse(dataJson, reviewerId, raviewerText, reviewerType, shopperId, oldJson.name);
            const [productInfo, shopperDataJson, sellerDataJson] = await Promise.all([
                common.uploadProduct(responseJson, productId),
                Contract.viewShopperReview(Number(shopperId)).then(shopperData => IpfsService.gateway(shopperData).then(getShopperJSON => JSON.parse(getShopperJSON))),
                Contract.viewSellerReview(Number(dataJson.sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => JSON.parse(getSellerJSON))),
            ]);

            const [shopperResponseData, sellerResponseData] = await Promise.all([productUtils.addShopperSellerResponse(shopperDataJson, productId, raviewerText, reviewerType, oldJson.name, shopperId, reviewerId),
            productUtils.addShopperSellerResponse(sellerDataJson, productId, raviewerText, reviewerType, oldJson.name, shopperId, reviewerId)]);

            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadShopper(shopperResponseData, shopperId),
                common.uploadSeller(sellerResponseData, dataJson.sellerId),
            ]);

            const saveHash = await Contract.addReviewReply(productId, dataJson.sellerId, shopperId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

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
        const isIdExist = await Contract.viewProductReview(Number(id))
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