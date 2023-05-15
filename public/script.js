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
            console.log(response,"response")
            if (response.success == true) {
                resolve(response)
            } else {
                resolve([]);
            }
        })
    });
}

function getAllSellerInfo() {
    console.log(baseUrl + `/all-seller-review`,"dfcghj")
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
    console.log(pid,"df")
    if (pid) {
        getSellerDetails(pid);
    }
}
onloadReputationScore()

async function getSellerDetails(id) {
    document.getElementById("allReviewSellers").innerHTML = "";
    document.getElementById("sellerDataById").innerHTML = "";
    document.getElementById("reputationBody").innerHTML = ""
    document.getElementById("loader4").style.display = "block";
    let getSellerinfos = await getSellerInfoById(id);
    console.log(getSellerinfos, "sellerInfo")
    el1 = document.getElementById('allReviewSellers');
    output = "<div class=\"outerbox\">";
    let getSellerinfo = getSellerinfos.data
    if(getSellerinfo.sellerReviews.length){
        for (let i = getSellerinfo.sellerReviews.length; i > 0; i--) {
            console.log(getSellerinfo.sellerReviews[i - 1].reviewerId, "id")
            output += "<div class=\"masindfdf\">";
            output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
                    <button type ="button" class="" onclick="getShopperData(${getSellerinfo.sellerReviews[i - 1].reviewerId})"> Reviewed By: ${getSellerinfo.sellerReviews[i - 1].reviewerName}</button></div>
                   
                    <p>Rating: ${getSellerinfo.sellerReviews[i - 1].rating} </p>
                    <p>ProductId: ${getSellerinfo.sellerReviews[i - 1].productId} </p>
                    <p> Comment: ${getSellerinfo.sellerReviews[i - 1].reviewText}</p>
                    <span class="mt-2 colortext">${(getSellerinfo.sellerReviews[i - 1].timestamp)}</span>`;
            for (let j = 0; j < getSellerinfo.sellerReviews[i - 1].responses.length; j++) {
                console.log("fdfdfdfdfdf", getSellerinfo.sellerReviews[i - 1].responses)
                if (getSellerinfo.sellerReviews[i - 1].responses[j].responseText)
                    output += `<div id="responseBySeller">
                            <div class="client-reviews p-0 m-0">
                                    <p class="">Response : ${getSellerinfo.sellerReviews[i - 1].responses[j].responderName}</p>
                            </div>
                            <p> Comment: ${getSellerinfo.sellerReviews[i - 1].responses[j].responseText}</p>
                                <span class="mt-2 colortext">${(getSellerinfo.sellerReviews[i - 1].responses[j].timestamp)}</span>
                            </div>`
            }

            output += `<div class="shopperdiv2"><textarea placeholder="Reply here..." name="" id="reviews2${i - 1}" ></textarea>
                                <button type="button" id="sellerSubmitBtnResp${i - 1}" onclick="sellerReviewResponse(${id}, ${i - 1},${getSellerinfo.sellerReviews[i - 1].reviewerId}, ${getSellerinfo.sellerReviews[i - 1].productId})">Submit</button>
                            </div><p id="lengthErrorSellerResponse${i - 1}" style="color: red; margin: 5px 2px 0"></p></div>`;
            output += "</div>";
        }
        
    }else{
        output += `<tr>No review found</tr>`
    }
    el1.innerHTML = output;
    document.getElementById("loader4").style.display = "none";
    document.getElementById("sellerTxnHash").href = explorer + getSellerinfo.txnHash
    document.getElementById("sellerIdBox").innerHTML = getSellerinfo.id;
    document.getElementById("sellerNameBox").innerHTML = getSellerinfo.name;
    document.getElementById("sellerWalletBox").innerHTML = getSellerinfo.address.slice(0, 4) + "...." + getSellerinfo.address.slice(-5);
    document.getElementById("sellerHash").innerHTML = `<a href=${getSellerinfos.URL}>SellerInfo</a>`;
    for (let i = 0; i < getSellerinfo.productReviews.length; i++) {
        if (getSellerinfo.id == id) {
            console.log(getSellerinfo.productReviews[i].reviews.length )
            let avgRating, rating1,rating2,rating3,rating4;
            if (getSellerinfo.productReviews[i].reviews.length >= 4) {
                
                avgRating = (Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) +
                    Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating) + Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 3].rating)
                    + Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 4].rating)) / 4
                
                rating1 = (getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) 
                rating2 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating) 
                rating3 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 3].rating) 
                rating4 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 4].rating)
                
            } else if (getSellerinfo.productReviews[i].reviews.length == 3) {
               
                avgRating = (Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) +
                    Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating) + Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 3].rating)) / 3
                
                rating1 = (getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) 
                rating2 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating) 
                rating3 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 3].rating) 
                rating4 =0
            } else if (getSellerinfo.productReviews[i].reviews.length == 2) {
                
                avgRating = (Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) +
                    Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating)) / 2
                
                rating1 = (getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating) 
                rating2 =(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 2].rating) 
                rating3 =0
                rating4 =0
               
            } else {
                
                avgRating = Number(getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating)
            
                rating1 = getSellerinfo.productReviews[i].reviews[getSellerinfo.productReviews[i].reviews.length - 1].rating
                rating2 =0
                rating3 =0
                rating4 =0
                
            }
            // console.log(rating,"at")
            document.getElementById("reputationBody").innerHTML = document.getElementById("reputationBody").innerHTML +
            `<tr>
                <td> ${getSellerinfo.productReviews[i].productId}</td>
                <td>${rating1}</td>
                <td>${rating2}</td>
                <td>${rating3}</td>
                <td>${rating4}</td>
                <td>${avgRating}</td>
            </tr>`
            
            document.getElementById("sellerDataById").innerHTML = document.getElementById("sellerDataById").innerHTML +
                `<tr>
                    <td onclick="productInfo(${getSellerinfo.productReviews[i].productId})">${getSellerinfo.productReviews[i].productId}</td>
                    <td>${getSellerinfo.productReviews[i].reviews.length}</td>
                    <td>${avgRating}</td>
                </tr>`;
            // document.getElementById("reputationBody").innerHTML = document.getElementById("reputationBody").innerHTML +
            //     `<tr>
            //     <td> ${getSellerinfo.productReviews[i].productId}</td>
            //     <td>${rating}</td>
            // </tr>`
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
    let getAllSeller = await getAllSellerInfo()
    console.log(getAllSeller,"getAll")
    document.getElementById("loader1").style.display = "none";
    for (let i = 0; i < getAllSeller.length; i++) {
        document.getElementById("sellerData").innerHTML = document.getElementById("sellerData").innerHTML +
            `<tr>
            <td class="sellerListid" onclick="sellerInfo(${getAllSeller[i].id})">${getAllSeller[i].id}</td>
            <td>${getAllSeller[i].totalProducts}</td>
            <td>${getAllSeller[i].totalReviews}</td>
            <td class='sellerListRepu' onclick="sellerReputationScore(${getAllSeller[i].id} )">${(getAllSeller[i].rating)}</td>
        </tr>`;
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
                resolve(response)
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
    console.log(getShopperinfos, "shopperInfo")
    el1 = document.getElementById('allReviewShoppers');
    output = "<div class=\"outerbox\">";
    let getShopperinfo = getShopperinfos.data
    console.log(getShopperinfo,"fcghjk")
    if(getShopperinfo.sellerToShopperReviews.length){
        for (let i = getShopperinfo.sellerToShopperReviews.length; i > 0; i--) {
            console.log(getShopperinfo.sellerToShopperReviews[i - 1].reviewerName, "id")
            output += "<div class=\"masindfdf\">";
            output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
                     <button type ="button" class="" onclick="getSellerData(${getShopperinfo.sellerToShopperReviews[i - 1].reviewerId})"> Reviewed By: ${getShopperinfo.sellerToShopperReviews[i - 1].reviewerName}</button></div>
                     
                     <p>Rating: ${getShopperinfo.sellerToShopperReviews[i -1].rating} </p>
                     <p>ProductId: ${getShopperinfo.sellerToShopperReviews[i - 1].productId} </p>
                     <p> Comment: ${getShopperinfo.sellerToShopperReviews[i - 1].reviewText}</p>
                     <span class="mt-2 colortext">${(getShopperinfo.sellerToShopperReviews[i - 1].timestamp)}</span>`;
            for (let j = 0; j < getShopperinfo.sellerToShopperReviews[i -1 ].responses.length; j++) {
                console.log("fdfdfdfdfdf", getShopperinfo.sellerToShopperReviews[i - 1].responses)
                if (getShopperinfo.sellerToShopperReviews[i - 1].responses[j].responseText)
                    output += `<div id="responseBySeller">
                            <div class="client-reviews p-0 m-0">
                                     <p class="">Response : ${getShopperinfo.sellerToShopperReviews[i - 1].responses[j].responderName}</p>
                             </div>
                             <p> Comment: ${getShopperinfo.sellerToShopperReviews[i - 1].responses[j].responseText}</p>
                                <span class="mt-2 colortext">${(getShopperinfo.sellerToShopperReviews[i -1].responses[j].timestamp)}</span>
                            </div>`
            }
    
            output += `<div class="shopperdiv1"><textarea placeholder="Reply here..." name="" id="reviews1${i -1 }" ></textarea>
                                <button type="button" id="shopperSubmitBtnResp${i - 1}" onclick="shopperReviewResponse(${id}, ${i - 1},${getShopperinfo.sellerToShopperReviews[i - 1].reviewerId}, ${getShopperinfo.sellerToShopperReviews[i - 1].productId})">Submit</button>
                             </div><p id="lengthErrorResponse${i - 1}" style="color: red; margin: 5px 2px 0"></p></div>`;
            output += "</div>";
           
        }
    }else{
        output += `<tr>No review found</tr>`
    }
   
    el1.innerHTML = output;

    document.getElementById("loader5").style.display = "none";
    document.getElementById("shopperTxnHash").href = explorer + getShopperinfo.txnHash
    document.getElementById("shopperIdBox").innerHTML = getShopperinfo.id;
    document.getElementById("shopperNameBox").innerHTML = getShopperinfo.name;
    document.getElementById("shopperWalletBox").innerHTML = getShopperinfo.address.slice ? getShopperinfo.address.slice(0, 4) + "...." + getShopperinfo.address.slice(-5) : "";
    document.getElementById("shopperHash").innerHTML = `<a href=${getShopperinfos.URL}>ShopperInfo</a>`;
    for (let i = 0; i < getShopperinfo.productReviews.length; i++) {
        let rating, rating1,rating2,rating3,rating4;
        if (getShopperinfo.productReviews[i].reviews.length >= 4) {
            rating1 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating;
            rating2 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating
            rating3 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 3].rating
            rating4 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 4].rating
            rating = (Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating) +
                Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating) + Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 3].rating)
                + Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 4].rating)) / 4
        } else if (getShopperinfo.productReviews[i].reviews.length == 3) {
            rating1 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating;
            rating2 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating
            rating3 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 3].rating
            rating4 = 0
            rating = (Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating) +
                Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating) + Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 3].rating)) / 3
        } else if (getShopperinfo.productReviews[i].reviews.length == 2) {
            rating1 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating;
            rating2 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating
            rating3 = 0
            rating4 = 0
            rating = (Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating) +
                Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 2].rating)) / 2
        } else {
            rating1 = getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating
            rating2 = 0
            rating3 = 0
            rating4 = 0
            rating = Number(getShopperinfo.productReviews[i].reviews[getShopperinfo.productReviews[i].reviews.length - 1].rating)
        }
        document.getElementById("shopperDataById").innerHTML = document.getElementById("shopperDataById").innerHTML +
            `<tr>
            <td onclick="productInfo(${getShopperinfo.productReviews[i].productId})">${getShopperinfo.productReviews[i].productId}</td>
            <td>${getShopperinfo.productReviews[i].reviews[0].reviewText}</td><td>${getShopperinfo.productReviews[i].reviews[0].rating}</td>
        </tr>`;
        
         document.getElementById("shopper_repu").innerHTML = document.getElementById("shopper_repu").innerHTML +
            `<tr>
                <td>${getShopperinfo.productReviews[i].productId}</td>
                <td>${rating1}</td>
                <td>${rating2}</td>
                <td>${rating3}</td>
                <td>${rating4}</td>
                <td>${rating}</td>
            </tr>`
        
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
    let getAllShopper = await getAllShopperInfo();
    document.getElementById("loader2").style.display = "none";
    for (let i = 0; i < getAllShopper.length; i++) {
        document.getElementById("shopperData").innerHTML = document.getElementById("shopperData").innerHTML +
            `<tr>
            <td class='shopperListid' onclick="shopperInfo(${getAllShopper[i].id})">${getAllShopper[i].id}</td>
            <td>${getAllShopper[i].totalProducts}</td>
            <td>${getAllShopper[i].totalReviews}</td>
            <td class='shopperListRepu' onclick="shopperReputationScore(${getAllShopper[i].id})">${getAllShopper[i].rating}</td>
        </tr>`;
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
                resolve(response)
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
    document.getElementById("productTitle").innerHTML = productInfo.data.productName;
    document.getElementById("productTxnHash").href = explorer + productInfo.data.txnHash;
    document.getElementById("productDesp").innerHTML = productInfo.data.productDescription;
    document.getElementById("productRating").innerHTML = productInfo.data.avgRating ? (productInfo.data.avgRating) : 0;
    document.getElementById("productSellerBy").innerHTML = "Sell by " + productInfo.data.sellerName;
    document.getElementById("getsellerID").innerHTML = productInfo.data.sellerId;
    document.getElementById("imgIPFS").src = productInfo.imageURL;
    document.getElementById("productHash").href = productInfo.URL;
    let rating = productInfo.data.avgRating
    for (let i = 0; i < rating; i++) {
        document.getElementById("ratingStar").innerHTML += `<i class="bi bi-star-fill"></i>`;
    }
    document.getElementById("productSellerBy").setAttribute("onclick", `getSellerData(${productInfo.data.sellerId})`);
    
    el1 = document.getElementById('allReviewProduct');
    output = "<div class=\"outerbox\">";
    if(productInfo.data.reviews.length){
        for (let i = productInfo.data.reviews.length; i > 0; i--) {
            console.log(productInfo.data.reviews,"fcghbjk")
            output += "<div class=\"masindfdf\">";
            output += `<div class="reviewsdjn"><div class="client-reviews p-0 m-0">
                <button type ="button" class="" onclick="getShopperData(${productInfo.data.reviews[i - 1].reviewerId})"> Reviewed By: ${productInfo.data.reviews[i -1 ].reviewerName}</button></div>
               
                <p>Rating: ${productInfo.data.reviews[i -1].rating} </p>
                <p> Comment: ${productInfo.data.reviews[i -1].reviewText}</p>
                <span class="mt-2 colortext">${(productInfo.data.reviews[i - 1].timestamp)}</span>`;
            for (let j = 0; j < productInfo.data.reviews[i - 1].responses.length; j++) {
                console.log("fdfdfdfdfdf", productInfo.data.reviews[i-1].responses)
                if (productInfo.data.reviews[i - 1].responses[j].responseText)
                    output += `<div id="responseBySeller">
                            <div class="client-reviews p-0 m-0">
                                    <p class="">Response : ${productInfo.data.reviews[i - 1].responses[j].responderName}</p>
                            </div>
                            <p> Comment: ${productInfo.data.reviews[i - 1].responses[j].responseText}</p>
                                <span class="mt-2 colortext">${(productInfo.data.reviews[i - 1].responses[j].timestamp)}</span>
                            </div>`
            }
    
            output += `<div class="shopperdiv"><textarea placeholder="Reply here..." name="" id="reviews${i - 1}" ></textarea>
                                <button type="button" id="productSubmitBtnResp${i - 1}" onclick="productReviewResponse(${i - 1},${productInfo.data.reviews[i - 1].reviewerId})">Submit</button>
                            </div><p id="lengthErrorResp${i - 1}" style="color: red; margin: 5px 2px 0"></p></div>`;
            output += "</div>";
        }
    }else{
        output += `<tr>No review found</tr>`
    }
    
    el1.innerHTML = output;
}

async function allProduct() {
    document.getElementById("productData").innerHTML = "";
    document.getElementById("loader3").style.display = "block";
    let getAllProduct = await getAllProductInfo();
    document.getElementById("loader3").style.display = "none";
    for (let i = 0; i < getAllProduct.length; i++) {
        document.getElementById("productData").innerHTML = document.getElementById("productData").innerHTML +
            `<tr>
            <td class='productListid' onclick="productInfo(${getAllProduct[i].id})">${getAllProduct[i].id}</td>
            <td>${getAllProduct[i].totalReviews}</td>
            <td>${getAllProduct[i].rating}</td>
        </tr>`;
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

                            let postReview = await postSellerReview(3,  document.getElementById("getsellerID").innerHTML, text,  getSelectedValue.value, pid)
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
                                let postReview = await postProductReview(pid, res.data.sellerId, 1, text, getSelectedValue.value)

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

                            let postReview = await postShopperReview(document.getElementById("getsellerID").innerHTML, 3, text, getSelectedValue.value, pid)
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

function postProductReviewResponse(id,  responderId, responseText, responderType, shopperId) {
    console.log(id,  responderId, responseText, responderType, shopperId,"id,  responderId, responseText, responderType, shopperId")
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

function postShopperReviewResponse(id, responderId,   responseText,  responderType, sellerId, productId) {
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
                productId : productId,
                sellerId : sellerId
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

function postSellerReviewResponse(id, shopperId, responderId, responseText, responderType,   productId) {
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
                productId : productId,
                shopperId : shopperId
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








