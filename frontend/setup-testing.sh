#!/bin/bash
# Complete Testing Setup Script
# Run this from the frontend directory

# Enable strict error handling
set -euo pipefail

# Trap errors and provide clear failure messages
trap 'echo "❌ Error: Testing setup failed at line $LINENO. Please check the error messages above." >&2; exit 1' ERR

echo "🧪 Installing Testing Dependencies..."
echo ""

# Install all testing dependencies
if ! pnpm add -D \
  vitest \
  @vitest/ui \
  jsdom \
  happy-dom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  @playwright/test; then
  echo "❌ Error: Failed to install testing dependencies with pnpm" >&2
  exit 1
fi

echo ""
echo "✅ Testing dependencies installed!"
echo ""

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
if ! npx playwright install; then
  echo "❌ Error: Failed to install Playwright browsers" >&2
  exit 1
fi

echo ""
echo "✅ Playwright browsers installed!"
echo ""

echo "📝 Next Steps:"
echo "1. Create vitest.config.ts (see TESTING_SETUP.md)"
echo "2. Create src/test/setup.ts"
echo "3. Create src/test/mocks/ directory with handlers and server"
echo "4. Create playwright.config.ts"
echo "5. Update package.json scripts"
echo "6. Run: pnpm test"
echo ""
echo "📚 See TESTING_SETUP.md for detailed instructions"
