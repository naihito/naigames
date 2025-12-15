import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "NAIGAMES",
  description: "無料のゲームで無駄な時間を！"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white text-black min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
