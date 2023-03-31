/**
 * Module to handle product related operations
 * @module product
 */
const productUtils = require("./utils"); // importing utility functions
const IpfsService = require("../ipfs/service"); // importing IPFS service module
const Contract = require("../contract/index"); // importing blockchain Contract module
const common = require("./../common/common"); // importing common module

module.exports = {
    /**
     * Create a new product
     * @async
     * @param {string} id - Product id
     * @param {string} name - Product name
     * @param {string} image - Product image
     * @param {string} desc - Product description
     * @param {string} sellerId - Seller id
     * @param {string} sellerName - Seller name
     * @returns {Object} Object with success, message, data and error properties
     */
    async  create(id, name, image, desc, sellerId, sellerName) {
        try {
            // create a new product object using the productUtils module
            const product = productUtils.create(id, name, image, desc, 0, sellerId, sellerName);
            console.log(product,"product")
            // upload the new product object and get the product and all product hashes
            const [productHash, allProductHash] = await common.uploadReview("Product", product, id);
            console.log(productHash, allProductHash,"productHash, allProductHash")
            // create the product on the blockchain and get the saveHash
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

    
    /**
     * Adds a review for a product
     * 
     * @param {number} id - The ID of the product being reviewed
     * @param {object} productOldJSON - The previous JSON data of the product
     * @param {number} reviewerId - The ID of the reviewer
     * @param {string} reviewText - The text of the review
     * @param {number} rating - The rating of the product
     * @param {object} shopperOldJSON - The previous JSON data of the shopper
     * @param {number} sellerId - The ID of the seller
     * @param {object} sellerOldJSON - The previous JSON data of the seller
     * 
     * @returns {object} An object with success status, message, data and error
     */
    async addReview(id, productOldJSON, reviewerId, reviewText, rating, shopperOldJSON, sellerId, sellerOldJSON) {
        try {
            // Adding review to product JSON, seller JSON and shopper JSON using Promise.all()
            const [productReviewAdded, sellerReviewAdded, shopperReviewAdded] = await Promise.all([
                productUtils.addReview(productOldJSON, reviewerId, reviewText, rating, shopperOldJSON.name),
                productUtils.addSellerShopperReview(sellerOldJSON, id, reviewerId, reviewText, rating, shopperOldJSON.name),
                productUtils.addSellerShopperReview(shopperOldJSON, id, reviewerId, reviewText, rating, shopperOldJSON.name)
            ]);
            console.log(shopperReviewAdded,"shopperReviewAdded")
            console.log(sellerReviewAdded,"sellerReviewAdded")
            // Uploading updated JSON to IPFS and storing the hash in variables
            const [productInfo, sellerInfo, shopperInfo] = await Promise.all([
                common.uploadReview("Product", productReviewAdded, id),
                common.uploadReview("Seller" , sellerReviewAdded, sellerId),
                common.uploadReview("Shopper" , shopperReviewAdded, reviewerId)
            ]);
            console.log( shopperInfo, "productInfo, sellerInfo, shopperInfo")
            // Saving the review reply on the blockchain
            const saveHash = await Contract.addReviewReply(id, sellerId, reviewerId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);

            // Return the success or failure of saving the hash
            if (saveHash) {
                return { success: true, message: "Review Posted SuccessFully", data: saveHash, error: null};
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    /**
     * addResponse - function to add response for the review
     *
     * @param {Object} productJSON - productJSON object to be added
     * @param {Number} productId - product id
     * @param {Number} responderId - responder id
     * @param {String} responseText - response text
     * @param {Number} responderType - type of responder (1: shopper, 2: seller)
     * @param {Number} shopperId - shopper id
     *
     * @return {Object} success, message, data, error  - success: true/false, message: response message, data: response data, error: error
     */
    async addResponse(productJSON, productId, responderId, responseText, responderType, shopperId) {
        try {
            // Check if the responder is shopper
            const isShopper = responderType == 1;
            // Get the hash of the review
            const hash = isShopper ? await Contract.viewShopperReview(Number(responderId)) : await Contract.viewSellerReview(Number(responderId));
            // Get the JSON data of the review
            const getOldJSON = await IpfsService.gateway(hash);
            const oldJSON = JSON.parse(getOldJSON);
            // Add the response to the review
            const responseJSON = await productUtils.addResponse(productJSON, responderId, responseText, responderType, shopperId, oldJSON.name);
            // Upload the updated review to IPFS
            const [productInfo, shopperDataJSON, sellerDataJSON] = await Promise.all([
                common.uploadReview("Product", responseJSON, productId),
                Contract.viewShopperReview(Number(shopperId)).then(shopperData => IpfsService.gateway(shopperData).then(getShopperJSON => JSON.parse(getShopperJSON))),
                Contract.viewSellerReview(Number(productJSON.sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => JSON.parse(getSellerJSON))),
            ]);
             // Add the response to the shopper's and seller's JSON data
            const [shopperResponseData, sellerResponseData] = await Promise.all([productUtils.addShopperSellerResponse(shopperDataJSON, productId, oldJSON.name, shopperId, responderId, responseText, responderType),
                productUtils.addShopperSellerResponse(sellerDataJSON, productId, oldJSON.name, shopperId, responderId, responseText, responderType)]);
            // Upload the updated shopper's and seller's JSON data to IPFS
            const [shopperInfo, sellerInfo] = await Promise.all([
                    common.uploadReview("Shopper" , shopperResponseData, shopperId),
                    common.uploadReview("Seller", sellerResponseData, productJSON.sellerId),
            ]);
            // Saving the response on the blockchain
            const saveHash = await Contract.addReviewReply(productId, productJSON.sellerId, shopperId, productInfo[0], sellerInfo[0], shopperInfo[0], productInfo[1], sellerInfo[1], shopperInfo[1]);
            // Return the success or failure of saving the hash
            if (saveHash) {
                return { success: true, message: "Response Posted SuccessFully", data: saveHash, error: null };
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    /**
    Asynchronous function to get the data of a specific product using its ID.
    * @param {Number} id - The ID of the product to get the data for.
    * @returns {Object} - An object containing the success status, message, data, URL, imageURL, and error (if any).
    */
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
    /**
    Asynchronous function to get the data of all products.
    * @returns {Object} - An object containing the success status, message, data, and error (if any).
    */
    async getAllData() {
        try{
            const allProductHash = await Contract.getAllProductReview()
            if (!allProductHash.length || allProductHash != 0 && allProductHash !== "0") {
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