import { NextResponse } from 'next/server';
import { generateAIPrompt } from '@/lib/dr-kyle';
import { db } from '@/lib/db';
import {
  matrixScores,
  questionnaireResponses,
  labResults,
  interventions,
} from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Dr. Kyle AI Chat API Route
 * Simple AI chat with context from user's health data
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, profileId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // For demo, use profileId = 1
    const targetProfileId = profileId || 1;

    // Fetch user's health data
    const [latestScores] = await db
      .select()
      .from(matrixScores)
      .where(eq(matrixScores.profileId, targetProfileId))
      .orderBy(desc(matrixScores.calculationDate))
      .limit(1);

    const recentResponses = await db
      .select()
      .from(questionnaireResponses)
      .where(eq(questionnaireResponses.profileId, targetProfileId))
      .orderBy(desc(questionnaireResponses.completedAt))
      .limit(3);

    const recentLabs = await db
      .select()
      .from(labResults)
      .where(eq(labResults.profileId, targetProfileId))
      .orderBy(desc(labResults.createdAt))
      .limit(3);

    const activeInterventions = await db
      .select()
      .from(interventions)
      .where(eq(interventions.profileId, targetProfileId));

    // Extract recent symptoms
    const recentSymptoms: string[] = [];
    recentResponses.forEach(response => {
      const responses = response.responses as any;
      Object.keys(responses).forEach(key => {
        if (key.startsWith('has_') && responses[key]) {
          const symptom = key.replace('has_', '').replace(/_/g, ' ');
          recentSymptoms.push(symptom);
        }
      });
    });

    // Prepare health data for AI
    const healthData = {
      matrixScores: latestScores ? {
        assimilation: latestScores.assimilation,
        defense: latestScores.defense,
        energy: latestScores.energy,
        biotransformation: latestScores.biotransformation,
        transport: latestScores.transport,
        communication: latestScores.communication,
        structural: latestScores.structural,
        overallScore: latestScores.overallScore,
      } : null,
      recentSymptoms: [...new Set(recentSymptoms)].slice(0, 10),
      activeInterventions: activeInterventions.map(i => ({
        category: i.category,
        title: i.title,
        status: i.status,
      })),
      labResults: recentLabs.map(lab => ({
        testName: lab.testName,
        values: lab.values,
      })),
    };

    // Generate AI response (mock for now - in production, use Vercel AI SDK)
    const aiResponse = generateMockAIResponse(message, healthData);

    return NextResponse.json({
      response: aiResponse,
      context: healthData,
    });
  } catch (error) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

/**
 * Mock AI response generator
 * In production, replace with Vercel AI SDK integration
 */
function generateMockAIResponse(message: string, healthData: any): string {
  const lowerMessage = message.toLowerCase();
  const scores = healthData.matrixScores || {};

  // Handle common queries
  if (lowerMessage.includes('评分') || lowerMessage.includes('分数')) {
    return `根据您最新的健康评估数据：

📊 功能医学矩阵评分：
- 同化（消化）: ${scores.assimilation || 'N/A'}/100
- 防御与修复（免疫）: ${scores.defense || 'N/A'}/100
- 能量（线）: ${scores.energy || 'N/A'}/100
- 生物转化与排泄（解毒）: ${scores.biotransformation || 'N/A'}/100
- 输送（心血管）: ${scores.transport || 'N/A'}/100
- 通讯（内分泌）: ${scores.communication || 'N/A'}/100
- 结构（骨骼肌肉）: ${scores.structural || 'N/A'}/100

整体健康评分：${scores.overallScore || 'N/A'}/100

${scores.overallScore && scores.overallScore < 60 
  ? '您的整体健康评分较低，建议优先关注最低的维度，并遵循 5R 干预协议进行系统性改善。'
  : '您的健康状态良好，继续保持当前的干预方案和健康习惯！'}`;
  }

  if (lowerMessage.includes('建议') || lowerMessage.includes('干预')) {
    const activeInterventions = healthData.activeInterventions || [];
    if (activeInterventions.length > 0) {
      return `根据您的健康数据，您当前正在进行的干预方案包括：

${activeInterventions.map((i: any) => 
  `- [${i.category.toUpperCase()}] ${i.title}`
).join('\n')}

建议：
1. 坚持执行当前干预方案
2. 定期记录症状变化
3. 2-4 周后重新评估，根据改善情况调整方案

需要我详细解释某个干预方案吗？`;
    }
    return '根据您当前的健康状况，我建议从 5R 协议开始：\n\n1. **Remove（移除）**: 识别并移除饮食中的过敏原和促炎食物\n2. **Replace（补充）**: 补充必需营养素，如消化酶和益生菌\n3. **Reinoculate（再接种）**: 恢复肠道微生物平衡\n4. **Repair（修复）**: 修复肠道粘膜和支持肝脏解毒\n5. **Rebalance（再平衡）**: 优化睡眠、压力管理和运动习惯\n\n请填写问卷，我会为您生成个性化的干预方案。';
  }

  if (lowerMessage.includes('补充') || lowerMessage.includes('营养') || lowerMessage.includes('维生素')) {
    const scores = healthData.matrixScores || {};
    
    let recommendations: string[] = [];
    
    if (scores.energy && scores.energy < 60) {
      recommendations.push('- **能量支持**: 辅酶 Q10、B 族维生素（特别是 B12）有助于改善线粒体功能');
    }
    
    if (scores.assimilation && scores.assimilation < 60) {
      recommendations.push('- **消化支持**: 全谱消化酶、胃酸补充剂、L-谷氨酰胺');
    }
    
    if (scores.defense && scores.defense < 60) {
      recommendations.push('- **免疫支持**: 维生素 C、维生素 D3、锌、硒');
    }
    
    if (scores.biotransformation && scores.biotransformation < 60) {
      recommendations.push('- **解毒支持**: N-乙酰半胱氨酸（NAC）、α-硫辛酸、奶蓟草');
    }
    
    if (recommendations.length === 0) {
      return '根据您当前的评分，您的基础营养状况良好。建议：\n\n- 保持均衡饮食，摄入足够蛋白质、蔬菜和健康脂肪\n- 根据活动量补充电解质\n- 定期进行血液检查监测关键营养素水平\n\n如需个性化建议，请提供具体的关注领域。';
    }
    
    return `根据您的功能医学评分，以下营养补充建议可能对您有帮助：

${recommendations.join('\n')}

⚠️ 重要提示：
- 在开始任何补充剂之前，请咨询您的医疗提供者
- 从低剂量开始，逐渐增加
- 根据实验室结果调整剂量
- 优先从食物中获取营养素，补充剂作为辅助`;
  }

  if (lowerMessage.includes('症状') || lowerMessage.includes('不舒服') || lowerMessage.includes('痛')) {
    const symptoms = healthData.recentSymptoms || [];
    if (symptoms.length > 0) {
      return `根据您最近报告的症状：

${symptoms.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

这些症状可能指向以下功能医学失衡：

1. **消化系统问题**: 影响营养吸收，导致全身性症状
2. **能量代谢障碍**: 线粒体功能受损，影响细胞能量产生
3. **慢性炎症**: 免疫系统持续激活，消耗资源

建议：
- 记录症状的触发因素和时间规律
- 在评估问卷中更新症状严重程度
- 遵循 5R 干预协议进行系统性改善`;
    }
    return '您还没有报告具体的症状。请在评估问卷中填写您的健康状况，我会根据您的回答提供个性化建议。';
  }

  // Default response
  return `您好！我是 Dr. Kyle，您的功能医学健康顾问。

我可以帮助您：

📊 **健康评估分析**
- 解释您的功能医学矩阵评分
- 识别潜在的健康失衡

💊 **干预方案建议**
- 5R 协议个性化建议
- 营养补充方案
- 生活方式调整

🔬 **症状解读**
- 分析症状的根本原因
- 解释症状与功能医学维度的关联

❓ **功能医学知识**
- 回答关于功能医学的问题
- 解释营养素的作用机制

请告诉我您想了解什么，我会根据您的健康数据提供专业建议！`;
}
