/**
 * Dashboard Page
 * Shows user's matrix scores and health overview
 */

import { MatrixRadar } from '@/components/matrix-radar';
import { MatrixCards } from '@/components/matrix-cards';
import { AIChat } from '@/components/ai-chat';
import Link from 'next/link';

// Demo scores - in production, fetch from database
const mockScores = {
  assimilation: 75,
  defense: 75,
  energy: 70,
  biotransformation: 73,
  transport: 78,
  communication: 76,
  structural: 80,
  overallScore: 75,
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LAMS-FM</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 font-medium">
                仪表盘
              </Link>
              <Link 
                href="/assessment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                新评估
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">健康仪表盘</h1>
          <p className="text-gray-600 mt-2">查看您的功能医学矩阵评分和健康趋势</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">整体健康评分</h2>
              <p className="text-gray-600 text-sm mt-1">基于七大维度的综合评估</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600">
                {mockScores.overallScore}
              </div>
              <p className="text-gray-600 text-sm mt-1">/ 100</p>
            </div>
          </div>
        </div>

        {/* Charts, Cards, and AI Chat Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Radar Chart and Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Radar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <MatrixRadar data={mockScores} title="功能医学矩阵" />
            </div>

            {/* Dimension Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">维度详情</h3>
              <div className="space-y-4">
                {Object.entries(mockScores)
                  .filter(([key]) => key !== 'overallScore')
                  .map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`text-lg font-semibold ${
                          (value as number) >= 70 ? 'text-green-600' : (value as number) >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(value as number)}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            (value as number) >= 70 ? 'bg-green-500' : (value as number) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(value as number)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link 
                  href="/assessment"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7audi2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">填写问卷</p>
                    <p className="text-sm text-gray-600">开始新的健康评估</p>
                  </div>
                </Link>

                <Link 
                  href="/interventions"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24.24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">查看干预方案</p>
                    <p className="text-sm text-gray-600">5R 协议建议</p>
                  </div>
                </Link>

                <Link 
                  href="/daily-tracking"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">每日追踪</p>
                    <p className="text-sm text-gray-600">记录每日健康指标</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: AI Chat */}
          <div className="lg:col-span-1">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
}
