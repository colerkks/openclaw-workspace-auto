/**
 * Assessment Page
 * Interactive questionnaire for health assessment
 */

'use client';

import { useState } from 'react';
import { submitQuestionnaire } from '@/actions/questionnaire';
import Link from 'next/link';

type QuestionnaireType = 
  | 'gut_health'
  | 'energy_fatigue'
  | 'immune_function';

interface Symptom {
  id: string;
  label: string;
  category: 'digestive' | 'energy' | 'immune';
}

const symptoms: Symptom[] = [
  // Digestive symptoms
  { id: 'bloating', label: 'Bloating/腹胀', category: 'digestive' },
  { id: 'constipation', label: 'Constipation/便秘', category: 'digestive' },
  { id: 'diarrhea', label: 'Diarrhea/腹泻', category: 'digestive' },
  { id: 'heartburn', label: 'Heartburn/胃灼热', category: 'digestive' },
  { id: 'gas', label: 'Gas/排气多', category: 'digestive' },
  { id: 'abdominal_pain', label: 'Abdominal Pain/腹痛', category: 'digestive' },
  { id: 'food_sensitivities', label: 'Food Sensitivities/食物敏感', category: 'digestive' },
  
  // Energy symptoms
  { id: 'fatigue', label: 'Fatigue/疲劳', category: 'energy' },
  { id: 'brain_fog', label: 'Brain Fog/脑雾', category: 'energy' },
  { id: 'poor_concentration', label: 'Poor Concentration/注意力不集中', category: 'energy' },
  { id: 'exercise_intolerance', label: 'Exercise Intolerance/运动不耐', category: 'energy' },
  { id: 'cold_hands_feet', label: 'Cold Hands & Feet/手脚冰凉', category: 'energy' },
  { id: 'weakness', label: 'Weakness/虚弱', category: 'energy' },
  { id: 'low_stamina', label: 'Low Stamina/耐力差', category: 'energy' },
  
  // Immune symptoms
  { id: 'frequent_colds', label: 'Frequent Colds/频繁感冒', category: 'immune' },
  { id: 'allergies', label: 'Allergies/过敏', category: 'immune' },
  { id: 'joint_pain', label: 'Joint Pain/关节痛', category: 'immune' },
  { id: 'slow_healing', label: 'Slow Healing/愈合慢', category: 'immune' },
  { id: 'chronic_inflammation', label: 'Chronic Inflammation/慢性炎症', category: 'immune' },
];

const categoryNames: Record<string, string> = {
  digestive: '消化系统',
  energy: '能量系统',
  immune: '免疫系统',
};

export default function AssessmentPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [severity, setSeverity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const categories: string[] = ['digestive', 'energy', 'immune'];

  const toggleSymptom = (symptomId: string) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptomId)) {
      newSelected.delete(symptomId);
      delete severity[symptomId];
    } else {
      newSelected.add(symptomId);
      severity[symptomId] = 5; // Default severity
    }
    setSelectedSymptoms(newSelected);
    setSeverity({ ...severity });
  };

  const updateSeverity = (symptomId: string, value: number) => {
    setSeverity({ ...severity, [symptomId]: value });
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.size === 0) {
      alert('请至少选择一个症状');
      return;
    }

    setLoading(true);

    const responses: Record<string, string | number | boolean> = {};
    
    selectedSymptoms.forEach(symptomId => {
      responses[`has_${symptomId}`] = true;
      responses[`${symptomId}_severity`] = severity[symptomId] || 5;
    });

    const formData = {
      questionnaireType: 'initial_intake' as const,
      responses,
    };

    const result = await submitQuestionnaire(formData);
    setResult(result);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center">
            {result.success ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h2>
                <p className="text-gray-600 mb-6">{result.message}</p>
                
                {result.scores && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">矩阵评分</h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(result.scores.overallScore)}
                    </div>
                    <p className="text-sm text-gray-600">整体健康评分</p>
                  </div>
                )}

                <Link 
                  href="/dashboard"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  查看仪表盘
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">提交失败</h2>
                <p className="text-gray-600 mb-6">{result.error}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  重试
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LAMS-FM</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              返回仪表盘
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">健康评估问卷</h1>
          <p className="text-gray-600 mt-2">请选择您当前正在经历的症状，并评估其严重程度</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {categoryNames[category]}
              </h2>
              <div className="space-y-4">
                {symptoms
                  .filter((s) => s.category === category)
                  .map((symptom) => (
                    <div
                      key={symptom.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedSymptoms.has(symptom.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleSymptom(symptom.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              selectedSymptoms.has(symptom.id)
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedSymptoms.has(symptom.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{symptom.label}</span>
                        </div>
                      </div>

                      {selectedSymptoms.has(symptom.id) && (
                        <div className="mt-4 ml-8">
                          <label className="text-sm text-gray-600 mb-2 block">
                            严重程度 (1-10):
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={severity[symptom.id] || 5}
                              onChange={(e) =>
                                updateSeverity(symptom.id, parseInt(e.target.value))
                              }
                              className="flex-1"
                            />
                            <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                              {severity[symptom.id] || 5}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading || selectedSymptoms.size === 0}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl transition-all font-semibold text-lg shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>处理中...</span>
              </>
            ) : (
              <>
                <span>提交评估</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
