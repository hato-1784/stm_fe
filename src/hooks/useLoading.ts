import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  return { isLoading, setIsLoading };
};

export default useLoading;