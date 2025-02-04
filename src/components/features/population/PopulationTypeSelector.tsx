import { FC } from 'react';

export type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

interface PopulationTypeSelectorProps {
  selectedType: PopulationType;
  onTypeChange: (type: PopulationType) => void;
  className?: string;
}

export const PopulationTypeSelector: FC<PopulationTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  className = '',
}) => {
  const populationTypes: PopulationType[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {populationTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`h-8 px-3 text-sm transition-colors ${
            selectedType === type
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          } rounded`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}; 