import { useState } from 'react';

const useDropdownState = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // 現在開いているドロップダウンをクリックした場合（openDropdown === index）にopenDropdownをnullにする（閉じる）
  // 現在開いているドロップダウン以外をクリックした場合（openDropdown !== index）にopenDropdownをクリックしたindexにする（開く）
  const handleDropdownClick = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return { openDropdown, handleDropdownClick };
};

export default useDropdownState;

