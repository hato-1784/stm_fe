import React from 'react';
import { Stm } from 'src/interfaces/stm';
import stmApi from 'src/pages/api/stm';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddBoxIcon from '@mui/icons-material/AddBox'; // データ追加アイコン
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // データ削除アイコン
import CloseIcon from '@mui/icons-material/Close'; // 編集モード終了アイコン
import { useRouter } from 'next/router'; // Next.jsのルーターフックをインポート
import Box from '@mui/material/Box'; // MUIのBoxコンポーネントをインポート
import Button from '@mui/material/Button'; // Buttonコンポーネントをインポート
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search'; // 検索アイコンをインポート

// スタイル定義
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05), // 背景色を薄い灰色に設定
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1), // ホバー時の背景色を少し濃い灰色に設定
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0, // ここを0に変更して、左にマージンが入らないようにします
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(0), // この値を0に変更して左端に移動
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2.5)})`,
    width: '30ch', // 検索バーの幅を調整
  },
}));

interface CustomToolbarProps {
  deleteMode: boolean;
  setDeleteMode: (deleteMode: boolean) => void;
  exportMode: boolean;
  setExportMode: (exportMode: boolean) => void;
  selectedData: Stm[];
  onDelete: (selectedData: Stm[]) => void;
  onExport: (selectedData: Stm[]) => void;
  onSearchQueryChange: (query: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // onKeyDownプロパティを追加
  username: string;
  fetchData: () => Promise<void>;
}

const CustomToolbar = ({
  deleteMode: deleteMode,
  setDeleteMode: setDeleteMode,
  exportMode: exportMode,
  setExportMode: setExportMode,
  selectedData,
  onDelete,
  onExport,
  onSearchQueryChange,
  onKeyDown,
  username, fetchData
}: CustomToolbarProps) => {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null); // ファイル入力のためのref

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const toggleExportMode = () => {
    setExportMode(!exportMode);
  };

  const handleAddClick = () => {
    router.push('/stm/add_stm_data');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      await stmApi.stmUpload(file, username); // Buffer.from(buffer)の代わりにfileを直接使用
      // アップロード後の処理（成功通知など）をここに追加
      await fetchData();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click(); // 非表示のファイル入力をトリガー
  };

  return (
    <Box sx={{ justifyContent: 'space-between', pt: 0, display: 'flex' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // 入力を非表示にする
        onChange={handleFileUpload}
      />
      {(!deleteMode && !exportMode) && (
        <>
          <Search>
            <SearchIconWrapper>
              <IconButton>
                <SearchIcon />
              </IconButton>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => onSearchQueryChange((e.target as HTMLInputElement).value)}
              onKeyDown={onKeyDown} // onKeyDownイベントハンドラを使用
            />
          </Search>
          <div style={{ display: 'flex' }}>
            <IconButton onClick={handleAddClick}>
              <AddBoxIcon /> {/* データ追加 */}
            </IconButton>
            <IconButton onClick={toggleDeleteMode}>
              <DeleteOutlineIcon />
            </IconButton>
            <IconButton onClick={triggerFileInput}>
              <CloudUploadIcon />
            </IconButton>
            <IconButton onClick={toggleExportMode}>
              <CloudDownloadIcon />
            </IconButton>
          </div>
        </>
      )}
      {deleteMode && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IconButton onClick={toggleDeleteMode}>
            <CloseIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={() => onDelete(selectedData)}
            disabled={selectedData.length === 0} // 選択されていない場合はボタンを無効化
            style={{
              backgroundColor: selectedData.length > 0 ? 'red' : 'grey', // 選択されている場合は赤色、そうでなければグレー
              color: 'white',
              marginLeft: '8px', // マージンを適用してボタン間のスペースを確保
              height: '28px',
            }}
          >
            削除 {/* アイコンではなくテキストを表示 */}
          </Button>
        </div>
      )}
      {exportMode && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IconButton onClick={toggleExportMode}>
            <CloseIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={() => onExport(selectedData)}
            disabled={selectedData.length === 0} // 選択されていない場合はボタンを無効化
            style={{
              backgroundColor: selectedData.length > 0 ? 'green' : 'grey', // 選択されている場合は赤色、そうでなければグレー
              color: 'white',
              marginLeft: '8px', // マージンを適用してボタン間のスペースを確保
              height: '28px',
            }}
          >
            エクスポート {/* アイコンではなくテキストを表示 */}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default CustomToolbar
