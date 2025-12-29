"use client";
import { useState } from "react";

type VocabItem = {
  id: number;
  word: string;
  meaning: string;
  type: "Từ vựng" | "Ngữ pháp";
  progress: number;
  lastReview: string;
};

const vocabData: VocabItem[] = [
  { id: 1, word: "Achieve", meaning: "Đạt được, hoàn thành", type: "Từ vựng", progress: 95, lastReview: "Hôm nay" },
  { id: 2, word: "Effort", meaning: "Nỗ lực, cố gắng", type: "Từ vựng", progress: 80, lastReview: "2 ngày trước" },
  { id: 3, word: "Present Perfect", meaning: "Thì hiện tại hoàn thành", type: "Ngữ pháp", progress: 75, lastReview: "Hôm qua" },
  { id: 4, word: "Motivation", meaning: "Động lực", type: "Từ vựng", progress: 60, lastReview: "3 ngày trước" },
  { id: 5, word: "Passive Voice", meaning: "Thể bị động", type: "Ngữ pháp", progress: 45, lastReview: "1 tuần trước" },
  { id: 6, word: "Challenge", meaning: "Thử thách", type: "Từ vựng", progress: 30, lastReview: "2 tuần trước" },
  { id: 7, word: "Conditionals", meaning: "Câu điều kiện", type: "Ngữ pháp", progress: 90, lastReview: "Hôm nay" },
];

export default function ManageVocabPage() {
  const [activeTab, setActiveTab] = useState<"all" | "vocab" | "grammar">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [progressFilter, setProgressFilter] = useState<"all" | "low" | "medium" | "high">("all");

  // Lọc dữ liệu theo tab, tìm kiếm và tiến độ
  const filteredData = vocabData.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "vocab" && item.type === "Từ vựng") ||
      (activeTab === "grammar" && item.type === "Ngữ pháp");

    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "low" && item.progress < 50) ||
      (progressFilter === "medium" && item.progress >= 50 && item.progress < 80) ||
      (progressFilter === "high" && item.progress >= 80);

    return matchesTab && matchesSearch && matchesProgress;
  });

  // Đếm số lượng theo loại
  const countAll = vocabData.length;
  const countVocab = vocabData.filter((i) => i.type === "Từ vựng").length;
  const countGrammar = vocabData.filter((i) => i.type === "Ngữ pháp").length;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-600";
    if (progress >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-600";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold text-blue-700">Quản Lý Từ Vựng & Ngữ Pháp</h1>
          <a
            href="/add"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            + Thêm Từ Mới
          </a>
        </div>

        {/* Tabs + Thống kê */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả <span className="ml-2 text-sm font-bold">({countAll})</span>
              </button>
              <button
                onClick={() => setActiveTab("vocab")}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === "vocab"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Từ vựng <span className="ml-2 text-sm font-bold">({countVocab})</span>
              </button>
              <button
                onClick={() => setActiveTab("grammar")}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === "grammar"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ngữ pháp <span className="ml-2 text-sm font-bold">({countGrammar})</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm từ hoặc nghĩa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />

              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value as any)}
                className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả tiến độ</option>
                <option value="low">Chưa ôn tốt (&lt;50%)</option>
                <option value="medium">Đang học (50-79%)</option>
                <option value="high">Thành thạo (≥80%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh sách - Table trên desktop, Card trên mobile */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-8 py-5 text-left">Từ / Cấu trúc</th>
                <th className="px-8 py-5 text-left">Nghĩa</th>
                <th className="px-8 py-5 text-center">Loại</th>
                <th className="px-8 py-5 text-center">Tiến độ ôn tập</th>
                <th className="px-8 py-5 text-left">Ôn lần cuối</th>
                <th className="px-8 py-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-8 py-6 font-bold text-lg">{item.word}</td>
                  <td className="px-8 py-6 text-gray-700">{item.meaning}</td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.type === "Từ vựng"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-40 bg-gray-200 rounded-full h-5">
                        <div
                          className={`h-5 rounded-full bg-gradient-to-r ${getProgressColor(
                            item.progress
                          )} transition-all duration-500`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg w-12 text-center">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600">{item.lastReview}</td>
                  <td className="px-8 py-6 text-center space-x-4">
                    <button className="text-blue-600 font-semibold hover:underline">Sửa</button>
                    <button className="text-red-600 font-semibold hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phiên bản Mobile - Card */}
        <div className="md:hidden grid gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">{item.word}</h3>
                  <p className="text-gray-700 mt-1">{item.meaning}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.type === "Từ vựng"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Tiến độ:</span>
                  <span className="font-bold">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(
                      item.progress
                    )}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ôn lần cuối: {item.lastReview}</span>
                <div className="space-x-4">
                  <button className="text-blue-600 font-medium">Sửa</button>
                  <button className="text-red-600 font-medium">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">Không tìm thấy kết quả phù hợp 😔</p>
            <p className="mt-2">Thử thay đổi bộ lọc hoặc thêm từ mới!</p>
          </div>
        )}
      </div>
    </>
  );
}