import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return json({ success: false, message: 'Invalid email address' }, { status: 400 });
        }

        const { error } = await supabase
            .from('waitlist')
            .insert([{ email }]);

        if (error) {
            if (error.code === '23505') { // Unique violation
                return json({ success: true, message: 'You are already on the list!' }); // Treat as success to user
            }
            console.error('Supabase error:', error);
            return json({ success: false, message: 'Failed to join waitlist. Please try again.' }, { status: 500 });
        }

        return json({ success: true, message: 'Welcome to the waitlist!' });

    } catch (err) {
        console.error('Server error:', err);
        return json({ success: false, message: 'An internal error occurred.' }, { status: 500 });
    }
};
