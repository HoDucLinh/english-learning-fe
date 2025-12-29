"use client";
export default function AddPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
        Thêm Từ Vựng hoặc Ngữ Pháp Mới
      </h1>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Form thêm từ */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ vựng / Cấu trúc ngữ pháp
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Achieve hoặc Present Perfect"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nghĩa tiếng Việt
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Đạt được, Hoàn thành"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phát âm (IPA) - tùy chọn
              </label>
              <input
                type="text"
                placeholder="/əˈtʃiːv/"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Câu ví dụ
              </label>
              <textarea
                rows={4}
                placeholder="She worked hard to achieve her dreams."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
            >
              Thêm Từ & Tạo Flashcard Tự Động
            </button>
          </form>
        </div>

        {/* Preview Flashcard */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Preview Flashcard</h2>
          <div className="relative w-80 h-96 perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white p-8 text-center transform transition-all duration-700 hover:rotate-y-180 preserve-3d">
              {/* Mặt trước */}
              <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold mb-4">Achieve</p>
                <p className="text-xl opacity-80">/əˈtʃiːv/</p>
                <p className="mt-8 text-lg">Chạm để lật thẻ</p>
              </div>

              {/* Mặt sau */}
              <div className="backface-hidden absolute inset-0 rotate-y-180 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold mb-6">Đạt được</p>
                <p className="text-lg text-center max-w-xs">
                  She worked hard to <span className="font-bold underline">achieve</span> her dreams.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600">Flashcard sẽ được tạo tự động sau khi thêm</p>
        </div>
      </div>
    </>
  );
}