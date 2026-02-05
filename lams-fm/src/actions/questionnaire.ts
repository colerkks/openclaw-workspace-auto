/**
 * Server Actions for LAMS-FM
 * Handle form submissions and database operations
 */

'use server';

import { db } from '@/lib/db';
import {
  users,
  fmProfiles,
  questionnaireResponses,
  matrixScores,
  matrixScoreHistory,
} from '@/lib/schema';
import { calculateScoresFromQuestionnaire } from '@/lib/matrix-engine';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const QuestionnaireResponseSchema = z.object({
  questionnaireType: z.enum([
    'initial_intake',
    'gut_health',
    'energy_fatigue',
    'hormone_balance',
    'detox_capacity',
    'immune_function',
    'follow_up',
  ]),
  responses: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
});

/**
 * Create or get user by email
 */
export async function getUser(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length > 0) {
    return result[0];
  }

  const newUser = await db
    .insert(users)
    .values({
      email,
    })
    .returning();

  return newUser[0];
}

/**
 * Submit questionnaire response
 */
export async function submitQuestionnaire(formData: unknown) {
  try {
    // Validate input
    const validatedData = QuestionnaireResponseSchema.parse(formData);
    const { questionnaireType, responses } = validatedData;

    // TODO: Get user ID from session (implement auth later)
    // For now, use demo user
    const email = 'demo@lams-fm.com';
    const user = await getUser(email);

    // Check if user has a profile
    let profileResult = await db
      .select()
      .from(fmProfiles)
      .where(eq(fmProfiles.userId, user.id))
      .limit(1);

    let profileId: number;

    if (profileResult.length === 0) {
      // Create profile
      const newProfile = await db
        .insert(fmProfiles)
        .values({
          userId: user.id,
        })
        .returning();
      profileId = newProfile[0].id;
    } else {
      profileId = profileResult[0].id;
    }

    // Save questionnaire response
    const savedResponse = await db
      .insert(questionnaireResponses)
      .values({
        profileId,
        questionnaireType,
        responses: responses as any,
      })
      .returning();

    // Calculate new matrix scores
    const allResponses = await db
      .select()
      .from(questionnaireResponses)
      .where(eq(questionnaireResponses.profileId, profileId));

    const newScores = calculateScoresFromQuestionnaire(
      allResponses.map(r => ({
        questionnaireType: r.questionnaireType,
        responses: r.responses as any,
      }))
    );

    // Save matrix scores
    await db.insert(matrixScores).values({
      profileId,
      assimilation: Math.round(newScores.assimilation),
      defense: Math.round(newScores.defense),
      energy: Math.round(newScores.energy),
      biotransformation: Math.round(newScores.biotransformation),
      transport: Math.round(newScores.transport),
      communication: Math.round(newScores.communication),
      structural: Math.round(newScores.structural),
      overallScore: Math.round(newScores.overallScore),
      dataSource: 'questionnaire',
    });

    // Save to history
    await db.insert(matrixScoreHistory).values({
      profileId,
      assimilation: Math.round(newScores.assimilation),
      defense: Math.round(newScores.defense),
      energy: Math.round(newScores.energy),
      biotransformation: Math.round(newScores.biotransformation),
      transport: Math.round(newScores.transport),
      communication: Math.round(newScores.communication),
      structural: Math.round(newScores.structural),
      overallScore: Math.round(newScores.overallScore),
    });

    return {
      success: true,
      scores: newScores,
      message: '问卷提交成功！矩阵评分已更新。',
    };
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '提交失败，请重试',
    };
  }
}

/**
 * Get latest matrix scores for user
 */
export async function getMatrixScores(profileId: number) {
  try {
    const result = await db
      .select()
      .from(matrixScores)
      .where(eq(matrixScores.profileId, profileId))
      .orderBy(matrixScores.calculationDate)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Error fetching matrix scores:', error);
    return null;
  }
}

/**
 * Get questionnaire history for user
 */
export async function getQuestionnaireHistory(profileId: number) {
  try {
    const result = await db
      .select()
      .from(questionnaireResponses)
      .where(eq(questionnaireResponses.profileId, profileId))
      .orderBy(questionnaireResponses.completedAt);

    return result;
  } catch (error) {
    console.error('Error fetching questionnaire history:', error);
    return [];
  }
}
