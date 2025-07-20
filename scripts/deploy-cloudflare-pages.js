#!/usr/bin/env node

/**
 * Deploy to Cloudflare Pages with automatic project creation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PROJECT_NAME = 'courses-careers-com';
const BUILD_OUTPUT_DIR = 'dist';

// Check required environment variables
if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ Missing required environment variables: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID');
  process.exit(1);
}

// Check if build directory exists
if (!fs.existsSync(BUILD_OUTPUT_DIR)) {
  console.error(`❌ Build directory ${BUILD_OUTPUT_DIR} not found. Run 'npm run build' first.`);
  process.exit(1);
}

async function checkProjectExists() {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
      {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Error checking project:', error);
    return false;
  }
}

async function createProject() {
  console.log(`📦 Creating Cloudflare Pages project: ${PROJECT_NAME}`);
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: PROJECT_NAME,
          production_branch: 'main',
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      if (data.errors?.[0]?.code === 8000007) {
        console.log('✅ Project already exists');
        return true;
      }
      throw new Error(`Failed to create project: ${JSON.stringify(data)}`);
    }
    
    console.log('✅ Project created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating project:', error);
    return false;
  }
}

async function deployWithWrangler() {
  console.log('🚀 Deploying to Cloudflare Pages...');
  
  try {
    // Install wrangler if not already installed
    try {
      execSync('npx wrangler --version', { stdio: 'ignore' });
    } catch {
      console.log('📦 Installing Wrangler...');
      execSync('npm install -D wrangler@3', { stdio: 'inherit' });
    }

    // Deploy using wrangler
    const command = `npx wrangler pages deploy ${BUILD_OUTPUT_DIR} --project-name=${PROJECT_NAME}`;
    
    console.log(`Running: ${command}`);
    execSync(command, {
      stdio: 'inherit',
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID,
      },
    });
    
    console.log('✅ Deployment successful!');
    console.log(`🌐 Your site is available at: https://${PROJECT_NAME}.pages.dev`);
    
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    return false;
  }
}

async function configureDomains() {
  console.log('🌐 Configuring custom domains...');
  
  const domains = ['courses-careers.com', 'www.courses-careers.com'];
  
  for (const domain of domains) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: domain }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Domain ${domain} configured`);
      } else if (data.errors?.[0]?.code === 8000016) {
        console.log(`✅ Domain ${domain} already configured`);
      } else {
        console.warn(`⚠️  Failed to configure domain ${domain}: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error(`❌ Error configuring domain ${domain}:`, error);
    }
  }
}

async function main() {
  console.log('🔧 Starting Cloudflare Pages deployment...');
  console.log(`📁 Project: ${PROJECT_NAME}`);
  console.log(`📂 Build directory: ${BUILD_OUTPUT_DIR}`);
  
  // Check if project exists
  const projectExists = await checkProjectExists();
  
  if (!projectExists) {
    // Create project if it doesn't exist
    const created = await createProject();
    if (!created) {
      console.error('❌ Failed to create project. Trying direct deployment anyway...');
    }
  }
  
  // Deploy with wrangler
  const deployed = await deployWithWrangler();
  
  if (deployed) {
    // Configure custom domains
    await configureDomains();
    
    console.log('\n🎉 Deployment complete!');
    console.log('📍 URLs:');
    console.log(`   - https://${PROJECT_NAME}.pages.dev`);
    console.log('   - https://courses-careers.com (after DNS propagation)');
    console.log('   - https://www.courses-careers.com (after DNS propagation)');
  } else {
    process.exit(1);
  }
}

// Run the deployment
main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});