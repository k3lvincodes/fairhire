import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			include: ['buffer'],
			globals: {
				Buffer: true,
			},
		})
	],
	define: {
		'process.env.NODE_DEBUG': false,
		'global': 'globalThis'
	},
	optimizeDeps: {
		include: ['buffer', '@solana/web3.js']
	}
});
