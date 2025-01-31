import React from 'react';
import type { Decorator } from '@storybook/react';

export const withContainer: Decorator = (Story) => {
  return (
    <div className="p-4">
      <Story />
    </div>
  );
};

export const withDarkMode: Decorator = (Story) => {
  return (
    <div className="dark">
      <div className="bg-gray-900 text-white min-h-screen">
        <Story />
      </div>
    </div>
  );
};

export const withMaxWidth: Decorator = (Story) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Story />
    </div>
  );
}; 