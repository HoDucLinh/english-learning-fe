'use client'

import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Thêm từ vựng", href: "/add" },
    { name: "Quản lý từ vựng", href: "/manage-vocab" },
    { name: "Hồ sơ", href: "/profile" },
    { name: "Quản lý Flashcard", href: "/manage-quiz" },
    { name: "Thực hành", href: "/practice" },
  ];

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold">English Learner</Link>

        <nav className="flex flex-wrap justify-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng..."
            className="px-4 py-2 rounded-lg text-black w-full md:w-64"
          />
          {session ? (
            <div className="relative">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-colors group"
                title="Đăng xuất"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <svg className="w-5 h-5 text-white hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}