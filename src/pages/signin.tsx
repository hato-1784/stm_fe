import React, { useState } from "react";
import Head from "next/head";
import 'tailwindcss/tailwind.css';
import { useAuth } from 'src/contexts/auth';

const Signin = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signin } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ログイン処理
    try {
      await signin(username, password);
    } catch (err) {
      alert("サインインに失敗しました");
    }
  };

  return (
    <div>
      <Head>
        <title>サインインページ</title>
      </Head>
      <section className="">
        <div className="items-center px-5 py-24 lg:px-20">
          <div className="flex flex-col w-full max-w-md p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-gray-100 rounded-lg md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    required={true}
                    placeholder="Username"
                    className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative mb-4">
                <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={true}
                    placeholder="Password"
                    className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" placeholder="Your password" className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500" />
                  <label htmlFor="remember-me" className="block my-2 ml-2 text-sm text-neutral-600"> Remember me </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> Forgot your password? </a>
                </div>
              </div>

              <div>
                <button type="submit" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-green-500 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signin;
