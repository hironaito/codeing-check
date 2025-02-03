import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay';
import { ErrorState, ErrorCode } from '@/types/error';

// lucide-reactのモック
jest.mock('lucide-react', () => ({
  XCircle: () => <span role="img" aria-hidden="true" data-testid="x-circle-icon" />,
  AlertTriangle: () => <span role="img" aria-hidden="true" data-testid="alert-triangle-icon" />,
  RefreshCw: () => <span role="img" aria-hidden="true" data-testid="refresh-icon" />,
}));

// alertコンポーネントのモック
jest.mock('./alert', () => ({
  Alert: (props: any) => (
    <div data-testid="alert" data-variant={props.variant} className={props.className} {...props}>
      {props.children}
    </div>
  ),
  AlertTitle: (props: any) => (
    <h5 data-testid="alert-title" className={props.className}>{props.children}</h5>
  ),
  AlertDescription: (props: any) => (
    <div data-testid="alert-description" className={props.className}>{props.children}</div>
  ),
}));

// buttonコンポーネントのモック
jest.mock('./button', () => ({
  Button: (props: any) => (
    <button
      data-testid="button"
      data-variant={props.variant}
      data-size={props.size}
      className={props.className}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </button>
  ),
}));

describe('ErrorDisplay', () => {
  const mockError: ErrorState = {
    code: ErrorCode.API_REQUEST_FAILED,
    message: 'APIエラーが発生しました',
    timestamp: Date.now(),
  };

  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnClear.mockClear();
  });

  it('エラーがない場合は何も表示しないこと', () => {
    const { container } = render(
      <ErrorDisplay
        error={null}
        errorMessage={null}
        isRecoverable={false}
        isCritical={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('クリティカルエラーが正しく表示されること', () => {
    render(
      <ErrorDisplay
        error={mockError}
        errorMessage="重大なエラーが発生しました"
        isRecoverable={false}
        isCritical={true}
      />
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('data-variant', 'destructive');
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('重大なエラーが発生しました')).toBeInTheDocument();
    expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('button')).not.toBeInTheDocument();
  });

  it('警告が正しく表示されること', () => {
    render(
      <ErrorDisplay
        error={mockError}
        errorMessage="警告メッセージ"
        isRecoverable={false}
        isCritical={false}
      />
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('data-variant', 'warning');
    expect(screen.getByText('警告')).toBeInTheDocument();
    expect(screen.getByText('警告メッセージ')).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
  });

  it('再試行ボタンが表示され、クリックで onClear が呼ばれること', () => {
    render(
      <ErrorDisplay
        error={mockError}
        errorMessage="エラーメッセージ"
        isRecoverable={true}
        isCritical={false}
        onClear={mockOnClear}
      />
    );

    const retryButton = screen.getByTestId('button');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveAttribute('data-variant', 'outline');
    expect(retryButton).toHaveAttribute('data-size', 'sm');
    expect(retryButton).toHaveAttribute('aria-label', 'エラーを解消して再試行');
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('アクセシビリティ要件を満たしていること', () => {
    render(
      <ErrorDisplay
        error={mockError}
        errorMessage="エラーメッセージ"
        isRecoverable={true}
        isCritical={true}
      />
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    
    // アイコンが装飾的であることを確認
    const icons = screen.getAllByRole('img', { hidden: true });
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
}); 