import React, { useEffect, useState } from "react";
import 'tailwindcss/tailwind.css';
import Head from "next/head";
import { useRouter } from 'next/router';
import { Stm } from 'src/interfaces/stm';
import { stmList } from 'src/pages/api/stm';

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
      <div className="relative overflow-x-auto container mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th>氏名</th>
              <th>年齢</th>
              <th>性別</th>
              <th>連絡先</th>
              <th>郵便番号</th>
              <th>住所</th>
            </tr>
          </thead>
          <tbody>
            {stm.map((item, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index} onClick={() => router.push(`/stm/${item.id}`)}>
                <td>
                  {item.last_name} {item.first_name} ({item.last_name_kana} {item.first_name_kana})
                </td>
                <td>{item.age}</td>
                <td>{item.gender}</td>
                <td>{item.contact_information}</td>
                <td>{item.postal_code}</td>
                <td>{item.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stm;
