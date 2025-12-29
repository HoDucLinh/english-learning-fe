import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "English Learner",
  description: "Tự học tiếng Anh với flashcard và quiz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Providers>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}