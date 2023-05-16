/**
 * Module to handle seller related operations
 * @module seller
 */
const sellerUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("./../common/common")


module.exports = {
    /**
    * Create a new seller
    * @async
    * @param {number} id - The seller's ID
    * @param {string} name - The seller's name
    * @param {string} address - The seller's address
    * @returns {Object} Object with success, message, data and error properties
    */
    async create(id, name, address) {
        try {
            // create a new seller object using the sellerUtils module
            const seller = sellerUtils.create(id, name, address, 0);
            // upload the new seller object and get the seller and all seller hashes
            const [sellerHash, allSellerHash] = await common.uploadReview("Seller", seller, id);
            console.log(sellerHash, allSellerHash)
            // create the seller on the blockchain and get the receipt
            const receipt = await Contract.createSeller(id, sellerHash, allSellerHash);
            if (receipt.status) {
                // update the transaction hash in seller object using the sellerUtils module
                const addTxn = await sellerUtils.addTxn(seller, receipt.transactionHash);
                // upload the new seller object
                const hash = common.updateTxnHash("Seller", addTxn, id);
                return { success: true, message: "Seller Created SuccessFully", data: receipt.status, error: null };
            } else {
                return { success: false, message: "Unable to save seller hash to the blockchain", data: null, error: "ERROR Seller" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },

    /**
     * addReview is a function that adds a review to the seller.
     * @param {number} sellerId - The unique identifier of the seller.
     * @param {object} sellerOldJSON - JSON object containing the old data of the seller.
     * @param {number} revieweeId - The unique identifier of the shopper who is leaving the review.
     * @param {string} reviewText - The text of the review that the shopper is leaving.
     * @param {number} rating - The rating that the shopper is giving to the seller.
     * @param {object} shopperOldJSON - JSON object containing the old data of the shopper.
     * @param {number} productId - The unique identifier of the product that the shopper is reviewing.
     * @returns {object} - Returns an object with a success status, message, data and error.
     */
    async addReview(sellerId, sellerOldJSON, revieweeId, reviewText, rating, shopperOldJSON, productId) {
        try {
            // Adding review to  seller JSON and shopper JSON using Promise.all()
            const [reviewAdded, shopperReviewAdded] = await Promise.all([sellerUtils.addReview(sellerOldJSON, revieweeId, reviewText, rating, shopperOldJSON.name, productId)
                , sellerUtils.addShopperReview(shopperOldJSON, sellerId, reviewText, rating, sellerOldJSON.name, productId)]);
            // Uploading updated JSON to IPFS and storing the hash in variables
            const [sellerInfo, shopperInfo] = await Promise.all([
                common.uploadReview("Seller", reviewAdded, sellerId),
                common.uploadReview("Shopper", shopperReviewAdded, revieweeId)
            ]);
            // Save hash on blockchain
            const receipt = await Contract.addSellerShopperReview(sellerId, revieweeId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);
            if (receipt.status) {
                // update the transaction hash in seller, shopper JSON using the sellerUtils module
                const [addSellerTxn, addShopperTxn] = await Promise.all([
                    sellerUtils.addTxn(reviewAdded, receipt.transactionHash),
                    sellerUtils.addTxn(shopperReviewAdded, receipt.transactionHash)
                ]);
                 // Uploading updated JSON to storj and storing the hash in variables
                await Promise.all([                   
                    common.updateTxnHash("Seller" , addSellerTxn, sellerId),
                    common.updateTxnHash("Shopper" , addShopperTxn, revieweeId)
                ]);
                return { success: true, message: "Review Posted SuccessFully", data: receipt, error: null};
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    }
    ,

    /**
     * Add response to the seller or shopper review
     * @param {Object} dataJSON - The seller JSON data to which response is to be added
     * @param {Number} id - The seller id
     * @param {Number} shopperId - The shopper id who left the review
     * @param {Number} responderId - The id of the responder (seller or shopper)
     * @param {String} responseText - The response text to be added
     * @param {Number} responderType - The type of responder (seller or shopper)
     * @param {Number} productId - The id of the product for which review was left
     * @returns {Object} - The response object with success flag, message and error if any
     */
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
            const receipt = await Contract.addReviewReply(productId, id, shopperId, "Product" + productId, sellerInfo[0], shopperInfo[0], 'AllProduct', sellerInfo[1], shopperInfo[1]);
            if (receipt.status) {
                // update the transaction hash in seller, shopper JSON using the sellerUtils module
                const [addSellerTxn, addShopperTxn] = await Promise.all([
                    sellerUtils.addTxn(sellerDataJSON, receipt.transactionHash),
                    sellerUtils.addTxn(shopperDataJSON, receipt.transactionHash)
                ]);
                // Uploading updated JSON to storj and storing the hash in variables
                await Promise.all([                   
                    common.updateTxnHash("Seller" , addSellerTxn, id),
                    common.updateTxnHash("Shopper" , addShopperTxn, shopperId)
                ]);
                return { success: true, message: "Response Posted SuccessFully", data: receipt, error: null };
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    /**
    Asynchronous function to get the data of a specific seller using its ID.
    * @param {Number} id - The ID of the seller to get the data for.
    * @returns {Object} - An object containing the success status, message, data, URL, and error (if any).
    */
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

    /**
    Asynchronous function to get the data of all seller.
    * @returns {Object} - An object containing the success status, message, data, and error (if any).
    */
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