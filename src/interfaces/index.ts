export enum BlockchainType {
    Ethereum = "Ethereum",
    Binance = "Binance",
    Klaytn = "Klaytn"
}

export interface singleNFTPayload {
    metadata_url: string;
    blockchain: BlockchainType;
}

export interface singleNFTResult {
    transactionID: string;
    blockchain_type: BlockchainType;
    tokenId: number;
}

export interface multiNFTPayload {
    metadata_urls: string;
    blockchain: BlockchainType;
}

export interface multiNFTResult {
    transactionID: string;
    blockchain: BlockchainType;
    tokenIds: number[];
}

export interface transferNFTPayload {
    wallet_address: string;
    tokenIds: number[];
    receipent_address: string;
    blockchain: BlockchainType;
}

export interface transferNFTResult {
    wallet_address: string;
    transactionID: string;
    tokenIds: number[];
    blockchain: BlockchainType;
    receipent_address: string;
}

export interface ownerOfNFTPayload {
    wallet_address: string;
    tokenId: number;
    blockchain: BlockchainType;
}

export interface ownerOfNFTResult {
    isOwner: boolean;
    tokenId: number;
    blockchain: BlockchainType;
}

export interface imageGenerateResult {
    image_url: string;
    uid: string;
}