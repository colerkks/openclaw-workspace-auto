/**
 * Matrix Dimensions Detail Cards
 * Shows detailed info for each dimension
 */

'use client';

import { getDimensionNameCN, getDimensionDescription, getDimensionColor, type MatrixDimension } from '@/lib/matrix-engine';

interface DimensionCardProps {
  dimension: MatrixDimension;
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return '优秀';
  if (score >= 60) return '良好';
  if (score >= 40) return '一般';
  return '需要关注';
}

function DimensionCard({ dimension, score }: DimensionCardProps) {
  const name = getDimensionNameCN(dimension);
  const description = getDimensionDescription(dimension);
  const color = getDimensionColor(dimension);
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        <div className={`text-2xl font-bold ${scoreColor}`}>
          {Math.round(score)}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all"
            style={{ 
              width: `${score}%`,
              backgroundColor: color 
            }}
          />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-600">{scoreLabel}</span>
      </div>
    </div>
  );
}

interface MatrixCardsProps {
  data: Record<string, number>;
}

export function MatrixCards({ data }: MatrixCardsProps) {
  const dimensions: MatrixDimension[] = [
    'assimilation',
    'defense',
    'energy',
    'biotransformation',
    'transport',
    'communication',
    'structural',
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dimensions.map((dim) => (
        <DimensionCard 
          key={dim}
          dimension={dim}
          score={data[dim]}
        />
      ))}
    </div>
  );
}
