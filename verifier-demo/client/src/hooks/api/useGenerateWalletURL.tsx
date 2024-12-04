import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./base";

const useGenerateWalletURL = (enabled = true) => {
  const generateWalletURL = async () => {
    // const response = await fetch(
    //   "http://localhost:8080/login/generateWalletURL"
    // );
    const response = await fetch(`${baseUrl}/login/generateWalletURL`);

    const { walletUrl, login_id } = await response.json();
    return { walletUrl, login_id };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["walletUrl"],
    queryFn: generateWalletURL,
    enabled,
  });

  const login_id = data?.login_id;
  const walletUrl = data?.walletUrl;

  return {
    walletUrl,
    login_id,
    isLoading,
    error,
  };
};

export default useGenerateWalletURL;
