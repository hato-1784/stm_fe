import { useState, useCallback } from "react";
import { Stm } from 'src/interfaces/stm/response_stm';
import stmApi from 'src/pages/api/stm';
import useLoading from 'src/hooks/useLoading';

export const useStmPage = (username: string) => {
  const [stm, setStm] = useState<Stm[]>([]);
  const [filteredStm, setFilteredStm] = useState<Stm[]>([]);
  const [selectedData, setSelectedData] = useState<Stm[]>([]);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, setIsLoading } = useLoading();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await stmApi.stmList();
      setStm(res);
      setFilteredStm(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 検索処理
  const handleSearch = useCallback(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = stm.filter(item =>
      item.last_name.toLowerCase().includes(lowercasedQuery) ||
      item.first_name.toLowerCase().includes(lowercasedQuery) ||
      item.last_name_kana.toLowerCase().includes(lowercasedQuery) ||
      item.first_name_kana.toLowerCase().includes(lowercasedQuery) ||
      item.address.toLowerCase().includes(lowercasedQuery) ||
      item.contact_information.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredStm(filteredData);
  }, [searchQuery, stm]);

  // 選択された行のデータをエクスポートする関数
  const handleExport = async () => {
    if (selectedData.length > 0) {
      const csvHeader = Object.keys(selectedData[0]).join(',') + '\n';
      const csvBody = selectedData
        .map(row => Object.values(row).join(','))
        .join('\n');
      const csvContent = csvHeader + csvBody;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 検索クエリの状態を更新する関数
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredStm(stm);
    }
  }, [stm]);

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, id: string, index: number) => {
    let newSelectedData = [...selectedData];
    const isChecked = event.target.checked;
    const isShiftKey = (event.nativeEvent as MouseEvent).shiftKey;

    if (isShiftKey && lastChecked !== null) {
      const start = Math.min(lastChecked, index);
      const end = Math.max(lastChecked, index);
      const toBeToggled = stm.slice(start, end + 1);

      if (isChecked) {
        newSelectedData = [...new Set([...newSelectedData, ...toBeToggled])];
      } else {
        newSelectedData = newSelectedData.filter(data => !toBeToggled.some(toggle => toggle.id === data.id));
      }
    } else {
      if (isChecked) {
        newSelectedData.push(stm.find(data => data.id === id)!);
      } else {
        newSelectedData = newSelectedData.filter(data => data.id !== id);
      }
      setLastChecked(index);
    }

    setSelectedData(newSelectedData);
  }, [selectedData, lastChecked, stm]);

  const handleDelete = async () => {
    if (selectedData.length > 0) {
      try {
        await stmApi.stmDeleteMultiple(selectedData, username);
        setSelectedData([]);
        await fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return {
    stm,
    filteredStm,
    selectedData,
    searchQuery,
    isLoading,
    handleSearchQueryChange,
    handleCheckboxChange,
    handleDelete,
    handleExport,
    handleKeyDown,
    fetchData,
  };
};

