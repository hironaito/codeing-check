/**
 * グラフの共通設定
 */

// グラフのサイズ設定
export const CHART_DIMENSIONS = {
  aspectRatio: 16 / 9, // アスペクト比
  minHeight: {
    mobile: 300,
    desktop: 400,
  },
  maxHeight: {
    mobile: 400,
    desktop: 600,
  },
} as const;

// グラフの色設定
export const CHART_COLORS = {
  primary: '#0ea5e9', // Tailwind blue-500
  secondary: '#6366f1', // Tailwind indigo-500
  tertiary: '#ec4899', // Tailwind pink-500
  quaternary: '#10b981', // Tailwind emerald-500
  quinary: '#f59e0b', // Tailwind amber-500
} as const;

// グラフのマージン設定
export const CHART_MARGINS = {
  desktop: {
    top: 20,
    right: 30,
    bottom: 40,
    left: 60,
  },
  mobile: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 40,
  },
} as const;

// グラフのアニメーション設定
export const CHART_ANIMATION = {
  duration: 500,
  easing: 'ease-in-out',
} as const;

// グラフのツールチップ設定
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(229, 231, 235, 0.5)',
  borderRadius: '8px',
  padding: '12px 16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  outline: 'none',
  maxWidth: {
    mobile: '240px',
    desktop: '300px',
  },
  zIndex: 10,
} as const;

// グラフの軸設定
export const CHART_AXIS_STYLE = {
  stroke: '#9ca3af', // Tailwind gray-400
  strokeWidth: 1,
  fontSize: {
    mobile: 10,
    desktop: 12,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  tickSize: {
    mobile: 4,
    desktop: 8,
  },
  tickPadding: {
    mobile: 4,
    desktop: 8,
  },
  tickRotation: {
    mobile: -45,
    desktop: 0,
  },
} as const;

// グラフのグリッド設定
export const CHART_GRID_STYLE = {
  stroke: '#e5e7eb', // Tailwind gray-200
  strokeDasharray: '4 4',
  opacity: 0.8,
  vertical: true,
} as const;

// グラフの凡例設定
export const CHART_LEGEND_STYLE = {
  fontSize: {
    mobile: 10,
    desktop: 12,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  marginTop: {
    mobile: 16,
    desktop: 24,
  },
  iconSize: {
    mobile: 12,
    desktop: 16,
  },
  iconType: 'circle',
  align: 'center' as const,
  verticalAlign: 'bottom' as const,
} as const;

// グラフのドット設定
export const CHART_DOT_STYLE = {
  strokeWidth: 2,
  radius: {
    mobile: {
      normal: 2,
      active: 4,
    },
    desktop: {
      normal: 4,
      active: 6,
    },
  },
  fill: '#ffffff',
} as const;

// グラフの線設定
export const CHART_LINE_STYLE = {
  strokeWidth: {
    mobile: 1.5,
    desktop: 2.5,
  },
  activeDot: {
    strokeWidth: 2,
    r: {
      mobile: 4,
      desktop: 6,
    },
    fill: '#ffffff',
  },
} as const; 