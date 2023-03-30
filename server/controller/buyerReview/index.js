const buyerService = require("./service")
const Contract = require("../contract/index")
const Validator = require("../../helpers/validators");
const IpfsService = require("../ipfs/service");
const buyerValidate = require("./validation")


module.exports = {
    /**
     * 
     * @param {Http request} req 
     * @param {Http response} res 
     * @returns {Object} with properties success, message, data and error message}
     */
    async handleBuyerReviews(req, res) {
        try {

            let data = Validator.checkValidation(req.body);
            if (!data.success) {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            const { id, name, address, reviewText, reviewerId, rating, productId } = req.body;
            const validate = buyerValidate.buyer(req.body)
            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const isIdExist = await Contract.isBuyerIdExist(Number(id))
            if (isIdExist !== "0" && isIdExist !== 0 && isIdExist.length !== 0) {
                console.log("if")
                const [oldJson, oldSellerJson] = await Promise.all([
                    IpfsService.gateway(isIdExist),
                    Contract.isSellerIdExist(Number(reviewerId)).then(IpfsService.gateway)
                ]);
                const reviewAdded = await buyerService.addReview(id, JSON.parse(oldJson), reviewerId, reviewText, rating, JSON.parse(oldSellerJson), productId);
                return res.status(200).send({ success: true, message: "success", data: reviewAdded, error: "" })
            } else {
                console.log("else")
                const isCreated = await buyerService.create(id, name, address)
                return res.status(200).send(isCreated)
            }

        } catch (error) {
            return res.status(203).send({ success: false, message: error.message, data: "", error: error.message })
        }
    },
    async handleBuyerResponse(req, res) {
        let data = Validator.checkValidation(req.body);
        if (!data.success) {
            return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: "" });
        }
        const validate = buyerValidate.buyerResponse(req.body)
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const { id, reviewerType, reviewText, reviewerId, sellerId, productId } = req.body
        const isIdExist = await Contract.isBuyerIdExist(Number(id));
        if (!isIdExist || !isIdExist.length) {
            return res.status(203).send({ success: false, message: "Buyer ID does not exist", data: "", error: "" });
        }

        const getJSON = await IpfsService.gateway(isIdExist);
        const isResponseAdded = await buyerService.response(JSON.parse(getJSON), id, sellerId, reviewerType, reviewText, reviewerId, productId);
        return res.status(200).send({ success: true, message: "success", data: isResponseAdded, error: "" })

    },


    /**
     * 
     * @param {Http request} req 
     * @param {Http response} res 
     * @returns {Object} with properties success, message, data and error message}
     */
    async getBuyerReviews(req, res) {
        try {
            let data = Validator.checkValidation(req.query);
            if (data['success'] == true) {
                data = data['data'];
            } else {
                return res.status(201).send({ success: false, msg: "Missing field", data: {}, errors: '' });
            }
            if (data.id !== null && data.id !== undefined && data.id !== "" && !isNaN(data.id)) {
                const response = await buyerService.getData(data.id);
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
        const data = await buyerService.getAllData();
        if (data.success) {
            return res.status(200).send(data)
        } else {
            return res.status(203).send(data)
        }
    }
}
