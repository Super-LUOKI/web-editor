import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({
            target: 'react', autoCodeSplitting: true,
            routesDirectory: './src/route',
            generatedRouteTree: './src/generate/routeTree.gen.ts'
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5100,
    },
})
