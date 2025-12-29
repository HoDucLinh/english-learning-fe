import Link from "next/link";

export default function Header() {
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

        <input
          type="text"
          placeholder="Tìm kiếm từ vựng..."
          className="px-4 py-2 rounded-lg text-black w-full md:w-64"
        />
      </div>
    </header>
  );
}