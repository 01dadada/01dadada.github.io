import { copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
    copyFileSync(indexPath, notFoundPath);
    console.log('✓ Successfully copied index.html to 404.html');
} catch (error) {
    console.error('✗ Failed to copy index.html to 404.html:', error.message);
    process.exit(1);
}

