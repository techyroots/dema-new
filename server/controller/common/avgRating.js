/**
 * Calculates the average rating of the given reviews array
 * @param {Array} reviews - The array of review objects to calculate the average rating from
 * @returns {number} The average rating rounded to 2 decimal places
 */
module.exports = {
    async getAverageRating(reviews) {
      const len = Object.keys(reviews).length;
      if (len === 0) return 0;
      if (len === 1) return Number(reviews[0].rating);
  
      const maxReviews = Math.min(len, 4);
      let ratings = 0;
  
      // Iterate over the last 4 reviews and add their ratings together
      for (let i = 1; i <= maxReviews; i++) {
        ratings += Number(reviews[len - i].rating);
      }
      
      // Calculate and return the average rating rounded to 2 decimal places
      return (ratings / maxReviews).toFixed(2);
    },
  };
  