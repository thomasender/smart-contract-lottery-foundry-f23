import { ContractABI } from "./hooks/use-contract";
import ABI from "./raffle-abi.json"

// OWNER: 0x7B3594AA123CFdFE16fb2d9122D86E34E76B8749
// MUMBAI Address: 0x666dDf38c9F35E63e6b4d4895a200f0CbeAe85E5 (Interval 60 seconds)
export const RAFFLE_ADDRESS = "0x666dDf38c9F35E63e6b4d4895a200f0CbeAe85E5";
export const CONTRACT_ABI = ABI as ContractABI;
// Mumbai Testnet TX BASE URL: https://mumbai.polygonscan.com/tx/
// Mainnet TX BASE URL: https://polygonscan.com/tx/
export const ETHERSCAN_POLYGON_BASE_URL = "https://polygonscan.com/"
export const ETHERSCAN_POLYGON_TX_BASE_URL = `${ETHERSCAN_POLYGON_BASE_URL}tx/`
export const ETHERSCAN_POLYGON_ADDRESS_BASE_URL = `${ETHERSCAN_POLYGON_BASE_URL}address/`
export const ETHERSCAN_MUMBAI_POLYGON_TX_BASE_URL = "https://mumbai.polygonscan.com/tx/"
export const POLYGON_MUMBAI_CHAIN_ID = 80001;
export const POLYGON_MAINNET_CHAIN_ID = 137;

export const POLL_INTERVAL_IN_MS = 5000;
export const NEXT_DRAW_INTERVAL_IN_MS = 60000;