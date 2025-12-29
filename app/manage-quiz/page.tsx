"use client";

import { useState } from "react";

type QuizItem = {
  id: number;
  name: string;
  type: "Flashcard" | "Quiz";
  itemCount: number; // số card hoặc số câu hỏi
  createdAt: string;
  progress: number; // % hoàn thành trung bình
  lastPracticed: string;
};

const quizData: QuizItem[] = [
  { id: 1, name: "Từ vựng cơ bản 100 từ", type: "Flashcard", itemCount: 100, createdAt: "15/12/2025", progress: 85, lastPracticed: "Hôm nay" },
  { id: 2, name: "Ngữ pháp Present Tenses", type: "Quiz", itemCount: 25, createdAt: "10/12/2025", progress: 70, lastPracticed: "2 ngày trước" },
  { id: 3, name: "Từ vựng chủ đề Travel", type: "Flashcard", itemCount: 60, createdAt: "05/12/2025", progress: 45, lastPracticed: "1 tuần trước" },
  { id: 4, name: "Bài kiểm tra TOEIC Part 5", type: "Quiz", itemCount: 40, createdAt: "01/12/2025", progress: 92, lastPracticed: "Hôm qua" },
  { id: 5, name: "Idioms thông dụng", type: "Flashcard", itemCount: 50, createdAt: "20/11/2025", progress: 30, lastPracticed: "2 tuần trước" },
  { id: 6, name: "Conditionals Quiz", type: "Quiz", itemCount: 30, createdAt: "18/11/2025", progress: 60, lastPracticed: "5 ngày trước" },
];

export default function ManageQuizPage() {
  const [activeTab, setActiveTab] = useState<"all" | "flashcard" | "quiz">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [progressFilter, setProgressFilter] = useState<"all" | "learning" | "completed">("all");

  // Lọc dữ liệu
  const filteredData = quizData.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "flashcard" && item.type === "Flashcard") ||
      (activeTab === "quiz" && item.type === "Quiz");

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "learning" && item.progress < 90) ||
      (progressFilter === "completed" && item.progress >= 90);

    return matchesTab && matchesSearch && matchesProgress;
  });

  // Đếm số lượng
  const countAll = quizData.length;
  const countFlashcard = quizData.filter((i) => i.type === "Flashcard").length;
  const countQuiz = quizData.filter((i) => i.type === "Quiz").length;

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "from-emerald-500 to-teal-600";
    if (progress >= 60) return "from-blue-500 to-indigo-600";
    if (progress >= 30) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-600";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold text-blue-700">Quản Lý Flashcard & Bài Quiz</h1>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg">
            + Tạo Bộ Mới
          </button>
        </div>

        {/* Tabs + Bộ lọc */}
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
                onClick={() => setActiveTab("flashcard")}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === "flashcard"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Flashcard <span className="ml-2 text-sm font-bold">({countFlashcard})</span>
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === "quiz"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Quiz <span className="ml-2 text-sm font-bold">({countQuiz})</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Tìm tên bộ flashcard hoặc quiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
              />

              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value as any)}
                className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="learning">Đang học (&lt;90%)</option>
                <option value="completed">Đã hoàn thành (≥90%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-8 py-5 text-left">Tên Bộ</th>
                <th className="px-8 py-5 text-center">Loại</th>
                <th className="px-8 py-5 text-center">Số Lượng</th>
                <th className="px-8 py-5 text-center">Tiến Độ Trung Bình</th>
                <th className="px-8 py-5 text-left">Ngày Tạo</th>
                <th className="px-8 py-5 text-left">Ôn Lần Cuối</th>
                <th className="px-8 py-5 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-8 py-6 font-bold text-lg">{item.name}</td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.type === "Flashcard"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center font-medium">{item.itemCount} {item.type === "Flashcard" ? "thẻ" : "câu"}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-40 bg-gray-200 rounded-full h-5">
                        <div
                          className={`h-5 rounded-full bg-gradient-to-r ${getProgressColor(item.progress)} transition-all`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg w-12 text-center">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600">{item.createdAt}</td>
                  <td className="px-8 py-6 text-gray-600">{item.lastPracticed}</td>
                  <td className="px-8 py-6 text-center space-x-4">
                    <button className="text-blue-600 font-semibold hover:underline">Sửa</button>
                    <button className="text-red-600 font-semibold hover:underline">Xóa</button>
                    <button className="text-green-600 font-semibold hover:underline ml-4">Ôn Ngay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card - Mobile */}
        <div className="md:hidden grid gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">{item.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {item.itemCount} {item.type === "Flashcard" ? "thẻ" : "câu hỏi"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.type === "Flashcard"
                      ? "bg-orange-100 text-orange-800"
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
                    className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(item.progress)}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-600">
                <div>
                  <p>Tạo: {item.createdAt}</p>
                  <p>Ôn lần cuối: {item.lastPracticed}</p>
                </div>
                <div className="flex gap-3">
                  <button className="text-blue-600 font-medium">Sửa</button>
                  <button className="text-red-600 font-medium">Xóa</button>
                  <button className="text-green-600 font-medium">Ôn →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">Không tìm thấy bộ flashcard hoặc quiz nào 😊</p>
            <p className="mt-2">Hãy tạo bộ mới để bắt đầu học!</p>
          </div>
        )}
      </div>
    </>
  );
}