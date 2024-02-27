import React, { useEffect, useState, useCallback } from "react";
import withAuth from 'src/components/hoc/with_auth';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Stm } from 'src/interfaces/stm';
import { User } from 'src/interfaces/user';
import stmApi from 'src/pages/api/stm';
import { DataGrid, GridColDef, GridValueGetterParams, jaJP } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PostalMarkIcon from 'src/icons/PostalMarkIcon';
import CircularProgress from '@mui/material/CircularProgress'; // ローディングインジケーター用のコンポーネントをインポート
import CustomNoRowsOverlay from 'src/components/stm/custom_no_rows_overlay';
import CustomToolbar from 'src/components/stm/custom_toolbar';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox'; // Checkboxをインポート

const StmPage: React.FC<User> = ({ username }) => {
  const [stm, setStm] = useState<Stm[]>([]);
  const [filteredStm, setFilteredStm] = useState<Stm[]>([]); // 検索結果を格納するための状態
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態
  const [isLoading, setIsLoading] = useState(true); // データ読み込み状態を追跡するための状態変数
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [deleteMode, setDeleteMode] = useState(false); // 削除モードの状態を追加
  const [exportMode, setExportMode] = useState(false); // Exportモードの状態を追加
  const [selectedData, setSelectedData] = useState<Stm[]>([]); // 選択されたデータを管理
  const [lastChecked, setLastChecked] = useState<number | null>(null); // 最後にチェックされた行のインデックスを保持

  const fetchData = async () => {
    setIsLoading(true); // データ読み込み開始
    try {
      const res = await stmApi.stmList();
      setStm(res);
      setFilteredStm(res); // データ取得後に検索結果を更新
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // データ読み込み完了またはエラー発生後にローディング状態を解除
    }
  };

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
      // 他に検索対象としたいフィールドがあればここに追加
    );
    setFilteredStm(filteredData);
  }, [searchQuery, stm]);

  // エンターキーを押下したときに検索を実行するイベントハンドラ
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // 検索クエリが変更されたときに検索を実行
  useEffect(() => {
    fetchData();
    // 初期読み込み時には検索を実行しない
  }, []);

  // 検索クエリ入力フィールドの変更イベントハンドラ
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query === '') {
      // 検索バーが空の場合はすべてのデータを表示
      setFilteredStm(stm);
    }
  }, [stm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // ページサイズを変更するときは1ページ目に戻る
  };

  // 削除モードの状態を切り替える関数
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  // Exportモードの状態を切り替える関数
  const toggleExportMode = () => {
    setExportMode(!exportMode);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string, index: number) => {
    let newSelectedData = [...selectedData];
    const isChecked = event.target.checked;
    const isShiftKey = (event.nativeEvent as MouseEvent).shiftKey;

    if (isShiftKey && lastChecked !== null) {
      const start = Math.min(lastChecked, index);
      const end = Math.max(lastChecked, index);
      const toBeToggled = stm.slice(start, end + 1);

      if (isChecked) {
        // 範囲内の未選択項目を選択
        newSelectedData = [...new Set([...newSelectedData, ...toBeToggled])];
      } else {
        // 範囲内の選択項目を解除
        newSelectedData = newSelectedData.filter(data => !toBeToggled.some(toggle => toggle.id === data.id));
      }
    } else {
      if (isChecked) {
        newSelectedData.push(stm.find(data => data.id === id)!);
      } else {
        newSelectedData = newSelectedData.filter(data => data.id !== id);
      }
      setLastChecked(index); // 最後にチェックされた行のインデックスを更新
    }

    setSelectedData(newSelectedData);
  };


  // 選択された行のIDを使用して削除処理を行う関数
  const handleDelete = async () => {
    if (selectedData.length > 0) {
      try {
        await stmApi.stmDeleteMultiple(selectedData, username as string);
        setSelectedData([]); // 選択状態をクリア
        await fetchData(); // 削除後にデータを再取得
        // 成功した場合のメッセージ表示など
      } catch (error) {
        console.error(error);
        // エラー処理
      }
    }
  };

  // 選択された行のデータをエクスポートする関数
  const handleExport = async () => {
    if (selectedData.length > 0) {
      // 選択されたデータをCSV形式でエクスポートする処理
      const csvHeader = Object.keys(selectedData[0]).join(',') + '\n'; // ヘッダー行
      const csvBody = selectedData
        .map(row => {
          return Object.values(row).join(',');
        })
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

  if (isLoading) {
    return (
      <Container component="main">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress /> {/* ローディングインジケーターを表示 */}
        </Box>
      </Container>
    );
  }

  const columns: GridColDef[] = [
    {
      // 空にするとヘッダーの背景色が変わってしまうため、空白を入れる
      field: ' ',
      // 空にするとヘッダーの背景色が変わってしまうため、空白を入れる
      headerName: ' ',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => {
        if (deleteMode || exportMode) {
          const isChecked = selectedData.some(data => data.id === params.row.id);
          const index = stm.findIndex(data => data.id === params.row.id); // 現在の行のインデックスを取得
          return (
            <Checkbox
              color="primary"
              checked={isChecked}
              onChange={(event) => handleCheckboxChange(event, params.row.id, index)}
            />
          );
        } else {
          return (
            <ArrowForwardIosIcon
              style={{ cursor: 'pointer', color: '#CCCCCC' }}
              onClick={() => router.push(`/stm/${params.row.id}`)}
            />
          );
        }
      },
    },
    {
      field: 'fullName',
      headerName: '氏名',
      flex: 8,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.last_name || ''} ${params.row.first_name || ''}（${params.row.last_name_kana || ''} ${params.row.first_name_kana || ''}）`,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'age',
      headerName: '年齢',
      type: 'number',
      flex: 3,
      sortable: true,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'gender',
      headerName: '性別',
      flex: 3,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'contact_information',
      headerName: '連絡先',
      flex: 4,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'postal_code',
      headerName: '郵便番号',
      flex: 4,
      sortable: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', }}>
          {/* <PostalMarkIcon style={{ fontSize: 'inherit' }} /> */}
          <PostalMarkIcon />
          {/* 郵便番号をハイフン区切りに変更 */}
          {params.value ? params.value.replace(/^(\d{3})(\d{4})$/, '$1-$2') : ''}
        </div>
      ),
    },
    {
      field: 'address',
      headerName: '住所',
      flex: 10,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
  ];

  // データが読み込まれた後のコンポーネントのレンダリング
  return (
    <Container component="main" style={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Head>
          <title>STM</title>
        </Head>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CustomToolbar
            deleteMode={deleteMode}
            setDeleteMode={toggleDeleteMode}
            exportMode={exportMode}
            setExportMode={toggleExportMode}
            selectedData={selectedData}
            onDelete={handleDelete}
            onExport={handleExport}
            onSearchQueryChange={handleSearchQueryChange}
            onKeyDown={handleKeyDown}
            username={username as string}
            fetchData={fetchData}
          />
          <TablePagination
            component="div"
            count={stm.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 50, 100]}
          />
        </Box>
        <DataGrid
          rows={filteredStm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          columns={columns}
          rowCount={stm.length}
          sortingMode="client"
          autoHeight
          hideFooter={true}
          hideFooterPagination={true}
          sx={{
            width: '100%',
            // muiのデフォルトのスタイルを変更
            '.MuiDataGrid-columnHeader--sorted': {
              backgroundColor: 'transparent',
            },
            '.MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '.MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '--DataGrid-overlayHeight': '300px',
          }}
          pagination
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            // toolbar: () => <CustomToolbar editMode={editMode} setEditMode={toggleEditMode} selectedData={selectedData} onDelete={handleDelete} />,
          }}
          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Container>
  );
};

export default withAuth(StmPage);
