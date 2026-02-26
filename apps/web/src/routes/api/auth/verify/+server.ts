import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import nacl from 'tweetnacl';
import { getAdminSupabase } from '$lib/server/supabase';

/**
 * Lightweight SIWS verification — NO JWT minting.
 * Just verifies the wallet signature is valid and upserts the user in the DB.
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { publicKey, signature, message } = await request.json();

        if (!publicKey || !signature || !message) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate message content
        if (!message.includes('Sign in to FairHire')) {
            return json({ error: 'Invalid message content' }, { status: 401 });
        }

        // Decode the public key from base58
        const publicKeyBytes = base58Decode(publicKey);
        const signatureBytes = new Uint8Array(signature);
        const messageBytes = new TextEncoder().encode(message);

        // Verify the signature using tweetnacl
        const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

        if (!isValid) {
            return json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Upsert the user row server-side using the service role key
        // This bypasses RLS so the row exists before client-side updates
        try {
            const adminSupabase = getAdminSupabase();
            const { error } = await adminSupabase
                .from('users')
                .upsert(
                    { wallet_address: publicKey, updated_at: new Date().toISOString() },
                    { onConflict: 'wallet_address' }
                );
            if (error) console.error('User upsert failed:', error.message);
        } catch (e) {
            console.error('Admin Supabase error during user upsert:', e);
        }

        return json({
            success: true,
            wallet_address: publicKey
        });
    } catch (err: any) {
        console.error('SIWS verification error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

/**
 * Simple base58 decoder (avoids needing bs58 package on server).
 * Solana public keys are 32 bytes encoded in base58.
 */
function base58Decode(str: string): Uint8Array {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = 58;
    const bytes: number[] = [0];
    for (const char of str) {
        const value = ALPHABET.indexOf(char);
        if (value < 0) throw new Error(`Invalid base58 character: ${char}`);
        let carry = value;
        for (let j = 0; j < bytes.length; j++) {
            carry += bytes[j] * BASE;
            bytes[j] = carry & 0xff;
            carry >>= 8;
        }
        while (carry > 0) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }
    // Handle leading '1's
    for (const char of str) {
        if (char !== '1') break;
        bytes.push(0);
    }
    return new Uint8Array(bytes.reverse());
}
