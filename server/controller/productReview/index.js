const productService = require("./service")
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const productValidate = require("./validation")

module.exports = {
  async createProduct(req, res) {
    try {
      const { error } = productValidate.create(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }
  
      const { id, name, image, desc, sellerId, sellerName } = req.body;
      const productHash = await Contract.viewProductReview(Number(id));
      console.log(productHash,"productHash")
      if (!productHash.length || productHash != '') {
        console.log("inside")
        const productCreated = await productService.create(id, name, image, desc, sellerId, sellerName);
        return res.status(200).json(productCreated);
      } else {
        return res.status(400).json({ success: false, message: "Product ID already exist", data: null, error: null });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },

  async productReview(req, res) {
    try {
      const { error } = productValidate.product(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }

      const { id, sellerId, reviewerId, reviewText, rating } = req.body;
      const productHash = await Contract.viewProductReview(Number(id));

      if (!productHash || !productHash.length) {
        return res.status(400).json({
          success: false,
          message: 'Product ID not exist',
          data: null,
          error: null
        });
      }
      const [oldProductJSON, oldShopperJSON, oldSellerJSON] = await Promise.all([
        IpfsService.gateway(productHash),
        Contract.viewShopperReview(Number(reviewerId)).then(IpfsService.gateway),
        Contract.viewSellerReview(Number(sellerId)).then(IpfsService.gateway)
      ]);
      const reviewAdded = await productService.addReview(id, JSON.parse(oldProductJSON), reviewerId, reviewText, rating, JSON.parse(oldShopperJSON), sellerId, JSON.parse(oldSellerJSON));
      return res.status(200).json(reviewAdded);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },
  async productResponse(req, res) {
    try {
      const { error } = productValidate.productResponse(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.message, data: null, error });
      }
  
      const { productId, responderId, responseText, responderType, shopperId } = req.body;
      const productHash = await Contract.viewProductReview(Number(productId));
  
      if (!productHash || !productHash.length) {
        return res.status(400).json({ success: false, message: "Product ID not found", data: null, error: null });
      }
  
      const productJSON = await IpfsService.gateway(productHash);
      const responseAdded = await productService.addResponse(JSON.parse(productJSON), productId, responderId, responseText, responderType, shopperId);
      return res.status(200).json(responseAdded);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  },
  async getProductReviews(req, res) {
    try {
      const productId = req.query.id;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Bad Request: Missing Product ID'
        });
      }

      const response = await productService.getData(productId);
      if (response.success) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, data: null, error });
    }
  }
  ,
  async getAllData(req, res) {
    const data = await productService.getAllData();
    if (data.success) {
      return res.status(200).json(data)
    } else {
      return res.status(400).json(data)
    }
  }
}