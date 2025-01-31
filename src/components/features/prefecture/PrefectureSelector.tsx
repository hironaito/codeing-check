'use client';

import { FC } from 'react';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureSelectorProps {
  prefecture: Prefecture;
  isSelected: boolean;
  onChange: (prefCode: number, checked: boolean) => void;
}

export const PrefectureSelector: FC<PrefectureSelectorProps> = ({
  prefecture,
  isSelected,
  onChange,
}) => {
  const handleClick = () => {
    onChange(prefecture.prefCode, !isSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${prefecture.prefName}を選択`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <input
        type="checkbox"
        id={`prefecture-${prefecture.prefCode}`}
        checked={isSelected}
        onChange={(e) => onChange(prefecture.prefCode, e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-label={`${prefecture.prefName}を選択`}
        onClick={(e) => e.stopPropagation()}
      />
      <label
        htmlFor={`prefecture-${prefecture.prefCode}`}
        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {prefecture.prefName}
      </label>
    </div>
  );
}; 