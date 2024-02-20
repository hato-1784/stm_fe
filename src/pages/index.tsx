import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/signin',
      permanent: false, // 一時的なリダイレクトの場合はfalseに設定
    },
  };
};

const Index = () => {
  // コンポーネントの内容はリダイレクトにより表示されないため、必要最小限に保つ
  return null;
};

export default Index;
