//Import required files
const sellerService = require("./service");
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const sellerValidate = require("./validation")
const shopperValidate = require("./../shopperReview/validation")

module.exports = {
    /**
     * Async function to create a new seller
     * @function
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success or error message
     */
    async createSeller(req, res) {
        try {
            // Validate the request body using shopperValidate.create()
            const { error } = shopperValidate.create(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error.message
                });
            }

            // Destructure the request body to get id, name, and address of the seller
            const { id, name, address } = req.body;
            // Get the seller hash from the contract using Contract.viewSellerReview
            const sellerHash = await Contract.viewSellerReview(Number(id));
            // If seller hash is not found, create a new seller using sellerService.create()
            if (!sellerHash.length) {
                const sellerCreated = await sellerService.create(id, name, address);
                return res.status(200).json(sellerCreated);
            } else {
                // If seller hash is found, return an error message
                return res.status(400).json({
                    success: false,
                    message: 'Seller ID already exists',
                    data: {},
                    error: null
                });
            }
        } catch (error) {
            // If any error occurs, return an error message
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Async function to add a review for a shopper with review validation
     * @param {Object} req - The request object containing review details
     * @param {Object} res - The response object
     * @returns {Object} - Returns a response object with success status, message, and review data or error
     */
    async shopperReview(req, res) {
        try {
            // Validate the request body using the shopperValidate.review method
            const { error } = shopperValidate.review(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
    
            // Destructure the request body
            const { id, revieweeId, reviewText, rating, productId } = req.body;
    
            // Check if the seller exists
            const sellerHash = await Contract.viewSellerReview(Number(id));
            if (!sellerHash || !sellerHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Seller ID not exist',
                    data: null,
                    error: null
                });
            }
    
            // Get the seller and shopper data from IPFS
            const [sellerJSON, shopperJSON] = await Promise.all([
                IpfsService.gateway(sellerHash),
                Contract.viewShopperReview(Number(revieweeId)).then(IpfsService.gateway)
            ]);
            console.log("inside")
            // Add the review using the sellerService.addReview method
            const reviewAdded = await sellerService.addReview(id, sellerJSON.pin.meta, revieweeId, reviewText, rating, shopperJSON.pin.meta, productId);
    
            // Return the review added data
            return res.status(200).json(reviewAdded);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Adds a response to a shopper review.
     *
     * @param {object} req - The HTTP request object.
     * @param {object} res - The HTTP response object.
     * @returns {object} Returns a JSON object with a success flag, a message, and data if successful, or an error object if unsuccessful.
     */
    async shopperResponse(req, res) {
        try {
            // Validate the request body
            const { error } = sellerValidate.shopperResponse(req.body);
            // If there is an error in the validation, return a bad request response with the error message
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
            // Destructure the request body
            const { sellerId, shopperId, responderId, responseText, responderType, productId } = req.body;
            // Get the hash of the seller review from the contract
            const sellerHash = await Contract.viewSellerReview(Number(sellerId));
            // If the seller hash is not found or its length is 0, return a bad request response with an appropriate message
            if (!sellerHash || !sellerHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Seller ID not exist',
                    data: null,
                    error: null
                });
            }
            // Get the JSON data of the seller review from IPFS
            const sellerJSON = await IpfsService.gateway(sellerHash);
            // Call the addResponse function in the seller service to add the response to the review
            const responseAdded = await sellerService.addResponse(sellerJSON.pin.meta, sellerId, shopperId, responderId, responseText, responderType, productId);
            // Return a success response with the data
            return res.status(200).json(responseAdded);
        } catch (error) {
            // Return a server error response with the error message
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Endpoint for getting reviews of a particular seller
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success/failure status, message, and data/error
     */
    async getSellerReviews(req, res) {
        try {
            // Check if seller id is present in the query
            const sellerId = req.query.id;
            if (!sellerId || isNaN(sellerId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad Request: Missing Seller ID',
                    data: null,
                    error: null
                });
            }

            // Call getData method of sellerService to get the reviews data
            const response = await sellerService.getData(sellerId);

            // Return the response based on the success property of the response object
            if (response.success) {
                return res.status(200).json(response)
            } else {
                return res.status(400).json(response)
            }

        } catch (error) {
            // Return error in case of any exception
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Endpoint for getting reviews of a all seller
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success/failure status, message, and data/error
     */
    async getAllData(req, res) {
        // Get all seller data from the seller service
        const data = await sellerService.getAllData();
        // If the response is successful, return a 200 OK response with the data
        if (data.success) {
            return res.status(200).json(data)
        } else {
            // If the response is not successful, return a 400 Bad Request response with the data
            return res.status(400).json(data)
        }
    }
}