module.exports ={
    async getAverageRating(reviews) {
        const len = reviews.length;
        if (len === 0) return 0;
        if (len === 1) return Number(reviews[0].rating);

        const maxReviews = Math.min(len, 4);
        let ratings = 0;

        for (let i = 1; i <= maxReviews; i++) {
            ratings += Number(reviews[len - i].rating);
        }
        return (ratings / maxReviews).toFixed(2);
    }
}