import { render, screen } from '@testing-library/react';
import { PopulationChart } from '../PopulationChart';
import { Prefecture } from '@/types/api/prefecture';
import { PrefecturePopulation } from '@/types/api/population';

// LineGraphの型定義
type LineGraphProps = {
  data: Array<{
    year: number;
    value: number;
    [key: string]: number;
  }>;
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
};

// LineGraphコンポーネントをモック
jest.mock('@/components/ui/LineGraph', () => ({
  LineGraph: ({ data, lines }: LineGraphProps) => (
    <div data-testid="line-graph">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-lines">{JSON.stringify(lines)}</div>
    </div>
  ),
}));

describe('PopulationChart', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  const mockPopulationData: { prefCode: number; data: PrefecturePopulation }[] = [
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
      prefCode: 2,
      data: {
        boundaryYear: 2020,
        data: [
          {
            label: '総人口',
            data: [
              { year: 2015, value: 3000000 },
              { year: 2020, value: 2800000 },
            ],
          },
        ],
      },
    },
  ];

  it('should render chart with correct data', () => {
    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '[]');
    const chartLines = JSON.parse(screen.getByTestId('chart-lines').textContent || '[]');

    // データポイントの検証
    expect(chartData).toHaveLength(2); // 2015年と2020年のデータ
    expect(chartData[0]).toEqual({
      year: 2015,
      value: 0,
      value1: 5000000,
      value2: 3000000,
    });
    expect(chartData[1]).toEqual({
      year: 2020,
      value: 0,
      value1: 4800000,
      value2: 2800000,
    });

    // 線の設定の検証
    expect(chartLines).toHaveLength(2);
    expect(chartLines[0]).toEqual({
      dataKey: 'value1',
      name: '北海道',
      color: expect.any(String),
    });
    expect(chartLines[1]).toEqual({
      dataKey: 'value2',
      name: '青森県',
      color: expect.any(String),
    });
  });

  it('should not render when no data is provided', () => {
    render(
      <PopulationChart
        prefectures={[]}
        populationData={[]}
      />
    );

    expect(screen.queryByTestId('line-graph')).not.toBeInTheDocument();
  });

  it('should handle missing prefecture names', () => {
    const populationDataWithUnknownPref = [
      {
        prefCode: 999,
        data: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 2015, value: 1000000 },
              ],
            },
          ],
        },
      },
    ];

    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={populationDataWithUnknownPref}
      />
    );

    const chartLines = JSON.parse(screen.getByTestId('chart-lines').textContent || '[]');
    expect(chartLines[0].name).toBe('都道府県999');
  });

  it('should apply custom className', () => {
    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
        className="custom-class"
      />
    );

    const container = screen.getByTestId('line-graph').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should handle missing data points', () => {
    const incompleteData = [
      {
        prefCode: 1,
        data: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 2015, value: 5000000 },
                // 2020年のデータが欠落
              ],
            },
          ],
        },
      },
    ];

    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={incompleteData}
      />
    );

    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '[]');
    expect(chartData[0].value1).toBe(5000000);
    expect(chartData[0].year).toBe(2015);
  });
});
