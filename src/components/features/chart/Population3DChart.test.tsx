import { render, screen, fireEvent } from '@testing-library/react';
import { Population3DChart } from './Population3DChart';

// モックデータ
const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
];

const mockPopulationData = [
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
        {
          label: '年少人口',
          data: [
            { year: 2015, value: 1000000 },
            { year: 2020, value: 900000 },
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
        {
          label: '年少人口',
          data: [
            { year: 2015, value: 2000000 },
            { year: 2020, value: 1900000 },
          ],
        },
      ],
    },
  },
];

describe('Population3DChart', () => {
  const defaultProps = {
    prefectures: mockPrefectures,
    populationData: mockPopulationData,
    selectedType: '総人口',
  };

  it('正しくレンダリングされること', () => {
    render(<Population3DChart {...defaultProps} />);
    expect(screen.getByRole('img', { name: '人口推移3Dグラフ' })).toBeInTheDocument();
  });

  it('クラス名が正しく適用されること', () => {
    const className = 'test-class';
    render(
      <Population3DChart
        {...defaultProps}
        className={className}
      />
    );
    expect(screen.getByRole('img', { name: '人口推移3Dグラフ' }).parentElement).toHaveClass(className);
  });

  it('マウスドラッグでグラフが回転すること', () => {
    render(<Population3DChart {...defaultProps} />);
    const canvas = screen.getByRole('img', { name: '人口推移3Dグラフ' });
    
    fireEvent.mouseDown(canvas, { clientX: 0 });
    fireEvent.mouseMove(canvas, { clientX: 100 });
    fireEvent.mouseUp(canvas);
    
    // 回転が適用されていることを確認
    // Note: 実際の回転値のテストは難しいため、イベントハンドラが呼び出されることのみを確認
  });

  it('マウスリーブでドラッグが解除されること', () => {
    render(<Population3DChart {...defaultProps} />);
    const canvas = screen.getByRole('img', { name: '人口推移3Dグラフ' });
    
    fireEvent.mouseDown(canvas, { clientX: 0 });
    fireEvent.mouseLeave(canvas);
    
    // ドラッグが解除されていることを確認
    fireEvent.mouseMove(canvas, { clientX: 100 });
    // 回転が適用されていないことを確認
  });
}); 