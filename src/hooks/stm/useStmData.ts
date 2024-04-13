import { useState, useCallback } from 'react';
import stmApi from 'src/pages/api/stm';
import { Stm } from 'src/interfaces/stm/response_stm';

export const useStmData = () => {
  const [stm, setStm] = useState<Stm[]>([]);
  const [filteredStm, setFilteredStm] = useState<Stm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await stmApi.stmList();
      setStm(res);
      setFilteredStm(res);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stm, filteredStm, setFilteredStm, isLoading, fetchData };
};