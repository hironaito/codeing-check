import type { Metadata } from "next";
import "./globals.css";
import { PopulationDataProvider } from '@/store/PopulationDataContext';
import { PrefectureDataProvider } from '@/store/PrefectureDataContext';
import { ErrorStateProvider } from '@/store/ErrorStateContext';

export const metadata: Metadata = {
  title: "都道府県別人口推移グラフ",
  description: "都道府県ごとの人口推移データをインタラクティブなグラフで可視化するアプリケーションです。",
  keywords: "人口推移, 都道府県, データ可視化, 統計, 人口統計",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <ErrorStateProvider>
          <PrefectureDataProvider>
            <PopulationDataProvider>
              {children}
            </PopulationDataProvider>
          </PrefectureDataProvider>
        </ErrorStateProvider>
      </body>
    </html>
  );
}
