"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function Home() {
  const vocabData = [{ name: "Hoàn thành", value: 75 }, { name: "Còn lại", value: 25 }];
  const grammarData = [{ name: "Hoàn thành", value: 60 }, { name: "Còn lại", value: 40 }];
  const COLORS = ["#10B981", "#EF4444"];

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">Chào mừng quay lại!</h1>

      <input
        type="text"
        placeholder="Tìm kiếm từ vựng hoặc ngữ pháp..."
        className="w-full max-w-lg mx-auto block px-4 py-3 rounded-lg border mb-10"
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Tiến độ Từ vựng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={vocabData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {vocabData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl mt-4 font-bold text-green-600">75% Hoàn thành</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Tiến độ Ngữ pháp</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={grammarData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                {grammarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl mt-4 font-bold text-green-600">60% Hoàn thành</p>
        </div>
      </div>
    </>
  );
}