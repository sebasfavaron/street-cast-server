#!/usr/bin/env node

/**
 * Development server script with PORT support
 */

const { spawn } = require('child_process');

// Load environment variables
require('dotenv').config();

// Get PORT from environment or default to 3050
const port = process.env.PORT || 3050;

// Check if --dry-run flag is passed
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log(`🚀 Would start development server on port ${port}...`);
  console.log(`Command: npx next dev --turbopack -p ${port}`);
  process.exit(0);
}

console.log(`🚀 Starting development server on port ${port}...`);

// Spawn Next.js dev server
const child = spawn(
  'npx',
  ['next', 'dev', '--turbopack', '-p', port.toString()],
  {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: port,
    },
  }
);

child.on('error', (error) => {
  console.error('❌ Error starting development server:', error);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  child.kill('SIGINT');
});
