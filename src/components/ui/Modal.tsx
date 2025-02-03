'use client';

import { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="absolute inset-0 bg-white sm:inset-4 sm:rounded-lg sm:shadow-xl">
        <div className="flex h-full flex-col">
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 