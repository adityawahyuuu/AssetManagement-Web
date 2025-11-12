#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Ensures all requirements are met before deployment to Vercel
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify package.json exists and has required scripts
log.section('1. Checking package.json configuration...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const requiredScripts = ['dev', 'build', 'start', 'test'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      log.success(`Script "${script}" is defined`);
    } else {
      log.error(`Missing required script: "${script}"`);
      hasErrors = true;
    }
  });

  // Check for test scripts
  if (packageJson.scripts['test:ci']) {
    log.success('CI test script is configured');
  } else {
    log.warning('CI test script not found - recommended for deployment');
    hasWarnings = true;
  }
} catch (error) {
  log.error(`Failed to read package.json: ${error.message}`);
  hasErrors = true;
}

// Check 2: Verify environment configuration
log.section('2. Checking environment configuration...');
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES',
  'NEXT_PUBLIC_DEFAULT_PAGE_SIZE',
];

// Check if .env.example exists
if (fs.existsSync('.env.example')) {
  log.success('.env.example file exists');

  const envExample = fs.readFileSync('.env.example', 'utf8');
  requiredEnvVars.forEach(varName => {
    if (envExample.includes(varName)) {
      log.success(`${varName} is documented in .env.example`);
    } else {
      log.warning(`${varName} not found in .env.example`);
      hasWarnings = true;
    }
  });
} else {
  log.warning('.env.example file not found');
  hasWarnings = true;
}

// Check if .env.production example exists
if (fs.existsSync('.env.production')) {
  log.success('.env.production file exists');
} else {
  log.warning('.env.production file not found');
  hasWarnings = true;
}

// Check 3: Verify Next.js configuration
log.section('3. Checking Next.js configuration...');
if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
  log.success('Next.js config file exists');
} else {
  log.warning('No Next.js config file found (using defaults)');
  hasWarnings = true;
}

// Check 4: Verify Vercel configuration
log.section('4. Checking Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  log.success('vercel.json file exists');

  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

    if (vercelConfig.buildCommand) {
      log.success(`Build command configured: ${vercelConfig.buildCommand}`);
    }

    if (vercelConfig.framework === 'nextjs') {
      log.success('Framework set to Next.js');
    }

    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
      log.success('Security headers configured');
    }
  } catch (error) {
    log.error(`Failed to parse vercel.json: ${error.message}`);
    hasErrors = true;
  }
} else {
  log.warning('vercel.json not found (using Vercel defaults)');
  hasWarnings = true;
}

// Check 5: Verify TypeScript configuration
log.section('5. Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  log.success('tsconfig.json exists');

  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsconfig.compilerOptions?.strict) {
      log.success('TypeScript strict mode enabled');
    } else {
      log.warning('TypeScript strict mode not enabled');
      hasWarnings = true;
    }
  } catch (error) {
    log.error(`Failed to parse tsconfig.json: ${error.message}`);
    hasErrors = true;
  }
} else {
  log.error('tsconfig.json not found');
  hasErrors = true;
}

// Check 6: Verify test configuration
log.section('6. Checking test configuration...');
if (fs.existsSync('jest.config.js')) {
  log.success('Jest configuration exists');
} else {
  log.warning('Jest configuration not found');
  hasWarnings = true;
}

if (fs.existsSync('__tests__')) {
  const testFiles = fs.readdirSync('__tests__', { recursive: true })
    .filter(file => file.endsWith('.test.ts') || file.endsWith('.test.tsx'));

  if (testFiles.length > 0) {
    log.success(`Found ${testFiles.length} test files`);
  } else {
    log.warning('No test files found in __tests__ directory');
    hasWarnings = true;
  }
} else {
  log.warning('__tests__ directory not found');
  hasWarnings = true;
}

// Check 7: Verify critical files exist
log.section('7. Checking critical files...');
const criticalFiles = [
  'lib/constants.ts',
  'lib/api.ts',
  'lib/auth.ts',
  'app/layout.tsx',
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log.success(`${file} exists`);
  } else {
    log.error(`Missing critical file: ${file}`);
    hasErrors = true;
  }
});

// Check 8: Verify no sensitive data in repository
log.section('8. Checking for sensitive data...');
const sensitivePatterns = [
  '.env.local',
  '.env.development.local',
  '.env.production.local',
];

let foundSensitive = false;
sensitivePatterns.forEach(pattern => {
  if (fs.existsSync(pattern)) {
    log.error(`Sensitive file found in repository: ${pattern}`);
    foundSensitive = true;
    hasErrors = true;
  }
});

if (!foundSensitive) {
  log.success('No sensitive files found in repository');
}

// Check 9: Verify .gitignore
log.section('9. Checking .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredIgnores = ['.env*', 'node_modules', '.next'];

  let allPresent = true;
  requiredIgnores.forEach(pattern => {
    if (gitignore.includes(pattern)) {
      log.success(`${pattern} is ignored`);
    } else {
      log.error(`${pattern} not found in .gitignore`);
      allPresent = false;
      hasErrors = true;
    }
  });
} else {
  log.error('.gitignore file not found');
  hasErrors = true;
}

// Check 10: Verify API routes
log.section('10. Checking API routes...');
const apiRoutesDir = 'app/api';
if (fs.existsSync(apiRoutesDir)) {
  const routeFiles = fs.readdirSync(apiRoutesDir, { recursive: true })
    .filter(file => file.endsWith('route.ts'));

  if (routeFiles.length > 0) {
    log.success(`Found ${routeFiles.length} API route files`);
  } else {
    log.warning('No API route files found');
    hasWarnings = true;
  }
} else {
  log.error(`API routes directory not found: ${apiRoutesDir}`);
  hasErrors = true;
}

// Summary
log.section('Pre-deployment Check Summary');
console.log('');

if (hasErrors) {
  log.error('❌ Pre-deployment check FAILED');
  log.error('Please fix the errors above before deploying');
  process.exit(1);
} else if (hasWarnings) {
  log.warning('⚠️  Pre-deployment check completed with warnings');
  log.info('Review the warnings above - deployment can proceed but improvements are recommended');
  process.exit(0);
} else {
  log.success('✅ All pre-deployment checks passed!');
  log.success('Your application is ready for deployment to Vercel');
  process.exit(0);
}
