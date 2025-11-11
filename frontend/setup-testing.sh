#!/bin/bash
# Complete Testing Setup Script
# Run this from the frontend directory

echo "🧪 Installing Testing Dependencies..."
echo ""

# Install all testing dependencies
pnpm add -D \
  vitest \
  @vitest/ui \
  jsdom \
  happy-dom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  @playwright/test

echo ""
echo "✅ Testing dependencies installed!"
echo ""

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

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
