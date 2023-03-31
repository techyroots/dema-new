const IpfsService = require("../ipfs/service");
const Contract = require("../contract/index");
const fs = require("fs");
const path = require("path");
const productUtils = require("./../productReview/utils");
const shopperUtils = require("./../shopperReview/utils");
const sellerUtils = require("./../sellerReview/utils");

module.exports = {
    async uploadReview(type, review, id) {
      let oldReviews = [];
      let filename = '';
      let allReviews = [];
      let oldReview;
    
      switch (type) {
        case 'Product':
          filename = 'product.json';
          oldReview = await Contract.getAllProductReview()
          if(oldReviews !== "0"){
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }        
          allReviews = productUtils.allProduct(oldReviews, review, type + id);
          break;
    
        case 'Shopper':
          filename = 'shopper.json';
          oldReview = await Contract.getAllShopperReview()
          if(oldReviews !== "0"){
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }        
          allReviews = await shopperUtils.allShopper(oldReviews, review, type + id);
          break;
    
        case 'Seller':
          filename = 'seller.json';
          oldReview = await Contract.getAllSellerReview()
          if(oldReviews !== "0"){
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }
          allReviews = sellerUtils.allSeller(oldReviews, review, type + id);
          break;
    
        default:
          throw new Error('Invalid review type');
      }
    
      fs.writeFileSync(path.join(__dirname, `../../../${filename}`), JSON.stringify(review));
      const isUploaded = await IpfsService.pinJSONToIPFS(type + id);
      fs.writeFileSync(path.join(__dirname, `../../../${filename}`), JSON.stringify(allReviews));
      const isUploadedAll = await IpfsService.pinJSONToIPFS("All" + type);
    
      return [isUploaded.key, isUploadedAll.key];
    }
};