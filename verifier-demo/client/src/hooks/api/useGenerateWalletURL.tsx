import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./base";

const useGenerateWalletURL = (enabled = true) => {
  const generateWalletURL = async () => {
    const response = await fetch(`${baseUrl}/present/generateWalletURL`);

    const { walletUrl, challenge } = await response.json();
    return { walletUrl, challenge };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["walletUrl"],
    queryFn: generateWalletURL,
    enabled,
  });

  const challenge = data?.challenge;
  const walletUrl = data?.walletUrl;

  return {
    walletUrl,
    challenge,
    isLoading,
    error,
  };
};

export default useGenerateWalletURL;
