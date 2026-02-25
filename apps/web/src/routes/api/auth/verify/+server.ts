import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
// If tweetnacl isn't available, we will install it shortly.
import nacl from 'tweetnacl';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { publicKey, signature, message } = await request.json();

        if (!publicKey || !signature || !message) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Parse public key and signature
        let rPublicKey: PublicKey;
        let rSignature: Uint8Array;
        let rMessage: Uint8Array;

        try {
            rPublicKey = new PublicKey(publicKey);
            rSignature = bs58.decode(signature);
            // The message should be the exact Uint8Array or string that was signed
            rMessage = new TextEncoder().encode(message);
        } catch (e) {
            return json({ error: 'Invalid public key, signature, or message format' }, { status: 400 });
        }

        // Verify the signature
        const isValid = nacl.sign.detached.verify(
            rMessage,
            rSignature,
            rPublicKey.toBytes()
        );

        if (!isValid) {
            return json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Verify the message content (e.g. domain, nonce, timestamp) in a real prod app to prevent replay attacks.
        // For simplicity, we ensure the message at least mentions the correct action.
        if (!message.includes('Sign in to FairHire')) {
            return json({ error: 'Invalid message content' }, { status: 401 });
        }

        // The JWT Secret from Supabase (required to mint valid JWTs for your Supabase project)
        const jwtSecret = env.SUPABASE_JWT_SECRET;

        if (!jwtSecret) {
            console.error('SUPABASE_JWT_SECRET is missing from environment variables');
            return json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Mint custom Supabase JWT
        // The payload must match what Supabase expects for Row Level Security
        const payload = {
            aud: 'authenticated',
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 1 week
            sub: rPublicKey.toBase58(),
            role: 'authenticated',
            app_metadata: {
                provider: 'solana'
            }
        };

        const token = jwt.sign(payload, jwtSecret);

        return json({
            success: true,
            token,
            user: {
                wallet_address: rPublicKey.toBase58()
            }
        });

    } catch (err: any) {
        console.error('SIWS verification error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
