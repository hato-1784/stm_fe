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

const Stm = () => {
  const [stm, setStm] = useState<Stm[]>([]);
  const router = useRouter();

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

  return (
    <div>
      <Head>
        <title>STM</title>
      </Head>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>氏名</TableCell>
              <TableCell>年齢</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>連絡先</TableCell>
              <TableCell>郵便番号</TableCell>
              <TableCell>住所</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stm.map((item, index) => (
              <TableRow key={index} onClick={() => router.push(`/stm/${item.id}`)}>
                <TableCell>{item.last_name} {item.first_name} ({item.last_name_kana} {item.first_name_kana})</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>{item.contact_information}</TableCell>
                <TableCell>{item.postal_code}</TableCell>
                <TableCell>{item.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Stm;
