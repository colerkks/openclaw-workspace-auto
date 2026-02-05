/**
 * LAMS-FM Database Schema
 * Functional Medicine Matrix Management System
 *
 * Design Principles:
 * 1. Separation of concerns: Static scores (structure) vs Dynamic data (JSON)
 * 2. Audit trail: Every score change is tracked via history tables
 * 3. Flexibility: Medical data stored as JSON for schema evolution
 * 4. Integrity: Foreign keys ensure referential consistency
 */

import { mysqlTable, mysqlEnum, int, bigint, text, varchar, timestamp, json, decimal } from 'drizzle-orm/mysql-core';

/**
 * Core User Table
 * Stores authentication and basic profile info
 */
export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Functional Medicine Profile
 * Stores the user's baseline medical information
 */
export const fmProfiles = mysqlTable('fm_profiles', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Basic demographics
  birthDate: varchar('birth_date', { length: 10 }), // YYYY-MM-DD
  gender: mysqlEnum('gender', ['male', 'female', 'other']),
  heightCm: int('height_cm'),
  weightKg: int('weight_kg'),
  
  // Medical history (JSON for flexibility)
  medicalHistory: json('medical_history').$type<{
    conditions: string[];
    medications: Array<{ name: string; dosage: string; frequency: string }>;
    allergies: string[];
    surgeries: string[];
    familyHistory: Record<string, string[]>;
  }>(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Matrix Scores Table
 * Stores the 7 core functional medicine matrix scores (0-100)
 * Each score is calculated from raw data, not user input
 */
export const matrixScores = mysqlTable('matrix_scores', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  // The 7 Matrix Dimensions (0-100, 100 = optimal)
  assimilation: int('assimilation').notNull().default(50), // Digestion, absorption, gut microbiome
  defense: int('defense').notNull().default(50), // Immune, inflammation, infection
  energy: int('energy').notNull().default(50), // Mitochondrial function, oxidative stress
  biotransformation: int('biotransformation').notNull().default(50), // Detoxification, liver
  transport: int('transport').notNull().default(50), // Cardiovascular, lymphatic
  communication: int('communication').notNull().default(50), // Hormones, neurotransmitters
  structural: int('structural').notNull().default(50), // Cell membrane, musculoskeletal
  
  // Overall wellness score (weighted average)
  overallScore: int('overall_score').notNull().default(50),
  
  // Scoring metadata
  calculationDate: timestamp('calculation_date').notNull().defaultNow(),
  dataSource: mysqlEnum('data_source', ['questionnaire', 'lab_results', 'mixed']),
  rawDataHash: varchar('raw_data_hash', { length: 64 }), // Track data changes
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Matrix Score History
 * Audit trail for score changes to track trends over time
 */
export const matrixScoreHistory = mysqlTable('matrix_score_history', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  // Snapshot of all scores at a point in time
  assimilation: int('assimilation').notNull(),
  defense: int('defense').notNull(),
  energy: int('energy').notNull(),
  biotransformation: int('biotransformation').notNull(),
  transport: int('transport').notNull(),
  communication: int('communication').notNull(),
  structural: int('structural').notNull(),
  overallScore: int('overall_score').notNull(),
  
  recordedAt: timestamp('recorded_at').notNull().defaultNow(),
});

/**
 * Questionnaire Responses
 * Stores raw questionnaire data (structured but flexible)
 */
export const questionnaireResponses = mysqlTable('questionnaire_responses', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  questionnaireType: mysqlEnum('questionnaire_type', [
    'initial_intake',
    'gut_health',
    'energy_fatigue',
    'hormone_balance',
    'detox_capacity',
    'immune_function',
    'follow_up'
  ]).notNull(),
  
  // Flexible JSON storage for answers
  responses: json('responses').notNull().$type<Record<string, string | number | boolean | string[]>>(),
  
  completedAt: timestamp('completed_at').notNull().defaultNow(),
});

/**
 * Lab Results
 * Stores laboratory test results (flexible schema)
 */
export const labResults = mysqlTable('lab_results', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  testName: varchar('test_name', { length: 255 }).notNull(),
  testDate: varchar('test_date', { length: 10 }), // YYYY-MM-DD
  labProvider: varchar('lab_provider', { length: 100 }),
  
  // Flexible storage for test values
  values: json('values').notNull().().$type<Array<{
    biomarker: string;
    value: number;
    unit: string;
    referenceRange: { min: number; max: number; unit: string };
    status: 'low' | 'normal' | 'high' | 'critical';
  }>>(),
  
  // Raw data or attachments
  rawData: json('raw_data'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Interventions (5R Protocol)
 * Stores recommended interventions based on matrix analysis
 */
export const interventions = mysqlTable('interventions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  // The 5R Protocol categories
  category: mysqlEnum('category', ['remove', 'replace', 'reinoculate', 'repair', 'rebalance']).notNull(),
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  
  // Prioritization
  priority: int('priority').notNull().default(50), // 0-100
  targetDimension: mysqlEnum('target_dimension', [
    'assimilation', 'defense', 'energy', 'biotransformation',
    'transport', 'communication', 'structural', 'overall'
  ]),
  
  // Implementation details
  instructions: json('instructions').$type<{
    dosage?: string;
    frequency?: string;
    duration?: string;
    timing?: string;
    contraindications?: string[];
  }>(),
  
  // Status tracking
  status: mysqlEnum('status', ['pending', 'in_progress', 'completed', 'discontinued']).notNull().default('pending'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  
  // Effectiveness tracking (self-reported)
  effectivenessRating: int('effectiveness_rating'), // 1-5
  notes: text('notes'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Daily Tracking
 * Logs daily wellness metrics and intervention compliance
 */
export const dailyTracking = mysqlTable('daily_tracking', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  trackDate: varchar('track_date', { length: 10 }).notNull(), // YYYY-MM-DD
  
  // Subjective metrics (1-10)
  energyLevel: int('energy_level'), // 1-10
  mood: int('mood'), // 1-10
  sleepQuality: int('sleep_quality'), // 1-10
  stressLevel: int('stress_level'), // 1-10
  digestionQuality: int('digestion_quality'), // 1-10
  
  // Compliance tracking
  interventionsCompleted: json('interventions_completed').$type<number[]>(), // IDs of completed interventions
  supplementation: json('supplementation').$type<Array<{
    name: string;
    taken: boolean;
    time: string;
  }>>(),
  
  // Symptoms tracking
  symptoms: json('symptoms').$type<Array<{
    symptom: string;
    severity: number; // 1-10
    notes?: string;
  }>>(),
  
  // Notes
  notes: text('notes'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * AI Consultations (Dr. Kyle)
 * Stores AI-generated insights and recommendations
 */
export const aiConsultations = mysqlTable('ai_consultations', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  profileId: bigint('profile_id', { mode: 'number' }).notNull().references(() => fmProfiles.id, { onDelete: 'cascade' }),
  
  userQuery: text('user_query').notNull(),
  
  // AI response
  aiResponse: text('ai_response').notNull(),
  
  // Context used for response
  contextUsed: json('context_used').$type<{
    matrixScores?: Record<string, number>;
    recentSymptoms?: string[];
    activeInterventions?: string[];
  }>(),
  
  // Feedback
  helpfulRating: int('helpful_rating'), // 1-5
  feedback: text('feedback'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Type exports for TypeScript
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type FMProfile = typeof fmProfiles.$inferSelect;
export type NewFMProfile = typeof fmProfiles.$inferInsert;

export type MatrixScore = typeof matrixScores.$inferSelect;
export type NewMatrixScore = typeof matrixScores.$inferInsert;

export type Intervention = typeof interventions.$inferSelect;
export type NewIntervention = typeof interventions.$inferInsert;

export type DailyTracking = typeof dailyTracking.$inferSelect;
export type NewDailyTracking = typeof dailyTracking.$inferInsert;
