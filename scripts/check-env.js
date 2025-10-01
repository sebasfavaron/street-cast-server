#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const readline = require('readline');

const isProduction = process.env.NODE_ENV === 'production';

// Only show prompt if in production environment
if (isProduction) {
  console.log(
    '🚨 WARNING: You are about to run a command in PRODUCTION environment!'
  );
  console.log('');
  console.log('This could affect:');
  console.log('• Production database');
  console.log('• Live user data');
  console.log('• Production application');
  console.log('');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('✅ Proceeding with production command...');
      rl.close();
      process.exit(0); // Allow command to continue
    } else {
      console.log('❌ Command cancelled for safety');
      rl.close();
      process.exit(1); // Stop the command
    }
  });
} else {
  // Invisible for non-production environments
  process.exit(0); // Allow command to continue silently
}
