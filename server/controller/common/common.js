
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const fs = require('fs')
const path = require('path');
const productUtils = require('./../productReview/utils')
const shopperUtils = require("./../shopperReview/utils")
const sellerUtils = require("./../sellerReview/utils")

module.exports = {
    async uploadProduct(review, id) {
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(review));
        const isUploaded = await IpfsService.pinJSONToIPFS('ProductInfomation1' + id);
        const allProductOldJson = [];
        const allProductOldHash = await Contract.getAllProductReview();

        if (allProductOldHash !== 0 && allProductOldHash !== "0") {
            allProductOldJson = JSON.parse(await IpfsService.gateway(allProductOldHash));
        }

        const generateAllProduct = productUtils.allProduct(allProductOldJson, review, isUploaded.key);
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(generateAllProduct));

        const isUploadedAll = await IpfsService.pinJSONToIPFS('AllProductInfomation1');
        return ([isUploaded.key, isUploadedAll.key]);
    },
    async uploadShopper(review, id) {
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(review));
        const isUploaded = await IpfsService.pinJSONToIPFS('ShopperInfomation1' + id);
        const allShoppersOldJson = []
        const allShoppersOldHash = await Contract.getAllShopperReview();
        if (allShoppersOldHash !== 0 && allShoppersOldHash !== "0") {
            allShoppersOldJson = JSON.parse(await IpfsService.gateway(allShoppersOldHash));
        }
        console.log(allShoppersOldJson, review, isUploaded.key, "xdfghukj")
        const generateAllShopper = await shopperUtils.allShopper(allShoppersOldJson, review, isUploaded.key);
        console.log(generateAllShopper, "generateAllShopper")
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(generateAllShopper));

        const isUploadedAll = await IpfsService.pinJSONToIPFS('AllShopperInfomation1');
        return ([isUploaded.key, isUploadedAll.key]);
    },
    async uploadSeller(review, id) {
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(review));
        const isUploaded = await IpfsService.pinJSONToIPFS('SellerInfomation1' + id);
        const allSellersOldJson = []
        const allSellersOldHash = await Contract.getAllSellerReview();
        if (allSellersOldHash !== 0 && allSellersOldHash !== "0") {
            allSellersOldJson = JSON.parse(await IpfsService.gateway(allSellersOldHash));
        }
        const generateAllSellers = sellerUtils.allSeller(allSellersOldJson, review, isUploaded.key);
        fs.writeFileSync(path.join(__dirname, '../../../data.json'), JSON.stringify(generateAllSellers));
        const isUploadedAll = await IpfsService.pinJSONToIPFS('AllSellerInfomation1');
        return ([isUploaded.key, isUploadedAll.key]);
    }

}