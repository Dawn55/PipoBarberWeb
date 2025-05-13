'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLink = ({ href, children }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md ${
          isActive
            ? 'bg-accent text-black'
            : 'text-gray-300 hover:bg-secondary hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-primary border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-accent text-2xl font-bold">
                Pipo Berber
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <NavLink href="/">Ana Sayfa</NavLink>
                <NavLink href="/about">Hakkımızda</NavLink>
                {session && <NavLink href="/appointments">Randevular</NavLink>}
                {session?.user?.isAdmin && (
                  <NavLink href="/admin">Yönetici Paneli</NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center ml-4 space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span>
                    Hoş geldiniz, {session.user.name} {session.user.surname}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="btn btn-secondary"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link href="/login" className="btn btn-secondary">
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Menüyü aç</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
          >
            Hakkımızda
          </Link>
          {session && (
            <Link
              href="/appointments"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
            >
              Randevular
            </Link>
          )}
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
            >
              Yönetici Paneli
            </Link>
          )}
          {session ? (
            <div className="pt-4 pb-3 border-t border-secondary">
              <div className="px-3">
                <div className="text-sm font-medium text-gray-300">
                  {session.user.name} {session.user.surname}
                </div>
                <div className="text-sm text-gray-400">{session.user.email}</div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-secondary">
              <div className="px-2 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-secondary hover:text-white"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}