const sellerService = require("./service");
const Contract = require("../contract/index")
const IpfsService = require("../ipfs/service");
const Validator = require("../../helpers/validators");
const sellerValidate = require("./validation")

module.exports = {
    async handleSellerReviews(req, res) {
        try {
            const data = Validator.checkValidation(req.body);
            if (!data.success) {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            const { id, name, address, reviewText, reviewerId, rating, productId } = req.body;
            const validate = sellerValidate.seller(req.body)
            if (validate.error) {
                throw new Error(validate.error.message);
            }
            const isIdExist = await Contract.isSellerIdExist(Number(id));
            if (isIdExist !== "0" && isIdExist !== 0 && isIdExist.length !== 0) {
                const [oldJson, oldShopperJson] = await Promise.all([
                    IpfsService.gateway(isIdExist),
                    Contract.isBuyerIdExist(Number(reviewerId)).then(IpfsService.gateway)
                ]);
                const reviewAdded = await sellerService.addReview(id, JSON.parse(oldJson), reviewerId, reviewText, rating, JSON.parse(oldShopperJson), productId);
                return res.status(200).send({ success: true, message: "success", data: reviewAdded, error: "" })
            } else {
                const isCreated = await sellerService.create(id, name, address)
                return res.status(200).send({ success: true, message: "success", data: isCreated, error: "" })
            }
        } catch (error) {
            return res.status(203).send({ success: false, message: error.message, data: "", error: error.message })
        }
    }
    ,
    async handleSellerResponse(req, res) {
        let data = Validator.checkValidation(req.body);
        if (data['success'] == true) {
            data = data['data'];
        } else {
            return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
        }
        const validate = sellerValidate.sellerResponse(req.body)
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const { id, buyerId, reviewerType, reviewText, reviewerId, productId } = req.body
        const isIdExist = await Contract.isSellerIdExist(Number(id));
        if (isIdExist !== "0" && isIdExist !== 0 && isIdExist.length !== 0) {
            try {
                const getJSON = await IpfsService.gateway(isIdExist);
                const isResponseAdded = await sellerService.response(JSON.parse(getJSON), id, buyerId, reviewerType, reviewText, reviewerId, productId);
                return res.status(200).send({ success: true, message: "success", data: isResponseAdded, error: "" })
            } catch (error) {
                return res.status(203).send({ success: false, message: error.message, data: "", error: error.message })
            }
        }
    },
    async getSellerReviews(req, res) {
        try {
            let data = Validator.checkValidation(req.query);
            if (data['success'] == true) {
                data = data['data'];
            } else {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            if (data.id !== null && data.id !== undefined && data.id !== "" && !isNaN(data.id)) {
                const response = await sellerService.getData(data.id);
                if (response.success) {
                    return res.status(200).send(response)
                } else {
                    return res.status(203).send(response)
                }
            }
        } catch (error) {
            return res.status(203).send({ success: false, message: "Can't process your request right now! please try again later", data: "", err: "" })
        }
    },
    async getAllData(req, res) {
        const data = await sellerService.getAllData();
        if (data.success) {
            return res.status(200).send(data)
        } else {
            return res.status(203).send(data)
        }
    }
}