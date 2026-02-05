import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  users,
  fmProfiles,
  interventions,
  dailyTracking,
} from '@/lib/schema';
import { generateDailyTasks } from '@/lib/economics';
import { eq } from 'drizzle-orm';

/**
 * Cron Job: Daily Reset and Task Generation
 * Runs daily at 00:00 UTC to generate new daily tasks for all users
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret (optional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Starting daily cron job...');

    // Get all active users
    const allUsers = await db.select().from(users);

    let tasksGenerated = 0;

    for (const user of allUsers) {
      // Get user's profile
      const [profile] = await db
        .select()
        .from(fmProfiles)
        .where(eq(fmProfiles.userId, user.id))
        .limit(1);

      if (!profile) continue;

      // Get active interventions
      const activeInterventions = await db
        .select()
        .from(interventions)
        .where(eq(interventions.profileId, profile.id));

      if (activeInterventions.length === 0) continue;

      // Generate daily tasks
      const tasks = generateDailyTasks(activeInterventions);

      // Create daily tracking entry
      const today = new Date().toISOString().split('T')[0];
      
      await db.insert(dailyTracking).values({
        profileId: profile.id,
        'trackDate': today,
        tasksCompleted: tasks
          .filter(t => t.completed)
          .map(t => parseInt(t.id.split('-')[1])),
        supplementation: [], // Will be filled during the day
        symptoms: [],
      });

      tasksGenerated += tasks.length;

      console.log(`  ✅ Generated ${tasks.length} tasks for user ${user.email}`);
    }

    console.log(`✅ Cron job completed! Generated ${tasksGenerated} tasks.`);

    return NextResponse.json({
      success: true,
      message: `Daily tasks generated for ${allUsers.length} users`,
      tasksGenerated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    );
  }
}
