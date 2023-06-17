//Import Web3 Module
const Web3 = require("web3");
const dotenv = require("dotenv"); // Import the dotenv module
dotenv.config(); // Load environment variables from the .env file
// Contract Address
const address = "0x357468999f78463F56b129b29bf1EA0544890980";
//Contract ABI
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
				"name": "allSellerHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "allShopperHash",
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
]
/**
 * Initialize a new instance of the Web3 library using the specified RPC provider URL.
 * @param {string} process.env.RPC - The URL of the Ethereum node to connect to.
 */
const web3 = new Web3(process.env.RPC);

/**
 * Create a new instance of the Ethereum smart contract using its ABI and address.
 * @param {Object} ABI - The Application Binary Interface (ABI) of the contract.
 * @param {string} address - The address of the contract on the Ethereum network.
 */
const myContract = new web3.eth.Contract(ABI, address);


module.exports = {
	/**
	 * Asynchronously retrieves the review for a product with the specified ID.
	 * @param {number} id - The ID of the product to retrieve the review for.
	 * @returns {Promise<string>} - A Promise that resolves to the review hash for the product.
	 */
	async viewProductReview(id) {
		const productHash = await myContract.methods.viewProductReview(id).call();
		return productHash;
	},

	/**
	 * Asynchronously retrieves the review for a seller with the specified ID.
	 * @param {number} id - The ID of the seller to retrieve the review for.
	 * @returns {Promise<string>} - A Promise that resolves to the review hash for the seller.
	 */
	async viewSellerReview(id) {
		const sellerHash = await myContract.methods.viewSellerReview(id).call();
		return sellerHash;
	},

	/**
	 * Asynchronously retrieves the review for a shopper with the specified ID.
	 * @param {number} id - The ID of the shopper to retrieve the review for.
	 * @returns {Promise<string>} - A Promise that resolves to the review hash for the shopper.
	 */
	async viewShopperReview(id) {
		const shopperHash = await myContract.methods.viewShopperReview(id).call();
		return shopperHash;
	},

	/**
	* Creates a new product in the smart contract using the provided parameters.
	*
	* @param {number} productId - The ID of the product to create.
	* @param {string} productHash - The hash of the product data.
	* @param {string} allProductHash - The hash of all product data.
	* @returns {Promise<boolean>} A promise that resolves to true if the transaction was successful, false otherwise.
	*/
	async createProduct(productId, productHash, allProductHash) {
		return new Promise(async (resolve, reject) => {
			try {
				// Encode the method data for the contract function call
				const Data = await myContract.methods
					.createProduct(productId, productHash, allProductHash)
					.encodeABI();

				// Define the transaction object with gas price, limit, and method data
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};

				// Sign the transaction with the private key and send it
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						
						resolve(receipt);
						
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},

	/**
	 * Creates a new seller in the smart contract using the provided parameters.
	 * @param {number} sellerId - The ID of the seller to be created.
	 * @param {string} sellerHash - The hash of the seller data to be stored.
	 * @param {string} allSellerHash - The hash of all sellers data to be updated.
	 * @returns {Promise<boolean>} - A promise that resolves to true if the transaction succeeds, false otherwise.
	 */
	async createSeller(sellerId, sellerHash, allSellerHash) {
		return new Promise(async (resolve, reject) => {
			try {
				// Encode the method data for the contract function call
				const Data = await myContract.methods
					.createSeller(sellerId, sellerHash, allSellerHash)
					.encodeABI();
				// Define the transaction object with gas price, limit, and method data
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				// Sign the transaction with the private key and send it
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						resolve(receipt);
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},

	/**
	 * Create a new shopper in the smart contract using the provided parameters.
	 * @param {number} shopperId - The ID of the shopper to be created
	 * @param {string} shopperHash - The hash of the shopper data to be stored in the blockchain
	 * @param {string} allShopperHash - The hash of all shopper data to be stored in the blockchain
	 * @returns {Promise<boolean>} - A promise that resolves to true if the transaction was successful, false otherwise.
	 */
	async createShopper(shopperId, shopperHash, allShopperHash) {
		return new Promise(async (resolve, reject) => {
			try {
				// Encode the method data for the contract function call
				const Data = await myContract.methods
					.createShopper(shopperId, shopperHash, allShopperHash)
					.encodeABI();
				// Define the transaction object with gas price, limit, and method data
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				// Sign the transaction with the private key and send it
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						resolve(receipt);
					});
			} catch (error) {
				console.log(error);
				reject(false);
			}
		});
	},

	/**
	 * Adds a review response for a product, seller, and shopper to the smart contract using the provided parameters.
	 * @param {number} sellerId - The ID of the seller.
	 * @param {number} shopperId - The ID of the shopper.
	 * @param {string} sellerHash - The IPFS hash of the seller's review.
	 * @param {string} shopperHash - The IPFS hash of the shopper's review.
	 * @param {string} allSellerHash - The IPFS hash of all reviews for the seller.
	 * @param {string} allShopperHash - The IPFS hash of all reviews by the shopper
	 * @returns {Promise<boolean>} - A promise that resolves to true if the transaction was successful, false otherwise.
	 */
	async addSellerShopperReview(sellerId, shopperId, sellerHash, shopperHash, allSellerHash, allShopperHash) {
		return new Promise(async (resolve, reject) => {
			try {
				// Encode the method data for the contract function call
				const Data = await myContract.methods
					.setShopperSellerReview(
						sellerId,
						shopperId,
						sellerHash,
						shopperHash,
						allSellerHash,
						allShopperHash
					)
					.encodeABI();
				// Define the transaction object with gas price, limit, and method data
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				// Sign the transaction with the private key and send it
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						console.log(receipt);
						resolve(receipt);
					});
			} catch (error) {
				console.log(error.message);
				reject(false);
			}
		});
	},

	/**
	 * Adds a review for a seller and a shopper to the smart contract using the provided parameters.
	 * @param {string} productId - The ID of the product.
	 * @param {number} sellerId - The ID of the seller.
	 * @param {number} shopperId - The ID of the shopper.
	 * @param {string} productHash - The IPFS hash of the product review.
	 * @param {string} sellerHash - The IPFS hash of the seller's review.
	 * @param {string} shopperHash - The IPFS hash of the shopper's review.
	 * @param {string} allProductHash - The IPFS hash of all reviews for the product.
	 * @param {string} allSellerHash - The IPFS hash of all reviews for the seller.
	 * @param {string} allShopperHash - The IPFS hash of all reviews by the shopper
	 * @returns {Promise<boolean>} - A promise that resolves to true if the transaction was successful, false otherwise.
	 */
	async addReviewReply(
		productId,
		sellerId,
		shopperId,
		productHash,
		sellerHash,
		shopperHash,
		allProductHash,
		allSellerHash,
		allShopperHash
	) {
		return new Promise(async (resolve, reject) => {
			try {
				// Encode the method data for the contract function call
				const Data = await myContract.methods
					.setReviewResponse(
						productId,
						sellerId,
						shopperId,
						productHash,
						sellerHash,
						shopperHash,
						allProductHash,
						allSellerHash,
						allShopperHash
					)
					.encodeABI();
				// Define the transaction object with gas price, limit, and method data
				const rawTransaction = {
					to: address,
					gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
					gasLimit: web3.utils.toHex("200000"), // Always in Wei
					data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
				};
				// Sign the transaction with the private key and send it
				const signPromise = await web3.eth.accounts.signTransaction(
					rawTransaction,
					process.env.private_key.toString()
				);
				await web3.eth
					.sendSignedTransaction(signPromise.rawTransaction)
					.on("receipt", async (receipt) => {
						resolve(receipt);
					});
			} catch (error) {
				console.log(error.message);
				reject(false);
			}
		});
	},

	/**
	 * Asynchronously fetches all seller reviews from the smart contract
	 * @returns {Promise<Array>} An array of all seller review data
	 */
	async getAllSellerReview() {
		const allData = await myContract.methods.allSellers().call();
		return allData;
	},

	/**
	 * Asynchronously fetches all shopper reviews from the smart contract
	 * @returns {Promise<Array>} An array of all shopper review data
	 */
	async getAllShopperReview() {
		const allData = await myContract.methods.allShoppers().call();
		return allData;
	},

	/**
	 * Asynchronously fetches all product reviews from the smart contract
	 * @returns {Promise<Array>} An array of all product review data
	 */
	async getAllProductReview() {
		const allData = await myContract.methods.allProducts().call();
		return allData;
	},
};
