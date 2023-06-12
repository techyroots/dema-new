//Import required files
const shopperService = require("./service")
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const shopperValidate = require("./validation")

module.exports = {
    /**
     * Async function to create a new shopper
     * @function
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success or error message
     */
    async createShopper(req, res) {
        try {
          // Validate the request body using shopperValidate.create method
          const { error } = shopperValidate.create(req.body);
          if (error) {
            // If there is an error in request body, return error response
            return res.status(400).json({
              success: false,
              message: error.message, // Error message from Joi
              data: null,
              error: error
            });
          }
      
          // Destructuring id, name and address from request body
          const { id, name, address } = req.body;
          // Get the shopper hash by checking the shopper id in blockchain
          const shopperHash = await Contract.viewShopperReview(Number(id));
          if (!shopperHash.length) {
            // If shopper id doesn't exist, create a new shopper
            const shopperCreated = await shopperService.create(id, name, address);
            // Return success response with shopper details
            return res.status(200).json(shopperCreated);
          } else {
            // If shopper id already exists, return error response
            return res.status(400).json({
              success: false,
              message: 'Shopper ID already exists',
              data: {},
              error: null
            });
          }
        } catch (error) {
          // Return error response in case of any unexpected error
          return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Async function to add a review for a seller with review validation
     * @param {Object} req - The request object containing review details
     * @param {Object} res - The response object
     * @returns {Object} - Returns a response object with success status, message, and review data or error
     */
    async sellerReview(req, res) {
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
            // Check if the shopper exists
            const shopperHash = await Contract.viewShopperReview(Number(id));
            if (!shopperHash || !shopperHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Shopper ID not exist',
                    data: null,
                    error: null
                });
            }
            // Get the seller and shopper data from IPFS
            const [oldShopperJSON, oldSellerJSON] = await Promise.all([
                IpfsService.gateway(shopperHash),
                Contract.viewSellerReview(Number(revieweeId)).then(IpfsService.gateway)
            ]);
            // Add the review using the shopperService.addReview method
            const reviewAdded = await shopperService.addReview(id, (oldShopperJSON.pin.meta), revieweeId, reviewText, rating, (oldSellerJSON.pin.meta), productId);
            return res.status(200).json(reviewAdded);

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Adds a response to a seller review.
     *
     * @param {object} req - The HTTP request object.
     * @param {object} res - The HTTP response object.
     * @returns {object} Returns a JSON object with a success flag, a message, and data if successful, or an error object if unsuccessful.
     */
    async sellerResponse(req, res) {
        try {
            // Validate the request body
            const { error } = shopperValidate.sellerResponse(req.body);
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
            const { shopperId, sellerId, responderId, responseText, responderType, productId } = req.body;
            // Get the hash of the shopper review from the contract
            const shopperHash = await Contract.viewShopperReview(Number(shopperId));
             // If the shopper hash is not found or its length is 0, return a bad request response with an appropriate message
            if (!shopperHash || !shopperHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Shopper ID not exist',
                    data: null,
                    error: null
                });
            }
            // Get the JSON data of the shopper review from IPFS
            const shopperJSON = await IpfsService.gateway(shopperHash);
            // Add response
            const responseAdded = await shopperService.addResponse(shopperJSON.pin.meta, shopperId, sellerId, responderId, responseText, responderType, productId);
            return res.status(200).json(responseAdded);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },


    /**
     * Endpoint for getting reviews of a particular shopper
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success/failure status, message, and data/error
     */
    async getShopperReviews(req, res) {
        try {
            // Check if shopper id is present in the query
            const shopperId = req.query.id;
            if (!shopperId || isNaN(shopperId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad Request: Missing Shopper ID',
                    data: null,
                    error: null
                });
            }
            // Call getData method of shopperService to get the reviews data
            const response = await shopperService.getData(shopperId);
            //Return Response
            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },

    /**
     * Endpoint for getting reviews of a all shopper
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response object with success/failure status, message, and data/error
     */
    async getAllData(req, res) {
        // Get all shopper data from the seller service
        const data = await shopperService.getAllData();
        // If the response is successful, return a 200 OK response with the data
        if (data.success) {
            return res.status(200).json(data)
        } else {
            // If the response is not successful, return a 400 Bad Request response with the data
            return res.status(400).json(data)
        }
    }
}
