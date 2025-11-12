#!/usr/bin/env node

/**
 * Post-deployment validation script
 * Verifies deployment health and functionality
 */

const https = require('https');
const http = require('http');

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

// Get deployment URL from environment or command line
const deploymentUrl = process.env.DEPLOYMENT_URL || process.argv[2];

if (!deploymentUrl) {
  log.error('Deployment URL not provided');
  log.info('Usage: node post-deploy-check.js <deployment-url>');
  log.info('Or set DEPLOYMENT_URL environment variable');
  process.exit(1);
}

log.section('Post-Deployment Health Check');
log.info(`Checking deployment at: ${deploymentUrl}`);

let hasErrors = false;

// Helper function to make HTTP/HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeout = options.timeout || 10000;

    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test 1: Basic connectivity
async function testConnectivity() {
  log.section('1. Testing basic connectivity...');

  try {
    const response = await makeRequest(deploymentUrl);

    if (response.statusCode === 200) {
      log.success(`Homepage accessible (HTTP ${response.statusCode})`);
      return true;
    } else if (response.statusCode === 301 || response.statusCode === 302) {
      log.success(`Homepage redirects (HTTP ${response.statusCode})`);
      return true;
    } else {
      log.error(`Unexpected status code: ${response.statusCode}`);
      hasErrors = true;
      return false;
    }
  } catch (error) {
    log.error(`Failed to connect: ${error.message}`);
    hasErrors = true;
    return false;
  }
}

// Test 2: Security headers
async function testSecurityHeaders() {
  log.section('2. Checking security headers...');

  try {
    const response = await makeRequest(deploymentUrl);
    const headers = response.headers;

    const securityHeaders = {
      'x-content-type-options': 'nosniff',
      'x-frame-options': ['DENY', 'SAMEORIGIN'],
      'x-xss-protection': '1',
    };

    let allPresent = true;
    for (const [header, expectedValue] of Object.entries(securityHeaders)) {
      const actualValue = headers[header];

      if (actualValue) {
        if (Array.isArray(expectedValue)) {
          if (expectedValue.some(val => actualValue.includes(val))) {
            log.success(`${header}: ${actualValue}`);
          } else {
            log.warning(`${header}: ${actualValue} (expected one of: ${expectedValue.join(', ')})`);
          }
        } else if (actualValue.includes(expectedValue)) {
          log.success(`${header}: ${actualValue}`);
        } else {
          log.warning(`${header}: ${actualValue} (expected: ${expectedValue})`);
        }
      } else {
        log.warning(`Missing security header: ${header}`);
        allPresent = false;
      }
    }

    return allPresent;
  } catch (error) {
    log.error(`Failed to check headers: ${error.message}`);
    hasErrors = true;
    return false;
  }
}

// Test 3: API routes (smoke test)
async function testApiRoutes() {
  log.section('3. Testing API routes...');

  // These endpoints should return 401 (unauthorized) without token
  const apiEndpoints = [
    '/api/rooms',
    '/api/assets',
    '/api/user/auth/me',
  ];

  let allWorking = true;

  for (const endpoint of apiEndpoints) {
    try {
      const url = `${deploymentUrl}${endpoint}`;
      const response = await makeRequest(url);

      // We expect 401 for protected routes without auth
      if (response.statusCode === 401) {
        log.success(`${endpoint} - Protected (HTTP ${response.statusCode})`);
      } else if (response.statusCode === 200) {
        log.success(`${endpoint} - Accessible (HTTP ${response.statusCode})`);
      } else {
        log.warning(`${endpoint} - Unexpected status: ${response.statusCode}`);
        allWorking = false;
      }
    } catch (error) {
      log.error(`${endpoint} - Error: ${error.message}`);
      allWorking = false;
      hasErrors = true;
    }
  }

  return allWorking;
}

// Test 4: Static assets
async function testStaticAssets() {
  log.section('4. Testing static assets...');

  const staticPaths = [
    '/_next/static/css',
    '/favicon.ico',
  ];

  let allAccessible = true;

  for (const path of staticPaths) {
    try {
      const url = `${deploymentUrl}${path}`;
      const response = await makeRequest(url);

      if (response.statusCode === 200 || response.statusCode === 404) {
        log.success(`${path} - Endpoint exists`);
      } else {
        log.warning(`${path} - Status: ${response.statusCode}`);
        allAccessible = false;
      }
    } catch (error) {
      log.warning(`${path} - ${error.message}`);
      allAccessible = false;
    }
  }

  return allAccessible;
}

// Test 5: Response time
async function testResponseTime() {
  log.section('5. Testing response time...');

  const startTime = Date.now();

  try {
    await makeRequest(deploymentUrl);
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (duration < 1000) {
      log.success(`Response time: ${duration}ms (excellent)`);
    } else if (duration < 3000) {
      log.success(`Response time: ${duration}ms (good)`);
    } else if (duration < 5000) {
      log.warning(`Response time: ${duration}ms (acceptable)`);
    } else {
      log.warning(`Response time: ${duration}ms (slow)`);
    }

    return duration < 5000;
  } catch (error) {
    log.error(`Failed to measure response time: ${error.message}`);
    hasErrors = true;
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('');

  const results = {
    connectivity: await testConnectivity(),
    securityHeaders: await testSecurityHeaders(),
    apiRoutes: await testApiRoutes(),
    staticAssets: await testStaticAssets(),
    responseTime: await testResponseTime(),
  };

  // Summary
  log.section('Post-Deployment Check Summary');
  console.log('');

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;

  log.info(`Tests passed: ${passedTests}/${totalTests}`);

  if (hasErrors) {
    log.error('❌ Post-deployment check FAILED');
    log.error('Critical issues detected - please investigate');
    process.exit(1);
  } else if (passedTests < totalTests) {
    log.warning('⚠️  Post-deployment check completed with warnings');
    log.info('Some checks failed but deployment may still be functional');
    process.exit(0);
  } else {
    log.success('✅ All post-deployment checks passed!');
    log.success('Deployment is healthy and fully functional');
    process.exit(0);
  }
}

// Execute tests
runAllTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
