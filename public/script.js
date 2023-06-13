let baseUrl = "http://localhost:7777/api";
let explorer = "https://mumbai.polygonscan.com/tx/"

//-----------------------------------------Seller Starts---------------------------------------------//

$(".backSeller").click(function () {
    $("#seller-main").show();
    $("#seller-repu").hide();
    $("#seller-id").hide();
    history.pushState(null, null, "?page=1");
});

function getSellerInfoById(id) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/seller-review?id=${id}`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response, "response")
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function getAllInfoById(id) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/all-data`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function getAllSellerInfo() {
    console.log(baseUrl + `/all-seller-review`, "dfcghj")
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/all-seller-review`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function sellerInfo(id) {
    $("#seller-main").hide();
    $("#seller-repu").hide();
    $("#seller-id").show();
    history.pushState(null, null, `?page=1&&seller=1&&seller_id=${id}`);
    getSellerDetails(id)
}

function sellerReputationScore(id) {
    $("#seller-main").hide();
    $("#seller-repu").show();
    $("#seller-id").hide();
    history.pushState(null, null, `?page=1&&repu=2&&seller_id=${id}`);
    onloadReputationScore();
}

function onloadReputationScore() {
    let params = new URL(document.location).searchParams;
    let pid = params.get("seller_id");
    console.log(pid, "df")
    if (pid) {
        getSellerDetails(pid);
    }
}
onloadReputationScore()

async function getSellerDetails(id) {
    document.getElementById("allReviewSellers").innerHTML = "";
    document.getElementById("sellerDataById").innerHTML = "";
    document.getElementById("reputationBody").innerHTML = "";
    document.getElementById("loader4").style.display = "block";
    let getSellerinfos = await getSellerInfoById(id);
    console.log(getSellerinfos, getSellerinfos.pin.meta.id, "sellerInfo");
    el1 = document.getElementById('allReviewSellers');
    output = "<div class=\"outerbox\">";
    let getSellerinfo = getSellerinfos.pin.meta;
    if (getSellerinfo.sellerReviews) {
        const reviewKeys = Object.keys(getSellerinfo.sellerReviews);
        for (let i = reviewKeys.length - 1; i >= 0; i--) {
            const key = reviewKeys[i];
            if (getSellerinfo.sellerReviews.hasOwnProperty(key)) {
                const item = getSellerinfo.sellerReviews[key];
                console.log(item, "id");
                output += "<div class=\"masindfdf\">";
                output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
                    <button type ="button" class="" onclick="getShopperData(${item.reviewerId})"> Reviewed By: ${item.reviewerName}</button></div>
                   
                    <p>Rating: ${item.rating} </p>
                    <p>ProductId: ${item.productId} </p>
                    <p> Comment: ${item.reviewText}</p>
                    <span class="mt-2 colortext">${(item.timestamp)}</span>`;
                for (const key1 in item.responses) {
                    if (item.responses.hasOwnProperty(key1)) {
                        const item1 = item.responses[key1];
                        console.log(item1, "itme1");
                        if (item1.responseText)
                            output += `<div id="responseBySeller">
                            <div class="client-reviews p-0 m-0">
                                    <p class="">Response : ${item1.responderName}</p>
                            </div>
                            <p> Comment: ${item1.responseText}</p>
                                <span class="mt-2 colortext">${(item1.timestamp)}</span>
                            </div>`;
                    }
                }

                output += `<div class="shopperdiv2"><textarea placeholder="Reply here..." name="" id="reviews2${key}" ></textarea>
                                <button type="button" id="sellerSubmitBtnResp${key}" onclick="sellerReviewResponse(${id}, ${key},${item.reviewerId}, ${item.productId})">Submit</button>
                            </div><p id="lengthErrorSellerResponse${key}" style="color: red; margin: 5px 2px 0"></p></div>`;
                output += "</div>";
            }
        }

    } else {
        output += `<tr>No review found</tr>`;
    }
    el1.innerHTML = output;

    document.getElementById("loader4").style.display = "none";
    document.getElementById("sellerTxnHash").href = explorer + getSellerinfos.pin.meta.txnHash;
    document.getElementById("sellerIdBox").innerHTML = getSellerinfos.pin.meta.id;
    document.getElementById("sellerNameBox").innerHTML = getSellerinfos.pin.meta.name;
    document.getElementById("sellerWalletBox").innerHTML = getSellerinfos.pin.meta.address.slice(0, 4) + "...." + getSellerinfos.pin.meta.address.slice(-5);
    document.getElementById("sellerHash").innerHTML = `<a href=${baseUrl + "/seller-review?id=" + getSellerinfos.pin.meta.id}>SellerInfo</a>`;

    if (getSellerinfo.productReviews) {
        for (const key in getSellerinfo.productReviews) {
            if (getSellerinfo.productReviews.hasOwnProperty(key)) {
                const item = getSellerinfo.productReviews[key];
                console.log(item, "id");
                if (getSellerinfos.pin.meta.id == id) {
                    let avgRating, lastFourRatings;
                    const metaLength = Object.keys(item.reviews).length;
                    console.log("Length of meta:", metaLength);
                    const keys = Object.keys(item.reviews);
                    if (metaLength >= 4) {
                        avgRating = Object.keys(item.reviews).slice(-4).map((key) => parseFloat(item.reviews[key].rating));
                        const lastFourKeys = keys.slice(-4);
                        lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);

                    } else if (metaLength == 3) {
                        avgRating = Object.keys(item.reviews).slice(-3).map((key) => parseFloat(item.reviews[key].rating));
                        const lastFourKeys = keys.slice(-3);
                        lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                    } else if (metaLength == 2) {
                        avgRating = Object.keys(item.reviews).slice(-2).map((key) => parseFloat(item.reviews[key].rating));
                        const lastFourKeys = keys.slice(-2);
                        lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                    } else {
                        avgRating = Object.keys(item.reviews).slice(-1).map((key) => parseFloat(item.reviews[key].rating));
                        const lastFourKeys = keys.slice(-1);
                        lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                    }
                    document.getElementById("reputationBody").innerHTML = document.getElementById("reputationBody").innerHTML +
                        `<tr>
                            <td> ${item.productId}</td>
                            <td>${lastFourRatings[0] != undefined ? lastFourRatings[0] : 0}</td>
                            <td>${lastFourRatings[1] != undefined ? lastFourRatings[1] : 0}</td>
                            <td>${lastFourRatings[2] != undefined ? lastFourRatings[2] : 0}</td>
                            <td>${lastFourRatings[3] != undefined ? lastFourRatings[3] : 0}</td>
                            <td>${avgRating}</td>
                        </tr>`;
                    document.getElementById("sellerDataById").innerHTML = document.getElementById("sellerDataById").innerHTML +
                        `<tr>
                            <td onclick="productInfo(${item.productId})">${item.productId}</td>
                            <td>${metaLength}</td>
                            <td>${avgRating}</td>
                        </tr>`;
                }
            }
        }
    }

    $(document).ready(function () {
        //initialize DataTables
        $("#example4").DataTable({
            "bDestroy": true
        });
        document.getElementById("loader4").style.display = "none";
    });
}


async function allSeller() {
    document.getElementById("sellerData").innerHTML = "";
    document.getElementById("loader1").style.display = "block";
    let getAllData = await getAllSellerInfo();
    let getAllSeller = (getAllData.pin.meta)
    document.getElementById("loader1").style.display = "none";
    for (const key in getAllSeller) {
        if (getAllSeller.hasOwnProperty(key)) {
            const item = getAllSeller[key];
            console.log(item.id, "item")

            document.getElementById("sellerData").innerHTML = document.getElementById("sellerData").innerHTML +
                `<tr>
            <td class="sellerListid" onclick="sellerInfo(${item.id})">${item.id}</td>
            <td>${item.totalProducts}</td>
            <td>${item.totalReviews}</td>
            <td class='sellerListRepu' onclick="sellerReputationScore(${item.id} )">${(item.rating)}</td>
        </tr>`;
        }
    }
    $(document).ready(function () {
        //initialize DataTables
        $("#example1").DataTable({
            "bDestroy": true
        });
        document.getElementById("loader1").style.display = "none";
    });
}
allSeller();

//-----------------------------------------Seller Ends---------------------------------------------//


//-----------------------------------------Shopper Starts---------------------------------------------//

$(".backShopper").click(function () {
    $("#shopper-main").show();
    $("#shopper-repu").hide();
    $("#shopper-id").hide();
    history.pushState(null, null, "?page=2");
});

function getShopperInfoById(id) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/shopper-review?id=${id}`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function getAllShopperInfo() {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/all-shopper-review`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function shopperInfo(id) {
    $("#shopper-main").hide();
    $("#shopper-repu").hide();
    $("#shopper-id").show();
    history.pushState(null, null, `?page=2&&shopper=1&&shopper_id=${id}`);
    getShopperDetails(id)
}

function shopperReputationScore(id) {
    $("#shopper-main").hide();
    $("#shopper-repu").show();
    $("#shopper-id").hide();
    history.pushState(null, null, `?page=2&&shopper=2&&shopper_id=${id}`);
    onloadShopperReputationScore();
}

function onloadShopperReputationScore() {
    let params = new URL(document.location).searchParams;
    let pid = params.get("shopper_id");
    if (pid) {
        getShopperDetails(pid);
    }
}
onloadShopperReputationScore();

async function getShopperDetails(id) {
    document.getElementById("allReviewShoppers").innerHTML = "";
    document.getElementById("shopperDataById").innerHTML = "";
    document.getElementById("loader5").style.display = "block";
    document.getElementById("shopper_repu").innerHTML = "";
    let getShopperinfos = await getShopperInfoById(id);
    console.log(getShopperinfos, "shopperInfo");
    el1 = document.getElementById('allReviewShoppers');
    output = "<div class=\"outerbox\">";
    let getShopperinfo = getShopperinfos.pin.meta;
    console.log(getShopperinfo, "fcghjk");
    if (getShopperinfo.sellerToShopperReviews) {
        const reviewKeys = Object.keys(getShopperinfo.sellerToShopperReviews);
        for (let i = reviewKeys.length - 1; i >= 0; i--) {
            const key = reviewKeys[i];
            if (getShopperinfo.sellerToShopperReviews.hasOwnProperty(key)) {
                const item = getShopperinfo.sellerToShopperReviews[key];
                console.log(item, "id");
                output += "<div class=\"masindfdf\">";
                output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
                     <button type ="button" class="" onclick="getSellerData(${item.reviewerId})"> Reviewed By: ${item.reviewerName}</button></div>
                     
                     <p>Rating: ${item.rating} </p>
                     <p>ProductId: ${item.productId} </p>
                     <p> Comment: ${item.reviewText}</p>
                     <span class="mt-2 colortext">${(item.timestamp)}</span>`;
                for (const key1 in item.responses) {
                    if (item.responses.hasOwnProperty(key1)) {
                        const item1 = item.responses[key1];
                        console.log(item1, "itme1");
                        if (item1.responseText)
                            output += `<div id="responseBySeller">
                            <div class="client-reviews p-0 m-0">
                                     <p class="">Response : ${item1.responderName}</p>
                             </div>
                             <p> Comment: ${item1.responseText}</p>
                                <span class="mt-2 colortext">${(item1.timestamp)}</span>
                            </div>`

                    }
                }

                output += `<div class="shopperdiv1"><textarea placeholder="Reply here..." name="" id="reviews1${key}" ></textarea>
                                <button type="button" id="shopperSubmitBtnResp${key}" onclick="shopperReviewResponse(${id}, ${key},${item.reviewerId}, ${item.productId})">Submit</button>
                             </div><p id="lengthErrorResponse${key}" style="color: red; margin: 5px 2px 0"></p></div>`;
                output += "</div>";


            }
        }
    } else {
        output += `<tr>No review found</tr>`;
    }

    el1.innerHTML = output;

    document.getElementById("loader5").style.display = "none";
    document.getElementById("shopperTxnHash").href = explorer + getShopperinfo.txnHash;
    document.getElementById("shopperIdBox").innerHTML = getShopperinfo.id;
    document.getElementById("shopperNameBox").innerHTML = getShopperinfo.name;
    document.getElementById("shopperWalletBox").innerHTML = getShopperinfo.address.slice ? getShopperinfo.address.slice(0, 4) + "...." + getShopperinfo.address.slice(-5) : "";
    document.getElementById("shopperHash").innerHTML = `<a href=${baseUrl + "/shopper-review?id=" + getShopperinfo.id}>ShopperInfo</a>`;
    if (getShopperinfo.productReviews) {
        for (const key in getShopperinfo.productReviews) {
            if (getShopperinfo.productReviews.hasOwnProperty(key)) {
                const item = getShopperinfo.productReviews[key];
                console.log(item, "id");
                let lastFourRatings, rating;
                const metaLength = Object.keys(item.reviews).length;
                console.log("Length of meta:", metaLength);
                const keys = Object.keys(item.reviews);
                if (metaLength >= 4) {
                    rating = Object.keys(item.reviews).slice(-4).map((key) => parseFloat(item.reviews[key].rating));
                    const lastFourKeys = keys.slice(-4);
                    lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating)
                } else if (metaLength == 3) {
                    rating = Object.keys(item.reviews).slice(-3).map((key) => parseFloat(item.reviews[key].rating));
                    const lastFourKeys = keys.slice(-3);
                    lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                } else if (metaLength == 2) {
                    rating = Object.keys(item.reviews).slice(-2).map((key) => parseFloat(item.reviews[key].rating));
                    const lastFourKeys = keys.slice(-2);
                    lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                } else {
                    rating = Object.keys(item.reviews).slice(-1).map((key) => parseFloat(item.reviews[key].rating));
                    const lastFourKeys = keys.slice(-1);
                    lastFourRatings = lastFourKeys.map((key) => item.reviews[key].rating);
                }
                document.getElementById("shopperDataById").innerHTML = document.getElementById("shopperDataById").innerHTML +
                    `<tr>
                        <td onclick="productInfo(${item.productId})">${item.productId}</td>
                        <td>${item.reviews[0].reviewText}</td><td>${item.reviews[0].rating}</td>
                    </tr>`;

                document.getElementById("shopper_repu").innerHTML = document.getElementById("shopper_repu").innerHTML +
                    `<tr>
                <td>${item.productId}</td>
                <td>${lastFourRatings[0] != undefined ? lastFourRatings[0] : 0}</td>
                <td>${lastFourRatings[1] != undefined ? lastFourRatings[1] : 0}</td>
                <td>${lastFourRatings[2] != undefined ? lastFourRatings[2] : 0}</td>
                <td>${lastFourRatings[3] != undefined ? lastFourRatings[3] : 0}</td>
                <td>${rating}</td>
            </tr>`;
            }

        }
    }

    $(document).ready(function () {
        //initialize DataTables
        $("#example5").DataTable({
            "bDestroy": true
        });
        document.getElementById("loader5").style.display = "none";
    });

}


async function allShopper() {
    document.getElementById("shopperData").innerHTML = "";
    document.getElementById("loader2").style.display = "block";
    let getAllData = await getAllShopperInfo();
    let getAllShopper = (getAllData.pin.meta)
    document.getElementById("loader2").style.display = "none";
    for (const key in getAllShopper) {
        if (getAllShopper.hasOwnProperty(key)) {
            const item = getAllShopper[key];
            document.getElementById("shopperData").innerHTML = document.getElementById("shopperData").innerHTML +
                `<tr>
            <td class='shopperListid' onclick="shopperInfo(${item.id})">${item.id}</td>
            <td>${item.totalProducts}</td>
            <td>${item.totalReviews}</td>
            <td class='shopperListRepu' onclick="shopperReputationScore(${item.id})">${item.rating}</td>
        </tr>`;
        }
    }
    $(document).ready(function () {
        //initialize DataTables
        $("#example2").DataTable({
            "bDestroy": true
        });
        document.getElementById("loader2").style.display = "none";
    });
}
allShopper();

//-----------------------------------------Shopper Ends---------------------------------------------//


//-----------------------------------------Product Starts---------------------------------------------//

$(".backProduct").click(function () {
    $("#product-main").show();
    $("#product-id").hide();
    history.pushState(null, null, "?page=3");
});

function getProductReviewById(id) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/product-review?id=${id}`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function getAllProductInfo() {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + `/all-product-review`,
            method: "GET",
            timeout: 0,
        };
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response.data)
            } else {
                resolve([]);
            }
        })
    });
}

function onloadProductInfo() {
    let params = new URL(document.location).searchParams;
    let pid = params.get("pid");
    if (pid) {
        getProductDetails(pid);
    }
}
onloadProductInfo();

function productInfo(id) {
    $("#product-main").hide();
    $("#product-id").show();
    history.pushState(null, null, `?page=3&&product=1&&pid=${id}`);
    window.location.reload()
    getProductDetails(id)
}

function getSellerData(id) {
    sellerInfo(id);
    window.location.reload();
}

function getShopperData(id) {
    shopperInfo(id)
    window.location.reload();
}

async function getProductDetails(id) {
    document.getElementById("allReviewProduct").innerHTML = "";
    let productInfo = await getProductReviewById(id);
    console.log(productInfo, "productInfo")
    document.getElementById("productTitle").innerHTML = productInfo.pin.meta.productName;
    document.getElementById("productTxnHash").href = explorer + productInfo.pin.meta.txnHash;
    document.getElementById("productDesp").innerHTML = productInfo.pin.meta.productDescription;
    document.getElementById("productRating").innerHTML = productInfo.pin.meta.avgRating ? (productInfo.pin.meta.avgRating) : 0;
    document.getElementById("productSellerBy").innerHTML = "Sell by " + productInfo.pin.meta.sellerName;
    document.getElementById("getsellerID").innerHTML = productInfo.pin.meta.sellerId;
    // document.getElementById("imgIPFS").src = await getImage(productInfo.pin.meta.productImage);
    document.getElementById("productHash").href = baseUrl + "/product-review?id=" + productInfo.pin.meta.productId;
    let rating = productInfo.pin.meta.avgRating
    for (let i = 0; i < rating; i++) {
        document.getElementById("ratingStar").innerHTML += `<i class="bi bi-star-fill"></i>`;
    }
    document.getElementById("productSellerBy").setAttribute("onclick", `getSellerData(${productInfo.pin.meta.sellerId})`);

    el1 = document.getElementById('allReviewProduct');
    output = "<div class=\"outerbox\">";
    if (productInfo.pin.meta.reviews) {
        const reviews = Object.values(productInfo.pin.meta.reviews); // Get an array of reviews
        for (let i = reviews.length - 1; i >= 0; i--) {
            const item = reviews[i];
            console.log(item, "id")
            output += "<div class=\"masindfdf\">";
            output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
            <button type ="button" class="" onclick="getShopperData(${item.reviewerId})"> Reviewed By: ${item.reviewerName}</button></div>
           
            <p>Rating: ${item.rating} </p>
            <p> Comment: ${item.reviewText}</p>
            <span class="mt-2 colortext">${(item.timestamp)}</span>`;
            for (const key1 in item.responses) {
                if (item.responses.hasOwnProperty(key1)) {
                    const item1 = item.responses[key1];
                    console.log(item1, "itme1")
                    if (item1.responseText)
                        output += `<div id="responseBySeller">
                        <div class="client-reviews p-0 m-0">
                                <p class="">Response : ${item1.responderName}</p>
                        </div>
                        <p> Comment: ${item1.responseText}</p>
                            <span class="mt-2 colortext">${(item1.timestamp)}</span>
                        </div>`
                }
            }

            output += `<div class="shopperdiv"><textarea placeholder="Reply here..." name="" id="reviews${i}" ></textarea>
                            <button type="button" id="productSubmitBtnResp${i}" onclick="productReviewResponse(${i},${item.reviewerId})">Submit</button>
                        </div><p id="lengthErrorResp${i}" style="color: red; margin: 5px 2px 0"></p></div>`;
            output += "</div>";
        }
    } else {
        output += `<tr>No review found</tr>`;
    }

    el1.innerHTML = output;
}


async function allProduct() {
    document.getElementById("productData").innerHTML = "";
    document.getElementById("loader3").style.display = "block";
    let getAllData = await getAllProductInfo();
    let getAllProduct = (getAllData.pin.meta)
    console.log(getAllProduct, "getaa")
    document.getElementById("loader3").style.display = "none";
    for (const key in getAllProduct) {
        if (getAllProduct.hasOwnProperty(key)) {
            const item = getAllProduct[key];
            document.getElementById("productData").innerHTML = document.getElementById("productData").innerHTML +
                `<tr>
            <td class='productListid' onclick="productInfo(${item.id})">${item.id}</td>
            <td>${item.totalReviews}</td>
            <td>${item.rating}</td>
        </tr>`;
        }
    }
    $(document).ready(function () {
        //initialize DataTables
        $("#example3").DataTable({
            "bDestroy": true
        });
        document.getElementById("loader3").style.display = "none";
    });
}
allProduct();

//-------------------------------------------Shopper give review to seller------------------------------//

function postSellerReview(id, revieweeId, reviewText, rating, productId) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/seller-review",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                id: id,
                rating: rating,
                productId: productId,
                revieweeId: revieweeId,
                reviewText: reviewText,
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}

function shopperToSellerReview(text) {
    if (text !== "") {
        if (text.length <= 255) {
            document.getElementById("lengthError_seller").innerHTML = "";
            document.getElementById("ratingError_seller").innerHTML = "";
            let getSelectedValue = document.querySelector('input[name="ratings"]:checked');
            if (getSelectedValue != null) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, submit it!",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: "success",
                            title: "Your review is submiting...",
                            showConfirmButton: true,
                            timer: 2000,
                        });

                        let params = new URL(document.location).searchParams;
                        let pid = params.get("pid");
                        if (pid) {

                            document.getElementById("productSubmitBtn_seller").disabled = true;
                            document.getElementById("productSubmitBtn_seller").innerHTML = "Submiting...";

                            let postReview = await postSellerReview(2, document.getElementById("getsellerID").innerHTML, text, getSelectedValue.value, pid)
                            console.log(postReview, "Post")
                            if (postReview.success == true) {

                                Swal.fire({
                                    icon: "success",
                                    title: "Review successfully submitted",
                                    showConfirmButton: true,
                                    timer: 2000,
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error while submitting the review",
                                    showConfirmButton: true,
                                    timer: 2000,
                                });
                            }
                            document.getElementById("productSubmitBtn_seller").disabled = false;
                            document.getElementById("productSubmitBtn_seller").innerHTML = "Submit";
                            document.getElementById("productText_seller").value = "";

                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: res.message,
                                showConfirmButton: true,
                                timer: 2000,
                            });
                        }
                    }
                })

            } else {
                document.getElementById("ratingError_seller").innerHTML = "Please select star rating";
            }
        } else {
            document.getElementById("lengthError").innerHTML = "Enter only 255 characters";
        }
    } else {
        document.getElementById("lengthError_seller").innerHTML = "Please Enter Review";
    }
}

//-------------------------------------------Shopper give review to product------------------------------//

function postProductReview(id, sellerId, reviewerId, reviewText, rating) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/product-review",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                id: id,
                sellerId: sellerId,
                reviewerId: reviewerId,
                reviewText: reviewText,
                rating: rating
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}

async function shopperToProductReview(text) {
    if (text !== "") {
        if (text.length <= 255) {
            document.getElementById("lengthError").innerHTML = "";

            document.getElementById("ratingError").innerHTML = "";
            let getSelectedValue = document.querySelector('input[name="rating"]:checked');
            if (getSelectedValue != null) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, submit it!",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: "success",
                            title: "Your review is submiting...",
                            showConfirmButton: true,
                            timer: 2000,
                        });

                        let params = new URL(document.location).searchParams;
                        console.log("params", params);
                        let pid = params.get("pid");
                        if (pid) {
                            getProductReviewById(pid).then(async (res) => {
                                document.getElementById("productSubmitBtn").disabled = true;
                                document.getElementById("productSubmitBtn").innerHTML = "Submiting...";
                                console.log("getSelectedValue", getSelectedValue.value);
                                let postReview = await postProductReview(pid, res.pin.meta.sellerId, 2, text, getSelectedValue.value)

                                if (postReview.success == true) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Review successfully submitted",
                                        showConfirmButton: false,
                                        timer: 2000,
                                    });
                                    getProductReviewById(pid)
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error while submitting the review",
                                        showConfirmButton: false,
                                        timer: 2000,
                                    });
                                }
                                document.getElementById("productSubmitBtn").disabled = false;
                                document.getElementById("productSubmitBtn").innerHTML = "Submit";
                                document.getElementById("productText").value = "";
                            });
                        }
                    }
                });
            } else {
                document.getElementById("ratingError").innerHTML = "Please select star rating";
            }

        } else {
            document.getElementById("lengthError").innerHTML = "Enter only 255 characters";
        }
    } else {
        document.getElementById("lengthError").innerHTML = "Please Enter Review";
    }
}

//-------------------------------------------Seller give review to shopper------------------------------//

function postShopperReview(id, reviewerId, reviewText, rating, productId) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/shopper-review",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                id: id,
                productId: productId,
                rating: rating,
                revieweeId: reviewerId,
                reviewText: reviewText,
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}

async function sellerToShopperReview(text) {
    if (text !== "") {
        if (text.length <= 255) {
            document.getElementById("lengthErrorForShopper").innerHTML = "";
            document.getElementById("ratingError1").innerHTML = "";
            let getSelectedValue = document.querySelector('input[name="rating1"]:checked');
            if (getSelectedValue != null) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, submit it!",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: "success",
                            title: "Your review is submiting...",
                            showConfirmButton: true,
                            timer: 2000,
                        });

                        let params = new URL(document.location).searchParams;
                        let pid = params.get("pid");
                        if (pid) {

                            document.getElementById("shoppersSubmitBtn").disabled = true;
                            document.getElementById("shoppersSubmitBtn").innerHTML = "Submiting...";

                            let postReview = await postShopperReview(document.getElementById("getsellerID").innerHTML, 1, text, getSelectedValue.value, pid)
                            console.log(postReview, "Post")
                            if (postReview.success == true) {

                                Swal.fire({
                                    icon: "success",
                                    title: "Review successfully submitted",
                                    showConfirmButton: true,
                                    timer: 2000,
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error while submitting the review",
                                    showConfirmButton: true,
                                    timer: 2000,
                                });
                            }
                            document.getElementById("shoppersSubmitBtn").disabled = false;
                            document.getElementById("shoppersSubmitBtn").innerHTML = "Submit";
                            document.getElementById("shopperText").value = "";

                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: res.message,
                                showConfirmButton: true,
                                timer: 2000,
                            });
                        }
                    }
                })

            } else {
                document.getElementById("ratingError1").innerHTML = "Please select star rating";
            }
        } else {
            document.getElementById("lengthErrorForShopper").innerHTML = "Enter only 255 characters";
        }
    } else {
        document.getElementById("lengthErrorForShopper").innerHTML = "Please Enter Review";
    }
}

//-------------------------------------------Shopper/Seller give response on product review------------------------------//

function postProductReviewResponse(id, responderId, responseText, responderType, shopperId) {
    console.log(id, responderId, responseText, responderType, shopperId, "id,  responderId, responseText, responderType, shopperId")
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/product-response",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                productId: id,
                shopperId: shopperId,
                responderId: responderId,
                responseText: responseText,
                responderType: responderType
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}
// ReviewerType : 0 for seller and 1 for shopper
async function productReviewResponse(id, shopperId) {
    let text = document.getElementById('reviews' + id).value
    if (text !== "") {
        let params = new URL(document.location).searchParams;
        let pid = params.get("pid");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Your response is submiting...",
                    showConfirmButton: true,
                    timer: 2000,
                });
                document.getElementById("productSubmitBtnResp" + id).disabled = true;
                document.getElementById("productSubmitBtnResp" + id).innerHTML = "Submiting...";
                let postReviewResp = await postProductReviewResponse(pid, document.getElementById("getsellerID").innerHTML, text, 0, shopperId);
                if (postReviewResp.success == true) {
                    Swal.fire({
                        icon: "success",
                        title: "Response successfully submitted",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    getProductDetails(pid)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error while submitting the review",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                document.getElementById("productSubmitBtnResp" + id).disabled = false;
                document.getElementById("productSubmitBtnResp" + id).innerHTML = "Submit";
                document.getElementById('reviews' + id).value = "";
            }
        });
    } else {
        document.getElementById("lengthErrorResp" + id).innerHTML = "Please Enter Review";
    }

}

//-------------------------------------------Shopper/Seller give response on shopper review------------------------------//

function postShopperReviewResponse(id, responderId, responseText, responderType, sellerId, productId) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/shopper-response",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                shopperId: id,
                responderId: responderId,
                responseText: responseText,
                responderType: responderType,
                productId: productId,
                sellerId: sellerId
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}

// ReviewerType : 0 for seller and 1 for shopper
async function shopperReviewResponse(shopperId, id, sellerId, productId) {
    let text = document.getElementById('reviews1' + id).value;
    if (text !== "") {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Your response is submiting...",
                    showConfirmButton: true,
                    timer: 2000,
                });
                document.getElementById("shopperSubmitBtnResp" + id).disabled = true;
                document.getElementById("shopperSubmitBtnResp" + id).innerHTML = "Submiting...";
                let postReviewResp = await postShopperReviewResponse(shopperId, 1, text, 1, sellerId, productId);
                if (postReviewResp.success == true) {
                    Swal.fire({
                        icon: "success",
                        title: "Response successfully submitted",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    getShopperInfoById(shopperId)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error while submitting the review",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                document.getElementById("shopperSubmitBtnResp" + id).disabled = false;
                document.getElementById("shopperSubmitBtnResp" + id).innerHTML = "Submit";
                document.getElementById('reviews1' + id).value = "";
            }
        });
    } else {
        document.getElementById("lengthErrorResponse" + id).innerHTML = "Please Enter Review";
    }

}

//-------------------------------------------Shopper/Seller give response on seller review------------------------------//

function postSellerReviewResponse(id, shopperId, responderId, responseText, responderType, productId) {
    return new Promise((resolve, reject) => {
        let settings = {
            url: baseUrl + "/seller-response",
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: {
                sellerId: id,
                responderId: responderId,
                responseText: responseText,
                responderType: responderType,
                productId: productId,
                shopperId: shopperId
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    })
}

// ReviewerType : 0 for seller and 1 for shopper
async function sellerReviewResponse(sellerId, id, shopperId, productId) {
    let text = document.getElementById('reviews2' + id).value;
    if (text !== "") {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Your response is submiting...",
                    showConfirmButton: true,
                    timer: 2000,
                });
                document.getElementById("sellerSubmitBtnResp" + id).disabled = true;
                document.getElementById("sellerSubmitBtnResp" + id).innerHTML = "Submiting...";
                let postReviewResp = await postSellerReviewResponse(sellerId, shopperId, 1, text, 0, productId);
                if (postReviewResp.success == true) {
                    Swal.fire({
                        icon: "success",
                        title: "Response successfully submitted",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    getSellerInfoById(sellerId);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error while submitting the review",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                document.getElementById("sellerSubmitBtnResp" + id).disabled = false;
                document.getElementById("sellerSubmitBtnResp" + id).innerHTML = "Submit";
                document.getElementById('reviews2' + id).value = "";
            }
        });
    } else {
        document.getElementById("lengthErrorSellerResponse" + id).innerHTML = "Please Enter Review";
    }

}








