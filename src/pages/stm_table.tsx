import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Stm } from 'src/interfaces/stm';
import { stmList } from 'src/pages/api/stm';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Grid } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const Stm = () => {
  const [stm, setStm] = useState<Stm[]>([]);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Stm>('last_name');
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      stmList().then((res) => {
        setStm(res.data);
      }).catch((err) => {
        console.log(err);
      });
    };
    fetchData();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Stm,
  ) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedStm = React.useMemo(() => {
    return stm.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [stm, orderDirection, orderBy]);

  const handleMouseEnter = (columnName: string) => {
    setHoveredColumn(columnName);
  };

  const handleMouseLeave = () => {
    setHoveredColumn(null);
  };

  const handleHeaderMouseEnter = () => {
    setHoveredColumn('all');
  };

  const handleHeaderMouseLeave = () => {
    setHoveredColumn(null);
  };

  return (
    <div>
      <Head>
        <title>STM</title>
      </Head>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead
            onMouseEnter={handleHeaderMouseEnter}
            onMouseLeave={handleHeaderMouseLeave}
          >
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}></TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('last_name')}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredColumn && (
                  <div style={{
                    position: 'absolute',
                    height: '50%',
                    width: '2px',
                    backgroundColor: '#ccc',
                    right: 0,
                    top: '25%',
                  }} />
                )}
                <TableSortLabel
                  active={orderBy === 'last_name'}
                  direction={orderBy === 'last_name' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'last_name')}
                >
                  氏名
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('age')}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredColumn && (
                  <div style={{
                    position: 'absolute',
                    height: '50%',
                    width: '2px',
                    backgroundColor: '#ccc',
                    right: 0,
                    top: '25%',
                  }} />
                )}
                <TableSortLabel
                  active={orderBy === 'age'}
                  direction={orderBy === 'age' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'age')}
                >
                  年齢
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('gender')}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredColumn && (
                  <div style={{
                    position: 'absolute',
                    height: '50%',
                    width: '2px',
                    backgroundColor: '#ccc',
                    right: 0,
                    top: '25%',
                  }} />
                )}
                <TableSortLabel
                  active={orderBy === 'gender'}
                  direction={orderBy === 'gender' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'gender')}
                >
                  性別
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('contact_information')}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredColumn && (
                  <div style={{
                    position: 'absolute',
                    height: '50%',
                    width: '2px',
                    backgroundColor: '#ccc',
                    right: 0,
                    top: '25%',
                  }} />
                )}
                <TableSortLabel
                  active={orderBy === 'contact_information'}
                  direction={orderBy === 'contact_information' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'contact_information')}
                >
                  連絡先
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('postal_code')}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredColumn && (
                  <div style={{
                    position: 'absolute',
                    height: '50%',
                    width: '2px',
                    backgroundColor: '#ccc',
                    right: 0,
                    top: '25%',
                  }} />
                )}
                <TableSortLabel
                  active={orderBy === 'postal_code'}
                  direction={orderBy === 'postal_code' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'postal_code')}
                >
                  郵便番号
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  position: 'relative',
                }}
                onMouseEnter={() => handleMouseEnter('address')}
                onMouseLeave={handleMouseLeave}
              >
                <TableSortLabel
                  active={orderBy === 'address'}
                  direction={orderBy === 'address' ? orderDirection : 'asc'}
                  onClick={(event) => handleRequestSort(event, 'address')}
                >
                  住所
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sortedStm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedStm
            ).map((item, index) => (
              <TableRow key={index} onClick={() => router.push(`/stm/${item.id}`)}>
                <TableCell>
                  <Grid container justifyContent='center' alignItems='center'>
                    <AccountCircleIcon sx={{ color: '#ccc', fontSize: 40 }} />
                  </Grid>
                </TableCell>
                <TableCell>{item.last_name} {item.first_name} ({item.last_name_kana} {item.first_name_kana})</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>{item.contact_information}</TableCell>
                <TableCell>{item.postal_code}</TableCell>
                <TableCell>{item.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={stm.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={(event) => handleChangeRowsPerPage(event)}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Stm;
