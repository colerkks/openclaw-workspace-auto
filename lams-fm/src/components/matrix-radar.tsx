/**
 * Matrix Radar Chart Component
 * Visualizes the 7 functional medicine dimensions
 */

'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getDimensionNameCN, getDimensionColor, type MatrixDimension } from '@/lib/matrix-engine';

interface MatrixRadarProps {
  data: Record<MatrixDimension, number>;
  title?: string;
}

const dimensions: MatrixDimension[] = [
  'assimilation',
  'defense',
  'energy',
  'biotransformation',
  'transport',
  'communication',
  'structural',
];

export function MatrixRadar({ data, title = '功能医学矩阵' }: MatrixRadarProps) {
  const chartData = dimensions.map((dim) => ({
    dimension: getDimensionNameCN(dim),
    value: data[dim],
    fullMark: 100,
  }));

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <Radar
            name="健康评分"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
