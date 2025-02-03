'use client';

import { FC, useEffect, useState } from 'react';
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
  height,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        style={{
          ...CHART_TOOLTIP_STYLE,
          maxWidth: isMobile ? CHART_TOOLTIP_STYLE.maxWidth.mobile : CHART_TOOLTIP_STYLE.maxWidth.desktop,
        }}
        className="shadow-lg backdrop-blur-sm transition-opacity duration-200 ease-in-out"
        role="tooltip"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2">
          <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 border-b border-gray-100 pb-2`}>{`${label}年`}</p>
          <div className="space-y-2">
            {payload.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full flex-shrink-0`}
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <div className="flex items-baseline gap-2">
                  <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-gray-900`}>{entry.name}</span>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{tooltipFormatter(entry.value as number)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const defaultHeight = isMobile ? CHART_DIMENSIONS.minHeight.mobile : CHART_DIMENSIONS.minHeight.desktop;
  const margins = isMobile ? CHART_MARGINS.mobile : CHART_MARGINS.desktop;
  const fontSize = isMobile ? CHART_AXIS_STYLE.fontSize.mobile : CHART_AXIS_STYLE.fontSize.desktop;
  const tickSize = isMobile ? CHART_AXIS_STYLE.tickSize.mobile : CHART_AXIS_STYLE.tickSize.desktop;
  const tickPadding = isMobile ? CHART_AXIS_STYLE.tickPadding.mobile : CHART_AXIS_STYLE.tickPadding.desktop;
  const tickRotation = isMobile ? CHART_AXIS_STYLE.tickRotation.mobile : CHART_AXIS_STYLE.tickRotation.desktop;
  const legendFontSize = isMobile ? CHART_LEGEND_STYLE.fontSize.mobile : CHART_LEGEND_STYLE.fontSize.desktop;
  const legendMarginTop = isMobile ? CHART_LEGEND_STYLE.marginTop.mobile : CHART_LEGEND_STYLE.marginTop.desktop;
  const legendIconSize = isMobile ? CHART_LEGEND_STYLE.iconSize.mobile : CHART_LEGEND_STYLE.iconSize.desktop;
  const dotRadius = isMobile ? CHART_DOT_STYLE.radius.mobile : CHART_DOT_STYLE.radius.desktop;
  const lineStrokeWidth = isMobile ? CHART_LINE_STYLE.strokeWidth.mobile : CHART_LINE_STYLE.strokeWidth.desktop;
  const activeDotRadius = isMobile ? CHART_LINE_STYLE.activeDot.r.mobile : CHART_LINE_STYLE.activeDot.r.desktop;

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-sm p-1 sm:p-4 ${className}`}
      style={{ height: `${height || defaultHeight}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={margins}
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
              offset: -margins.bottom / 2,
              fontSize,
            }}
            tick={{
              fontSize,
              dy: tickPadding,
              transform: `rotate(${tickRotation})`,
            }}
            tickLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            axisLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            tickSize={tickSize}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'left',
              offset: -margins.left + (isMobile ? 10 : 20),
              fontSize,
            }}
            tick={{
              fontSize,
              dx: -tickPadding,
            }}
            tickLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            axisLine={{
              stroke: CHART_AXIS_STYLE.stroke,
              strokeWidth: CHART_AXIS_STYLE.strokeWidth,
            }}
            tickSize={tickSize}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: CHART_AXIS_STYLE.stroke, strokeWidth: 1 }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: legendMarginTop,
              fontFamily: CHART_LEGEND_STYLE.fontFamily,
              fontSize: legendFontSize,
            }}
            iconSize={legendIconSize}
            align={CHART_LEGEND_STYLE.align}
            verticalAlign={CHART_LEGEND_STYLE.verticalAlign}
          />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]}
              strokeWidth={lineStrokeWidth}
              dot={{
                r: dotRadius.normal,
                strokeWidth: CHART_DOT_STYLE.strokeWidth,
                fill: CHART_DOT_STYLE.fill,
                stroke: line.color || Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length],
              }}
              activeDot={{
                r: dotRadius.active,
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