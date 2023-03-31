// Import required modules
// Express framework for building web applications
const express = require("express");
// Asynchronous module to handle concurrency
const async = require("async");
// Router module to handle routes
const route = express.Router();
// Controller module for shopper reviews
const shopperReview = require("../controller/shopperReview/index");
// Controller module for product reviews
const productReview = require("../controller/productReview/index");
// Controller module for seller reviews
const sellerReview = require("../controller/sellerReview/index");
// Custom validation helper module
const Validator = require("../helpers/validators");

//Create an async queue for handling POST requests
const postQueue = async.queue(function (task, callback) {
  task.handler(task.req, task.res, task.next);
  callback();
});

// Define route handlers
// A GET request for the root endpoint
route.get("/", (req, res) => {
  res
    .status(203)
    .json({ success: true, msg: "API is Working", data: "", error: "" });
});

// This route handles HTTP GET requests to get shopper reviews.
// It uses the getShopperReviews function from the shopperReview controller.
route.get("/shopper-review", shopperReview.getShopperReviews);
// This route handles HTTP GET requests to get product reviews.
// It uses the getProductReviews function from the productReview controller.
route.get("/product-review", productReview.getProductReviews);
// This route handles HTTP GET requests to get seller reviews.
// It uses the getSellerReviews function from the sellerReview controller.
route.get("/seller-review", sellerReview.getSellerReviews);

//GET request to fetch all shopper reviews
route.get("/all-shopper-review", shopperReview.getAllData);
//GET request to fetch all product reviews
route.get("/all-product-review", productReview.getAllData);
//GET request to fetch all seller reviews
route.get("/all-seller-review", sellerReview.getAllData);

//GET request to fetch all seller reviews
route.use(Validator.checkValidation);

//POST request to submit a seller review which is given by shopper
route.post("/seller-review", function (req, res, next) {
  postQueue.push({
    handler: shopperReview.sellerReview,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to submit a product review which is given by shopper
route.post("/product-review", function (req, res, next) {
  postQueue.push({
    handler: productReview.productReview,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to submit a shopper review which is given by shopper
route.post("/shopper-review", function (req, res, next) {
  postQueue.push({
    handler: sellerReview.shopperReview,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to submit a response to a product review
route.post("/product-response", function (req, res, next) {
  postQueue.push({
    handler: productReview.productResponse,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to submit a response to a seller review
route.post("/seller-response", function (req, res, next) {
  postQueue.push({
    handler: shopperReview.sellerResponse,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to submit a response to a shopper review
route.post("/shopper-response", function (req, res, next) {
  postQueue.push({
    handler: sellerReview.shopperResponse,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to create a new product
route.post("/create-product", function (req, res, next) {
  postQueue.push({
    handler: productReview.createProduct,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to create a new shopper
route.post("/create-shopper", function (req, res, next) {
  postQueue.push({
    handler: shopperReview.createShopper,
    req: req,
    res: res,
    next: next,
  });
});

//POST request to create a new seller
route.post("/create-seller", function (req, res, next) {
  postQueue.push({
    handler: sellerReview.createSeller,
    req: req,
    res: res,
    next: next,
  });
});

//Middleware to handle when route not found
route.use((req, res, next) => {
  res
    .status(401)
    .json({ success: false, msg: "Route not found", data: {}, errors: "" });
});

module.exports = route;
