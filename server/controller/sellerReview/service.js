const sellerUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")


module.exports = {
    async create(id, name, address) {
        try {
            const isReviewCreated = sellerUtils.create(id, name, address, 0);
            const result = await common.uploadSeller(isReviewCreated, id);
            const saveHash = await Contract.createSeller(id, result[0], result[1]);
            if (saveHash) {
                return { success: true, message: "Created SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 01" };
            }
        } catch (error) {
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Seller 03" };
        }
    },
    async addReview(sellerId, sellerOldJson, reviewerId, reviewText, rating, shopperOldJson, productId) {
        try {
            const [isReviewAdded, isShopperReviewAdded] = await Promise.all([sellerUtils.addReview(sellerOldJson, reviewerId, reviewText, rating, shopperOldJson.name, productId)
                , sellerUtils.addShopperReview(shopperOldJson, sellerId, reviewText, rating, sellerOldJson.name, productId)]);

            const [sellerInfo, shopperInfo] = await Promise.all([
                common.uploadSeller(isReviewAdded, sellerId),
                common.uploadShopper(isShopperReviewAdded, reviewerId)
            ]);

            const saveHash = await Contract.addSellerShopperReview(sellerId, reviewerId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);

            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR shopper 13" + error.message };
        }
    }
    ,
    async response(dataJson, id, shopperId, reviewerType, reviewText, reviewerId, productId) {
        try {

            const isIdExist = await (reviewerType == 1 ? Contract.viewShopperReview(Number(reviewerId)) : Contract.viewSellerReview(Number(reviewerId)));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJson = JSON.parse(getOldJSON);

            const [responsedataJson, shopperDataJson] = await Promise.all([
                sellerUtils.addResponse(dataJson, shopperId, reviewText, reviewerType, reviewerId, OldJson.name),
                Contract.viewShopperReview(Number(shopperId)).then(shopperData => IpfsService.gateway(shopperData).then(getShopperJSON => sellerUtils.addShopperResponse(JSON.parse(getShopperJSON), id, reviewText, reviewerType, reviewerId, OldJson.name))),
            ]);
            const [sellerInfo, shopperInfo] = await Promise.all([
                common.uploadSeller(responsedataJson, id),
                common.uploadShopper(shopperDataJson, shopperId)
            ]);
            const saveHash = await Contract.addReviewReply(productId, id, shopperId, "P" + productId, sellerInfo[0], shopperInfo[0], 'AllProduct', sellerInfo[1], shopperInfo[1]);
            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            return {
                success: false,
                message: "Can't process your request right now please try again later",
                data: "",
                error: "ERROR Product 01",
            };
        }
    },
    async getData(id) {
        try {
            const isIdExist = await Contract.viewSellerReview(Number(id))
            if (isIdExist !== "0" && isIdExist !== 0) {
                const data = JSON.parse(await IpfsService.gateway(isIdExist));
                const URL = await IpfsService.getImageURL(isIdExist);
                return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
            } else {
                return { success: false, message: "Id not found", data: "", error: "" }
            }
        } catch (error) {
            return { success: false, message: "Error while processing your request please try again later", data: "", error: "" }
        }

    },
    async getAllData() {
        const hash = await Contract.getAllSellerReview();
        if (hash !== 0 && hash !== "0") {
            const data = JSON.parse(await IpfsService.gateway(hash));
            return { success: true, message: "Data found", data: data, error: "" }
        } else {
            return { success: false, message: "Data not found", data: "", error: "" }
        }
    }
}