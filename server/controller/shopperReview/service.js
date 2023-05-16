/**
 * Module to handle shopper related operations
 * @module shopper
 */
const shopperUtils = require("./utils")
const IpfsService = require("../ipfs/service")
const Contract = require("../contract/index")
const common = require("../common/common")


module.exports = {
    /**
     * create - creates a shopper and stores its data on the blockchain.
     *
     * @param {number} id - ID of the shopper
     * @param {string} name - Name of the shopper
     * @param {string} address - Address of the shopper
     * @returns {object} - success status, message, data and error.
     */
    async create(id, name, address) {
        try {
            // Create a shopper object
            const shopper = shopperUtils.create(id, name, address, 0);

            // Upload the shopper review to IPFS
            const [shopperHash, allShopperHash] = await common.uploadReview("Shopper", shopper, id)

            // Save the shopper hash to the blockchain
            const receipt = await Contract.createShopper(id, shopperHash, allShopperHash);

            // Return success or failure based on the result of saving the hash
            if (receipt.status) {
                // update the transaction hash in shopper object using the shopperUtils module
                const addTxn = await shopperUtils.addTxn(shopper, receipt.transactionHash);
                // upload the new shopper object
                const hash = common.updateTxnHash("Shopper", addTxn, id);
                return { success: true, message: "Shopper Created SuccessFully", data: receipt.status, error: "" };
            } else {
                return { success: false, message: "Unable to save shopper hash to the blockchain", data: "", error: "ERROR Shopper" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
    /**
     * addReview - function to add review for seller by shopper
     *
     * @param {number} shopperId - The id of the shopper
     * @param {object} shopperOldJSON - The old shopper data stored in IPFS
     * @param {number} revieweeId - The id of the seller being reviewed
     * @param {string} reviewText - The text of the review
     * @param {number} rating - The rating given by the shopper to the seller
     * @param {string} sellerName - The name of the seller
     * @param {number} productId - The id of the product being reviewed
     * @return {object}  - Returns an object with success, message, data and error properties
     */
    async addReview(shopperId, shopperOldJSON, revieweeId, reviewText, rating, sellerOldJSON, productId) {
        try {
            // Adding review to  seller JSON and shopper JSON using Promise.all()
            const [reviewAdded, sellerReviewAdded] = await Promise.all([shopperUtils.addReview(shopperOldJSON, revieweeId, reviewText, rating, sellerOldJSON.name, productId),
            shopperUtils.addSellerReview(sellerOldJSON, shopperId, reviewText, rating, shopperOldJSON.name, productId)])

            // Uploading updated JSON to IPFS and storing the hash in variables
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadReview("Shopper", reviewAdded, shopperId),
                common.uploadReview("Seller", sellerReviewAdded, revieweeId)
            ]);
            // Save hash on blockchain
            const receipt = await Contract.addSellerShopperReview(revieweeId, shopperId, sellerInfo[0], shopperInfo[0], sellerInfo[1], shopperInfo[1]);
            if (receipt.status) {
                // update the transaction hash in seller, shopper JSON using the shopperUtils module
                const [addSellerTxn, addShopperTxn] = await Promise.all([
                    shopperUtils.addTxn(sellerReviewAdded, receipt.transactionHash),
                    shopperUtils.addTxn(reviewAdded, receipt.transactionHash)
                ]);
                // Uploading updated JSON to storj and storing the hash in variables
                await Promise.all([                   
                    common.updateTxnHash("Seller" , addSellerTxn, revieweeId),
                    common.updateTxnHash("Shopper" , addShopperTxn, shopperId)
                ]);
                return { success: true, message: "Review Posted SuccessFully", data: receipt, error: null };
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },
   /**
     * addResponse - Function to add a response to the review made by a shopper
     *
     * @param  {Object} dataJSON       JSON object containing the current data of the shopper
     * @param  {Number} id             ID of the shopper
     * @param  {Number} sellerId       ID of the seller being reviewed
     * @param  {Number} responderId    ID of the responder
     * @param  {String} responseText   Text of the response
     * @param  {Number} responderType  Type of the responder (1 for Shopper, 2 for Seller)
     * @param  {Number} productId      ID of the product being reviewed
     * @return {Object}                JSON object containing the status of the response addition
     */
    async addResponse(dataJSON, id, sellerId, responderId, responseText, responderType, productId) {
        try {
            // Check if the responderId exists in the system (either as Shopper or Seller)
            const isIdExist = await (responderType == 1 ? Contract.viewShopperReview(Number(responderId)) : Contract.viewSellerReview(Number(responderId)));
            // Retrieve the JSON data of the responder
            const getOldJSON = await IpfsService.gateway(isIdExist);
            const OldJSON = JSON.parse(getOldJSON);

            // Add the response to both the shopper and seller JSON data
            const [responsedataJSON, sellerDataJSON] = await Promise.all([
                shopperUtils.addShopperResponse(dataJSON, sellerId, responderId, responseText, responderType, OldJSON.name),
                Contract.viewSellerReview(Number(sellerId)).then(sellerData => IpfsService.gateway(sellerData).then(getSellerJSON => shopperUtils.addResponse(JSON.parse(getSellerJSON), id, responderId, responseText, responderType, OldJSON.name))),
            ]);
            // Upload the updated shopper and seller JSON data to IPFS
            const [shopperInfo, sellerInfo] = await Promise.all([
                common.uploadReview("Shopper", responsedataJSON, id),
                common.uploadReview("Seller", sellerDataJSON, sellerId)
            ]);

            // Save the updated shopper and seller hash to the blockchain
            const receipt = await Contract.addReviewReply(productId, sellerId, id, "Product" + productId, sellerInfo[0], shopperInfo[0], 'AllProduct', sellerInfo[1], shopperInfo[1]);
            if (receipt.status) {
                // update the transaction hash in seller, shopper JSON using the shopperUtils module            
                const [addSellerTxn, addShopperTxn] = await Promise.all([
                    shopperUtils.addTxn(sellerDataJSON, receipt.transactionHash),
                    shopperUtils.addTxn(responsedataJSON, receipt.transactionHash)
                ]);
                // Uploading updated JSON to storj and storing the hash in variables
                await Promise.all([                   
                    common.updateTxnHash("Seller" , addSellerTxn, sellerId),
                    common.updateTxnHash("Shopper" , addShopperTxn, id)
                ]);
                return { success: true, message: "Response posted successfully", data: receipt, error: null };
            } else {
                return { success: false, message: "Unable to save hash to the blockchain", data: null, error: "ERROR" };
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },

     /**
    Asynchronous function to get the data of a specific shopper using its ID.
    * @param {Number} id - The ID of the shopper to get the data for.
    * @returns {Object} - An object containing the success status, message, data, URL, and error (if any).
    */
    async getData(id) {
        try {
            const shopperHash = await Contract.viewShopperReview(Number(id))
            if (shopperHash || shopperHash.length) {
                const shopperJSON = JSON.parse(await IpfsService.gateway(shopperHash));
                const URL = await IpfsService.getImageURL(shopperHash);
                return { success: true, message: "Shopper Details Found", data: shopperJSON, URL: URL, error: null }
            } else {
                return { success: false, message: "Shopper Id not exist", data: null, error: null }
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    },

    /**
    Asynchronous function to get the data of all shopper.
    * @returns {Object} - An object containing the success status, message, data, and error (if any).
    */
    async getAllData() {
        try {
            const allShopperHash = await Contract.getAllShopperReview();
            if (allShopperHash || allShopperHash.length) {
                const allShopperJSON = JSON.parse(await IpfsService.gateway(allShopperHash));
                const URL = await IpfsService.getImageURL(allShopperHash);
                return { success: true, message: "All shopper details found", data: allShopperJSON, URL: URL, error: null }
            } else {
                return { success: false, message: "All shopper details not found", data: null, error: null }
            }
        } catch (error) {
            return { success: false, message: error.message, data: null, error: error };
        }
    }
}