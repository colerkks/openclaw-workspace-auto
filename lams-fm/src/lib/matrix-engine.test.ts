/**
 * Matrix Engine Unit Tests
 * Testing the core scoring algorithm
 */

import {
  calculateScoresFromQuestionnaire,
  calculateScoresWithLabs,
  getDimensionNameCN,
  getDimensionNameEN,
  getDimensionDescription,
  getDimensionColor,
  type QuestionnaireData,
  type LabResultData,
} from './matrix-engine';

// Test utilities
function assertEqual(actual: number, expected: number, message: string): void {
  const diff = Math.abs(actual - expected);
  if (diff > 5) { // Allow 5-point tolerance
    throw new Error(`${message}: Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

// Test Suite: Basic Scoring
console.log('🧪 Testing Matrix Engine...\n');

// Test 1: Empty questionnaire returns baseline scores
console.log('Test 1: Empty questionnaire');
const emptyQuestionnaire: QuestionnaireData = {
  questionnaireType: 'initial_intake',
  responses: {},
};
const emptyScores = calculateScoresFromQuestionnaire([emptyQuestionnaire]);
console.log('  Baseline scores:', JSON.stringify(emptyScores, null, 2));
Object.values(emptyScores).forEach(score => {
  assertEqual(score, 70, 'Baseline score should be 70');
});
console.log('  ✅ Passed\n');

// Test 2: Single symptom affects specific dimensions
console.log('Test 2: Single symptom (fatigue)');
const fatigueQuestionnaire: QuestionnaireData = {
  questionnaireType: 'energy_fatigue',
  responses: {
    has_fatigue: true,
    fatigue_severity: 8,
  },
};
const fatigueScores = calculateScoresFromQuestionnaire([fatigueQuestionnaire]);
console.log('  Scores after fatigue:', JSON.stringify(fatigueScores, null, 2));
assertTrue(fatigueScores.energy < 70, 'Energy score should decrease');
assertTrue(fatigueScores.defense < 70, 'Defense score should decrease slightly');
assertTrue(fatigueScores.communication < 70, 'Communication score should decrease slightly');
console.log('  ✅ Passed\n');

// Test 3: Multiple symptoms accumulate impact
console.log('Test 3: Multiple symptoms (gut health focus)');
const gutQuestionnaire: QuestionnaireData = {
  questionnaireType: 'gut_health',
  responses: {
    has_bloating: true,
    bloating_severity: 7,
    has_constipation: true,
    constipation_severity: 5,
    has_diarrhea: true,
    diarrhea_severity: 6,
  },
};
const gutScores = calculateScoresFromQuestionnaire([gutQuestionnaire]);
console.log('  Scores after gut issues:', JSON.stringify(gutScores, null, 2));
assertTrue(gutScores.assimilation < 60, 'Assimilation should be significantly decreased');
assertTrue(gutScores.defense < 70, 'Defense should be decreased');
assertTrue(gutScores.biotransformation < 70, 'Biotransformation should be decreased');
console.log('  ✅ Passed\n');

// Test 4: Lab results modify baseline scores
console.log('Test 4: Lab results integration');
const baseQuestionnaire: QuestionnaireData = {
  questionnaireType: 'initial_intake',
  responses: {},
};
const baseScores = calculateScoresFromQuestionnaire([baseQuestionnaire]);

const abnormalLabs: LabResultData = {
  testName: 'Metabolic Panel',
  values: [
    { biomarker: 'CRP', value: 8.5, referenceRange: { min: 0, max: 5 }, status: 'high' },
    { biomarker: 'TSH', value: 12.3, referenceRange: { min: 0.5, max: 4.5 }, status: 'high' },
    { biomarker: 'Glucose', value: 130, referenceRange: { min: 70, max: 99 }, status: 'high' },
  ],
};

const adjustedScores = calculateScoresWithLabs(baseScores, [abnormalLabs]);
console.log('  Scores after abnormal labs:', JSON.stringify(adjustedScores, null, 2));
assertTrue(adjustedScores.defense < baseScores.defense, 'Defense decreased due to high CRP');
assertTrue(adjustedScores.energy < baseScores.energy, 'Energy decreased due to high TSH');
assertTrue(adjustedScores.transport < baseScores.transport, 'Transport decreased due to high Glucose');
console.log('  ✅ Passed\n');

// Test 5: Comprehensive multi-domain case
console.log('Test 5: Comprehensive case (multiple questionnaires + labs)');
const comprehensiveData: QuestionnaireData[] = [
  {
    questionnaireType: 'gut_health',
    responses: {
      has_bloating: true,
      bloating_severity: 6,
      has_food_sensitivities: true,
    },
  },
  {
    questionnaireType: 'energy_fatigue',
    responses: {
      has_fatigue: true,
      fatigue_severity: 9,
      has_brain_fog: true,
      brain_fog_severity: 7,
    },
  },
  {
    questionnaireType: 'immune_function',
    responses: {
      has_frequent_colds: true,
      frequent_colds_severity: 6,
      has_joint_pain: true,
      joint_pain_severity: 5,
    },
  },
];

const comprehensiveScores = calculateScoresFromQuestionnaire(comprehensiveData);
console.log('  Comprehensive scores:', JSON.stringify(comprehensiveScores, null, 2));

const comprehensiveLabs: LabResultData[] = [
  {
    testName: 'Inflammatory Markers',
    values: [
      { biomarker: 'CRP', value: 7.2, referenceRange: { min: 0, max: 5 }, status: 'high' },
    ],
  },
  {
    testName: 'Thyroid Panel',
    values: [
      { biomarker: 'TSH', value: 8.5, referenceRange: { min: 0.5, max: 4.5 }, status: 'high' },
    ],
  },
];

const finalScores = calculateScoresWithLabs(comprehensiveScores, comprehensiveLabs);
console.log('  Final scores with labs:', JSON.stringify(finalScores, null, 2));
assertTrue(finalScores.overallScore < 70, 'Overall score should decrease');
assertTrue(finalScores.assimilation < 70, 'Assimilation should be low');
assertTrue(finalScores.energy < 60, 'Energy should be very low');
assertTrue(finalScores.defense < 60, 'Defense should be very low');
console.log('  ✅ Passed\n');

// Test 6: Normal labs don't affect scores
console.log('Test 6: Normal labs (no impact)');
const normalScores = calculateScoresFromQuestionnaire([baseQuestionnaire]);
const normalLabs: LabResultData = {
  testName: 'Normal Panel',
  values: [
    { biomarker: 'CRP', value: 2.5, referenceRange: { min: 0, max: 5 }, status: 'normal' },
    { biomarker: 'TSH', value: 2.1, referenceRange: { min: 0.5, max: 4.5 }, status: 'normal' },
  ],
};
const afterNormalLabs = calculateScoresWithLabs(normalScores, [normalLabs]);
console.log('  Scores after normal labs:', JSON.stringify(afterNormalLabs, null, 2));
Object.entries(afterNormalLabs).forEach(([key, value]) => {
  if (key === 'overallScore') return;
  assertEqual(value, normalScores[key as keyof typeof normalScores], `${key} should not change`);
});
console.log('  ✅ Passed\n');

// Test 7: Utility functions
console.log('Test 7: Utility functions');
assertTrue(getDimensionNameCN('assimilation') === '同化', 'Chinese name correct');
assertTrue(getDimensionNameEN('energy') === 'Energy', 'English name correct');
assertTrue(getDimensionDescription('defense').includes('免疫'), 'Description correct');
assertTrue(getDimensionColor('biotransformation') === '#8b5cf6', 'Color correct');
console.log('  ✅ Passed\n');

// Test 8: Score bounds (0-100)
console.log('Test 8: Score bounds validation');
const extremeQuestionnaire: QuestionnaireData = {
  questionnaireType: 'initial_intake',
  responses: {
    has_fatigue: true,
    fatigue_severity: 10,
    has_autoimmune_disease: true,
  },
};
const extremeScores = calculateScoresFromQuestionnaire([extremeQuestionnaire]);
Object.entries(extremeScores).forEach(([key, value]) => {
  if (key === 'overallScore') return;
  assertTrue(value >= 0 && value <= 100, `${key} should be within 0-100 range`);
});
console.log('  ✅ Passed\n');

console.log('✅ All tests passed!\n');

// Export test results
export const testResults = {
  emptyScores,
  fatigue: fatigueScores,
  gut: gutScores,
  labAdjusted: adjustedScores,
  comprehensive: finalScores,
};
