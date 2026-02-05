
import Link from 'next/link';

export default function DailyTrackingPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; 返回仪表盘
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">每日健康追踪</h1>
          <p className="text-gray-600 mt-2">记录您的每日健康数据、症状和生活方式变化。</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">追踪功能模块正在开发中</h2>
          <p className="text-gray-600 mb-6">
            我们正在构建每日健康日志功能，帮助您持续监控健康状况。
            <br />
            该功能上线后，您可以记录饮食、睡眠、运动和症状变化。
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              返回仪表盘
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
