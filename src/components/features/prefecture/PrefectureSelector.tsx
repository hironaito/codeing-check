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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(prefecture.prefCode, e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(prefecture.prefCode, !isSelected);
    }
  };

  return (
    <label
      className={`
        flex items-center p-1.5 rounded-md cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
        }
        active:scale-95 touch-manipulation
      `}
      htmlFor={`prefecture-${prefecture.prefCode}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={isSelected}
    >
      <input
        type="checkbox"
        id={`prefecture-${prefecture.prefCode}`}
        checked={isSelected}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all duration-200"
        aria-label={`${prefecture.prefName}を選択`}
        tabIndex={-1}
      />
      <span className="ml-1.5 text-xs font-medium text-gray-700 select-none truncate">
        {prefecture.prefName}
      </span>
    </label>
  );
};
