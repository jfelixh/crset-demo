import { useQuery } from "@tanstack/react-query";

const useTest = () => {
  const test = async () => {
    const response = await fetch("http://localhost:8080/test");

    const { test } = await response.json();
    return test;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["test"],
    queryFn: test,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useTest;
