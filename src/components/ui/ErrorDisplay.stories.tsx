import type { Meta, StoryObj } from '@storybook/react';
import { ErrorDisplay } from './ErrorDisplay';
import { ErrorCode } from '@/types/error';

const meta = {
  title: 'UI/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8F9FA' },
        { name: 'dark', value: '#1A1A1A' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl w-full">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorDisplay>;

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

// クリティカルエラー
export const Critical: Story = {
  args: {
    error: {
      code: ErrorCode.API_REQUEST_FAILED,
      message: 'Critical error',
      timestamp: Date.now(),
    },
    errorMessage: 'データの取得中に重大なエラーが発生しました。',
    isRecoverable: false,
    isCritical: true,
  },
};

// 警告（リカバリー可能）
export const Warning: Story = {
  args: {
    error: {
      code: ErrorCode.CACHE_ERROR,
      message: 'Warning',
      timestamp: Date.now(),
    },
    errorMessage: '一部のデータの取得に失敗しました。',
    isRecoverable: true,
    isCritical: false,
  },
};

// リカバリー可能なエラー
export const Recoverable: Story = {
  args: {
    error: {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Recoverable error',
      timestamp: Date.now(),
    },
    errorMessage: 'ネットワークエラーが発生しました。再試行してください。',
    isRecoverable: true,
    isCritical: true,
  },
};

// エラーなし
export const NoError: Story = {
  args: {
    error: null,
    errorMessage: null,
    isRecoverable: false,
    isCritical: false,
  },
}; 