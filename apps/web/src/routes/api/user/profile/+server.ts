import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminSupabase } from '$lib/server/supabase';

/**
 * GET /api/user/profile?wallet=<address>
 * Returns the full user profile including aggregated stats.
 */
export const GET: RequestHandler = async ({ url }) => {
    const wallet = url.searchParams.get('wallet');

    if (!wallet) {
        return json({ error: 'wallet parameter is required' }, { status: 400 });
    }

    try {
        const adminSupabase = getAdminSupabase();

        // Fetch user profile
        const { data: userData, error: userError } = await adminSupabase
            .from('users')
            .select('wallet_address, username, display_name, bio, avatar_url, skills, email, cached_fair_score, cached_tier, created_at')
            .eq('wallet_address', wallet)
            .single();

        if (userError || !userData) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Aggregate stats from tasks (created by user)
        const { count: tasksPosted } = await adminSupabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('creator_wallet', wallet);

        // Tasks where user was the worker (via deliverables)
        const { data: deliverables } = await adminSupabase
            .from('deliverables')
            .select('task_id, submitted_at, tasks(title, budget_amount, status)')
            .eq('worker_wallet', wallet)
            .order('submitted_at', { ascending: false })
            .limit(10);

        // Applications by user
        const { data: applications } = await adminSupabase
            .from('applications')
            .select('task_id, status, created_at, tasks(title, budget_amount, status)')
            .eq('applicant_wallet', wallet)
            .order('created_at', { ascending: false })
            .limit(10);

        // Build stats
        const tasksCompleted = deliverables?.length ?? 0;
        const totalEarnings = deliverables?.reduce((sum, d: any) => {
            return sum + (d.tasks?.budget_amount ?? 0);
        }, 0) ?? 0;

        // Build recent activity from both deliverables and applications
        const activity: any[] = [];

        deliverables?.forEach((d: any) => {
            activity.push({
                id: d.task_id,
                action: 'completed',
                task: d.tasks?.title ?? 'Unknown task',
                amount: d.tasks?.budget_amount ?? 0,
                date: d.submitted_at
            });
        });

        applications?.forEach((a: any) => {
            activity.push({
                id: a.task_id,
                action: a.status === 'accepted' ? 'claimed' : a.status,
                task: a.tasks?.title ?? 'Unknown task',
                amount: a.tasks?.budget_amount ?? 0,
                date: a.created_at
            });
        });

        // Sort by date descending and take top 5
        activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const recentActivity = activity.slice(0, 5);

        return json({
            profile: {
                wallet_address: userData.wallet_address,
                username: userData.username,
                display_name: userData.display_name,
                bio: userData.bio,
                avatar_url: userData.avatar_url,
                skills: userData.skills ?? [],
                email: userData.email,
                cached_fair_score: userData.cached_fair_score,
                cached_tier: userData.cached_tier,
                created_at: userData.created_at
            },
            stats: {
                tasksCompleted,
                tasksPosted: tasksPosted ?? 0,
                earnings: totalEarnings,
                disputes: 0, // No disputes table yet
                successRate: tasksCompleted > 0 ? 100 : 0
            },
            recentActivity
        });
    } catch (err: any) {
        console.error('[user/profile] Server error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
