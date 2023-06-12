// Import the IPFS service module
const IpfsService = require("../ipfs/service");
// Import the contract module
const Contract = require("../contract/index");
// Import the product review utilities module
const productUtils = require("./../productReview/utils");
// Import the shopper review utilities module
const shopperUtils = require("./../shopperReview/utils");
// Import the seller review utilities module
const sellerUtils = require("./../sellerReview/utils");

module.exports = {
  // Function to upload a review
  async uploadReview(type, review, id) {
    let oldReviews = [];
    let allReviews = [];
    let typeCID;
    let isUploaded;
    switch (type) {
      case "Product":
        // Get all previous product reviews from the contract
        let productOldReview = await Contract.getAllProductReview();
        // Generate a unique CID for the product review
        typeCID = await IpfsService.generateCID(type + id + Math.floor(Date.now() / 1000));
        if (!productOldReview.length || (productOldReview != "" && productOldReview != 0)) {
          // Retrieve old reviews from IPFS if they exist
          oldReviews = await IpfsService.gateway(productOldReview);
        }
        let productReview = {
          'cid': typeCID,
          'meta': review
        };
        // Upload the new product review to IPFS
        isUploaded = await IpfsService.pinJSONToIPFS(productReview);
        // Generate all product reviews with the new review and update the old reviews
        allReviews = productUtils.allProduct(oldReviews, review, isUploaded.requestid);
        break;

      case "Seller":
        // Get all previous seller reviews from the contract
        let sellerOldReview = await Contract.getAllSellerReview();
        // Generate a unique CID for the seller review
        typeCID = await IpfsService.generateCID(type + id + Math.floor(Date.now() / 1000));
        if (!sellerOldReview.length || (sellerOldReview != "" && sellerOldReview != 0)) {
          // Retrieve old reviews from IPFS if they exist
          oldReviews = await IpfsService.gateway(sellerOldReview);
        }
        let sellerReview = {
          'cid': typeCID,
          'meta': review
        };
        // Upload the new seller review to IPFS
        isUploaded = await IpfsService.pinJSONToIPFS(sellerReview);
        // Generate all seller reviews with the new review and update the old reviews
        allReviews = sellerUtils.allSeller(oldReviews, review, isUploaded.requestid);
        break;

      case "Shopper":
        // Get all previous shopper reviews from the contract
        let shopperOldReview = await Contract.getAllShopperReview();
        // Generate a unique CID for the shopper review
        typeCID = await IpfsService.generateCID(type + id + Math.floor(Date.now() / 1000));
        if (!shopperOldReview.length || (shopperOldReview != "" && shopperOldReview != 0)) {
          // Retrieve old reviews from IPFS if they exist
          oldReviews = await IpfsService.gateway(shopperOldReview);
        }
        let shopperReview = {
          'cid': typeCID,
          'meta': review
        };
        // Upload the new shopper review to IPFS
        isUploaded = await IpfsService.pinJSONToIPFS(shopperReview);
        // Generate all shopper reviews with the new review and update the old reviews
        allReviews = await shopperUtils.allShopper(oldReviews, review, isUploaded.requestid);
        break;

      default:
        // Throw an error if an invalid review type is provided
        throw new Error("Invalid review type");
    }

    let AllReview;
    let AllTypeCID = await IpfsService.generateCID("All" + type + Math.floor(Date.now() / 1000));
    if (oldReviews.length == 0)
      AllReview = {
        'cid': AllTypeCID,
        'meta': allReviews
      };
    else {
      AllReview = {
        'cid': AllTypeCID,
        'meta': allReviews.pin.meta
      };
    }
    // Upload the combined reviews to IPFS
    const isUploadedAll = await IpfsService.pinJSONToIPFS(AllReview);
    return [isUploaded.requestid, isUploadedAll.requestid];
  },

  // Function to update the transaction hash for a review
  async updateTxnHash(review, id) {
    let typeCID = await IpfsService.generateCID(id + Math.floor(Date.now() / 1000));
    let Review = {
      'cid': typeCID,
      'meta': review
    };
    // Upload the updated review to IPFS
    const isUploaded = await IpfsService.pinJSONToIPFS(Review);
    // Return an array containing the IPFS hash of the uploaded review
    return isUploaded.requestid;
  }
};
