"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ENDPOINTS } from "../lib/api";

type VocabItem = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  createdAt: string;
};

export default function PracticePage() {
  const { data: session, status } = useSession();
  const [vocabularies, setVocabularies] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remembered, setRemembered] = useState<number>(0);
  const [forgot, setForgot] = useState<number>(0);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchVocabularies = async () => {
      if (status !== 'authenticated' || !session?.idToken) {
        setError("Bạn cần đăng nhập để thực hành.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(ENDPOINTS.VOCABULARIES, {
          headers: {
            Authorization: `Bearer ${session.idToken}`,
          },
        });

        if (response.ok) {
          const data: VocabItem[] = await response.json();
          // Shuffle the vocabularies for practice
          const shuffled = data.sort(() => Math.random() - 0.5);
          setVocabularies(shuffled);
        } else {
          setError("Không thể tải danh sách từ vựng.");
        }
      } catch (err) {
        console.error("Error fetching vocabularies:", err);
        setError("Lỗi kết nối khi tải từ vựng.");
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, [session, status]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRemembered = () => {
    setRemembered(remembered + 1);
    nextCard();
  };

  const handleForgot = () => {
    setForgot(forgot + 1);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all cards
      alert(`Hoàn thành! Nhớ: ${remembered + 1}, Quên: ${forgot}`);
      // Reset or something
      setCurrentIndex(0);
      setRemembered(0);
      setForgot(0);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">Đang tải từ vựng để thực hành...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">Bạn chưa có từ vựng nào để thực hành. Hãy thêm từ vựng trước!</div>
      </div>
    );
  }

  const currentCard = vocabularies[currentIndex];

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">
        Thực Hành Flashcard
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-1 gap-12">
        {/* Flashcard Practice */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-8 text-indigo-700">Ôn Flashcard</h2>
          <div className="relative h-96 flex items-center justify-center">
            <div
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl w-full max-w-lg h-80 shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={handleFlip}
            >
              <div className="text-center">
                {!isFlipped ? (
                  <>
                    <p className="text-5xl font-bold mb-4">{currentCard.word}</p>
                    <p className="text-xl">Chạm để xem nghĩa →</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold mb-4">{currentCard.meaning}</p>
                    <p className="text-lg italic mb-4">"{currentCard.example}"</p>
                    <p className="text-sm">Chạm để lật lại</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={handleForgot}
              className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600"
            >
              Quên rồi 😔
            </button>
            <button
              onClick={handleRemembered}
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600"
            >
              Nhớ tốt 👍
            </button>
          </div>
          <p className="mt-6 text-gray-600">
            Thẻ {currentIndex + 1} / {vocabularies.length} | Nhớ: {remembered} | Quên: {forgot}
          </p>
        </div>
      </div>
    </>
  );
}