import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminSupabase } from '$lib/server/supabase';

/**
 * POST /api/auth/send-otp
 * Sends a 6-digit OTP code to the user's email.
 * Uses the admin Supabase client to send OTP.
 *
 * IMPORTANT: To prevent magic links from appearing in the email,
 * edit the email template in Supabase Dashboard:
 *   Authentication → Email Templates → Magic Link
 *   Remove {{ .ConfirmationURL }} and only keep {{ .Token }}
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return json({ error: 'Valid email is required' }, { status: 400 });
        }

        const adminSupabase = getAdminSupabase();

        const { error } = await adminSupabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true
            }
        });

        if (error) {
            console.error('[send-otp] Error:', error);
            return json({ error: error.message }, { status: 500 });
        }

        return json({ success: true });
    } catch (err: any) {
        console.error('[send-otp] Server error:', err);
        return json({ error: 'Failed to send verification code' }, { status: 500 });
    }
};
