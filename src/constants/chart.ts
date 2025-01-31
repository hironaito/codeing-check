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
  top: 10,
  right: 30,
  bottom: 30,
  left: 60,
} as const;

// グラフのアニメーション設定
export const CHART_ANIMATION = {
  duration: 300,
} as const;

// グラフのツールチップ設定
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '8px 12px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

// グラフの軸設定
export const CHART_AXIS_STYLE = {
  stroke: '#9ca3af', // Tailwind gray-400
  strokeWidth: 1,
  fontSize: 12,
} as const;

// グラフのグリッド設定
export const CHART_GRID_STYLE = {
  stroke: '#e5e7eb', // Tailwind gray-200
  strokeDasharray: '3 3',
} as const;

// グラフの凡例設定
export const CHART_LEGEND_STYLE = {
  fontSize: 12,
  marginTop: 16,
} as const; 