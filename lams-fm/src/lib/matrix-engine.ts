/**
 * LAMS-FM Matrix Engine
 * Core scoring algorithm for Functional Medicine Matrix
 *
 * Scoring Logic:
 * 1. Symptoms map to matrix dimensions with weights
 * 2. Lab results adjust baseline scores
 * 3. Daily tracking provides short-term modifiers
 * 4. Final scores normalized to 0-100 (100 = optimal)
 */

export type MatrixDimension = 
  | 'assimilation' 
  | 'defense' 
  | 'energy' 
  | 'biotransformation' 
  | 'transport' 
  | 'communication' 
  | 'structural';

export type QuestionnaireType = 
  | 'initial_intake'
  | 'gut_health'
  | 'energy_fatigue'
  | 'hormone_balance'
  | 'detox_capacity'
  | 'immune_function'
  | 'follow_up';

/**
 * Symptom to Matrix Dimension Mapping
 * Each symptom contributes to specific dimensions with weights
 */
const SYMPTOM_WEIGHTS: Record<string, Record<MatrixDimension, number>> = {
  // Assimilation (Gut, Digestion)
  'bloating': { assimilation: 0.8, defense: 0.3, energy: 0.2 },
  'constipation': { assimilation: 0.7, biotransformation: 0.3 },
  'diarrhea': { assimilation: 0.8, defense: 0.4, biotransformation: 0.3 },
  'heartburn': { assimilation: 0.7, structural: 0.2 },
  'nausea': { assimilation: 0.6, biotransformation: 0.2 },
  'gas': { assimilation: 0.5, defense: 0.2 },
  'abdominal_pain': { assimilation: 0.7, defense: 0.4 },
  'food_sensitivities': { assimilation: 0.6, defense: 0.8 },
  'poor_appetite': { assimilation: 0.5, energy: 0.3 },
  
  // Defense & Repair (Immune, Inflammation)
  'frequent_colds': { defense: 0.8, energy: 0.3 },
  'allergies': { defense: 0.7, assimilation: 0.3 },
  'autoimmune_disease': { defense: 0.9, communication: 0.5 },
  'chronic_inflammation': { defense: 0.8, biotransformation: 0.4 },
  'slow_healing': { defense: 0.6, structural: 0.4 },
  'recurrent_infections': { defense: 0.8, energy: 0.3 },
  'joint_pain': { defense: 0.6, structural: 0.5 },
  
  // Energy (Mitochondrial, Oxidative Stress)
  'fatigue': { energy: 0.8, defense: 0.3, communication: 0.3 },
  'brain_fog': { energy: 0.7, communication: 0.4, transport: 0.3 },
  'poor_concentration': { energy: 0.6, communication: 0.4 },
  'exercise_intolerance': { energy: 0.7, transport: 0.3 },
  'cold_hands_feet': { energy: 0.5, transport: 0.6 },
  'weakness': { energy: 0.7, structural: 0.3 },
  'low_stamina': { energy: 0.8, transport: 0.3 },
  
  // Biotransformation (Detoxification, Liver)
  'chemical_sensitivity': { biotransformation: 0.8, defense: 0.4 },
  'headaches': { biotransformation: 0.5, transport: 0.3 },
  'morning_grogginess': { biotransformation: 0.6, energy: 0.3 },
  'skin_issues': { biotransformation: 0.5, defense: 0.4 },
  'dark_urine': { biotransformation: 0.6, structural: 0.2 },
  'body_odor': { biotransformation: 0.5, defense: 0.2 },
  
  // Transport (Cardiovascular, Lymphatic)
  'high_blood_pressure': { transport: 0.8, communication: 0.3 },
  'swelling': { transport: 0.7, biotransformation: 0.3 },
  'varicose_veins': { transport: 0.6, structural: 0.3 },
  'poor_circulation': { transport: 0.8, energy: 0.4 },
  'chest_pain': { transport: 0.7, defense: 0.4 },
  'palpitations': { transport: 0.6, communication: 0.4 },
  
  // Communication (Hormones, Neurotransmitters)
  'mood_swings': { communication: 0.7, defense: 0.3 },
  'anxiety': { communication: 0.6, energy: 0.3, defense: 0.3 },
  'depression': { communication: 0.7, energy: 0.4 },
  'insomnia': { communication: 0.6, energy: 0.4 },
  'irritability': { communication: 0.5, energy: 0.3 },
  'hot_flashes': { communication: 0.6, energy: 0.3 },
  'low_libido': { communication: 0.6, energy: 0.3 },
  'memory_issues': { communication: 0.5, energy: 0.3 },
  
  // Structural (Cell Membrane, Musculoskeletal)
  'muscle_tension': { structural: 0.7, defense: 0.3 },
  'back_pain': { structural: 0.7, transport: 0.3 },
  'neck_pain': { structural: 0.6, communication: 0.2 },
  'osteoporosis': { structural: 0.8, communication: 0.4 },
  'poor_posture': { structural: 0.5, transport: 0.2 },
  'joint_stiffness': { structural: 0.6, defense: 0.3 },
};

/**
 * Lab Result Adjustments
 * Abnormal lab values modify baseline scores
 */
const LAB_ADJUSTMENTS: Record<string, Partial<Record<MatrixDimension, number>>> = {
  // Inflammatory markers
  'CRP': { defense: -10 },
  'ESR': { defense: -8 },
  'Ferritin': { defense: -5, energy: -5 },
  
  // Metabolic markers
  'Glucose': { energy: -8, transport: -5 },
  'HbA1c': { energy: -10, transport: -8 },
  'Insulin': { energy: -8, communication: -5 },
  
  // Thyroid markers
  'TSH': { energy: -10, communication: -8 },
  'Free_T3': { energy: -8, communication: -6 },
  'Free_T4': { energy: -6, communication: -5 },
  'Reverse_T3': { energy: -10, biotransformation: -5 },
  
  // Lipid markers
  'Cholesterol': { transport: -5, biotransformation: -3 },
  'LDL': { transport: -8, biotransformation: -5 },
  'HDL': { transport: -5 },
  'Triglycerides': { transport: -7, biotransformation: -5 },
  
  // Liver function
  'ALT': { biotransformation: -10 },
  'AST': { biotransformation: -8 },
  'GGT': { biotransformation: -7 },
  
  // Kidney function
  'BUN': { biotransformation: -5, transport: -3 },
  'Creatinine': { biotransformation: -5, transport: -3 },
  
  // Nutritional markers
  'Vitamin_D': { structural: -10, defense: -5 },
  'Vitamin_B12': { energy: -8, structural: -5 },
  'Iron': { energy: -7, defense: -5 },
  'Magnesium': { energy: -8, structural: -5, communication: -3 },
  'Zinc': { defense: -6, structural: -4 },
  
  // Hormones
  'Cortisol': { communication: -10, defense: -8, energy: -6 },
  'DHEA': { communication: -5, energy: -5 },
  'Testosterone': { communication: -8, energy: -5, structural: -3 },
  'Estrogen': { communication: -7, biotransformation: -4 },
  'Progesterone': { communication: -5, structural: -3 },
};

/**
 * Dimension Weights for Overall Score Calculation
 * Some dimensions are more critical to overall health
 */
const DIMENSION_WEIGHTS: Record<MatrixDimension, number> = {
  defense: 0.18,           // Immune is critical
  energy: 0.16,            // Energy affects everything
  assimilation: 0.15,      // Gut health foundation
  communication: 0.14,    // Hormones regulate all systems
  biotransformation: 0.13, // Detox is vital for maintenance
  transport: 0.13,         // Circulation essential
  structural: 0.11,        // Foundation but often stable
};

/**
 * Matrix Scores Result
 */
export interface MatrixScores {
  assimilation: number;
  defense: number;
  energy: number;
  biotransformation: number;
  transport: number;
  communication: number;
  structural: number;
  overallScore: number;
}

/**
 * Questionnaire Response Data
 */
export interface QuestionnaireData {
  questionnaireType: QuestionnaireType;
  responses: Record<string, string | number | boolean | string[]>;
}

/**
 * Lab Result Data
 */
export interface LabResultData {
  testName: string;
  values: Array<{
    biomarker: string;
    value: number;
    referenceRange: { min: number; max: number };
    status: 'low' | 'normal' | 'high' | 'critical';
  }>;
}

/**
 * Calculate Matrix Scores from Questionnaire Responses
 */
export function calculateScoresFromQuestionnaire(
  responses: QuestionnaireData[]
): MatrixScores {
  // Initialize scores
  const scores: Record<MatrixDimension, number> = {
    assimilation: 70,
    defense: 70,
    energy: 70,
    biotransformation: 70,
    transport: 70,
    communication: 70,
    structural: 70,
  };

  // Process each questionnaire
  for (const questionnaire of responses) {
    const { responses: answers } = questionnaire;

    // Extract symptoms from responses
    const symptoms = extractSymptoms(answers);
    
    // Calculate impact on each dimension
    for (const [symptom, severity] of Object.entries(symptoms)) {
      const weights = SYMPTOM_WEIGHTS[symptom.toLowerCase()];
      
      if (weights) {
        for (const [dimension, weight] of Object.entries(weights)) {
          const dim = dimension as MatrixDimension;
          // Higher severity = lower score
          const impact = (severity as number) * weight;
          scores[dim] = Math.max(0, scores[dim] - impact);
        }
      }
    }
  }

  // Normalize to 0-100
  const normalizedScores = normalizeScores(scores);
  
  // Calculate overall score
  const overallScore = calculateOverallScore(normalizedScores);

  return {
    ...normalizedScores,
    overallScore,
  };
}

/**
 * Calculate Matrix Scores with Lab Results Integration
 */
export function calculateScoresWithLabs(
  questionnaireScores: MatrixScores,
  labResults: LabResultData[]
): MatrixScores {
  const scores = { ...questionnaireScores };

  // Process lab results
  for (const lab of labResults) {
    for (const value of lab.values) {
      // Only consider abnormal values
      if (value.status !== 'normal') {
        const adjustments = LAB_ADJUSTMENTS[value.biomarker];
        
        if (adjustments) {
          for (const [dimension, adjustment] of Object.entries(adjustments)) {
            const dim = dimension as MatrixDimension;
            scores[dim] = Math.max(0, Math.min(100, scores[dim] + adjustment));
          }
        }
      }
    }
  }

  // Recalculate overall score
  scores.overallScore = calculateOverallScore(scores);

  return scores;
}

/**
 * Extract symptoms from questionnaire responses
 */
function extractSymptoms(
  responses: Record<string, string | number | boolean | string[]>
): Record<string, number> {
  const symptoms: Record<string, number> = {};

  for (const [key, value] of Object.entries(responses)) {
    // Handle different response formats
    
    // Boolean symptoms (has_symptom)
    if (key.startsWith('has_') && typeof value === 'boolean') {
      const symptom = key.replace('has_', '').replace(/_/g, ' ');
      if (value) {
        symptoms[symptom] = 15; // Default severity for boolean true
      }
    }
    
    // Numeric severity ratings (symptom_severity)
    if (key.endsWith('_severity') && typeof value === 'number') {
      const symptom = key.replace('_severity', '').replace(/_/g, ' ');
      if (value > 0) {
        symptoms[symptom] = value;
      }
    }
    
    // Symptom arrays
    if (key === 'symptoms' && Array.isArray(value)) {
      for (const symptom of value) {
        symptoms[symptom] = 10; // Default severity
      }
    }
  }

  return symptoms;
}

/**
 * Normalize scores to 0-100 range
 */
function normalizeScores(scores: Record<MatrixDimension, number>): Record<MatrixDimension, number> {
  const normalized: Record<MatrixDimension, number> = {} as any;

  for (const [dimension, score] of Object.entries(scores)) {
    normalized[dimension as MatrixDimension] = Math.max(0, Math.min(100, score));
  }

  return normalized;
}

/**
 * Calculate overall wellness score (weighted average)
 */
function calculateOverallScore(scores: Record<MatrixDimension, number>): number {
  let total = 0;
  let weightSum = 0;

  for (const [dimension, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    const dim = dimension as MatrixDimension;
    total += scores[dim] * weight;
    weightSum += weight;
  }

  return Math.round(total / weightSum);
}

/**
 * Get dimension name in Chinese
 */
export function getDimensionNameCN(dimension: MatrixDimension): string {
  const names: Record<MatrixDimension, string> = {
    assimilation: '同化',
    defense: '防御与修复',
    energy: '能量',
    biotransformation: '生物转化与排泄',
    transport: '输送',
    communication: '通讯',
    structural: '结构',
  };
  return names[dimension];
}

/**
 * Get dimension name in English
 */
export function getDimensionNameEN(dimension: MatrixDimension): string {
  const names: Record<MatrixDimension, string> = {
    assimilation: 'Assimilation',
    defense: 'Defense & Repair',
    energy: 'Energy',
    biotransformation: 'Biotransformation',
    transport: 'Transport',
    communication: 'Communication',
    structural: 'Structural',
  };
  return names[dimension];
}

/**
 * Get dimension description
 */
export function getDimensionDescription(dimension: MatrixDimension): string {
  const descriptions: Record<MatrixDimension, string> = {
    assimilation: '消化、吸收、肠道微生物',
    defense: '免疫、炎症、感染',
    energy: '线粒体功能、氧化应激',
    biotransformation: '毒素处理、肝脏解毒',
    transport: '心血管、淋巴系统',
    communication: '内分泌、神经递质',
    structural: '细胞膜完整性、骨骼肌肉',
  };
  return descriptions[dimension];
}

/**
 * Get color for dimension (for UI visualization)
 */
export function getDimensionColor(dimension: MatrixDimension): string {
  const colors: Record<MatrixDimension, string> = {
    assimilation: '#10b981',
    defense: '#ef4444',
    energy: '#f59e0b',
    biotransformation: '#8b5cf6',
    transport: '#06b6d4',
    communication: '#ec4899',
    structural: '#6366f1',
  };
  return colors[dimension];
}
