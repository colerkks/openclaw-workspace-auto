
import Link from 'next/link';

export default function InterventionsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; 返回仪表盘
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">健康干预方案</h1>
          <p className="text-gray-600 mt-2">基于您的健康评估生成的个性化干预建议。</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-5xl mb-4">🩺</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">干预方案模块正在开发中</h2>
          <p className="text-gray-600 mb-6">
            我们正在构建个性化的饮食、营养和生活方式建议系统。
            <br />
            请稍后回来查看您的定制方案。
          </p>
          <Link 
            href="/assessment" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            重新进行评估
          </Link>
        </div>
      </div>
    </div>
  );
}
