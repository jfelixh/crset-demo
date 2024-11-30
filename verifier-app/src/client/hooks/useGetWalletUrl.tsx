import { useQuery } from "@tanstack/react-query";

export const useGetWalletUrl = () => {
  const getWalletUrl = async () => {
    const { uuid: _, walletUrl } = await fetch("/test").then(
      (res) => res.json()
    );

    return walletUrl;
  };

  const {
    data: walletUrl,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletUrl"],
    queryFn: getWalletUrl,
  });

  return { walletUrl, isLoading, isError, error };
};
