/**
 * Dr. Kyle AI System Prompt
 * LAMS-FM Assistant with Functional Medicine Knowledge
 */

export const DR_KYLE_SYSTEM_PROMPT = `你现在是 Dr. Kyle，LAMS-FM（功能医学慢病管理系统）的 AI 健康顾问。

你的专长领域包括：
- 功能医学矩阵理论（七大核心失衡）
- 5R 干预协议（Remove, Replace, Reinoculate, Repair, Rebalance）
- 症状分析与根本原因识别
- 个性化健康建议生成

用户当前的健康数据：
{{USER_HEALTH_DATA}}

功能医学七大维度评分：
{{MATRIX_SCORES}}

最近的症状：
{{RECENT_SYMPTOMS}}

当前的实验室结果：
{{LAB_RESULTS}}

当前正在进行的干预方案：
{{ACTIVE_INTERVENTIONS}}

你的职责：
1. 分析用户的健康数据，识别功能医学失衡的根源
2. 基于当前的矩阵评分，提供个性化的 5R 干预建议
3. 解释症状与功能医学矩阵维度之间的关联
4. 提供具体、可执行的健康改善建议
5. 回答用户关于功能医学、营养、生活方式的问题

回答风格：
- 专业但易懂（使用中文）
- 基于功能医学理论，提供科学依据
- 给出具体的建议步骤
- 鼓励用户，但要实事求是

请记住：你是一个 AI 助手，不能替代专业医疗建议。在必要时提醒用户咨询医生。`;

/**
 * Format user health data for AI prompt
 */
export function formatHealthDataForAI(data: {
  matrixScores?: Record<string, number>;
  recentSymptoms?: string[];
  activeInterventions?: Array<{ category: string; title: string; status: string }>;
  labResults?: Array<{ testName: string; values: any[] }>;
}): string {
  const { matrixScores, recentSymptoms, activeInterventions, labResults } = data;

  let formatted = '';

  // Matrix scores
  if (matrixScores) {
    formatted += '\n功能医学矩阵评分：\n';
    const dimensionNames: Record<string, string> = {
      assimilation: '同化（消化）',
      defense: '防御与修复（免疫）',
      energy: '能量（线粒体）',
      biotransformation: '生物转化与排泄（解毒）',
      transport: '输送（心血管）',
      communication: '通讯（内分泌）',
      structural: '结构（骨骼肌肉）',
    };
    
    Object.entries(matrixScores).forEach(([dim, score]) => {
      if (dim !== 'overallScore') {
        formatted += `- ${dimensionNames[dim]}: ${Math.round(score)}/100\n`;
      }
    });
    
    if (matrixScores.overallScore) {
      formatted += `\n整体健康评分: ${Math.round(matrixScores.overallScore)}/100\n`;
    }
  }

  // Recent symptoms
  if (recentSymptoms && recentSymptoms.length > 0) {
    formatted += '\n最近报告的症状：\n';
    recentSymptoms.forEach(symptom => {
      formatted += `- ${symptom}\n`;
    });
  } else {
    formatted += '\n最近没有报告症状\n';
  }

  // Active interventions
  if (activeInterventions && activeInterventions.length > 0) {
    formatted += '\n当前正在进行的干预方案：\n';
    const categoryNames: Record<string, string> = {
      remove: '移除',
      replace: '补充',
      reinoculate: '再接种',
      repair: '修复',
      rebalance: '再平衡',
    };
    
    activeInterventions.forEach(intervention => {
      const status = intervention.status === 'in_progress' ? '进行中' : intervention.status;
      formatted += `- [${categoryNames[intervention.category]}] ${intervention.title} (${status})\n`;
    });
  }

  // Lab results
  if (labResults && labResults.length > 0) {
    formatted += '\n最近的实验室检查结果：\n';
    labResults.forEach(lab => {
      formatted += `\n${lab.testName}:\n`;
      lab.values.forEach((value: any) => {
        const status = value.status === 'high' ? '↑ 高' : value.status === 'low' ? '↓ 低' : '正常';
        formatted += `  - ${value.biomarker}: ${value.value} ${value.unit} (${status})\n`;
      });
    });
  }

  return formatted;
}

/**
 * Generate AI prompt with user context
 */
export function generateAIPrompt(userQuery: string, healthData: any): string {
  const healthDataString = formatHealthDataForAI(healthData);
  
  return DR_KYLE_SYSTEM_PROMPT
    .replace('{{USER_HEALTH_DATA}}', healthDataString)
    .replace('{{MATRIX_SCORES}}', JSON.stringify(healthData.matrixScores || {}))
    .replace('{{RECENT_SYMPTOMS}}', JSON.stringify(healthData.recentSymptoms || []))
    .replace('{{LAB_RESULTS}}', JSON.stringify(healthData.labResults || []))
    .replace('{{ACTIVE_INTERVENTIONS}}', JSON.stringify(healthData.activeInterventions || []))
    + `\n\n用户问题：${userQuery}\n\n请提供你的专业建议：`;
}
