import React from 'react';
import { Stm } from 'src/interfaces/stm';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddBoxIcon from '@mui/icons-material/AddBox'; // データ追加アイコン
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // データ削除アイコン
import CloseIcon from '@mui/icons-material/Close'; // 編集モード終了アイコン
import { useRouter } from 'next/router'; // Next.jsのルーターフックをインポート
import { useGridApi } from './data_grid';
import Box from '@mui/material/Box'; // MUIのBoxコンポーネントをインポート

interface CustomToolbarProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  selectedData: Stm[];
  onDelete: (selectedData: Stm[]) => void; // 引数の型を修正
}

const CustomToolbar = ({ editMode, setEditMode, selectedData, onDelete }: CustomToolbarProps) => {
  const { apiRef } = useGridApi(); // useGridApiフックを使用してDataGridのAPI参照を取得
  const router = useRouter();

  const handleSearchClick = () => {
    if (apiRef && apiRef.current) {
      apiRef.current.showFilterPanel();
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode); // 編集モードの切り替え
  };

  const handleAddClick = () => {
    router.push('/stm/add_stm_data'); // AddBoxIconクリック時に指定のパスに遷移
  };

  // GridToolbarContainerの代わりにBoxを使用
  return (
    <Box sx={{ justifyContent: 'space-between', pt: 0, display: 'flex' }}>
      {!editMode && (
        <>
          <IconButton onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
          <div style={{ display: 'flex' }}>
            <IconButton onClick={toggleEditMode}>
              <EditIcon />
            </IconButton>
            <IconButton>
              <CloudUploadIcon />
            </IconButton>
            <IconButton>
              <CloudDownloadIcon />
            </IconButton>
          </div>
        </>
      )}
      {editMode && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <IconButton onClick={toggleEditMode}>
            <CloseIcon /> {/* 編集モード終了 */}
          </IconButton>
          <IconButton onClick={handleAddClick}>
            <AddBoxIcon /> {/* データ追加 */}
          </IconButton>
          <IconButton onClick={() => onDelete(selectedData)}>
            <DeleteOutlineIcon /> {/* データ削除 */}
          </IconButton>
        </div>
      )}
    </Box>
  );
};

export default CustomToolbar;
