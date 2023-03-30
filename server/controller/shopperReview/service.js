const shopperUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("../common/common")


module.exports = {
    async create(id, name, address) {
        try {
            const isReviewCreated = shopperUtils.create(id, name, address, 0);
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
    async addReview(shopperId, shopperOldJson, revieweeId, reviewText, rating, sellerOldJson, productId) {
        try {
            const [isReviewAdded, isSellerReviewAdded] = await Promise.all([shopperUtils.addReview(shopperOldJson, revieweeId, reviewText, rating, sellerOldJson.name, productId),
            shopperUtils.addSellerReview(sellerOldJson, shopperId, reviewText, rating, shopperOldJson.name, productId)])

            console.log(isReviewAdded, isSellerReviewAdded, "dtfyguhijo")
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadShopper(isReviewAdded, shopperId),
                common.uploadSeller(isSellerReviewAdded, revieweeId)
            ]);

            const saveHash = await Contract.addSellerShopperReview(revieweeId, shopperId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);
            if (saveHash) {
                return { success: true, message: "Posted SuccessFully", data: "", error: "" };
            } else {
                return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR Product 10" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Can't process your request right now please try again later", data: "", error: "ERROR shopper 13" + error.message };
        }
    },
    async getData(id) {
        const isIdExist = await Contract.viewShopperReview(Number(id))
        if (isIdExist !== "0" && isIdExist !== 0) {
            const data = JSON.parse(await IpfsService.gateway(isIdExist));
            const URL = await IpfsService.getImageURL(isIdExist);
            return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
        } else {
            return { success: false, message: "Id not found", data: "", error: "" }
        }
    },
    async getAllData() {
        const hash = await Contract.getAllShopperReview();
        if (hash !== 0 && hash !== "0") {
            const data = JSON.parse(await IpfsService.gateway(hash));
            const URL = await IpfsService.getImageURL(hash);
            return { success: true, message: "Data found", data: data, imageURL: URL, error: "" }
        } else {
            return { success: false, message: "Data not found", data: "", error: "" }
        }
    },
    async response(dataJson, id, sellerId, reviewerType, reviewText, revieweeId, productId) {
        try {
            const isIdExist = await (reviewerType == 1 ? Contract.viewShopperReview(Number(revieweeId)) : Contract.viewSellerReview(Number(revieweeId)));
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJson = JSON.parse(getOldJSON);

            const [responsedataJson, sellerDataJson] = await Promise.all([
                shopperUtils.addResponseToSellerReview(dataJson, sellerId, reviewText, reviewerType, revieweeId, OldJson.name),
                Contract.viewSellerReview(Number(sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => shopperUtils.addResponseToSellerReview(JSON.parse(getSellerJSON), id, reviewText, reviewerType, revieweeId, OldJson.name))),
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