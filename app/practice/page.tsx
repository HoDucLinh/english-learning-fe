"use client";
export default function PracticePage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">
        Thực Hành Flashcard & Quiz
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Flashcard Practice */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-8 text-indigo-700">Ôn Flashcard</h2>
          <div className="relative h-96 flex items-center justify-center">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl w-full max-w-lg h-80 shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
              <div>
                <p className="text-5xl font-bold mb-4">Motivation</p>
                <p className="text-xl">Chạm để lật thẻ →</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center gap-6">
            <button className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600">
              Quên rồi 😔
            </button>
            <button className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600">
              Nhớ tốt 👍
            </button>
          </div>
          <p className="mt-6 text-gray-600">Còn 47 thẻ hôm nay</p>
        </div>

        {/* Quiz Practice */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-green-700">Làm Bài Quiz</h2>
          <div className="space-y-6">
            <p className="text-xl font-medium">
              "I _______ in this city since 2010."
            </p>
            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="quiz" className="mr-4 text-blue-600" />
                <span>A. live</span>
              </label>
              <label className="flex items-center p-4 border-2 border-green-500 bg-green-50 rounded-xl cursor-pointer">
                <input type="radio" name="quiz" className="mr-4 text-blue-600" defaultChecked />
                <span>B. have lived</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="quiz" className="mr-4 text-blue-600" />
                <span>C. am living</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="quiz" className="mr-4 text-blue-600" />
                <span>D. lived</span>
              </label>
            </div>
            <div className="text-center mt-8">
              <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700">
                Kiểm Tra Đáp Án
              </button>
            </div>
          </div>
          <p className="text-center mt-6 text-gray-600">Câu 3 / 20</p>
        </div>
      </div>
    </>
  );
}