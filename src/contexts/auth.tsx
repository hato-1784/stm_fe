import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { signIn } from 'src/pages/api/signIn';
import { signUp } from 'src/pages/api/signUp';
import { getUser } from 'src/pages/api/getUser';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: null | {
    username: string;
    email: string;
    version: number;
    client_request_token: string;
  };
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
  signin: async () => { },
  signout: () => { },
  signup: async () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<null | {
    username: string;
    email: string;
    version: number;
    client_request_token: string;
  }>(null);

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      getUser().then((res) => {
        if (res.error) {
          console.log(res.message);
          return;
        }
        setUser(res.data);
        router.push('/stm');
      }).catch((err) => {
        console.log(err);
      });
    }
    // []に値を設定すると、その値が変更されたときだけuseEffectが実行される
  }, [Cookies.get('access_token')]);

  const signin = async (username: string, password: string) => {
    try {
      const res = await signIn(username, password);
      setUser(res.data);
      Cookies.set('access_token', res.data.access_token);
      Cookies.set('refresh_token', res.data.refresh_token);
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
      Cookies.set('access_token', res.data.access_token);
      Cookies.set('refresh_token', res.data.refresh_token);
      router.push('/stm');
    } catch (err) {
      alert('サインアップに失敗しました');
      console.log(err);
    }
  };

  const value = {
    user,
    signin,
    signout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};