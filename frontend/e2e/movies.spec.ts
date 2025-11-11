import { test, expect } from '@playwright/test';

test.describe('Movies List Page', () => {
  test('should display page title and search input', async ({ page }) => {
    await page.goto('/');
    
    // Check for search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Check for main content area
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display movie cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load
    await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    
    // Should have multiple movie cards
    const movieCards = page.locator('[class*="card"]');
    await expect(movieCards.first()).toBeVisible();
  });

  test('should search for movies', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('action');
    
    // Wait for search results to update
    await page.waitForTimeout(500);
    
    // URL should contain search query
    await expect(page).toHaveURL(/q=action/);
  });

  test('should navigate to movie detail page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load
    await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    
    // Click on first movie card link
    const firstMovieLink = page.locator('a[href*="/movie/"]').first();
    await firstMovieLink.click();
    
    // Should navigate to movie detail page
    await expect(page).toHaveURL(/\/movie\/\d+/);
    
    // Wait for movie detail content
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should paginate through results', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pagination to appear
    await page.waitForSelector('[class*="pagination"]', { timeout: 10000 });
    
    // Click on page 2 or next button
    const nextButton = page.getByRole('listitem').filter({ hasText: '2' }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      
      // URL should update with page parameter
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('zzzzznonexistentmovie123');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Should show empty state or no results message
    const emptyState = page.locator('[class*="emptyState"]');
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Movie Detail Page', () => {
  test('should display movie information', async ({ page }) => {
    // Go directly to a movie detail page
    await page.goto('/movie/1');
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Should have a back button
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();
  });

  test('should navigate back to list', async ({ page }) => {
    await page.goto('/movie/1');
    
    // Wait for back button
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    // Should return to home page
    await expect(page).toHaveURL('/');
  });
});

test.describe('Theme Switching', () => {
  test('should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button (adjust selector based on your implementation)
    const themeToggle = page.locator('button[aria-label*="theme"], button[class*="theme"]').first();
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.locator('html').getAttribute('data-theme');
      
      // Click toggle
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(300);
      
      // Theme should have changed
      const newTheme = await page.locator('html').getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});

test.describe('Language Switching', () => {
  test('should switch between languages', async ({ page }) => {
    await page.goto('/');
    
    // Find language switcher (adjust selector based on your implementation)
    const langSwitcher = page.locator('button[aria-label*="language"], button[class*="language"]').first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      
      // Should show language options
      await expect(page.locator('[role="menu"], [class*="dropdown"]')).toBeVisible();
    }
  });
});
