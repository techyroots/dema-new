const express = require("express");
const async = require("async");
const route = express.Router();
const shopperReview = require("../controller/shopperReview/index");
const productReview = require("../controller/productReview/index");
const sellerReview = require("../controller/sellerReview/index");
const Validator = require("../helpers/validators");

const postQueue = async.queue(function(task, callback) {
  task.handler(task.req, task.res, task.next);
  callback();
});

route.get("/", (req, res)=>{
    res.status(203).json({success:true, msg:"API is Working", data:"", error:""})
});

route.get("/shopper-review", shopperReview.getShopperReviews)
route.get("/product-review", productReview.getProductReviews)
route.get("/seller-review", sellerReview.getSellerReviews)

route.get("/all-shopper-review", shopperReview.getAllData)
route.get("/all-product-review", productReview.getAllData)
route.get("/all-seller-review", sellerReview.getAllData)

route.use(Validator.checkValidation);

route.post("/seller-review", function(req, res, next) {
    postQueue.push({
      handler: shopperReview.sellerReview,
      req: req,
      res: res,
      next: next
    });
  });
  
  route.post("/product-review", function(req, res, next) {
    postQueue.push({
      handler: productReview.productReview,
      req: req,
      res: res,
      next: next
    });
  });
  
  route.post("/shopper-review", function(req, res, next) {
    postQueue.push({
      handler: sellerReview.shopperReview,
      req: req,
      res: res,
      next: next
    });
  });
  
  route.post("/product-response", function(req, res, next) {
    postQueue.push({
      handler: productReview.productResponse,
      req: req,
      res: res,
      next: next
    });
  });
  
  route.post("/seller-response", function(req, res, next) {
    postQueue.push({
      handler: shopperReview.sellerResponse,
      req: req,
      res: res,
      next: next
    });
  });
  
  route.post("/shopper-response", function(req, res, next) {
    postQueue.push({
      handler: sellerReview.shopperResponse,
      req: req,
      res: res,
      next: next
    });
  });

  route.post("/create-product", function(req, res, next) {
    postQueue.push({
      handler: productReview.createProduct,
      req: req,
      res: res,
      next: next
    });
  });

  route.post("/create-shopper", function(req, res, next) {
    postQueue.push({
      handler: shopperReview.createShopper,
      req: req,
      res: res,
      next: next
    });
  });

  route.post("/create-seller", function(req, res, next) {
    postQueue.push({
      handler: sellerReview.createSeller,
      req: req,
      res: res,
      next: next
    });
  });

route.use((req, res, next) => {
    res.status(401).json({ success: false, msg: "Route not found", data: {}, errors: '' });
});

module.exports = route;