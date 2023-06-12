// Import the product review service module
const productService = require("./service")
// Import the contract module to access the function
const Contract = require("../contract/index")
// Import the IPFS service module
const IpfsService = require("../ipfs/service");
// Import the validation module
const productValidate = require("./validation")

module.exports = {
  /**
  * Async function to create a product with product validation
  * @param {Object} req - The request object containing product details
  * @param {Object} res - The response object
  * @returns {Object} - Returns a response object with success status, message, and product data or error
  */
  async createProduct(req, res) {
    try {
      // Validate the product data
      const { error } = productValidate.create(req.body);
      if (error) {
        // Return a response object with an error status and message if validation fails
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }
      const { id, name, image, desc, sellerId, sellerName } = req.body;
      // Check if the product already exists in the contract
      const productHash = await Contract.viewProductReview(Number(id));
      if (!productHash.length || productHash != '') {
        // If the product does not exist in the contract, create it
        const productCreated = await productService.create(id, name, image, desc, sellerId, sellerName);
        // Return a response object with a success status and product data
        return res.status(200).json(productCreated);
      } else {
        // If the product already exists in the contract, return a response object with an error status and message
        return res.status(400).json({ success: false, message: "Product ID already exists", data: null, error: null });
      }
    } catch (error) {
      // If an error occurs, return a response object with an error status and message
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },

  /**
  * Async function to add a review for a product with product validation
  * @param {Object} req - The request object containing review details
  * @param {Object} res - The response object
  * @returns {Object} - Returns a response object with success status, message, and review data or error
  */
  async productReview(req, res) {
    try {
      // Validate the review data
      const { error } = productValidate.product(req.body);
      if (error) {
        // Return a response object with an error status and message if validation fails
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }

      const { id, sellerId, reviewerId, reviewText, rating } = req.body;
      // Check if the product already exists in the contract
      const productHash = await Contract.viewProductReview(Number(id));
      if (!productHash || !productHash.length) {
        // If the product does not exist in the contract, return a response object with an error status and message
        return res.status(400).json({
          success: false,
          message: 'Product ID does not exist',
          data: null,
          error: null
        });
      }
      // Retrieve the previous JSON data for the product, shopper, and seller
      const [oldProductJSON, oldShopperJSON, oldSellerJSON] = await Promise.all([
        IpfsService.gateway(productHash),
        Contract.viewShopperReview(Number(reviewerId)).then(IpfsService.gateway),
        Contract.viewSellerReview(Number(sellerId)).then(IpfsService.gateway)
      ]);
      // Add the review to the product and update the product, shopper, and seller JSON data
      const reviewAdded = await productService.addReview(id, (oldProductJSON.pin.meta), reviewerId, reviewText, rating, (oldShopperJSON.pin.meta), sellerId, (oldSellerJSON.pin.meta));
      // Return a response object with a success status and review data
      return res.status(200).json(reviewAdded);

    } catch (error) {
      // If an error occurs, return a response object with an error status and message
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },

  /**
   * Adds a response to a product review.
   *
   * @param {object} req - The HTTP request object.
   * @param {object} res - The HTTP response object.
   * @returns {object} Returns a JSON object with a success flag, a message, and data if successful, or an error object if unsuccessful.
   */
  async productResponse(req, res) {
    try {
      // Validate the incoming request data
      const { error } = productValidate.productResponse(req.body);
      if (error) {
        // If there's an error, return a 400 Bad Request response with an error message
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }

      // Destructure the request body into variables
      const { productId, responderId, responseText, responderType, shopperId } = req.body;

      // Get the IPFS hash for the product from the smart contract
      const productHash = await Contract.viewProductReview(Number(productId));

      // If the product ID is not found, return a 400 Bad Request response
      if (!productHash || !productHash.length) {
        return res.status(400).json({ success: false, message: "Product ID not found", data: null, error: null });
      }

      // Get the product data from IPFS
      const productJSON = await IpfsService.gateway(productHash);

      // Add the response to the product
      const responseAdded = await productService.addResponse(productJSON.pin.meta, productId, responderId, responseText, responderType, shopperId);

      // Return a 200 OK response with the updated product data
      return res.status(200).json(responseAdded);
    } catch (error) {
      // If there's an internal error, return a 500 Internal Server Error response with an error message
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },

  /**
   * Endpoint for getting reviews of a particular product
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response object with success/failure status, message, and data/error
   */
  async getProductReviews(req, res) {
    try {
      // Get the product ID from the query parameters
      const productId = req.query.id;

      // If the product ID is missing, return a 400 Bad Request response
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Bad Request: Missing Product ID'
        });
      }

      // Get the product data from the product service
      const response = await productService.getData(productId);

      // If the response is successful, return a 200 OK response with the data
      if (response.success) {
        return res.status(200).json(response);
      } else {
        // If the response is not successful, return a 400 Bad Request response with the data
        return res.status(400).json(response);
      }
    } catch (error) {
      // If there's an internal error, return a 500 Internal Server Error response with an error message
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },

  /**
   * Endpoint for getting reviews of a all product
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON response object with success/failure status, message, and data/error
   */
  async getAllData(req, res) {
    // Get all product data from the product service
    const data = await productService.getAllData();

    // If the response is successful, return a 200 OK response with the data
    if (data.success) {
      return res.status(200).json(data)
    } else {
      // If the response is not successful, return a 400 Bad Request response with the data
      return res.status(400).json(data)
    }
  },
}