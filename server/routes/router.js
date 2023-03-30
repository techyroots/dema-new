const express = require("express");
const route = express.Router();
const shopperReview = require("../controller/shopperReview/index");
const productReview = require("../controller/productReview/index");
const sellerReview = require("../controller/sellerReview/index");
const sellerReview = require("../helpers/validators");
const { validationResult } = require("express-validator");

const sendResponse = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  req.controllerHandler(req, res);
};

route.get("/", (req, res) => {
  res.status(203).json({ success: true, msg: "API is Working", data: "", error: "" });
});

route.get("/shopper-review", shopperReview.getShopperReviews);
route.get("/product-review", productReview.getProductReviews);
route.get("/seller-review", sellerReview.getSellerReviews);

route.get("/all-shopper-review", shopperReview.getAllData);
route.get("/all-product-review", productReview.getAllData);
route.get("/all-seller-review", sellerReview.getAllData);

route.post("/shopper-review", shopperReviewValidation, sendResponse, shopperReview.shopperReviews);
route.post("/product-review", productReviewValidation, sendResponse, productReview.productReviews);
route.post("/seller-review", sellerReviewValidation, sendResponse, sellerReview.sellerReviews);
route.post("/product-response", productResponseValidation, sendResponse, productReview.productResponse);
route.post("/seller-response", sellerResponseValidation, sendResponse, shopperReview.sellerResponse);
route.post("/shopper-response", shopperResponseValidation, sendResponse, sellerReview.shopperResponse);
route.post("/create-product", createProductValidation, sendResponse, productReview.createProduct);
route.post("/create-shopper", createShopperValidation, sendResponse, shopperReview.createShopper);
route.post("/create-seller", createSellerValidation, sendResponse, shopperReview.createSeller);

route.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ success: false, msg: err.message, data: {}, errors: '' });
  }
  next();
});

route.use((req, res, next) => {
  res.status(401).json({ success: false, msg: "Route not found", data: {}, errors: '' });
});

module.exports = route;
