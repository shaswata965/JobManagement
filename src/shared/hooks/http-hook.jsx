import { useCallback, useState, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSucess] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      console.log(url, method, body, headers);
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData);
        }
        setIsLoading(false);
        setIsSucess(true);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again");
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError, isSuccess, setIsSucess };
};
