#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates required environment variables for the application
 */

const requiredEnvVars = [
  // Add required environment variables here
  // 'DATABASE_URL',
  // 'API_KEY',
];

const optionalEnvVars = [
  'LOCAL_SEARCH_ENGINE',
  'LOCAL_INDEXES',
  'NODE_ENV',
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;

// Check required environment variables
console.log('📋 Required environment variables:');
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.log(`❌ ${envVar}: Missing (required)`);
    hasErrors = true;
  } else {
    console.log(`✅ ${envVar}: Set`);
  }
});

// Check optional environment variables
console.log('\n📝 Optional environment variables:');
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Set (${process.env[envVar]})`);
  } else {
    console.log(`⚠️  ${envVar}: Not set (optional)`);
  }
});

if (hasErrors) {
  console.log('\n❌ Environment validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ Environment validation passed!');
}
