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

export function extractCIDFromURL(url) {
  if (!url) return null;

  // Se a URL começa com ipfs://, extrair diretamente
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "");
  }

  // Para URLs HTTP(S) com /ipfs/
  if (url.includes("/ipfs/")) {
    const parts = url.split("/ipfs/");
    if (parts.length > 1) {
      const cidWithPath = parts[1];
      return cidWithPath.split("/")[0].split("?")[0];
    }
  }

  const ipfsSubdomainMatch = url.match(
    /https:\/\/([a-z0-9]+)\.ipfs\.[a-zA-Z0-9.]+/
  );
  if (ipfsSubdomainMatch && ipfsSubdomainMatch[1]) {
    return ipfsSubdomainMatch[1];
  }

  console.warn("Não foi possível extrair o CID da URL:", url);
  return url;
}
