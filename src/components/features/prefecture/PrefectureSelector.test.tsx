import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefectureSelector } from './PrefectureSelector';

describe('PrefectureSelector', () => {
  const mockPrefecture = {
    prefCode: 1,
    prefName: '北海道',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('都道府県名とチェックボックスが正しくレンダリングされること', () => {
    render(
      <PrefectureSelector
        prefecture={mockPrefecture}
        isSelected={false}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('北海道')).toBeInTheDocument();
    const checkbox = screen.getByLabelText('北海道を選択') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('選択状態が正しく反映されること', () => {
    render(
      <PrefectureSelector
        prefecture={mockPrefecture}
        isSelected={true}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText('北海道を選択') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('チェックボックスをクリックすると onChange が正しく呼ばれること', async () => {
    render(
      <PrefectureSelector
        prefecture={mockPrefecture}
        isSelected={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText('北海道を選択');
    await userEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(1, true);
  });

  it('Enterキーでチェックボックスの状態を切り替えられること', () => {
    render(
      <PrefectureSelector
        prefecture={mockPrefecture}
        isSelected={false}
        onChange={mockOnChange}
      />
    );

    const label = screen.getByText('北海道').parentElement;
    expect(label).not.toBeNull();
    if (label) {
      fireEvent.keyDown(label, { key: 'Enter' });
      expect(mockOnChange).toHaveBeenCalledWith(1, true);
    }
  });

  it('アクセシビリティ要件を満たしていること', () => {
    render(
      <PrefectureSelector
        prefecture={mockPrefecture}
        isSelected={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText('北海道を選択');
    const label = checkbox.parentElement;
    expect(checkbox).toHaveAttribute('aria-label', '北海道を選択');
    expect(label).toHaveAttribute('role', 'checkbox');
    expect(label).toHaveAttribute('aria-checked', 'false');
  });
}); 