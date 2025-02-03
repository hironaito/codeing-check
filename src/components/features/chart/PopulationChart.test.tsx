import { render, screen } from '@testing-library/react';
import { PopulationChart } from './PopulationChart';
import { Prefecture } from '@/types/api/prefecture';
import { PrefecturePopulation } from '@/types/api/population';

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

// LineGraphコンポーネントのモック
jest.mock('@/components/ui/LineGraph', () => ({
  LineGraph: ({ data, lines }: any) => (
    <div data-testid="line-graph">
      <div data-testid="graph-data">{JSON.stringify(data)}</div>
      <div data-testid="graph-lines">{JSON.stringify(lines)}</div>
    </div>
  ),
}));

describe('PopulationChart', () => {
  it('データが正しく加工されてLineGraphに渡されること', () => {
    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
      />
    );

    const graphData = JSON.parse(screen.getByTestId('graph-data').textContent || '[]');
    const graphLines = JSON.parse(screen.getByTestId('graph-lines').textContent || '[]');

    // データ構造の検証
    expect(graphData).toHaveLength(2); // 2015年と2020年のデータ
    expect(graphData[0]).toHaveProperty('year', 2015);
    expect(graphData[0]).toHaveProperty('value1', 5000000);
    expect(graphData[0]).toHaveProperty('value13', 13000000);

    // 線の設定の検証
    expect(graphLines).toHaveLength(2); // 2つの都道府県
    expect(graphLines[0]).toEqual(expect.objectContaining({
      dataKey: 'value1',
      name: '北海道',
    }));
    expect(graphLines[1]).toEqual(expect.objectContaining({
      dataKey: 'value13',
      name: '東京都',
    }));
  });

  it('データが空の場合はnullを返すこと', () => {
    const { container } = render(
      <PopulationChart
        prefectures={[]}
        populationData={[]}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('カスタムクラス名が適用されること', () => {
    render(
      <PopulationChart
        prefectures={mockPrefectures}
        populationData={mockPopulationData}
        className="custom-class"
      />
    );

    const wrapper = screen.getByTestId('line-graph').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });
}); 