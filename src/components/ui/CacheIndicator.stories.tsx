import type { Meta, StoryObj } from '@storybook/react';
import { CacheIndicator } from './CacheIndicator';

const meta = {
  title: 'UI/CacheIndicator',
  component: CacheIndicator,
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
    source: {
      control: 'radio',
      options: ['cache', 'api', null],
    },
    fetchTimeMs: {
      control: 'number',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CacheIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// キャッシュからのデータ取得
export const FromCache: Story = {
  args: {
    source: 'cache',
    fetchTimeMs: 50,
    isLoading: false,
  },
};

// APIからのデータ取得
export const FromAPI: Story = {
  args: {
    source: 'api',
    fetchTimeMs: 250,
    isLoading: false,
  },
};

// ローディング状態（API）
export const Loading: Story = {
  args: {
    source: 'api',
    fetchTimeMs: 0,
    isLoading: true,
  },
};

// 高速キャッシュ
export const FastCache: Story = {
  args: {
    source: 'cache',
    fetchTimeMs: 10,
    isLoading: false,
  },
};

// 遅いAPI
export const SlowAPI: Story = {
  args: {
    source: 'api',
    fetchTimeMs: 1500,
    isLoading: false,
  },
};

// カスタムスタイル
export const CustomStyle: Story = {
  args: {
    source: 'cache',
    fetchTimeMs: 100,
    isLoading: false,
    className: 'shadow-md',
  },
};

// 非表示（sourceがnull）
export const Hidden: Story = {
  args: {
    source: null,
    fetchTimeMs: null,
    isLoading: false,
  },
}; 