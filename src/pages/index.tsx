import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import 'tailwindcss/tailwind.css';
import { signUp } from 'src/pages/api/signUp';
import Cookies from 'js-cookie';

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signUp(username, email, password).then((res) => {
      Cookies.set('access_token', res.access_token);
      Cookies.set('refresh_token', res.refresh_token);
      router.push("/stm");
    }).catch(() => {
      alert("サインアップに失敗しました");
    });
  };
  return (
    <div>
      <Head>
        <title>トップページ</title>
      </Head>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical authentic, poko scenester</h1>
            <p className="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
          </div>
          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required={true}
                  placeholder="Username"
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required={true}
                  placeholder="Email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="password"
                  required={true}
                  placeholder="Password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="text-white bg-green-500 rounded-xl py-2 px-8 focus:outline-none hover:bg-green-600 text-base focus:ring-offset-2">Sign up</button>
              </div>
              <p className="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;