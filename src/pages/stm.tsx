import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useAuth } from 'src/contexts/auth';
import { Stm } from 'src/interfaces/stm';
import { stmList, stmDeleteMultiple } from 'src/pages/api/stm'; // Updated to include stmDeleteMultiple
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

const StmPage = () => {
  const username = useAuth().user?.username;
  const [stm, setStm] = useState<Stm[]>([]);
  const [isLoading, setIsLoading] = useState(true); // データ読み込み状態を追跡するための状態変数
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [editMode, setEditMode] = useState(false); // 編集モードの状態を追加
  const [selectedData, setSelectedData] = useState<Stm[]>([]); // 選択されたデータを管理

  const fetchData = async () => {
    setIsLoading(true); // データ読み込み開始
    try {
      const res = await stmList();
      setStm(res);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // データ読み込み完了またはエラー発生後にローディング状態を解除
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // ページサイズを変更するときは1ページ目に戻る
  };

  // 編集モードの状態を切り替える関数
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // 選択された行のIDを使用して削除処理を行う関数
  const handleDelete = async () => {
    if (selectedData.length > 0) {
      try {
        await stmDeleteMultiple(selectedData, username as string); // 'username'は適切な値に置き換えてください
        setSelectedData([]); // 選択状態をクリア
        await fetchData(); // 削除後にデータを再取得
        // 成功した場合のメッセージ表示など
      } catch (error) {
        console.error(error);
        // エラー処理
      }
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
        if (editMode) {
          const isChecked = selectedData.some(data => data.id === params.row.id);
          return (
            <Checkbox
              color="primary"
              checked={isChecked}
              onChange={(event) => {
                const newData = isChecked
                  ? selectedData.filter(data => data.id !== params.row.id)
                  : [...selectedData, params.row];
                setSelectedData(newData);
              }}
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
          <CustomToolbar editMode={editMode} setEditMode={toggleEditMode} selectedData={selectedData} onDelete={handleDelete} />
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
          rows={stm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
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

export default StmPage;
