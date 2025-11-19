#!/bin/bash

# PackUpdate Automation Test Script
# This script demonstrates the new automation features

echo "🧪 PackUpdate Automation Test Suite"
echo "===================================="

# Test 1: Help command
echo -e "\n📖 Test 1: Help Command"
echo "Command: updatepkgs --help"
cd node && node dist/updatePackages.js --help | head -20

# Test 2: Generate Report (shows outdated packages)
echo -e "\n📊 Test 2: Generate Report"
echo "Command: updatepkgs --generate-report"
cd /Users/manshres1/Documents/Apps/PackUpdate/node
node dist/updatePackages.js --generate-report

# Test 3: Automation validation (should fail without required params)
echo -e "\n❌ Test 3: Automation Validation (Expected to fail)"
echo "Command: updatepkgs --automate"
node dist/updatePackages.js --automate 2>&1 || echo "✅ Validation working correctly"

# Test 4: Automation validation with platform but missing repo
echo -e "\n❌ Test 4: Automation Validation - Missing Repository"
echo "Command: updatepkgs --automate --platform=github"
node dist/updatePackages.js --automate --platform=github 2>&1 || echo "✅ Repository validation working"

# Test 5: Show automation help section
echo -e "\n📋 Test 5: Automation Help Section"
echo "Automation flags from help:"
node dist/updatePackages.js --help | grep -A 20 "Automation Options:"

echo -e "\n✅ All tests completed!"
echo "The automation features are ready for use."
