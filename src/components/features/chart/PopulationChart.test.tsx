import { render, screen } from '@testing-library/react';
import { PopulationChart } from './PopulationChart';
import { Prefecture } from '@/types/api/prefecture';
import { PrefecturePopulation } from '@/types/api/population';
import { PopulationType } from '../population/PopulationTypeSelector';

// モックデータ
const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
];

const mockPopulationData: {
  prefCode: number;
  data: PrefecturePopulation;
}[] = [
  {
    prefCode: 1,
    data: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 2015, value: 5000000 },
            { year: 2020, value: 4800000 },
          ],
        },
      ],
    },
  },
  {
    prefCode: 13,
    data: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 2015, value: 13000000 },
            { year: 2020, value: 14000000 },
          ],
        },
      ],
    },
  },
];

// LineGraphの型定義
type LineGraphProps = {
  data: Array<{
    year: number;
    [key: string]: number;
  }>;
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
};

// LineGraphコンポーネントのモック
jest.mock('@/components/ui/LineGraph', () => ({
  LineGraph: ({ data, lines }: LineGraphProps) => (
    <div data-testid="line-graph">
      <div data-testid="graph-data">{JSON.stringify(data)}</div>
      <div data-testid="graph-lines">{JSON.stringify(lines)}</div>
    </div>
  ),
}));

describe('PopulationChart', () => {
  const defaultProps = {
    prefectures: mockPrefectures,
    populationData: mockPopulationData,
    selectedType: '総人口' as PopulationType,
  };

  it('正しくレンダリングされること', () => {
    render(<PopulationChart {...defaultProps} />);
    expect(screen.getByTestId('line-graph')).toBeInTheDocument();
  });

  it('データが空の場合はnullを返すこと', () => {
    const { container } = render(
      <PopulationChart
        prefectures={[]}
        populationData={[]}
        selectedType="総人口"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('クラス名が正しく適用されること', () => {
    const className = 'test-class';
    render(
      <PopulationChart
        {...defaultProps}
        className={className}
      />
    );
    expect(screen.getByTestId('line-graph').parentElement).toHaveClass(className);
  });

  it('データが正しくフォーマットされること', () => {
    render(<PopulationChart {...defaultProps} />);
    const graphData = JSON.parse(screen.getByTestId('graph-data').textContent || '[]');
    
    expect(graphData).toEqual([
      { year: 2015, value: 0, value1: 5000000, value13: 13000000 },
      { year: 2020, value: 0, value1: 4800000, value13: 14000000 },
    ]);
  });
});
