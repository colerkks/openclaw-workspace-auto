/**
 * Database Seed Script
 * Generates realistic test data for LAMS-FM development
 */

import { db } from './db';
import {
  users,
  fmProfiles,
  matrixScores,
  matrixScoreHistory,
  questionnaireResponses,
  labResults,
  interventions,
} from './schema';

/**
 * Generate seed data
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Create test user
    console.log('✅ Creating test user...');
    const [newUser] = await db.insert(users).values({
      email: 'demo@lams-fm.com',
      name: '张三',
    }).returning();
    console.log(`   User created: ${newUser.email} (ID: ${newUser.id})\n`);

    // Step 2: Create FM Profile
    console.log('✅ Creating functional medicine profile...');
    const [newProfile] = await db.insert(fmProfiles).values({
      userId: newUser.id,
      birthDate: '1985-06-15',
      gender: 'male',
      heightCm: 175,
      weightKg: 75,
      medicalHistory: {
        conditions: ['慢性疲劳', '代谢综合征'],
        medications: [
          { name: '复合维生素', dosage: '1片', frequency: '每日' },
        ],
        allergies: ['麸质'],
        surgeries: [],
        familyHistory: {
          cardiovascular: ['高血压', '糖尿病'],
        },
      },
    }).returning();
    console.log(`   Profile created (ID: ${newProfile.id})\n`);

    // Step 3: Create questionnaire responses (3 history entries)
    console.log('✅ Creating questionnaire responses...');
    
    // Initial assessment (poor health)
    const [response1] = await db.insert(questionnaireResponses).values({
      profileId: newProfile.id,
      questionnaireType: 'initial_intake',
      responses: {
        has_fatigue: true,
        fatigue_severity: 9,
        has_bloating: true,
        bloating_severity: 7,
        has_brain_fog: true,
        brain_fog_severity: 8,
        has_joint_pain: true,
        joint_pain_severity: 6,
      },
      completedAt: new Date('2025-12-01'),
    }).returning();

    // Follow-up assessment (moderate improvement)
    const [response2] = await db.insert(questionnaireResponses).values({
      profileId: newProfile.id,
      questionnaireType: 'follow_up',
      responses: {
        has_fatigue: true,
        fatigue_severity: 6,
        has_bloating: true,
        bloating_severity: 4,
        has_brain_fog: true,
        brain_fog_severity: 5,
        has_joint_pain: true,
        joint_pain_severity: 3,
      },
      completedAt: new Date('2025-12-15'),
    }).returning();

    // Recent assessment (good improvement)
    const [response3] = await db.insert(questionnaireResponses).values({
      profileId: newProfile.id,
      questionnaireType: 'follow_up',
      responses: {
        has_fatigue: true,
        fatigue_severity: 3,
        has_bloating: true,
        bloating_severity: 2,
        has_brain_fog: true,
        brain_fog_severity: 2,
        has_joint_pain: true,
        joint_pain_severity: 1,
      },
      completedAt: new Date('2026-01-15'),
    }).returning();

    console.log(`   3 questionnaire responses created\n`);

    // Step 4: Create matrix scores (showing improvement trend)
    console.log('✅ Creating matrix scores (improvement trend)...');

    // Score 1: Initial (low scores)
    const [score1] = await db.insert(matrixScores).values({
      profileId: newProfile.id,
      assimilation: 45,
      defense: 50,
      energy: 42,
      biotransformation: 48,
      transport: 55,
      communication: 52,
      structural: 58,
      overallScore: 50,
      dataSource: 'questionnaire',
      calculationDate: new Date('2025-12-01'),
      rawDataHash: 'hash1',
    }).returning();

    // Score 1: History
    await db.insert(matrixScoreHistory).values({
      profileId: newProfile.id,
      assimilation: 45,
      defense: 50,
      energy: 42,
      biotransformation: 48,
      transport: 55,
      communication: 52,
      structural: 58,
      overallScore: 50,
      recordedAt: new Date('2025-12-01'),
    });

    // Score 2: Follow-up (moderate improvement)
    const [score2] = await db.insert(matrixScores).values({
      profileId: newProfile.id,
      assimilation: 58,
      defense: 62,
      energy: 55,
      biotransformation: 60,
      transport: 65,
      communication: 63,
      structural: 68,
      overallScore: 62,
      dataSource: 'questionnaire',
      calculationDate: new Date('2025-12-15'),
      rawDataHash: 'hash2',
    }).returning();

    // Score 2: History
    await db.insert(matrixScoreHistory).values({
      profileId: newProfile.id,
      assimilation: 58,
      defense: 62,
      energy: 55,
      biotransformation: 60,
      transport: 65,
      communication: 63,
      structural: 68,
      overallScore: 62,
      recordedAt: new Date('2025-12-15'),
    });

    // Score 3: Recent (good improvement)
    const [score3] = await db.insert(matrixScores).values({
      profileId: newProfile.id,
      assimilation: 72,
      defense: 75,
      energy: 70,
      biotransformation: 73,
      transport: 78,
      communication: 76,
      structural: 80,
      overallScore: 75,
      dataSource: 'questionnaire',
      calculationDate: new Date('2026-01-15'),
      rawDataHash: 'hash3',
    }).returning();

    // Score 3: History
    await db.insert(matrixScoreHistory).values({
      profileId: newProfile.id,
      assimilation: 72,
      defense: 75,
      energy: 70,
      biotransformation: 73,
      transport: 78,
      communication: 76,
      structural: 80,
      overallScore: 75,
      recordedAt: new Date('2026-01-15'),
    });

    console.log(`   3 matrix scores created (trend: 50 → 62 → 75)\n`);

    // Step 5: Create lab results
    console.log('✅ Creating lab results...');
    
    const [lab1] = await db.insert(labResults).values({
      profileId: newProfile.id,
      testName: 'Inflammatory Markers',
      testDate: '2025-12-01',
      labProvider: 'Quest Diagnostics',
      values: [
        {
          biomarker: 'CRP',
          value: 8.5,
          unit: 'mg/L',
          referenceRange: { min: 0, max: 5, unit: 'mg/L' },
          status: 'high',
        },
        {
          biomarker: 'ESR',
          value: 25,
          unit: 'mm/h',
          referenceRange: { min: 0, max: 15, unit: 'mm/h' },
          status: 'high',
        },
      ],
      rawData: {
        notes: 'Elevated inflammatory markers suggest chronic inflammation',
      },
      createdAt: new Date('2025-12-01'),
    }).returning();

    const [lab2] = await db.insert(labResults).values({
      profileId: newProfile.id,
      testName: 'Thyroid Panel',
      testDate: '2025-12-01',
      labProvider: 'LabCorp',
      values: [
        {
          biomarker: 'TSH',
          value: 5.2,
          unit: 'mIU/L',
          referenceRange: { min: 0.5, max: 4.5, unit: 'mIU/L' },
          status: 'high',
        },
        {
          biomarker: 'Free_T3',
          value: 2.8,
          unit: 'pg/mL',
          referenceRange: { min: 2.0, max: 4.4, unit: 'pg/mL' },
          status: 'normal',
        },
      ],
      rawData: {
        notes: 'Slightly elevated TSH, may indicate subclinical hypothyroidism',
      },
      createdAt: new Date('2025-12-01'),
    }).returning();

    const [lab3] = await db.insert(labResults).values({
      profileId: newProfile.id,
      testName: 'Metabolic Panel',
      testDate: '2025-12-01',
      labProvider: 'Quest Diagnostics',
      values: [
        {
          biomarker: 'Glucose',
          value: 110,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 99, unit: 'mg/dL' },
          status: 'high',
        },
        {
          biomarker: 'HbA1c',
          value: 5.8,
          unit: '%',
          referenceRange: { min: 4.0, max: 5.6, unit: '%' },
          status: 'high',
        },
        {
          biomarker: 'Cholesterol',
          value: 240,
          unit: 'mg/dL',
          referenceRange: { min: 100, max: 199, unit: 'mg/dL' },
          status: 'high',
        },
      ],
      rawData: {
        notes: 'Elevated glucose and cholesterol suggest metabolic dysfunction',
      },
      createdAt: new Date('2025-12-01'),
    }).returning();

    console.log(`   3 lab test results created\n`);

    // Step 6: Create interventions (5R Protocol)
    console.log('✅ Creating interventions (5R Protocol)...');

    // Remove
    await db.insert(interventions).values({
      profileId: newProfile.id,
      category: 'remove',
      title: '饮食调整',
      description: '从饮食中移除麸质和加工食品',
      priority: 90,
      targetDimension: 'assimilation',
      instructions: {
        dosage: '完全避免',
        frequency: '持续',
        duration: '4-6 周',
        contraindications: [],
      },
      status: 'in_progress',
      startedAt: new Date('2025-12-01'),
    });

    // Replace
    await db.insert(interventions).values({
      profileId: newProfile.id,
      category: 'replace',
      title: '补充消化酶',
      description: '在每餐前服用全谱消化酶，改善营养吸收',
      priority: 80,
      targetDimension: 'assimilation',
      instructions: {
        dosage: '1-2 粒胶囊',
        frequency: '每餐前',
        duration: '持续',
        contraindications: [],
      },
      status: 'in_progress',
      startedAt: new Date('2025-12-01'),
    });

    // Reinoculate
    await db.insert(interventions).values({
      profileId: newProfile.id,
      category: 'reinoculate',
      title: '益生菌补充',
      description: '补充多菌株益生菌，恢复肠道微生物平衡',
      priority: 75,
      targetDimension: 'assimilation',
      instructions: {
        dosage: '1 粒',
        frequency: '每日早晨空腹',
        duration: '3 个月',
        contraindications: [],
      },
      status: 'in_progress',
      startedAt: new Date('2025-12-01'),
    });

    // Repair
    await db.insert(interventions).values({
      profileId: newProfile.id,
      category: 'repair',
      title: '肠道粘膜修复',
      description: '使用 L-谷氨酰胺修复肠道屏障功能',
      priority: 70,
      targetDimension: 'assimilation',
      instructions: {
        dosage: '5-10g',
        frequency: '每日 2 次',
        duration: '6-8 周',
        contraindications: [],
      },
      status: 'in_progress',
      startedAt: new Date('2025-12-01'),
    });

    // Rebalance
    await db.insert(interventions).values({
      profileId: newProfile.id,
      category: 'rebalance',
      title: '压力管理',
      description: '每天进行冥想或深呼吸练习，降低皮质醇水平',
      priority: 85,
      targetDimension: 'communication',
      instructions: {
        dosage: '15-20 分钟',
        frequency: '每日',
        duration: '长期',
        contraindications: [],
      },
      status: 'in_progress',
      startedAt: new Date('2025-12-01'),
    });

    console.log(`   5 interventions created (Remove, Replace, Reinoculate, Repair, Rebalance)\n`);

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: 1`);
    console.log(`   - Profiles: 1`);
    console.log(`   - Questionnaire responses: 3`);
    console.log(`   - Matrix scores: 3 (trend: 50 → 62 → 75)`);
    console.log(`   - Score history: 3`);
    console.log(`   - Lab results: 3`);
    console.log(`   - Interventions: 5 (5R Protocol)\n`);
    console.log('🎯 Test user credentials:');
    console.log(`   Email: demo@lams-fm.com`);
    console.log(`   Name: 张三\n`);
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase()
  .then(() => {
    console.log('✅ Seed script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
