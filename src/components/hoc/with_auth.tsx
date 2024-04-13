import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/contexts/auth';
import { User } from 'src/interfaces/user/response_user';

const withAuth = (WrappedComponent: ComponentType<User>) => {
  const WithAuthComponent = (props: User) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    console.log(user, isLoading);

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace('/signin');
      }
    }, [router, user, isLoading]);

    return <WrappedComponent {...props} {...user} />;
  };

  // HOCに表示名を設定
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;