const express = require("express");
const route = express.Router();
const buyerReview = require("../controller/buyerReview/index")
// const buyerValidator = require("../controller/buyerReview/validation")
const productReview = require("../controller/productReview/index")
const sellerReview = require("../controller/sellerReview/index")

route.get("/", (req, res)=>{
    res.status(203).send({success:true, msg:"API is Working", data:"", error:""})
});

route.post("/buyer-review", buyerReview.handleBuyerReviews)
route.post("/product-review", productReview.handleProductReviews)
route.post("/seller-review", sellerReview.handleSellerReviews)

route.get("/buyer-review", buyerReview.getBuyerReviews)
route.get("/product-review", productReview.getProductReviews)
route.get("/seller-review", sellerReview.getSellerReviews)

route.get("/all-buyer-review", buyerReview.getAllData)
route.get("/all-product-review", productReview.getAllData)
route.get("/all-seller-review", sellerReview.getAllData)

route.post("/product-response", productReview.handleProductResponse)
route.post("/buyer-response", buyerReview.handleBuyerResponse)
route.post("/seller-response", sellerReview.handleSellerResponse)



route.use((req, res, next) => {
    res.status(401).send({ success: false, msg: "Route not found", data: {}, errors: '' });
});

module.exports = route;