const shopperService = require("./service")
const Contract = require("../contract/index")
const Validator = require("../../helpers/validators");
const IpfsService = require("../ipfs/service");
const shopperValidate = require("./validation")
const sellerService = require("./../sellerReview/service")

module.exports = {
    async createShopper(req, res) {
        try {
            const { error } = shopperValidate.create(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
    
            const { id, name, address } = req.body;
            const shopperHash = await Contract.viewShopperReview(Number(id));
            if (!shopperHash.length) {
                const shopperCreated = await shopperService.create(id, name, address);
                return res.status(200).json(shopperCreated);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Shopper ID already exists',
                    data: {},
                    error: null
                });
            }
        } catch (error) {
            next(error);
        }
    }
    ,

    async createSeller(req, res) {
        try {
            const { error } = sellerValidate.create(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error.message
                });
            }
    
            const { id, name, address } = req.body;
            const sellerHash = await Contract.viewSellerReview(Number(id));
            if (!sellerHash.length) {
                const sellerCreated = await sellerService.create(id, name, address);
                return res.status(200).json(sellerCreated);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Seller ID already exists',
                    data: {},
                    error: null
                });
            }
        } catch (error) {
            next(error);
        }
    }
    ,
    
    /**
     * 
     * @param {Http request} req 
     * @param {Http response} res 
     * @returns {Object} with properties success, message, data and error message}
     */
     async sellerReview(req, res) {
        try {
            const { error } = shopperValidate.seller(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
    
            const { id, reviewText, reviewerId, rating, productId } = req.body;
            const shopperHash = await Contract.viewShopperReview(Number(id));
            if (shopperHash && shopperHash.length) {
                const [oldShopperJSON, oldSellerJSON] = await Promise.all([
                    IpfsService.gateway(shopperHash),
                    Contract.viewSellerReview(Number(reviewerId)).then(IpfsService.gateway)
                ]);
                const reviewAdded = await shopperService.addReview(id, JSON.parse(oldShopperJSON), reviewerId, reviewText, rating, JSON.parse(oldSellerJSON), productId);
                return res.status(200).json(reviewAdded);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Shopper ID not exist',
                    data: {},
                    error: null
                });
            }
        } catch (error) {
            rnext(error);
        }
    },

    async sellerResponse(req, res) {
        try {
            const { error } = shopperValidate.sellerResponse(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null,
                    error: error
                });
            }
    
            const { id, reviewerType, reviewText, reviewerId, sellerId, productId } = req.body;
            const shopperHash = await Contract.viewShopperReview(Number(id));
            if (!shopperHash || !shopperHash.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Shopper ID not exist',
                    data: null,
                    error: null
                });
            }
            const shopperJSON = await IpfsService.gateway(shopperHash);
            const responseAdded = await shopperService.response(JSON.parse(shopperJSON), id, sellerId, reviewerType, reviewText, reviewerId, productId);
            return res.status(200).json(responseAdded);
        } catch (error) {
            next(error);
        }
    },


    /**
     * 
     * @param {Http request} req 
     * @param {Http response} res 
     * @returns {Object} with properties success, message, data and error message}
     */
     async getShopperReviews(req, res) {
        try {
            const shopperId = req.query.id;
            if (!shopperId || isNaN(shopperId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad Request: Missing Shopper ID',
                    data: null,
                    error: null
                });
            }
    
            const response = await shopperService.getData(shopperId);
            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            next(error);
        }
    },
    
    async getAllData(req, res) {
        const data = await shopperService.getAllData();
        if (data.success) {
            return res.status(200).json(data)
        } else {
            return res.status(400).json(data)
        }
    }
}
