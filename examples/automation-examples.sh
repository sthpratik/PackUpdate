#!/bin/bash

# PackUpdate Automation Examples
# This script demonstrates various automation scenarios

echo "🚀 PackUpdate Automation Examples"
echo "================================="

# Set up environment variables (optional)
export PACKUPDATE_BITBUCKET_TOKEN="your-access-token"
export PACKUPDATE_BITBUCKET_ENDPOINT="https://your-bitbucket-server.com"
export PACKUPDATE_REVIEWERS="john.doe,jane.smith"

echo -e "\n📋 Available Examples:"
echo "1. Bitbucket Server - Basic automation"
echo "2. Bitbucket Server - With custom branch and reviewers"
echo "3. GitHub - SSH-based automation"
echo "4. Combined with existing features"
echo "5. Environment variable usage"
echo "6. Multiple repository processing"

echo -e "\n" && read -p "Select example (1-6) or 'all' to show all: " choice

case $choice in
  1|all)
    echo -e "\n🔹 Example 1: Bitbucket Server - Basic Automation"
    echo "Command:"
    echo "updatepkgs --automate \\"
    echo "  --platform bitbucket-server \\"
    echo "  --endpoint https://your-bitbucket-server.com \\"
    echo "  --token your-access-token \\"
    echo "  --repository WORKSPACE/repository \\"
    echo "  --ticket-no JIRA-456"
    echo ""
    echo "This will:"
    echo "- Clone WORKSPACE/repository repository"
    echo "- Create feature branch from develop (or master)"
    echo "- Update packages"
    echo "- Commit with JIRA-456 ticket reference"
    echo "- Create pull request with detailed logs"
    ;&
  
  2|all)
    echo -e "\n🔹 Example 2: Bitbucket Server - Custom Branch & Reviewers"
    echo "Command:"
    echo "updatepkgs --automate \\"
    echo "  --platform bitbucket-server \\"
    echo "  --endpoint https://your-bitbucket-server.com \\"
    echo "  --token your-access-token \\"
    echo "  --repository WORKSPACE/webapp \\"
    echo "  --base-branch main \\"
    echo "  --feature-branch feature/security-updates-nov2024 \\"
    echo "  --ticket-no PROJ-789 \\"
    echo "  --reviewers john.doe,jane.smith,security.team"
    echo ""
    echo "This will:"
    echo "- Use 'main' as base branch instead of develop"
    echo "- Create custom-named feature branch"
    echo "- Assign multiple reviewers to PR"
    ;&

  3|all)
    echo -e "\n🔹 Example 3: GitHub - SSH-based Automation"
    echo "Command:"
    echo "updatepkgs --automate \\"
    echo "  --platform github \\"
    echo "  --repository myorg/myapp \\"
    echo "  --ticket-no JIRA-123 \\"
    echo "  --minor-only"
    echo ""
    echo "This will:"
    echo "- Use SSH authentication (requires SSH key setup)"
    echo "- Only update minor versions (safer updates)"
    echo "- Push branch (manual PR creation for now)"
    ;&

  4|all)
    echo -e "\n🔹 Example 4: Combined with Existing Features"
    echo "Command:"
    echo "updatepkgs --automate \\"
    echo "  --platform bitbucket-server \\"
    echo "  --repository WORKSPACE/api \\"
    echo "  --ticket-no MAINT-456 \\"
    echo "  --safe \\"
    echo "  --pass=3 \\"
    echo "  --remove-unused \\"
    echo "  --dedupe-packages \\"
    echo "  --update-version=minor \\"
    echo "  --quiet"
    echo ""
    echo "This will:"
    echo "- Run in safe mode (test before applying)"
    echo "- Execute 3 update passes"
    echo "- Remove unused dependencies"
    echo "- Deduplicate packages"
    echo "- Bump minor version after updates"
    echo "- Run quietly (minimal output)"
    ;&

  5|all)
    echo -e "\n🔹 Example 5: Using Environment Variables"
    echo "Setup:"
    echo "export PACKUPDATE_BITBUCKET_TOKEN='your-access-token'"
    echo "export PACKUPDATE_BITBUCKET_ENDPOINT='https://your-bitbucket-server.com'"
    echo "export PACKUPDATE_REVIEWERS='john.doe,jane.smith'"
    echo ""
    echo "Simplified Command:"
    echo "updatepkgs --automate \\"
    echo "  --platform bitbucket-server \\"
    echo "  --repository WORKSPACE/repository \\"
    echo "  --ticket-no JIRA-456"
    echo ""
    echo "Benefits:"
    echo "- No need to repeat common parameters"
    echo "- Secure token management"
    echo "- Consistent reviewer assignments"
    ;&

  6|all)
    echo -e "\n🔹 Example 6: Multiple Repository Processing"
    echo "Parallel execution (different terminals):"
    echo ""
    echo "Terminal 1:"
    echo "updatepkgs --automate --platform github --repository myorg/frontend --ticket-no EPIC-100 &"
    echo ""
    echo "Terminal 2:"
    echo "updatepkgs --automate --platform github --repository myorg/backend --ticket-no EPIC-100 &"
    echo ""
    echo "Terminal 3:"
    echo "updatepkgs --automate --platform bitbucket-server --repository WORKSPACE/mobile --ticket-no EPIC-100 &"
    echo ""
    echo "Each creates unique workspace:"
    echo "temp-updates/"
    echo "├── myorg_frontend_2024-11-19T16-26-35/"
    echo "├── myorg_backend_2024-11-19T16-27-12/"
    echo "└── workspace_mobile_2024-11-19T16-28-45/"
    ;;
esac

if [ "$choice" != "all" ]; then
  echo -e "\n💡 Tips:"
  echo "- Always test with --safe mode first"
  echo "- Use --generate-report to preview changes"
  echo "- Set up SSH keys for GitHub/GitLab"
  echo "- Use environment variables for tokens"
  echo "- Review generated PRs before merging"
fi

echo -e "\n📚 For more examples and documentation:"
echo "https://sthpratik.github.io/PackUpdate/#/automation"

echo -e "\n✅ Ready to automate your package updates!"
