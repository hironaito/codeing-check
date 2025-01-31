import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: '都道府県別人口推移グラフ',
  brandUrl: 'http://localhost:3000',
  brandTarget: '_self',

  // UI
  appBg: '#F8F9FA',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E9ECEF',
  appBorderRadius: 6,

  // Text colors
  textColor: '#212529',
  textInverseColor: '#FFFFFF',

  // Toolbar default and active colors
  barTextColor: '#6C757D',
  barSelectedColor: '#0D6EFD',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#CED4DA',
  inputTextColor: '#212529',
  inputBorderRadius: 4,
}); 