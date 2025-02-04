import type { Meta, StoryObj } from '@storybook/react';
import { PopulationTypeSelector, PopulationType } from './PopulationTypeSelector';
import { useState } from 'react';

const meta = {
  title: 'Features/Population/PopulationTypeSelector',
  component: PopulationTypeSelector,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const [selectedType, setSelectedType] = useState<PopulationType>('総人口');
      return <Story args={{ selectedType, onTypeChange: setSelectedType }} />;
    },
  ],
} satisfies Meta<typeof PopulationTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedType: '総人口',
    onTypeChange: (type: PopulationType) => console.log(`Selected type: ${type}`),
  },
  parameters: {
    docs: {
      description: {
        story: '人口種別を選択できるインタラクティブなデモです。',
      },
    },
  },
}; 