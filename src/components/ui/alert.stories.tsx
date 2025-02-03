import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { XCircle, AlertTriangle, Info as InfoIcon, CheckCircle } from 'lucide-react';
import { Button } from './button';

const meta = {
  title: 'UI/Alert',
  component: Alert,
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
      options: ['default', 'destructive', 'warning'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// エラー表示（クリティカル）
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    className: 'max-w-md',
    children: (
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <XCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold">
            エラーが発生しました
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">データの取得に失敗しました。時間をおいて再度お試しください。</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
            >
              再試行
            </Button>
          </AlertDescription>
        </div>
      </div>
    ),
  },
};

// 警告表示
export const Warning: Story = {
  args: {
    variant: 'warning',
    className: 'max-w-md',
    children: (
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold">
            警告
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">一部のデータの取得に失敗しました。表示が不完全な可能性があります。</p>
          </AlertDescription>
        </div>
      </div>
    ),
  },
};

// 情報表示
export const Information: Story = {
  args: {
    variant: 'default',
    className: 'max-w-md',
    children: (
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <InfoIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold">
            お知らせ
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">新しいデータが利用可能になりました。</p>
          </AlertDescription>
        </div>
      </div>
    ),
  },
};

// 成功表示
export const Success: Story = {
  args: {
    variant: 'default',
    className: 'max-w-md border-green-500/50 text-green-600 [&>svg]:text-green-600',
    children: (
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold">
            完了
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">データの更新が完了しました。</p>
          </AlertDescription>
        </div>
      </div>
    ),
  },
};

// シンプルな表示
export const Simple: Story = {
  args: {
    variant: 'default',
    className: 'max-w-md',
    children: (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <AlertTitle>
            シンプルな通知
          </AlertTitle>
          <AlertDescription>
            アイコンなしのシンプルな通知メッセージです。
          </AlertDescription>
        </div>
      </div>
    ),
  },
}; 