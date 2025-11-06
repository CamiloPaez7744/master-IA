import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    globals: true,
  },
  resolve: {
    alias: {
        '@domain': join(__dirname, 'src/domain'),
        '@application': join(__dirname, 'src/application'),
        '@infrastructure': join(__dirname, 'src/infrastructure'),
        '@composition': join(__dirname, 'src/composition'),
        '@shared': join(__dirname, 'src/shared'),
    }
  }
});
