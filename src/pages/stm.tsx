import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Stm } from 'src/interfaces/stm';
import { stmList } from 'src/pages/api/stm';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PostalMarkIcon from 'src/icons/PostalMarkIcon';
import CircularProgress from '@mui/material/CircularProgress'; // ローディングインジケーター用のコンポーネントをインポート
import Button from '@mui/material/Button';

const StmPage = () => {
  const [stm, setStm] = useState<Stm[]>([]);
  const [isLoading, setIsLoading] = useState(true); // データ読み込み状態を追跡するための状態変数
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // データ読み込み開始
      stmList().then((res) => {
        console.log(res);
        setStm(res);
        setIsLoading(false); // データ読み込み完了
      }).catch((err) => {
        console.log(err);
        setIsLoading(false); // エラーが発生しても読み込み状態を解除
      });
    };
    fetchData();
  }, []);

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
      renderCell: (params) => (
        <ArrowForwardIosIcon
          style={{ cursor: 'pointer', color: '#CCCCCC' }}
          onClick={() => router.push(`/stm/${params.row.id}`)}
        />
      ),
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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" color="success" onClick={() => router.push('/stm/add_stm_data')}>追加</Button>
        </Box>
        <DataGrid
          rows={stm}
          columns={columns}
          sortingMode="server"
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
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 50, 100]}
        />
      </Box>
    </Container>
  );
};

export default StmPage;

