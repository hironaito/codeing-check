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
        className="shadow-lg"
      >
        <p className="font-bold mb-1">{`${label}年`}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              {entry.name}: {tooltipFormatter(entry.value as number)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={CHART_MARGINS}
        >
          <CartesianGrid {...CHART_GRID_STYLE} />
          <XAxis
            dataKey="year"
            label={{
              value: xAxisLabel,
              position: 'bottom',
              offset: -20,
              ...CHART_AXIS_STYLE,
            }}
            tick={CHART_AXIS_STYLE}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'left',
              offset: 0,
              ...CHART_AXIS_STYLE,
            }}
            tick={CHART_AXIS_STYLE}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            {...CHART_LEGEND_STYLE}
            wrapperStyle={{ paddingTop: CHART_LEGEND_STYLE.marginTop }}
          />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              animationDuration={CHART_ANIMATION.duration}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 