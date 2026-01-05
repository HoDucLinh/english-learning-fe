"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  if (!session) {
    return null; // Will redirect
  }
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">Hồ Sơ Cá Nhân</h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Avatar & Info chính */}
        <div className="md:col-span-1 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <img
              src={session.user?.image || "/avatar-placeholder.png"}
              alt="Avatar"
              className="w-40 h-40 rounded-full mx-auto border-4 border-blue-500 shadow-lg"
            />
            <h2 className="text-2xl font-bold mt-6">{session.user?.name || "Người dùng"}</h2>
            <p className="text-gray-600">{session.user?.email}</p>

            <div className="mt-8 space-y-4">
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg font-semibold">
                Cấp độ: B1 - Intermediate
              </div>
              <div className="text-3xl font-bold text-blue-600">127 ngày liên tục</div>
              <p className="text-sm text-gray-600">Chuỗi học dài nhất 🔥</p>
            </div>
          </div>
        </div>

        {/* Thống kê học tập */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-6">Thống Kê Học Tập</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">248</p>
                <p className="text-gray-600">Từ vựng đã học</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">42</p>
                <p className="text-gray-600">Cấu trúc ngữ pháp</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">1,840</p>
                <p className="text-gray-600">Flashcard đã ôn</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">89%</p>
                <p className="text-gray-600">Độ chính xác quiz</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
              Chỉnh Sửa Hồ Sơ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}