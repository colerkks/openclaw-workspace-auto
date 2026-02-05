/**
 * Life Force Economics UI Component
 * Displays Hashrate and EBIO metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { calculateDailyHashrate, formatHashrate, formatEBIO, getHashrateTier } from '@/lib/economics';

export function HashrateDisplay() {
  const [hashrate, setHashrate] = useState(0);
  const [ebio, setEbio] = useState(0);
  const [tier, setTier] = useState('Beginner');

  // Demo data - in production, fetch from database
  const [tasks, setTasks] = useState([
    { id: '1', category: 'remove', title: '饮食调整', difficulty: 6, healthImpact: 8, completed: true },
    { id: '2', category: 'replace', title: '补充消化酶', difficulty: 4, healthImpact: 6, completed: true },
    { id: '3', category: 'reinoculate', title: '益生菌补充', difficulty: 3, healthImpact: 5, completed: false },
  ]);

  const biometrics = {
    glucose: 85, // mg/dL
    sleepHours: 7.5,
    stressLevel: 3,
    energyLevel: 7,
    mood: 8,
  };

  useEffect(() => {
    // Calculate Hashrate
    const result = calculateDailyHashrate(tasks, biometrics);
    setHashrate(result.dailyHashrate);
    setEbio(result.totalEBIO);
    setTier(getHashrateTier(result.dailyHashrate));
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">生命算力</h3>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {tier}
        </div>
      </div>

      {/* Hashrate Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formatHashrate(hashrate)}
        </div>
        <p className="text-gray-600 text-sm mt-1">今日健康投资回报</p>
      </div>

      {/* EBIO Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatEBIO(ebio)}
          </div>
          <p className="text-green-700 text-xs mt-1">总健康资产</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {tasks.filter(t => t.completed).length}/{tasks.length}
          </div>
          <p className="text-purple-700 text-xs mt-1">今日任务完成</p>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">今日健康任务</h4>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                task.completed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-600">
                  难度: {task.difficulty}/10 · 影响: {task.healthImpact}/10
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biometrics Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">生物指标奖励</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={biometrics.glucose >= 70 && biometrics.glucose <= 99 ? 'text-green-600' : 'text-gray-400'}>
            <span className="text-xs">血糖</span>
            <div className="font-semibold">{biometrics.glucose}</div>
          </div>
          <div className={biometrics.sleepHours >= 7 && biometrics.sleepHours <= 9 ? 'text-green-600' : 'text-gray-400'}>
            <span className="text-xs">睡眠</span>
            <div className="font-semibold">{biometrics.sleepHours}h</div>
          </div>
          <div className={biometrics.stressLevel <= 3 ? 'text-green-600' : 'text-gray-400'}>
            <span className="text-xs">压力</span>
            <div className="font-semibold">{biometrics.stressLevel}/10</div>
          </div>
        </div>
      </div>
    </div>
  );
}
