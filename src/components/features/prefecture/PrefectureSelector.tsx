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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(prefecture.prefCode, event.target.checked);
  };

  return (
    <div 
      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${prefecture.prefName}を選択`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(prefecture.prefCode, !isSelected);
        }
      }}
    >
      <input
        type="checkbox"
        id={`prefecture-${prefecture.prefCode}`}
        checked={isSelected}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-label={`${prefecture.prefName}を選択`}
      />
      <label
        htmlFor={`prefecture-${prefecture.prefCode}`}
        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
      >
        {prefecture.prefName}
      </label>
    </div>
  );
}; 