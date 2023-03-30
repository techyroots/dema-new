const sellerService = require("./service");
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const Validator = require("../../helpers/validators");
const sellerValidate = require("./validation")

module.exports = {
    
    async shopperReviews(req, res) {
        try {
            const { error } = sellerValidate.shopper(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
    
            const { id, reviewText, revieweeId, rating, productId } = req.body;
            const sellerHash = await Contract.viewSellerReview(Number(id));
            if (!sellerHash || !sellerHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Seller ID not exist',
                    data: null,
                    error: null
                });
            }
    
            const [sellerJSON, shopperJSON] = await Promise.all([
                IpfsService.gateway(sellerHash),
                Contract.viewShopperReview(Number(revieweeId)).then(IpfsService.gateway)
            ]);
            const reviewAdded = await sellerService.addReview(id, JSON.parse(sellerJSON), revieweeId, reviewText, rating, JSON.parse(shopperJSON), productId);
            return res.status(200).json(reviewAdded);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    }
    
    ,
    async shopperResponse(req, res) {
        try{
        const { error } = sellerValidate.shopperResponse(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null,
                error: error
            });
        }
    
        const { id, shopperId, reviewerType, reviewText, reviewerId, productId } = req.body;
        const sellerHash = await Contract.viewSellerReview(Number(id));
        if (!sellerHash || !sellerHash.length) {
            return res.status(400).json({
                success: false,
                message: 'Seller ID not exist',
                data: null,
                error: null
            });
        }
    
        
        const sellerJSON = await IpfsService.gateway(sellerHash);
        const responseAdded = await sellerService.response(JSON.parse(sellerJSON), id, shopperId, reviewerType, reviewText, reviewerId, productId);
        return res.status(200).json(responseAdded);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    }
    ,
    async getSellerReviews(req, res) {
        try {
            const sellerId = req.query.id;
            if (!sellerId || isNaN(sellerId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad Request: Missing Seller ID',
                    data: null,
                    error: null
                });
            }
                const response = await sellerService.getData(sellerId);
                if (response.success) {
                    return res.status(200).json(response)
                } else {
                    return res.status(400).json(response)
                }
            
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message, data: null, error });
        }
    },
    async getAllData(req, res) {
        const data = await sellerService.getAllData();
        if (data.success) {
            return res.status(200).json(data)
        } else {
            return res.status(203).json(data)
        }
    }
}