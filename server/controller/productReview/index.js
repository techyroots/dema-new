const productService = require("./service")
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const Validator = require("../../helpers/validators");
const productValidate = require("./validation")

module.exports = {
    async handleProductReviews(req, res) {
        try {
            const data = Validator.checkValidation(req.body);
            if (!data.success) {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            const { id, name, image, desc, sellerId, reviewText, reviewerId, rating, sellerName } = data.data;
            const validate = productValidate.product(data.data);
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const isIdExist = await Contract.isProductIdExist(Number(id));
            console.log(isIdExist)
            if (isIdExist && isIdExist.length) {
                const [oldJSON, oldBuyerJSON, oldSellerJSON] = await Promise.all([
                    IpfsService.gateway(isIdExist),
                    Contract.isBuyerIdExist(Number(reviewerId)).then(IpfsService.gateway),
                    Contract.isSellerIdExist(Number(sellerId)).then(IpfsService.gateway)
                ]);
                const reviewAdded = await productService.addReview(id, JSON.parse(oldJSON), reviewerId, reviewText, rating, JSON.parse(oldBuyerJSON), sellerId, JSON.parse(oldSellerJSON));
                return res.status(200).send({ success: true, message: "success", data: reviewAdded, error: "" });
            } else {
                const isCreated = await productService.create(id, name, image, desc, sellerId, sellerName);
                return res.status(200).send({ success: true, message: "success", data: isCreated, error: "" });
            }
        } catch (error) {
            return res.status(203).send({ success: false, message: error.message, data: "", error: error.message });
        }
    },
    async handleProductResponse(req, res) {
        try {
            let data = Validator.checkValidation(req.body);
            console.log(data)
            if (!data.success) {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: "" });
            }
            const validate = productValidate.productResponse(req.body)
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const { id, reviewerId, reviewText, reviewerType, buyerId } = req.body;
            const isIdExist = await Contract.isProductIdExist(Number(id));
            if (!isIdExist || !isIdExist.length) {
                return res.status(203).send({ success: false, message: "Product ID does not exist", data: "", error: "" });
            }
            const getJSON = await IpfsService.gateway(isIdExist);
            const isResponseAdded = await productService.response(JSON.parse(getJSON), id, reviewerId, reviewText, reviewerType, buyerId);
            return res.status(200).send({ success: true, message: "success", data: isResponseAdded, error: "" });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: "Internal Server Error", data: "", error: error.message });
        }

    },
    async getProductReviews(req, res) {
        try {
            let data = Validator.checkValidation(req.query);
            if (data['success'] == true) {
                data = data['data'];
            } else {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            console.log(data,data.id,"dgfhj")
            if (data.id !== null && data.id !== undefined && data.id !== "" && !isNaN(data.id)) {
                const response = await productService.getData(data.id);
                if (response.success) {
                    return res.status(200).send(response)
                } else {
                    return res.status(203).send(response)
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(203).send({ success: false, message: "Can't process your request right now! please try again later", data: "", err: "" })
        }

    },
    async getAllData(req, res) {
        const data = await productService.getAllData();
        if (data.success) {
            return res.status(200).send(data)
        } else {
            return res.status(203).send(data)
        }
    }
}