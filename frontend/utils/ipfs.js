export const ipfsToHttp = (ipfsUrl) => {
  if (!ipfsUrl) return "";
  const hash = ipfsUrl.replace("ipfs://", "");
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
  // or return `https://ipfs.io/ipfs/${hash}`;
};

export const isValidIpfsUrl = (url) => {
  if (!url) return false;

  const ipfsPattern =
    /^https:\/\/(ipfs\.io|gateway\.pinata\.cloud)\/ipfs\/[a-zA-Z0-9]+/;
  return ipfsPattern.test(url);
};

export function convertIpfsUrl(ipfsUrl) {
  if (!ipfsUrl) {
    console.error("Empty IPFS URL provided to convertIpfsUrl");
    return null;
  }

  if (ipfsUrl.startsWith("ipfs://")) {
    const ipfsHash = ipfsUrl.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }

  if (ipfsUrl.startsWith("http://") || ipfsUrl.startsWith("https://")) {
    return ipfsUrl;
  }

  if (ipfsUrl.match(/^[a-zA-Z0-9]{46}$/)) {
    return `https://ipfs.io/ipfs/${ipfsUrl}`;
  }

  return ipfsUrl;
}
