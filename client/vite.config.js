import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            manifest: {
                name: 'Scheme.AI — Find Government Schemes',
                short_name: 'Scheme.AI',
                description: 'AI-powered government scheme discovery for Indian citizens.',
                theme_color: '#f7f7f7',
                background_color: '#f7f7f7',
                display: 'standalone',
                icons: [
                    {
                        src: 'logo.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5002',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
