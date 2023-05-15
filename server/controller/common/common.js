// Import the IPFS service module
const IpfsService = require("../ipfs/service");
// Import the contract module
const Contract = require("../contract/index");
// Import the file system module
const fs = require("fs");
// Import the path module
const path = require("path");
// Import the product review utilities module
const productUtils = require("./../productReview/utils");
// Import the shopper review utilities module
const shopperUtils = require("./../shopperReview/utils");
// Import the seller review utilities module
const sellerUtils = require("./../sellerReview/utils");

module.exports = {
  /**
   * Uploads a review to IPFS.
   * @param {string} type - The type of review to upload ('Product', 'Shopper', or 'Seller').
   * @param {Object} review - The review object to upload.
   * @param {string} id - The ID of the review to upload.
   * @returns {Array} An array of two keys representing the IPFS hash of the uploaded review and the IPFS hash of all reviews of the same type.
   * @throws {Error} If an invalid review type is provided.
   */
  async uploadReview(type, review, id) {
    // Initialize variables
    let oldReviews = [];
    let filename = "";
    let allReviews = [];
    let oldReview;

    // Switch based on the type of review
    switch (type) {
      case "Product":
        // Set filename and get old reviews for product review
        filename = "product.json";
        oldReview = await Contract.getAllProductReview();
        console.log(oldReview,"oldReview")
        if (!oldReview.length || (oldReview != "" && oldReview != 0)) {
          console.log("inside")
          oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
        }
        // Generate all product reviews with new review and update old reviews
        allReviews = productUtils.allProduct(oldReviews, review, type + id);
        break;

      case "Shopper":
        // Set filename and get old reviews for shopper review
        filename = "shopper.json";
        oldReview = await Contract.getAllShopperReview();
        if (!oldReview.length || (oldReview != "" && oldReview != 0)) {
          oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
        }
        // Generate all shopper reviews with new review and update old reviews
        allReviews = await shopperUtils.allShopper(
          oldReviews,
          review,
          type + id
        );
        break;

      case "Seller":
        // Set filename and get old reviews for seller review
        filename = "seller.json";
        oldReview = await Contract.getAllSellerReview();
        if (!oldReview.length || (oldReview != "" && oldReview != 0)) {
          oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
        }
        // Generate all seller reviews with new review and update old reviews
        allReviews = sellerUtils.allSeller(oldReviews, review, type + id);
        break;

      default:
        // Throw an error if an invalid review type is provided
        throw new Error("Invalid review type");
    }

    // Write the new review to a file and upload it to IPFS
    fs.writeFileSync(
      path.join(__dirname, `../../../${filename}`),
      JSON.stringify(review)
    );
    // type + id is the hash where type means product, seller or shopper and id means id of product, shopper and seller
    const isUploaded = await IpfsService.pinJSONToIPFS(type + id, filename);

    // Write the updated reviews to a file and upload it to IPFS
    fs.writeFileSync(
      path.join(__dirname, `../../../All${filename}`),
      JSON.stringify(allReviews)
    );
    const isUploadedAll = await IpfsService.pinJSONToIPFS(
      `All${type}`,
      `All${filename}`
    );

    // Return an array containing the IPFS hash of the uploaded review and the IPFS hash of all reviews of the same type
    return [isUploaded.key, isUploadedAll.key];
  },

  async updateTxnHash(type, review, id) {
    // Initialize variables
    let filename = "";
    // Switch based on the type of review
    switch (type) {
      case "Product":
        // Set filename and get old reviews for product review
        filename = "product.json";      
        break;

      case "Shopper":
        // Set filename and get old reviews for shopper review
        filename = "shopper.json";
       
        break;

      case "Seller":
        // Set filename and get old reviews for seller review
        filename = "seller.json";
       
        break;

      default:
        // Throw an error if an invalid review type is provided
        throw new Error("Invalid review type");
    }
    // Write the new review to a file and upload it to IPFS
    fs.writeFileSync(
      path.join(__dirname, `../../../${filename}`),
      JSON.stringify(review)
    );

    // type + id is the hash where type means product, seller or shopper and id means id of product, shopper and seller
    const isUploaded = await IpfsService.pinJSONToIPFS(type + id, filename);

    // Return an array containing the IPFS hash of the uploaded review and the IPFS hash of all reviews of the same type
    return [isUploaded.key];
  },
};
