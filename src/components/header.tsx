import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from 'src/contexts/auth';

const Header = () => {
  const { user, signout } = useAuth();

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <Image src="/images/zangies-logo.webp" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="ml-3 text-xl">STM</span>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          {user && (
            <>
              <a className="mr-5 hover:text-gray-900">Test1 Link</a>
              <a className="mr-5 hover:text-gray-900">Test2 Link</a>
              <a className="mr-5 hover:text-gray-900">Test3 Link</a>
              <a className="mr-5 hover:text-gray-900">Test4 Link</a>
            </>
          )}
        </nav>
        {user ? (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            Sign out
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link
            href="/signin"
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            Sign in
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  )
};

export default Header;