import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { User } from 'src/interfaces/user';
import { signIn } from 'src/pages/api/signIn';
import { signUp } from 'src/pages/api/signUp';
import { getUser } from 'src/pages/api/getUser';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// 新しいコンテキストを作成する（初期化）
const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signin: async () => { },
  signout: () => { },
  signup: async () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  // isLoading状態を追加
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      setIsLoading(true); // ロード開始
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        // accessTokenがある場合、ユーザー情報を取得
        try {
          const res = await getUser();
          if (res.error) {
            console.log(res.message);
            return;
          }
          setUser(res.data);
          // ユーザー情報取得後、またはaccessTokenがある場合、/stmにリダイレクト
          if (router.pathname === '/') {
            router.push('/stm');
          }
        } catch (err) {
          console.log(err);
        }
      } else if (router.pathname === '/') {
        // accessTokenがない場合は何もしない（Topページを表示）
        // このelseブロックは、必要に応じて削除またはコメントアウトしても良い
      }
      setIsLoading(false); // ロード完了
    };

    checkUserAndRedirect();
    // router.pathname または accessToken が変更されるたびに実行
  }, [router, router.pathname]);

  const signin = async (username: string, password: string) => {
    try {
      const res = await signIn(username, password);
      setUser(res.data);
      Cookies.set('access_token', res.data.access_token, { secure: true });
      Cookies.set('refresh_token', res.data.refresh_token, { secure: true });
      // ログインが成功したら /stm にリダイレクト
      router.push('/stm');
    } catch (err) {
      alert('サインインに失敗しました');
      console.log(err);
    }
  };

  const signout = async () => {
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setUser(null);
      router.push('/');
    } catch (err) {
      alert('サインアウトに失敗しました');
      console.log(err);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const res = await signUp(username, email, password);
      Cookies.set('access_token', res.data.access_token, { secure: true });
      Cookies.set('refresh_token', res.data.refresh_token, { secure: true });
      router.push('/stm');
    } catch (err) {
      alert('サインアップに失敗しました');
      console.log(err);
    }
  };

  const value = {
    user,
    isLoading,
    signin,
    signout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};