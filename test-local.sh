#!/bin/bash

echo "=============================================="
echo "🧪 TRIBAL APP - LOCAL TESTING"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "\n${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm installed: $(npm --version)${NC}"

# Install dependencies for Lambda functions
echo -e "\n${YELLOW}Installing Lambda dependencies...${NC}"
for lambda_dir in backend/lambda/*/; do
    if [ -f "${lambda_dir}package.json" ]; then
        echo "📦 Installing dependencies for $(basename $lambda_dir)"
        (cd "$lambda_dir" && npm install --silent) || {
            echo -e "${RED}❌ Failed to install dependencies for $(basename $lambda_dir)${NC}"
            exit 1
        }
    fi
done
echo -e "${GREEN}✅ Lambda dependencies installed${NC}"

# Validate JSON files
echo -e "\n${YELLOW}Validating JSON files...${NC}"
json_valid=true
for json_file in $(find . -name "*.json" -not -path "*/node_modules/*"); do
    if ! node -e "JSON.parse(require('fs').readFileSync('$json_file', 'utf8'))" 2>/dev/null; then
        echo -e "${RED}❌ Invalid JSON: $json_file${NC}"
        json_valid=false
    fi
done

if [ "$json_valid" = true ]; then
    echo -e "${GREEN}✅ All JSON files are valid${NC}"
else
    echo -e "${RED}❌ Some JSON files are invalid${NC}"
    exit 1
fi

# Validate JavaScript syntax
echo -e "\n${YELLOW}Validating JavaScript syntax...${NC}"
js_valid=true
for js_file in $(find backend mobile-app -name "*.js" -not -path "*/node_modules/*"); do
    if ! node --check "$js_file" 2>/dev/null; then
        echo -e "${RED}❌ Syntax error in: $js_file${NC}"
        js_valid=false
    fi
done

if [ "$js_valid" = true ]; then
    echo -e "${GREEN}✅ All JavaScript files have valid syntax${NC}"
else
    echo -e "${RED}❌ Some JavaScript files have syntax errors${NC}"
    exit 1
fi

# Run local tests
echo -e "\n${YELLOW}Running local tests...${NC}"
cd local-testing
node run-all-tests.js

test_result=$?

if [ $test_result -eq 0 ]; then
    echo -e "\n${GREEN}=============================================="
    echo "✅ ALL TESTS PASSED!"
    echo "🚀 Ready to push to GitHub and deploy to AWS"
    echo "==============================================${NC}\n"
    exit 0
else
    echo -e "\n${RED}=============================================="
    echo "❌ TESTS FAILED"
    echo "Please fix the issues before pushing"
    echo "==============================================${NC}\n"
    exit 1
fi
