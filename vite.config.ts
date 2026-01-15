
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: __dirname is not available in ESM context by default. 
// We derive it using fileURLToPath from import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Fix: Ensure the API key is sourced from process.env.API_KEY as per the @google/genai guidelines.
        // This makes the environment variable available to the client-side code.
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
