import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				fallback: 'index.html',
				strict: false
			})
		}),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Mahalla — Karrierë futbollistike',
				short_name: 'Mahalla',
				description: 'Simulues karriere futbollistike kosovare. Nga lagjja te legjenda.',
				theme_color: '#0f1419',
				background_color: '#0f1419',
				display: 'standalone',
				lang: 'sq',
				start_url: '/',
				icons: [
					{
						src: '/icons/icon.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/basemaps\.cartocdn\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'mahalla-map-tiles',
							expiration: {
								maxEntries: 250,
								maxAgeSeconds: 60 * 60 * 24 * 30
							},
							cacheableResponse: { statuses: [0, 200] }
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'mahalla-fonts',
							expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
						}
					}
				]
			}
		})
	]
});
