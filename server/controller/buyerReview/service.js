const buyerUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")


module.exports = {
    async create(id, name, address) {
        try {
            const isReviewCreated = buyerUtils.create(id, name, address, 0);
            console.log(isReviewCreated, "fcghjb")
            const result = await common.uploadShopper(isReviewCreated, id)
            const saveHash = await Contract.createShopper(id, result[0], result[1]);
            if (saveHash) {
                return { success: true, message: "Created SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Shopper 01" };
            }

        } catch (error) {
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Shopper 03" };
        }
    },
    async addReview(shopperId, shopperOldJson, reviewerId, reviewText, rating, sellerOldJson, productId) {
        try {
            const [isReviewAdded, isSellerReviewAdded] = await Promise.all([buyerUtils.addReview(shopperOldJson, reviewerId, reviewText, rating, sellerOldJson.name, productId),
            buyerUtils.addSellerReview(sellerOldJson, shopperId, reviewText, rating, shopperOldJson.name, productId)])

            console.log(isReviewAdded, isSellerReviewAdded, "dtfyguhijo")
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadShopper(isReviewAdded, shopperId),
                common.uploadSeller(isSellerReviewAdded, reviewerId)
            ]);

            const saveHash = await Contract.addSellerShopperReview(reviewerId, shopperId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);
            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR buyer 13" + error.message };
        }
    },
    async getData(id) {
        const isIdExist = await Contract.isBuyerIdExist(Number(id))
        if (isIdExist !== "0" && isIdExist !== 0) {
            const data = JSON.parse(await IpfsService.gateway(isIdExist));
            const URL = await IpfsService.getImageURL(isIdExist);
            return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
        } else {
            return { success: false, message: "Id not found", data: "", error: "" }
        }
    },
    async getAllData() {
        const hash = await Contract.getAllBuyerReview();
        if (hash !== 0 && hash !== "0") {
            const data = JSON.parse(await IpfsService.gateway(hash));
            const URL = await IpfsService.getImageURL(hash);
            return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
        } else {
            return { success: false, message: "Data not found", data: "", error: "" }
        }
    },
    async response(dataJson, id, sellerId, reviewerType, reviewText, reviewerId, productId) {
        try {
            const isIdExist = await (reviewerType == 1 ? Contract.isBuyerIdExist(Number(reviewerId)) : Contract.isSellerIdExist(Number(reviewerId)));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJson = JSON.parse(getOldJSON);

            const [responsedataJson, sellerDataJson] = await Promise.all([
                buyerUtils.addResponseToSellerReview(dataJson, sellerId, reviewText, reviewerType, reviewerId, OldJson.name),
                Contract.isSellerIdExist(Number(sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => buyerUtils.addResponseToSellerReview(JSON.parse(getSellerJSON), id, reviewText, reviewerType, reviewerId, OldJson.name))),
            ]);
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadShopper(responsedataJson, id),
                common.uploadSeller(sellerDataJson, sellerId)
            ]);

            const saveHash = await Contract.addReviewReply(productId, sellerId, id, "ProductInfomation1" + productId, sellerInfo[0], shopperInfo[0], 'AllProductInfomation1', sellerInfo[1], shopperInfo[1]);
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
    }



}