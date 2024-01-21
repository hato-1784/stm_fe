import { GetServerSideProps } from 'next';
import { jsonClient } from 'src/lib/apiClients';
import { Stm } from 'src/interfaces/stm';

interface Props {
  data: Stm;
}

const DetailPage = ({ data }: Props) => {
  return (
    <div>
      <p>ID: {data.id}</p>
      <p>氏名: {data.last_name} {data.first_name} ({data.last_name_kana} {data.first_name_kana})</p>
      <p>年齢: {data.age}</p>
      <p>性別: {data.gender}</p>
      <p>連絡先: {data.contact_information}</p>
      <p>郵便番号: {data.postal_code}</p>
      <p>住所: {data.address}</p>
      {/* 他のデータも同様に表示 */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id;
  if (!id) {
    return { notFound: true };
  }
  const response = await jsonClient().get(`/stm/${id}`);
  const data = response.data;
  return { props: { data } };
};

export default DetailPage;