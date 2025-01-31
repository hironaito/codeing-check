'use client';

import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import {
  CHART_DIMENSIONS,
  CHART_COLORS,
  CHART_MARGINS,
  CHART_ANIMATION,
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_STYLE,
  CHART_GRID_STYLE,
  CHART_LEGEND_STYLE,
  CHART_DOT_STYLE,
  CHART_LINE_STYLE,
} from '@/constants/chart';

export interface DataPoint {
  year: number;
  value: number;
  label?: string;
}

export interface LineGraphProps {
  data: DataPoint[];
  lines: {
    dataKey: string;
    name: string;
    color?: string;
  }[];
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
  height?: number;
}

export const LineGraph: FC<LineGraphProps> = ({
  data,
  lines,
  className = '',
  xAxisLabel,
  yAxisLabel,
  tooltipFormatter = (value) => `${value.toLocaleString()}人`,
  height = CHART_DIMENSIONS.minHeight,
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div
        style={CHART_TOOLTIP_STYLE}
        className="shadow-lg backdrop-blur-sm transition-opacity duration-200 ease-in-out"
        role="tooltip"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2">
          <p className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">{`${label}年`}</p>
          <div className="space-y-2">
            {payload.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-gray-900">{entry.name}</span>
                  <span className="text-sm text-gray-600">{tooltipFormatter(entry.value as number)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-sm p-4 ${className}`}
      style={{ height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={CHART_MARGINS}
        >
          <CartesianGrid
            {...CHART_GRID_STYLE}
            horizontal={!CHART_GRID_STYLE.vertical}
          />
          <XAxis
            dataKey="year"
            label={{
              value: xAxisLabel,
              position: 'bottom',
              offset: -CHART_MARGINS.bottom / 2,
              ...CHART_AXIS_STYLE,
            }}
            tick={{
              ...CHART_AXIS_STYLE,
              dy: CHART_AXIS_STYLE.tickPadding,
            }}
            tickLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            axisLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'left',
              offset: -CHART_MARGINS.left + 20,
              ...CHART_AXIS_STYLE,
            }}
            tick={{
              ...CHART_AXIS_STYLE,
              dx: -CHART_AXIS_STYLE.tickPadding,
            }}
            tickLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            axisLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: CHART_AXIS_STYLE.stroke, strokeWidth: 1 }}
          />
          <Legend
            {...CHART_LEGEND_STYLE}
            wrapperStyle={{
              paddingTop: CHART_LEGEND_STYLE.marginTop,
              fontFamily: CHART_LEGEND_STYLE.fontFamily,
              fontSize: CHART_LEGEND_STYLE.fontSize,
            }}
          />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
              strokeWidth={CHART_LINE_STYLE.strokeWidth}
              dot={{
                r: CHART_DOT_STYLE.radius.normal,
                strokeWidth: CHART_DOT_STYLE.strokeWidth,
                fill: CHART_DOT_STYLE.fill,
                stroke: line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length],
              }}
              activeDot={{
                r: CHART_DOT_STYLE.radius.active,
                strokeWidth: CHART_LINE_STYLE.activeDot.strokeWidth,
                fill: CHART_LINE_STYLE.activeDot.fill,
                stroke: line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length],
              }}
              animationDuration={CHART_ANIMATION.duration}
              animationEasing={CHART_ANIMATION.easing}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 