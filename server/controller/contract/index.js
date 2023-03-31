const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();
const address = "0x0c43971dF4b8cf60A627119De3aa82d153d7f86a";
const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "productHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allProductHash",
				"type": "string"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sellerId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "sellerHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allSellerHash",
				"type": "string"
			}
		],
		"name": "createSeller",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "shopperId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "shopperHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allShopperHash",
				"type": "string"
			}
		],
		"name": "createShopper",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sellerId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopperId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "productHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sellerHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopperHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allProductHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allSellerHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allShopperHash",
				"type": "string"
			}
		],
		"name": "setReviewResponse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sellerId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopperId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "sellerHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopperHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allShopperHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allSellerHash",
				"type": "string"
			}
		],
		"name": "setShopperSellerReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "allProducts",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "allSellers",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "allShoppers",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sellerInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shopperInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "viewProductReview",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "viewSellerReview",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "viewShopperReview",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const RPC = "https://matic-mumbai.chainstacklabs.com";
// const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const web3 = new Web3(Web3.givenProvider || process.env.RPC);
const myContract = new web3.eth.Contract(ABI, address);

module.exports = {
	async viewProductReview(id) {
		const productHash = await myContract.methods.viewProductReview(id).call();
		return productHash;
	},
	async viewSellerReview(id) {
		const sellerHash = await myContract.methods.viewSellerReview(id).call();
		return sellerHash;
	},
	async viewShopperReview(id) {
		const shopperHash = await myContract.methods.viewShopperReview(id).call();
		return shopperHash;
	},

	async createProduct(productId, productHash, allProductHash) {
		return new Promise(async (resolve, reject) => {
			try {
				const Data = await myContract.methods
					.createProduct(productId, productHash, allProductHash)
					.encodeABI();
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						if (receipt.status) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},
	async createSeller(sellerId, sellerHash, allSellerHash) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("dsfgh")
				const Data = await myContract.methods
					.createSeller(sellerId, sellerHash, allSellerHash)
					.encodeABI();
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						if (receipt.status) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},
	async createShopper(shopperId, shopperHash, allShopperHash) {
		return new Promise(async (resolve, reject) => {
			try {
				const Data = await myContract.methods
					.createShopper(shopperId, shopperHash, allShopperHash)
					.encodeABI();
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						if (receipt.status) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},

	async addSellerShopperReview(sellerId, shopperId, sellerHash, shopperHash, allSellerHash, allShopperHash) {
		// console.log("sellerId, shopperId, sellerHash, shopperHash, allSellerHash, allShopperHash", sellerId, shopperId, sellerHash, shopperHash, allSellerHash, allShopperHash)
		return new Promise(async (resolve, reject) => {
			try {
				const Data = await myContract.methods
					.setShopperSellerReview(sellerId, shopperId, sellerHash, shopperHash, allSellerHash, allShopperHash)
					.encodeABI();
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						if (receipt.status) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error.message);
				reject(false);
			}
		});
	},
	async addReviewReply(productId, sellerId, shopperId, productHash, sellerHash, shopperHash, allProductHash, allSellerHash, allShopperHash) {
		return new Promise(async (resolve, reject) => {
			try {
				const Data = await myContract.methods
					.setReviewResponse(productId, sellerId, shopperId, productHash, sellerHash, shopperHash, allProductHash, allSellerHash, allShopperHash)
					.encodeABI();
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						if (receipt.status) {
							resolve(true);
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error.message);
				reject(false);
			}
		});
	},

	async getAllSellerReview() {
		const allData = await myContract.methods.allSellers().call();
		return allData;
	},
	async getAllShopperReview() {
		const allData = await myContract.methods.allShoppers().call();
		return allData;
	},
	async getAllProductReview() {
		const allData = await myContract.methods.allProducts().call();
		return allData;
	},
};
