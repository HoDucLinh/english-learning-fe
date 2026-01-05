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


export default function ManageVocabPage() {
  const { data: session, status } = useSession();
  const [vocabularies, setVocabularies] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<VocabItem | null>(null);
  const [editForm, setEditForm] = useState({ word: "", meaning: "", example: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    word: "",
    meaning: "",
    example: "",
  });
  const [addMessage, setAddMessage] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchVocabularies = async () => {
      if (status !== 'authenticated' || !session?.idToken) {
        setError("Bạn cần đăng nhập để xem từ vựng.");
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
          setVocabularies(data);
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

  // Lọc dữ liệu theo tìm kiếm (vì không có type và progress nữa)
  const filteredData = vocabularies.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Đếm số lượng
  const countAll = vocabularies.length;

  const handleEdit = (item: VocabItem) => {
    setEditingItem(item);
    setEditForm({ word: item.word, meaning: item.meaning, example: item.example });
  };

  const handleUpdate = async () => {
    if (!editingItem || !session?.idToken) return;

    try {
      const response = await fetch(ENDPOINTS.VOCABULARY(editingItem.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.idToken}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setVocabularies(vocabularies.map(v => v.id === editingItem.id ? updatedItem : v));
        setEditingItem(null);
        setError(null);
      } else {
        setError("Không thể cập nhật từ vựng.");
      }
    } catch (err) {
      console.error("Error updating vocabulary:", err);
      setError("Lỗi kết nối khi cập nhật.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.idToken) return;

    if (!confirm("Bạn có chắc muốn xóa từ vựng này?")) return;

    try {
      const response = await fetch(ENDPOINTS.VOCABULARY(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.idToken}`,
        },
      });

      if (response.ok) {
        setVocabularies(vocabularies.filter(v => v.id !== id));
        setError(null);
      } else {
        setError("Không thể xóa từ vựng.");
      }
    } catch (err) {
      console.error("Error deleting vocabulary:", err);
      setError("Lỗi kết nối khi xóa.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.idToken) {
      setAddMessage("Bạn cần đăng nhập để thêm từ vựng.");
      return;
    }
    setAddLoading(true);
    setAddMessage("");

    try {
      const response = await fetch(ENDPOINTS.VOCABULARIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.idToken}`,
        },
        body: JSON.stringify(addFormData),
      });

      if (response.ok) {
        const data = await response.json();
        setAddMessage("Thêm từ vựng thành công!");
        setAddFormData({ word: "", meaning: "", example: "" });
        // Refresh list
        const refreshResponse = await fetch(ENDPOINTS.VOCABULARIES, {
          headers: {
            Authorization: `Bearer ${session.idToken}`,
          },
        });
        if (refreshResponse.ok) {
          const refreshedData: VocabItem[] = await refreshResponse.json();
          setVocabularies(refreshedData);
        }
        setTimeout(() => setIsAddModalOpen(false), 1500);
      } else {
        setAddMessage("Lỗi khi thêm từ vựng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAddMessage(`Lỗi kết nối: ${error instanceof Error ? error.message : 'Unknown error'}. Vui lòng thử lại.`);
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">Đang tải danh sách từ vựng...</div>
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

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold text-blue-700">Quản Lý Từ Vựng & Ngữ Pháp</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            + Thêm Từ Mới
          </button>
        </div>

        {/* Tabs + Thống kê */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-2">
              <button
                className="px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white"
              >
                Tất cả <span className="ml-2 text-sm font-bold">({countAll})</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm từ, nghĩa hoặc ví dụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        {/* Danh sách - Table trên desktop, Card trên mobile */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-8 py-5 text-left">Từ</th>
                <th className="px-8 py-5 text-left">Nghĩa</th>
                <th className="px-8 py-5 text-left">Ví dụ</th>
                <th className="px-8 py-5 text-left">Ngày tạo</th>
                <th className="px-8 py-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-8 py-6 font-bold text-lg">{item.word}</td>
                  <td className="px-8 py-6 text-gray-700">{item.meaning}</td>
                  <td className="px-8 py-6 text-gray-600">{item.example}</td>
                  <td className="px-8 py-6 text-gray-600">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-8 py-6 text-center space-x-4">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Xóa
                    </button>
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
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-blue-700">{item.word}</h3>
                <p className="text-gray-700 mt-1">{item.meaning}</p>
                <p className="text-gray-600 mt-2 italic">"{item.example}"</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tạo: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                <div className="space-x-4">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 font-medium"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 font-medium"
                  >
                    Xóa
                  </button>
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

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-700">Thêm Từ Vựng hoặc Ngữ Pháp Mới</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Form thêm từ */}
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <form onSubmit={handleAddSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Từ vựng / Cấu trúc ngữ pháp
                      </label>
                      <input
                        type="text"
                        name="word"
                        value={addFormData.word}
                        onChange={handleAddChange}
                        placeholder="Ví dụ: Achieve hoặc Present Perfect"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nghĩa tiếng Việt
                      </label>
                      <input
                        type="text"
                        name="meaning"
                        value={addFormData.meaning}
                        onChange={handleAddChange}
                        placeholder="Ví dụ: Đạt được, Hoàn thành"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
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
                        name="example"
                        value={addFormData.example}
                        onChange={handleAddChange}
                        placeholder="She worked hard to achieve her dreams."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {addMessage && (
                      <p className={`text-sm ${addMessage.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
                        {addMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={addLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50"
                    >
                      {addLoading ? "Đang thêm..." : "Thêm Từ & Tạo Flashcard Tự Động"}
                    </button>
                  </form>
                </div>

                {/* Preview Flashcard */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Preview Flashcard</h3>
                  <div className="relative w-80 h-96 perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white p-8 text-center transform transition-all duration-700 hover:rotate-y-180 preserve-3d">
                      {/* Mặt trước */}
                      <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-5xl font-bold mb-4">{addFormData.word || "Achieve"}</p>
                        <p className="text-xl opacity-80">/əˈtʃiːv/</p>
                        <p className="mt-8 text-lg">Chạm để lật thẻ</p>
                      </div>

                      {/* Mặt sau */}
                      <div className="backface-hidden absolute inset-0 rotate-y-180 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold mb-6">{addFormData.meaning || "Đạt được"}</p>
                        <p className="text-lg text-center max-w-xs">
                          {addFormData.example || "She worked hard to achieve her dreams."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-gray-600">Flashcard sẽ được tạo tự động sau khi thêm</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Sửa từ vựng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Từ vựng</label>
                  <input
                    type="text"
                    value={editForm.word}
                    onChange={(e) => setEditForm({ ...editForm, word: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nghĩa</label>
                  <input
                    type="text"
                    value={editForm.meaning}
                    onChange={(e) => setEditForm({ ...editForm, meaning: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ví dụ</label>
                  <textarea
                    value={editForm.example}
                    onChange={(e) => setEditForm({ ...editForm, example: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}