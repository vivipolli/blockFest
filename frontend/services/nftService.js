import axios from "axios";
import { Buffer } from "buffer";

const HORIZON_URL = "https://horizon-testnet.stellar.org/accounts/";

const fetchNftData = async (profileAddress) => {
  const config = {
    method: "get",
    url: `${HORIZON_URL}${profileAddress}/data/NFT_TBF_ipfs`,
    headers: { Accept: "application/json" },
  };

  try {
    const response = await axios.request(config);
    const base64Value = response.data.value;
    const ipfsHash = Buffer.from(base64Value, "base64").toString("utf-8");

    const metadata = await fetchIpfsData(ipfsHash);

    return [
      {
        tokenUri: `https://ipfs.io/ipfs/${ipfsHash}`,
        tx_id: "stellar-nft-" + Date.now(),
        metadata: metadata,
      },
    ];
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return [];
  }
};

const fetchIpfsData = async (ipfsHash) => {
  const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  try {
    const response = await axios.get(ipfsUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching IPFS data:", error);
    throw error;
  }
};

export default {
  fetchNftData,
};
