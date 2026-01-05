'use client'

import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { searchDictionary, DictionaryEntry, ENDPOINTS } from '../app/lib/api'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<DictionaryEntry[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [addVocabLoading, setAddVocabLoading] = useState(false)
  const [addVocabMessage, setAddVocabMessage] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Quản lý từ vựng", href: "/manage-vocab" },
    { name: "Quản lý Flashcard", href: "/manage-quiz" },
    { name: "Thực hành", href: "/practice" },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    setAddVocabMessage("") // Reset message khi tìm kiếm từ mới
    try {
      const data = await searchDictionary(searchTerm)
      setSearchResult(data)
      setIsModalOpen(true)
    } catch (error) {
      alert('Không tìm thấy từ này')
    }
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleAddToVocab = async () => {
    if (!searchResult || !session?.idToken) {
      setAddVocabMessage("Bạn cần đăng nhập để thêm từ vựng.");
      return;
    }

    setAddVocabLoading(true);
    setAddVocabMessage("");

    const entry = searchResult[0];
    const vocabData = {
      word: entry.word,
      meaning: "", // Để trống để người dùng tự điền nghĩa tiếng Việt
      example: "", // Để trống ví dụ
    };

    try {
      const response = await fetch(ENDPOINTS.VOCABULARIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.idToken}`,
        },
        body: JSON.stringify(vocabData),
      });

      if (response.ok) {
        setAddVocabMessage(`Đã thêm từ vựng "${entry.word}" thành công! Vui lòng vào trang Quản lý từ vựng để điền nghĩa tiếng Việt và ví dụ.`);
      } else {
        setAddVocabMessage("Lỗi khi thêm từ vựng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAddVocabMessage(`Lỗi kết nối: ${error instanceof Error ? error.message : 'Unknown error'}. Vui lòng thử lại.`);
    } finally {
      setAddVocabLoading(false);
    }
  };

  return (
    <>
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-bold">English Learner</Link>

          <nav className="flex flex-wrap justify-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                className="px-4 py-2 rounded-lg text-black w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                {isLoading ? '...' : 'Tìm'}
              </button>
            </div>
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-colors"
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
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && searchResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{searchResult[0].word}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setAddVocabMessage("")
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {searchResult[0].phonetic && (
              <p className="text-gray-600 mb-4">{searchResult[0].phonetic}</p>
            )}
            {searchResult[0].meanings.map((meaning, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 capitalize">{meaning.partOfSpeech}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {meaning.definitions.map((def, defIndex) => (
                    <li key={defIndex} className="text-gray-700">
                      {def.definition}
                      {def.example && (
                        <span className="block text-gray-500 italic mt-1">Ví dụ: "{def.example}"</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {session && (
              <div className="mt-6 pt-4 border-t">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Gợi ý nghĩa (tiếng Anh):</strong> {searchResult[0].meanings[0]?.definitions[0]?.definition}
                  </p>
                  {searchResult[0].meanings[0]?.definitions[0]?.example && (
                    <p className="text-sm text-blue-600 mt-1">
                      <strong>Ví dụ:</strong> {searchResult[0].meanings[0].definitions[0].example}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddToVocab}
                  disabled={addVocabLoading}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {addVocabLoading ? "Đang thêm..." : "Thêm vào danh sách từ vựng"}
                </button>
                {addVocabMessage && (
                  <p className={`text-sm mt-2 ${addVocabMessage.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
                    {addVocabMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}