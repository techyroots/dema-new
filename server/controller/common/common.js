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
          oldReview = await Contract.getAllProductReview();
          console.log(typeof(oldReview),oldReview, oldReview == 0,"oldReview")
          if(!oldReview.length || oldReview != '' && oldReview != 0){
            console.log("indie")
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }        
          console.log(oldReviews)
          allReviews = productUtils.allProduct(oldReviews, review, type + id);
          break;
    
        case 'Shopper':
          filename = 'shopper.json';
          oldReview = await Contract.getAllShopperReview()
          if(!oldReview.length || oldReview != '' && oldReview != 0){
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }        
          allReviews = await shopperUtils.allShopper(oldReviews, review, type + id);
          break;
    
        case 'Seller':
          filename = 'seller.json';
          oldReview = await Contract.getAllSellerReview()
          if(!oldReview.length || oldReview != '' && oldReview != 0){
            oldReviews = JSON.parse(await IpfsService.gateway(oldReview));
          }
          allReviews = sellerUtils.allSeller(oldReviews, review, type + id);
          break;
    
        default:
          throw new Error('Invalid review type');
      }
     console.log(review, allReviews)
      fs.writeFileSync(path.join(__dirname, `../../../${filename}`), JSON.stringify(review));
      const isUploaded = await IpfsService.pinJSONToIPFS(type + id, filename);
      fs.writeFileSync(path.join(__dirname, `../../../All${filename}`), JSON.stringify(allReviews));
      const isUploadedAll = await IpfsService.pinJSONToIPFS(`All${type}`, `All${filename}`);
    
      return [isUploaded.key, isUploadedAll.key];
    }
};