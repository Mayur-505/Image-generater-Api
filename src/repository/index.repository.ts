import Web3 from "web3";
import { singleNFTPayload, singleNFTResult, BlockchainType, multiNFTPayload, multiNFTResult, transferNFTPayload, transferNFTResult, ownerOfNFTPayload, ownerOfNFTResult, imageGenerateResult } from "../interfaces";
import { contract_ABI, imageProbability, modifyCategoryData } from "../utils/abi";
import { combineImages, removeBackground, uploadToPinata } from "../services/imageProcess";
import { userValidation } from "../validation";
const fs = require("fs");
const FormData = require('form-data');
const path = require('path');

export class Repository {
    constructor() { }

    public static mintSingleNFT = async (data: singleNFTPayload): Promise<singleNFTResult> => {
        try {
            let transactionID = "";
            let blockchain = "";
            let tokenId = "";
            // Conditions to check on which blockchain we need to mint the nft
            if (data.blockchain === BlockchainType.Ethereum) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

                // Get the private key from env file and add to provider
                const privateKey = `0x${process.env.ETHEREUM_CONTRACT_OWNER_PRIVATE_KEY}`;
                const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(privateKey);

                const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.ETHEREUM_WALLET_PRIVATE_KEY}`);

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.ETHEREUM_CONTRACT_ADDRESS);

                // Get block for generating the gas limit
                const block = await web3.eth.getBlock("latest");
                const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                // Calling the mint method of the contract and passing the transfer_to from payload 
                // and the metadata url from payload
                const resp = await myContract.methods.mint(myAccount1.address, data.metadata_url).send({ from: myAccount.address, gas: gasLimit });
                if (resp) {
                    const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                    const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                    const mintEvent = resp1.logs.find((log) => log.topics[0] === eventAbi.signature);
                    const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent.data, mintEvent.topics.slice(1));
                    // Set the transaction ID for response
                    transactionID = resp.transactionHash;
                    blockchain = BlockchainType.Ethereum;
                    tokenId = decodedData.tokenId;
                }
            } else if (data.blockchain === BlockchainType.Binance) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_RPC_URL));

                // Get the private key from env file and add to provider
                const privateKey = `0x${process.env.BINANCE_CONTRACT_OWNER_PRIVATE_KEY}`;
                const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(privateKey);

                const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.BINANCE_WALLET_PRIVATE_KEY}`);

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.BINANCE_CONTRACT_ADDRESS);

                // Get block for generating the gas limit
                const block = await web3.eth.getBlock("latest");
                const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                // Calling the mint method of the contract and passing the transfer_to from payload 
                // and the metadata url from payload
                const resp = await myContract.methods.mint(myAccount1.address, data.metadata_url).send({ from: myAccount.address, gas: gasLimit });
                if (resp) {
                    const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                    const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                    const mintEvent = resp1.logs.find((log) => log.topics[0] === eventAbi.signature);
                    const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent.data, mintEvent.topics.slice(1));
                    // Set the transaction ID for response
                    transactionID = resp.transactionHash;
                    blockchain = BlockchainType.Binance;
                    tokenId = decodedData.tokenId;
                }
            } else if (data.blockchain === BlockchainType.Klaytn) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KLAYTN_RPC_URL));

                // Get the private key from env file and add to provider
                const privateKey = `0x${process.env.KLAYTN_CONTRACT_OWNER_PRIVATE_KEY}`;
                const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(privateKey);

                const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.KLAYTN_WALLET_PRIVATE_KEY}`);

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.KLAYTN_CONTRACT_ADDRESS);

                // Calling the mint method of the contract and passing the transfer_to from payload 
                // and the metadata url from payload
                const resp = await myContract.methods.mint(myAccount1.address, data.metadata_url).send({ from: myAccount.address, gas: 2000000 });
                if (resp) {
                    const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                    const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                    const mintEvent = resp1.logs.find((log) => log.topics[0] === eventAbi.signature);
                    const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent.data, mintEvent.topics.slice(1));
                    // Set the transaction ID for response
                    transactionID = resp.transactionHash;
                    blockchain = BlockchainType.Klaytn;
                    tokenId = decodedData.tokenId;
                }
            }

            // Return the object as a response to API
            return {
                transactionID: transactionID,
                blockchain_type: <BlockchainType>blockchain,
                tokenId: Number(tokenId)
            };
        } catch (err) {
            throw err;
        }
    }

    public static mintMultipleNFTs = async (data: multiNFTPayload): Promise<multiNFTResult> => {
        try {
            let result: multiNFTResult;

            if (data.metadata_urls.length > 0) {
                let transactionID = "";
                // Conditions to check on which blockchain we need to mint the nft
                if (data.blockchain === BlockchainType.Ethereum) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.ETHEREUM_CONTRACT_OWNER_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.ETHEREUM_WALLET_PRIVATE_KEY}`);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.ETHEREUM_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the batchMint method of the contract and passing the transfer_to from payload 
                    // and the metadata url from payload
                    const resp = await myContract.methods.batchMint(myAccount1.address, data.metadata_urls).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                        const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                        const mintEvent = resp1.logs.filter((log) => log.topics[0] === eventAbi.signature);
                        const tokenIds = [];
                        for (let i = 0; i < mintEvent.length; i++) {
                            const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent[i].data, mintEvent[i].topics.slice(1));
                            tokenIds.push(Number(decodedData.tokenId));
                        }
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        result = {
                            transactionID: transactionID,
                            blockchain: BlockchainType.Ethereum,
                            tokenIds: tokenIds
                        };
                    }
                } else if (data.blockchain === BlockchainType.Binance) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.BINANCE_CONTRACT_OWNER_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.BINANCE_WALLET_PRIVATE_KEY}`);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.BINANCE_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the batchMint method of the contract and passing the transfer_to from payload 
                    // and the metadata url from payload
                    const resp = await myContract.methods.batchMint(myAccount1.address, data.metadata_urls).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                        const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                        const mintEvent = resp1.logs.filter((log) => log.topics[0] === eventAbi.signature);
                        const tokenIds = [];
                        for (let i = 0; i < mintEvent.length; i++) {
                            const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent[i].data, mintEvent[i].topics.slice(1));
                            tokenIds.push(Number(decodedData.tokenId));
                        }
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        result = {
                            transactionID: transactionID,
                            blockchain: BlockchainType.Binance,
                            tokenIds: tokenIds
                        };
                    }
                } else if (data.blockchain === BlockchainType.Klaytn) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KLAYTN_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.KLAYTN_CONTRACT_OWNER_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    const myAccount1 = web3.eth.accounts.privateKeyToAccount(`0x${process.env.KLAYTN_WALLET_PRIVATE_KEY}`);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.KLAYTN_CONTRACT_ADDRESS);

                    // Calling the batchMint method of the contract and passing the transfer_to from payload 
                    // and the metadata url from payload
                    const resp = await myContract.methods.batchMint(myAccount1.address, data.metadata_urls).send({ from: myAccount.address, gas: 2000000 });
                    if (resp) {
                        const resp1 = await web3.eth.getTransactionReceipt(resp.transactionHash);
                        const eventAbi = contract_ABI.find((abi) => abi.name === 'Mint');
                        const mintEvent = resp1.logs.filter((log) => log.topics[0] === eventAbi.signature);
                        const tokenIds = [];
                        for (let i = 0; i < mintEvent.length; i++) {
                            const decodedData = web3.eth.abi.decodeLog(eventAbi.inputs, mintEvent[i].data, mintEvent[i].topics.slice(1));
                            tokenIds.push(Number(decodedData.tokenId));
                        }
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        result = {
                            transactionID: transactionID,
                            blockchain: BlockchainType.Klaytn,
                            tokenIds: tokenIds
                        };
                    }
                }
                // Return the result object as a response to API
                return result;
            }
        } catch (err) {
            throw err;
        }
    }

    public static transferNFT = async (data: transferNFTPayload): Promise<transferNFTResult> => {
        try {
            let transactionID = "";
            let blockchain = "";
            let tokenId: any;
            if (data.tokenIds.length > 1) {
                // Conditions to check on which blockchain we need to transfer the nft
                if (data.blockchain === BlockchainType.Ethereum) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.ETHEREUM_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.ETHEREUM_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.batchTransfer(data.tokenIds, data.receipent_address).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Ethereum;
                        tokenId = data.tokenIds;
                    }
                } else if (data.blockchain === BlockchainType.Binance) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.BINANCE_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.BINANCE_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.batchTransfer(data.tokenIds, data.receipent_address).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Binance;
                        tokenId = data.tokenIds;
                    }
                } else if (data.blockchain === BlockchainType.Klaytn) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KLAYTN_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.KLAYTN_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.KLAYTN_CONTRACT_ADDRESS);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.batchTransfer(data.tokenIds, data.receipent_address).send({ from: myAccount.address, gas: 2000000 });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Klaytn;
                        tokenId = data.tokenIds;
                    }
                }
            } else {
                // Conditions to check on which blockchain we need to transfer the nft
                if (data.blockchain === BlockchainType.Ethereum) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.ETHEREUM_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.ETHEREUM_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.safeTransferFrom(myAccount.address, data.receipent_address, data.tokenIds[0]).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Ethereum;
                        tokenId = data.tokenIds;
                    }
                } else if (data.blockchain === BlockchainType.Binance) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.BINANCE_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.BINANCE_CONTRACT_ADDRESS);

                    // Get block for generating the gas limit
                    const block = await web3.eth.getBlock("latest");
                    const gasLimit = Math.round(block.gasLimit / block.transactions.length);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.safeTransferFrom(myAccount.address, data.receipent_address, data.tokenIds[0]).send({ from: myAccount.address, gas: gasLimit });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Binance;
                        tokenId = data.tokenIds;
                    }
                } else if (data.blockchain === BlockchainType.Klaytn) {
                    // Creating an instance of provider for contract interaction
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KLAYTN_RPC_URL));

                    // Get the private key from env file and add to provider
                    const privateKey = `0x${process.env.KLAYTN_WALLET_PRIVATE_KEY}`;
                    const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
                    web3.eth.accounts.wallet.add(privateKey);

                    // Creating an instance of contract using contract addresss and ABI
                    const myContract = new web3.eth.Contract(contract_ABI, process.env.KLAYTN_CONTRACT_ADDRESS);

                    // Calling the safeTransferFrom method of the contract and passing the wallet_address from env file
                    // and the receiver address and tokenId which we want to transfer
                    const resp = await myContract.methods.safeTransferFrom(myAccount.address, data.receipent_address, data.tokenIds[0]).send({ from: myAccount.address, gas: 2000000 });
                    if (resp) {
                        // Set the transaction ID for response
                        transactionID = resp.transactionHash;
                        blockchain = BlockchainType.Klaytn;
                        tokenId = data.tokenIds;
                    }
                }
            }
            return {
                transactionID: transactionID,
                tokenIds: tokenId,
                blockchain: <BlockchainType>blockchain,
                receipent_address: data.receipent_address,
                wallet_address: data.wallet_address
            };
        } catch (err) {
            throw err;
        }
    }

    public static ownerOfNFT = async (data: ownerOfNFTPayload): Promise<ownerOfNFTResult> => {
        try {
            let isOwner = false;
            let result: ownerOfNFTResult;
            // Conditions to check on which blockchain we need to transfer the nft
            if (data.blockchain === BlockchainType.Ethereum) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.ETHEREUM_CONTRACT_ADDRESS);

                // Calling the ownerOf method of the contract and pass the tokenId for getting the owner of tokenId
                const resp = await myContract.methods.ownerOf(data.tokenId).call();
                if (resp) {
                    if (String(resp).toLowerCase() === String(data.wallet_address).toLowerCase()) {
                        isOwner = true;
                    }
                }
                result = {
                    isOwner: isOwner,
                    blockchain: BlockchainType.Ethereum,
                    tokenId: data.tokenId
                }
            } else if (data.blockchain === BlockchainType.Binance) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_RPC_URL));

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.BINANCE_CONTRACT_ADDRESS);

                // Calling the ownerOf method of the contract and pass the tokenId for getting the owner of tokenId
                const resp = await myContract.methods.ownerOf(data.tokenId).call();
                if (resp) {
                    if (String(resp).toLowerCase() === String(data.wallet_address).toLowerCase()) {
                        isOwner = true;
                    }
                }
                result = {
                    isOwner: isOwner,
                    blockchain: BlockchainType.Binance,
                    tokenId: data.tokenId
                }
            } else if (data.blockchain === BlockchainType.Klaytn) {
                // Creating an instance of provider for contract interaction
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KLAYTN_RPC_URL));

                // Creating an instance of contract using contract addresss and ABI
                const myContract = new web3.eth.Contract(contract_ABI, process.env.KLAYTN_CONTRACT_ADDRESS);

                // Calling the ownerOf method of the contract and pass the tokenId for getting the owner of tokenId
                const resp = await myContract.methods.ownerOf(data.tokenId).call();
                if (resp) {
                    if (String(resp).toLowerCase() === String(data.wallet_address).toLowerCase()) {
                        isOwner = true;
                    }
                }
                result = {
                    isOwner: isOwner,
                    blockchain: BlockchainType.Klaytn,
                    tokenId: data.tokenId
                }
            }

            return result;
        } catch (err) {
            throw err;
        }
    }

    public static imageGenerate = async (data: any, files: any): Promise<imageGenerateResult[]> => {
        let { category, noOfImage, blockchain } = data
        try {
            let isOwner = false;
            let result: any = []
            let modifiedData = await modifyCategoryData(files, category || [])
            const { error, value } = userValidation.imageGenerate.validate(data);

            if (error) {
                // Validation failed
                throw error?.details
                //   res.status(400).json({ error: error.details });
            }
            // let newArray = [...modifiedData]
            let i = 0;
            let inputsArray = []
            for (let i = 0; i < noOfImage; i++) {
                const { inputs, secondArray } = await imageProbability(modifiedData);
                const modifiedInputs = { ...inputs[0], file: inputs[0].file };
                inputsArray.push(inputs.map((item, index) => ({ ...item, file: inputs[index].file })));
                modifiedData = secondArray;
            }

            const results = await Promise.all(inputsArray.map(async (inputs, index) => {
                const sortedByOrder = [...inputs].sort((a, b) => parseInt(a?.order) - parseInt(b?.order));
                const images = sortedByOrder.map(item => item?.file?.image || "");
                let inputPath = `output${index}.jpeg`;
                await combineImages(images?.filter(item => item), inputPath);
                const formData = new FormData();
                formData.append('size', 'auto');
                formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
                let removedBgImage = await removeBackground(formData, inputPath)
                const metadata = sortedByOrder[0];
                delete metadata["file"];
                metadata["name"] = metadata?.categoryName;
                metadata["blockchain"] = blockchain;

                const data = new FormData();
                data.append('pinataMetadata', JSON.stringify(metadata));
                data.append('file', fs.createReadStream(`output${index}.jpeg`));
                // data.append('file', removedBgImage);

                const response = await uploadToPinata(data);

                // fs.unlink('output.jpeg', err => {
                //     if (err) {
                //         console.log("Error unlinking file:", err);
                //     }
                // });

                return { image_url: `https://gateway.pinata.cloud/ipfs/${response?.IpfsHash}`, uid: response?.IpfsHash, blockchain };
            }));
            // while (i < noOfImage) {
            //     console.log("🚀 ~ file: index.repository.ts:499 ~ Repository ~ imageGenerate= ~ newArray:", newArray)
            //     const { inputs, secondArray } = await imageProbability(newArray)
            //     console.log("🚀 ~ file: index.repository.ts:501 ~ Repository ~ imageGenerate= ~ newArray:", newArray, secondArray)
            //     const sortedByOrder = await inputs.sort((a, b) => parseInt(a?.order) - parseInt(b?.order));

            //     let images = sortedByOrder?.map(item => item?.file ? item?.file?.image : "")

            //     await combineImages(images);
            //     let metadata = sortedByOrder[0]
            //     delete metadata["file"]
            //     metadata["name"] = metadata?.categoryName
            //     let data = new FormData();
            //     data.append('pinataMetadata', JSON.stringify(metadata));
            //     data.append('file', fs.createReadStream('output.jpeg'));

            //     const response = await uploadToPinata(data);
            //     result.push({ image_url: `https://gateway.pinata.cloud/ipfs/${response?.IpfsHash}`, uid: response?.IpfsHash })
            //     fs.unlink('output.jpeg', err => {
            //         console.log("err:", err)
            //     })
            //     newArray = [...secondArray]

            //     i++

            // }

            return results;
        } catch (err) {
            // console.log("🚀 ~ file: index.repository.ts:517 ~ Repository ~ imageGenerate= ~ err:", err)
            throw err;
        }
    }
}
export default new Repository();