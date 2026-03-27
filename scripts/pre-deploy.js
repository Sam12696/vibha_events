#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 * Run this before pushing to production
 * Usage: npm run pre-deploy
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function log(type, message) {
  const colors = {
    pass: "\x1b[32m✓",
    fail: "\x1b[31m✗",
    warn: "\x1b[33m⚠",
    info: "\x1b[36mℹ",
    reset: "\x1b[0m",
  };

  const icon = colors[type] || colors.info;
  console.log(`${icon} ${message}${colors.reset}`);

  if (type === "pass") checks.passed++;
  if (type === "fail") checks.failed++;
  if (type === "warn") checks.warnings++;
}

function checkFiles() {
  log("info", "\n📁 Checking critical files...");

  const criticalFiles = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    ".env.example",
    "src/App.tsx",
    "backend/src/server.ts",
  ];

  criticalFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      log("pass", `Found: ${file}`);
    } else {
      log("fail", `Missing: ${file}`);
    }
  });
}

function checkEnv() {
  log("info", "\n🔐 Checking environment setup...");

  if (fs.existsSync(".env.production")) {
    log("pass", "Production .env file exists");
  } else {
    log("warn", "Production .env file not found");
  }

  if (fs.existsSync(".env.example")) {
    log("pass", ".env.example exists");
  } else {
    log("fail", ".env.example missing");
  }
}

function checkDependencies() {
  log("info", "\n📦 Checking dependencies...");

  try {
    const packageJson = JSON.parse(
      fs.readFileSync("package.json", "utf-8")
    );
    const deps = packageJson.dependencies || {};

    const required = ["react", "express", "vite", "tailwindcss"];
    required.forEach((dep) => {
      if (deps[dep]) {
        log("pass", `${dep}: installed`);
      } else {
        log("warn", `${dep}: may be missing`);
      }
    });
  } catch (error) {
    log("fail", "Could not read package.json");
  }
}

function checkGit() {
  log("info", "\n🔗 Checking git status...");

  try {
    const status = execSync("git status --short", { encoding: "utf-8" });
    if (status.trim() === "") {
      log("pass", "No uncommitted changes");
    } else {
      log("warn", "Uncommitted changes detected:");
      console.log(status);
    }
  } catch (error) {
    log("fail", "Git not available");
  }
}

function checkBuild() {
  log("info", "\n🏗️  Checking if project builds...");

  try {
    log("info", "Running: npm run build");
    execSync("npm run build", { stdio: "inherit" });
    log("pass", "Build successful");
  } catch (error) {
    log("fail", "Build failed - fix errors before deploying");
  }
}

function checkTypes() {
  log("info", "\n🔍 Checking TypeScript types...");

  try {
    const output = execSync("npx tsc --noEmit", { encoding: "utf-8" });
    log("pass", "No type errors");
  } catch (error) {
    log("warn", "TypeScript errors found - review before deploying");
    console.log(error.stderr || error.stdout);
  }
}

function checkSecurity() {
  log("info", "\n🔒 Checking for security issues...");

  const dangerousPatterns = [
    { file: "src/**/*.tsx", pattern: /password|secret|api_key/gi },
    { file: "server.ts", pattern: /admin123/gi },
  ];

  let foundIssues = false;

  // Check for hardcoded secrets in common files
  const filesToCheck = [
    "src/App.tsx",
    "backend/src/server.ts",
    ".env.production",
  ];

  filesToCheck.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf-8");
      if (/password\s*=\s*["'].*["']|secret\s*=\s*["'].*["']/i.test(content)) {
        log("fail", `Hardcoded secrets found in ${file}`);
        foundIssues = true;
      }
    }
  });

  if (!foundIssues) {
    log("pass", "No hardcoded secrets detected");
  }
}

function printSummary() {
  log("info", "\n" + "=".repeat(50));
  log("info", "📋 PRE-DEPLOYMENT CHECKLIST SUMMARY");
  log("info", "=".repeat(50));

  console.log(`
Passed:  ${checks.passed}
Failed:  ${checks.failed}
Warnings: ${checks.warnings}
`);

  if (checks.failed > 0) {
    log("fail", "❌ FIX ERRORS BEFORE DEPLOYING");
    process.exit(1);
  }

  if (checks.warnings > 0) {
    log("warn", "⚠️  REVIEW WARNINGS BEFORE DEPLOYING");
    console.log("Proceed with caution: npm run deploy");
  } else {
    log("pass", "✅ READY FOR DEPLOYMENT");
    console.log("Next step: npm run deploy");
  }
}

// Run all checks
console.log("\n🚀 Starting pre-deployment checks...\n");
checkFiles();
checkEnv();
checkDependencies();
checkGit();
checkTypes();
checkSecurity();
checkBuild();
printSummary();
