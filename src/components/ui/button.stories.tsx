import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { RefreshCw, AlertTriangle, XCircle } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
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
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// アプリケーションで実際に使用されているボタンパターン
export const StandardButton: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: '全て選択',
    className: 'text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
  },
};

export const DisabledButton: Story = {
  args: {
    ...StandardButton.args,
    disabled: true,
    children: '選択解除',
  },
};

export const RetryButton: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    children: (
      <>
        <RefreshCw className="mr-2 h-4 w-4" />
        再試行
      </>
    ),
  },
};

export const ErrorButton: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: (
      <>
        <XCircle className="mr-2 h-4 w-4" />
        エラー
      </>
    ),
  },
};

export const WarningButton: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: (
      <>
        <AlertTriangle className="mr-2 h-4 w-4" />
        警告
      </>
    ),
    className: 'text-yellow-600 border-yellow-300 hover:bg-yellow-50',
  },
};

// サイズバリエーション
export const Small: Story = {
  args: {
    ...StandardButton.args,
    size: 'sm',
    children: '小',
  },
};

export const Large: Story = {
  args: {
    ...StandardButton.args,
    size: 'lg',
    children: '大',
  },
};

// ローディング状態
export const Loading: Story = {
  args: {
    ...StandardButton.args,
    disabled: true,
    children: (
      <>
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        処理中...
      </>
    ),
  },
}; 