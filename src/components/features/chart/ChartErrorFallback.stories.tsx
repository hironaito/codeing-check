import type { Meta, StoryObj } from '@storybook/react';
import { ChartErrorFallback } from './ChartErrorFallback';

const meta = {
  title: 'Features/Chart/ChartErrorFallback',
  component: ChartErrorFallback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <div className="w-[800px]">
      <ChartErrorFallback />
    </div>
  ),
};

export const WithCustomMessage = {
  render: () => (
    <div className="w-[800px]">
      <ChartErrorFallback
        message="データの取得に失敗しました。時間をおいて再度お試しください。"
      />
    </div>
  ),
};

export const WithRetryButton = {
  render: () => (
    <div className="w-[800px]">
      <ChartErrorFallback
        message="データの取得に失敗しました"
        onRetry={() => {
          console.log('Retry clicked');
        }}
      />
    </div>
  ),
}; 