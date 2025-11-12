/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [angular()],
    test: {
        environment: 'jsdom',
        setupFiles: ['src/test.setup.ts'],
        globals: true,
        include: ['src/**/*.spec.ts']
    }
});
