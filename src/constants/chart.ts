/**
 * グラフの共通設定
 */

// グラフのサイズ設定
export const CHART_DIMENSIONS = {
  aspectRatio: 16 / 9, // アスペクト比
  minHeight: 400,
  maxHeight: 600,
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
  top: 20,
  right: 30,
  bottom: 40,
  left: 60,
} as const;

// グラフのアニメーション設定
export const CHART_ANIMATION = {
  duration: 500,
  easing: 'ease-in-out',
} as const;

// グラフのツールチップ設定
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px 16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
} as const;

// グラフの軸設定
export const CHART_AXIS_STYLE = {
  stroke: '#9ca3af', // Tailwind gray-400
  strokeWidth: 1,
  fontSize: 12,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  tickSize: 8,
  tickPadding: 8,
  tickRotation: 0,
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
  fontSize: 12,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  marginTop: 24,
  iconSize: 16,
  iconType: 'circle',
  align: 'center' as const,
  verticalAlign: 'bottom' as const,
} as const;

// グラフのドット設定
export const CHART_DOT_STYLE = {
  strokeWidth: 2,
  radius: {
    normal: 4,
    active: 6,
  },
  fill: '#ffffff',
} as const;

// グラフの線設定
export const CHART_LINE_STYLE = {
  strokeWidth: 2.5,
  activeDot: {
    strokeWidth: 2,
    r: 6,
    fill: '#ffffff',
  },
} as const; 