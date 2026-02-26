import { getAdminSupabase } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const supabase = getAdminSupabase();

    // Fetch tasks descending by creation time.
    // We join the users table to get the creator's username or wallet address.
    const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
            id,
            title,
            description,
            budget_amount,
            settlement_type,
            deadline,
            min_score,
            status,
            users (
                wallet_address,
                username,
                display_name
            )
        `)
        .eq('status', 'draft') // Only show available tasks
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        return { tasks: [] };
    }

    // Map DB output to match the format the Svelte component expects
    const tasks = tasksData.map((task: any) => {
        // Find best display name for poster
        const posterUser = task.users;
        const poster = posterUser?.display_name || posterUser?.username || posterUser?.wallet_address || 'Unknown';

        return {
            id: task.id,
            title: task.title,
            price: Number(task.budget_amount) || 0,
            settlement: task.settlement_type || 'escrow',
            deadline: task.deadline ? formatTimeRemaining(task.deadline) : 'No deadline',
            minScore: task.min_score || 0,
            poster
        };
    });

    return { tasks };
};

// Helper to format ISO strings to short representations (e.g. '2d', '5h')
function formatTimeRemaining(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return '<1h';
}
