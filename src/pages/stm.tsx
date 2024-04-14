import React, { useEffect } from "react";
import withAuth from 'src/components/hoc/with_auth';
import Head from "next/head";
import { useRouter } from 'next/router';
import { User } from 'src/interfaces/user/response_user';
import { DataGrid, GridColDef, GridValueGetterParams, jaJP } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PostalMarkIcon from 'src/icons/PostalMarkIcon';
import CustomNoRowsOverlay from 'src/components/stm/customNoRowsOverlay';
import CustomToolbar from 'src/components/stm/customToolbar';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import { useUploadSuccess } from 'src/contexts/uploadSuccessContext';
import { useStmPage } from 'src/hooks/stm/useStmPage';
import LoadingScreenWrapper from 'src/components/loading/loadingScreenWrapper';

const StmPage: React.FC<User> = ({ username }) => {
  const {
    stm,
    filteredStm,
    selectedData,
    isLoading,
    fetchData,
    handleSearchQueryChange,
    handleCheckboxChange,
    handleDelete,
    handleExport,
    handleKeyDown,
  } = useStmPage(username);

  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [deleteMode, setDeleteMode] = React.useState(false);
  const [exportMode, setExportMode] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = useUploadSuccess();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const toggleExportMode = () => {
    setExportMode(!exportMode);
  };

  const columns: GridColDef[] = [
    {
      field: ' ',
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
      flex: 5,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.last_name_kana || ''} ${params.row.first_name_kana || ''}\n${params.row.last_name || ''} ${params.row.first_name || ''}`,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line', lineHeight: 'normal' }}>
          <span style={{ fontSize: '10px' }}>
            {params.row.last_name_kana || ''} {params.row.first_name_kana || ''}
          </span>
          <br />
          {params.row.last_name || ''} {params.row.first_name || ''}
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
          <PostalMarkIcon />
          {params.value ? params.value.replace(/^(\d{3})(\d{4})$/, '$1-$2') : ''}
        </div>
      ),
    },
    {
      field: 'address',
      headerName: '住所',
      flex: 13,
      sortable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>
          {params.value}
        </div>
      ),
    },
  ];

  return (
    <LoadingScreenWrapper isLoading={isLoading}>
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
              setUploadSuccess={setUploadSuccess}
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
            rowHeight={70}
            hideFooter={true}
            hideFooterPagination={true}
            sx={{
              width: '100%',
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
            }}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Container>
    </LoadingScreenWrapper>
  );
};

export default withAuth(StmPage);
