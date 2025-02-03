'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // 現在のフォーカス要素を保存
      previousFocusRef.current = document.activeElement as HTMLElement;
      // ESCキーイベントの登録
      document.addEventListener('keydown', handleKeyDown);
      // モーダルにフォーカス
      modalRef.current?.focus();
    } else {
      // モーダルが閉じられたら、前のフォーカス位置に戻す
      previousFocusRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* モーダルコンテンツ */}
      <div
        ref={modalRef}
        className="absolute inset-0 bg-white sm:inset-4 sm:rounded-lg sm:shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="flex h-full flex-col">
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="閉じる"
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