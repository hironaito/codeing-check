'use client';

import { FC } from 'react';

interface ChartErrorFallbackProps {
  className?: string;
  message?: string;
  onRetry?: () => void;
}

export const ChartErrorFallback: FC<ChartErrorFallbackProps> = ({
  className = '',
  message = 'グラフの描画に失敗しました',
  onRetry,
}) => {
  return (
    <div
      className={`w-full h-[400px] p-4 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-center space-y-4">
        {/* エラーアイコン */}
        <div className="inline-block p-3 bg-red-50 rounded-full">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* エラーメッセージ */}
        <p className="text-gray-600">{message}</p>

        {/* リトライボタン */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            再読み込み
          </button>
        )}
      </div>
    </div>
  );
}; 