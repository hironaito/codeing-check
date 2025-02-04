'use client';

import { FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PopulationResponse, PopulationComposition } from '@/types/api/population';
import { Prefecture } from '@/types/api/prefecture';
import { CHART_COLORS } from '@/constants/chart';

interface Population3DChartProps {
  prefectures: Prefecture[];
  populationData: Map<number, PopulationResponse>;
  selectedType: string;
  className?: string;
}

export const Population3DChart: FC<Population3DChartProps> = ({
  prefectures,
  populationData,
  selectedType,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [elevation, setElevation] = useState(0.4);
  const [startY, setStartY] = useState(0);

  // データの整形
  const chartData = useMemo(() => Array.from(populationData.entries()).map(([prefCode, response]) => {
    const prefecture = prefectures.find(p => p.prefCode === prefCode);
    const populationTypeData = response.result.data.find((d: PopulationComposition) => d.label === selectedType);
    return {
      name: prefecture?.prefName || `Prefecture ${prefCode}`,
      values: populationTypeData?.data || [],
    };
  }), [prefectures, populationData, selectedType]);

  // 色を明るくする関数
  const lightenColor = useCallback((color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R<255?R:255)*0x10000 + (G<255?G:255)*0x100 + (B<255?B:255)).toString(16).slice(1)}`;
  }, []);

  // 色を暗くする関数
  const darkenColor = useCallback((color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return `#${(0x1000000 + (R>0?R:0)*0x10000 + (G>0?G:0)*0x100 + (B>0?B:0)).toString(16).slice(1)}`;
  }, []);

  // 3Dグラフの描画
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // 基本設定
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    
    // 3D効果のための設定
    const barDepth = 50;
    const perspective = 1000;
    const maxValue = Math.max(...chartData.flatMap(d => d.values.map(v => v.value)));
    const scale = graphHeight / maxValue * 0.8;
    
    // 座標変換関数
    const to3D = (x: number, y: number, z: number) => {
      const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
      const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);
      
      // 仰角による変換を追加
      const elevatedY = y * Math.cos(elevation) - rotatedZ * Math.sin(elevation);
      const elevatedZ = y * Math.sin(elevation) + rotatedZ * Math.cos(elevation);
      
      const scale3d = perspective / (perspective + elevatedZ);
      
      return {
        x: rotatedX * scale3d + width / 2,
        y: elevatedY * scale3d + height / 2,
        z: elevatedZ,
        scale: scale3d,
      };
    };

    // グリッドの描画
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // 3Dグリッドの描画
    const gridSize = 50;
    const gridLines = 10;
    for (let i = 0; i <= gridLines; i++) {
      const x = (i - gridLines / 2) * gridSize;
      const z1 = -gridLines * gridSize / 2;
      const z2 = gridLines * gridSize / 2;
      
      const start = to3D(x, 0, z1);
      const end = to3D(x, 0, z2);
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      const z = (i - gridLines / 2) * gridSize;
      const x1 = -gridLines * gridSize / 2;
      const x2 = gridLines * gridSize / 2;
      
      const start2 = to3D(x1, 0, z);
      const end2 = to3D(x2, 0, z);
      
      ctx.beginPath();
      ctx.moveTo(start2.x, start2.y);
      ctx.lineTo(end2.x, end2.y);
      ctx.stroke();
    }

    // データの描画準備
    type Bar3D = {
      prefecture: string;
      points: {
        front: { x: number; y: number; z: number }[];
        top: { x: number; y: number; z: number }[];
        side: { x: number; y: number; z: number }[];
        shadow: { x: number; y: number; z: number }[];
      };
      color: string;
      zIndex: number;
    };

    const bars: Bar3D[] = [];

    // データの座標計算
    chartData.forEach((prefecture, prefIndex) => {
      prefecture.values.forEach((value, valueIndex) => {
        const totalPrefectures = chartData.length;
        const barWidth = (graphWidth / prefecture.values.length) * 0.8;
        const spacing = graphWidth / prefecture.values.length;
        
        const x = valueIndex * spacing - graphWidth / 2;
        const y = -(value.value * scale) / 2;
        const z = (prefIndex - totalPrefectures / 2) * barDepth;

        const color = Object.values(CHART_COLORS)[prefIndex % Object.keys(CHART_COLORS).length];
        
        // 各面の座標を計算
        const frontPoints = [
          to3D(x - barWidth/2, y, z),
          to3D(x + barWidth/2, y, z),
          to3D(x + barWidth/2, 0, z),
          to3D(x - barWidth/2, 0, z),
        ];

        const topPoints = [
          to3D(x - barWidth/2, y, z),
          to3D(x + barWidth/2, y, z),
          to3D(x + barWidth/2, y, z + barDepth),
          to3D(x - barWidth/2, y, z + barDepth),
        ];

        const sidePoints = [
          to3D(x + barWidth/2, y, z),
          to3D(x + barWidth/2, 0, z),
          to3D(x + barWidth/2, 0, z + barDepth),
          to3D(x + barWidth/2, y, z + barDepth),
        ];

        const shadowPoints = [
          to3D(x - barWidth/2, 0, z + barDepth),
          to3D(x + barWidth/2, 0, z + barDepth),
          to3D(x + barWidth/2, 0, z),
          to3D(x - barWidth/2, 0, z),
        ];

        // Z-indexの計算（奥行きの平均値）
        const zIndex = frontPoints.reduce((acc, point) => acc + point.z, 0) / frontPoints.length;

        bars.push({
          prefecture: prefecture.name,
          points: {
            front: frontPoints,
            top: topPoints,
            side: sidePoints,
            shadow: shadowPoints,
          },
          color,
          zIndex,
        });
      });
    });

    // Z-indexでソートして奥から手前に描画
    bars.sort((a, b) => b.zIndex - a.zIndex);

    // バーの描画
    bars.forEach(bar => {
      // 影の描画
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.moveTo(bar.points.shadow[0].x, bar.points.shadow[0].y);
      bar.points.shadow.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.fill();

      // 側面の描画
      if (rotation > 0) {
        ctx.beginPath();
        ctx.moveTo(bar.points.side[0].x, bar.points.side[0].y);
        bar.points.side.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fillStyle = darkenColor(bar.color, 20);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 上面の描画
      if (rotation > 0) {
        ctx.beginPath();
        ctx.moveTo(bar.points.top[0].x, bar.points.top[0].y);
        bar.points.top.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fillStyle = lightenColor(bar.color, 20);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 前面の描画
      ctx.beginPath();
      ctx.moveTo(bar.points.front[0].x, bar.points.front[0].y);
      bar.points.front.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.fillStyle = bar.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 軸ラベルの描画
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    
    // X軸ラベル
    const xLabel = to3D(0, 0, graphWidth/2);
    ctx.fillText('年度', xLabel.x, height - 10);
    
    // Y軸ラベル
    ctx.save();
    const yLabel = to3D(-graphWidth/2, -graphHeight/2, 0);
    ctx.translate(20, yLabel.y);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${selectedType}（人）`, 0, 0);
    ctx.restore();

    // 凡例の描画
    const legendY = height - 30;
    const legendSpacing = width / (chartData.length + 1);
    
    chartData.forEach((prefecture, index) => {
      const x = legendSpacing * (index + 1);
      const color = Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length];
      
      ctx.fillStyle = color;
      ctx.fillRect(x - 10, legendY - 10, 20, 20);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.fillText(prefecture.name, x, legendY + 20);
    });
  }, [chartData, rotation, elevation, lightenColor, darkenColor, selectedType]);

  // マウス位置の更新関数
  const updateMousePosition = useCallback((clientX: number, clientY: number) => {
    setStartX(clientX);
    setStartY(clientY);
  }, []);

  // 回転と仰角の更新関数
  const updateRotationAndElevation = useCallback((dx: number, dy: number) => {
    setRotation(prev => prev + dx * 0.01);
    setElevation(prev => Math.max(0, Math.min(Math.PI / 2, prev + dy * 0.01)));
  }, []);

  // マウスイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateMousePosition(e.clientX, e.clientY);
  }, [updateMousePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    updateRotationAndElevation(dx, dy);
    updateMousePosition(e.clientX, e.clientY);
  }, [isDragging, startX, startY, updateRotationAndElevation, updateMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // キーボードイベントハンドラー
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const rotationStep = 0.1;
    const elevationStep = 0.05;
    
    switch (e.key) {
      case 'ArrowLeft':
        setRotation(prev => prev - rotationStep);
        break;
      case 'ArrowRight':
        setRotation(prev => prev + rotationStep);
        break;
      case 'ArrowUp':
        setElevation(prev => Math.max(0, prev - elevationStep));
        break;
      case 'ArrowDown':
        setElevation(prev => Math.min(Math.PI / 2, prev + elevationStep));
        break;
    }
  }, []);

  // キャンバスのリサイズと描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw(ctx, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  // アニメーションフレームの更新
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, canvas.width, canvas.height);
  }, [draw]);

  // アクセシビリティのための説明テキストを生成
  const getAriaLabel = useCallback(() => {
    const descriptions = chartData.map(prefecture => {
      const latestValue = prefecture.values[prefecture.values.length - 1];
      return `${prefecture.name}の${selectedType}は${latestValue.year}年時点で${latestValue.value.toLocaleString()}人です。`;
    });
    return `人口推移3Dグラフ。${descriptions.join(' ')}グラフは矢印キーで回転と仰角を調整できます。`;
  }, [chartData, selectedType]);

  return (
    <div className={`relative w-full h-[500px] ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={getAriaLabel()}
        tabIndex={0}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}; 