import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/contexts/auth';
import { User } from 'src/interfaces/user';

const withAuth = (WrappedComponent: ComponentType<User>) => {
  return (props: User) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace('/signin');
      }
    }, [router, user]);

    // userオブジェクトからuserNameを取得し、ラップされたコンポーネントに渡す
    const userName = user?.username;

    return <WrappedComponent {...props} {...user} />;
  };
};

export default withAuth;