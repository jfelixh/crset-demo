import { useQuery } from "@tanstack/react-query";

const useGenerateWalletURL = () => {
  const generateWalletURL = async () => {
    const response = await fetch("http://localhost:8080/login/generateWalletURL");

    const { walletUrl } = await response.json();
    return walletUrl;
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["walletUrl"],
    queryFn: generateWalletURL,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useGenerateWalletURL;
