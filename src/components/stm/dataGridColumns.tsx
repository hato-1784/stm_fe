import React from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PostalMarkIcon from 'src/icons/PostalMarkIcon';

export const getDataGridColumns = (
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>, id: string, index: number) => void,
  selectedData: any[],
  stm: any[],
  deleteMode: boolean,
  exportMode: boolean,
  router: any
): GridColDef[] => [
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