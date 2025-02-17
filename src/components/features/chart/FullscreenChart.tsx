'use client';

import { FC, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { PopulationChart, PopulationChartProps } from './PopulationChart';

export type FullscreenChartProps = PopulationChartProps;

export const FullscreenChart: FC<FullscreenChartProps> = ({
  prefectures,
  populationData,
  selectedType,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* プレビューサイズのグラフ */}
      <div className="h-[300px] sm:h-[400px]">
        <PopulationChart
          prefectures={prefectures}
          populationData={populationData}
          selectedType={selectedType}
        />
      </div>

      {/* モバイルのみ表示される拡大ボタン */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
      >
        <Maximize2 className="h-4 w-4" />
        <span>グラフを拡大</span>
      </button>

      {/* フルスクリーンモーダル（モバイルのみ） */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="人口推移グラフ"
      >
        <div className="h-full p-4">
          <PopulationChart
            prefectures={prefectures}
            populationData={populationData}
            selectedType={selectedType}
            className="h-full"
          />
        </div>
      </Modal>
    </div>
  );
}; 