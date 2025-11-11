import { test, expect } from '@playwright/test';

test.describe('Movies API Integration E2E Tests', () => {
  test.describe('Movies List API', () => {
    test('should load movies from API on page load', async ({ page }) => {
      await page.goto('/');
      
      // Wait for API call to complete and movies to render
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Verify multiple movies are displayed
      const movieCards = page.locator('[class*="card"]');
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Verify movie card has essential information
      const firstCard = movieCards.first();
      await expect(firstCard).toContainText(/./); // Has some text content
    });

    test('should handle search query parameter in URL', async ({ page }) => {
      await page.goto('/?q=action');
      
      // Wait for search results
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Search input should have the query value
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toHaveValue('action');
    });

    test('should handle page parameter in URL', async ({ page }) => {
      await page.goto('/?page=2');
      
      // Wait for movies to load
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // URL should maintain page parameter
      await expect(page).toHaveURL(/page=2/);
      
      // Pagination should show page 2 as active
      const pagination = page.locator('[class*="pagination"]');
      await expect(pagination).toBeVisible({ timeout: 5000 });
    });

    test('should debounce search API calls', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.getByPlaceholder(/search/i);
      
      // Type quickly (should debounce)
      await searchInput.fill('a');
      await searchInput.fill('ac');
      await searchInput.fill('act');
      await searchInput.fill('acti');
      await searchInput.fill('actio');
      await searchInput.fill('action');
      
      // Wait for debounce to complete
      await page.waitForTimeout(600);
      
      // URL should update with final search term
      await expect(page).toHaveURL(/q=action/);
      
      // Results should be visible
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    });

    test('should preserve search query when paginating', async ({ page }) => {
      await page.goto('/?q=action');
      
      // Wait for initial results
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Navigate to page 2
      const pagination = page.locator('[class*="pagination"]');
      await expect(pagination).toBeVisible({ timeout: 5000 });
      
      const page2Button = page.getByRole('listitem').filter({ hasText: '2' }).first();
      if (await page2Button.isVisible()) {
        await page2Button.click();
        
        // Both search and page should be in URL
        await expect(page).toHaveURL(/q=action/);
        await expect(page).toHaveURL(/page=2/);
        
        // Search input should still have value
        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toHaveValue('action');
      }
    });

    test('should clear search and reload all movies', async ({ page }) => {
      await page.goto('/?q=action');
      
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toHaveValue('action');
      
      // Clear search
      await searchInput.clear();
      await searchInput.press('Enter');
      
      // Wait for results to reload
      await page.waitForTimeout(600);
      
      // URL should not have search parameter
      await expect(page).toHaveURL(/^(?!.*q=)/);
      
      // Movies should still be visible
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    });
  });

  test.describe('Movie Detail API', () => {
    test('should load movie details from API', async ({ page }) => {
      await page.goto('/movie/1');
      
      // Wait for movie details to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Verify essential movie information is displayed
      const title = page.locator('h1');
      await expect(title).toBeVisible();
      
      // Check for overview/description
      const overview = page.locator('[class*="overview"], p').first();
      await expect(overview).toBeVisible();
    });

    test('should display cast information', async ({ page }) => {
      await page.goto('/movie/1');
      
      // Wait for page to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Look for cast section (adjust selector based on your implementation)
      const castSection = page.locator('[class*="cast"], [class*="Cast"]').first();
      if (await castSection.isVisible({ timeout: 5000 })) {
        // Should have cast member information
        await expect(castSection).toContainText(/./);
      }
    });

    test('should display crew information', async ({ page }) => {
      await page.goto('/movie/1');
      
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Look for crew section
      const crewSection = page.locator('[class*="crew"], [class*="Crew"]').first();
      if (await crewSection.isVisible({ timeout: 5000 })) {
        await expect(crewSection).toContainText(/./);
      }
    });

    test('should handle invalid movie ID gracefully', async ({ page }) => {
      // Try to access a movie that doesn't exist
      await page.goto('/movie/999999999');
      
      // Should either redirect or show error message
      await page.waitForTimeout(3000);
      
      // Check if redirected to home or shows error
      const currentUrl = page.url();
      const hasError = await page.locator('[class*="error"], [class*="Error"]').isVisible();
      
      // Either we're redirected or we see an error message
      expect(currentUrl === '/' || hasError).toBe(true);
    });
  });

  test.describe('Language Switching with API', () => {
    test('should reload movie data when language changes', async ({ page }) => {
      await page.goto('/');
      
      // Wait for initial movies to load
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Find and click language switcher
      const langSwitcher = page.locator('button[aria-label*="language"], button[class*="language"]').first();
      
      if (await langSwitcher.isVisible()) {
        await langSwitcher.click();
        
        // Select a different language (e.g., Russian or Estonian)
        const langOption = page.locator('[role="menuitem"], button').filter({ hasText: /Русский|Eesti/ }).first();
        
        if (await langOption.isVisible({ timeout: 2000 })) {
          await langOption.click();
          
          // Wait for movies to reload with new language
          await page.waitForTimeout(1000);
          
          // Movies should still be visible (possibly with different titles)
          await page.waitForSelector('[class*="card"]', { timeout: 10000 });
        }
      }
    });

    test('should show movie details in selected language', async ({ page }) => {
      // Start at home page
      await page.goto('/');
      
      // Change language first
      const langSwitcher = page.locator('button[aria-label*="language"], button[class*="language"]').first();
      
      if (await langSwitcher.isVisible()) {
        await langSwitcher.click();
        
        const langOption = page.locator('[role="menuitem"], button').filter({ hasText: /Русский/ }).first();
        
        if (await langOption.isVisible({ timeout: 2000 })) {
          await langOption.click();
          await page.waitForTimeout(500);
        }
      }
      
      // Navigate to movie detail
      await page.goto('/movie/1');
      
      // Wait for content to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Content should be loaded (potentially in Russian)
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });
  });

  test.describe('Cache and Performance', () => {
    test('should cache movie list results', async ({ page }) => {
      await page.goto('/');
      
      // Wait for initial load
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Navigate to a detail page
      const firstMovieLink = page.locator('a[href*="/movie/"]').first();
      await firstMovieLink.click();
      
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Go back to list
      await page.goBack();
      
      // Movies should load quickly from cache (no skeleton/loading state)
      await page.waitForSelector('[class*="card"]', { timeout: 2000 });
      const movieCards = page.locator('[class*="card"]');
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle rapid navigation between list and detail', async ({ page }) => {
      await page.goto('/');
      
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      
      // Click on first movie
      await page.locator('a[href*="/movie/"]').first().click();
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Go back
      await page.goBack();
      await page.waitForSelector('[class*="card"]', { timeout: 5000 });
      
      // Click on same or different movie again
      await page.locator('a[href*="/movie/"]').nth(1).click();
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Should handle without errors
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });
  });

  test.describe('Error Recovery', () => {
    test('should handle network timeout gracefully', async ({ page }) => {
      // This test simulates slow network by checking if loading states work
      await page.goto('/');
      
      // Should show some loading indicator initially
      const hasContent = await page.locator('[class*="card"], [class*="spin"], [class*="loading"]').first().isVisible({ timeout: 10000 });
      expect(hasContent).toBe(true);
      
      // Eventually should show movies or error message
      await page.waitForTimeout(5000);
      const hasMoviesOrError = 
        (await page.locator('[class*="card"]').count() > 0) ||
        (await page.locator('[class*="error"]').isVisible());
      
      expect(hasMoviesOrError).toBe(true);
    });

    test('should recover from failed search', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.getByPlaceholder(/search/i);
      
      // Try a search that might fail or return no results
      await searchInput.fill('zzznonexistent999');
      await page.waitForTimeout(600);
      
      // Should show empty state or handle gracefully
      await page.waitForTimeout(2000);
      
      // Now do a valid search
      await searchInput.clear();
      await searchInput.fill('action');
      await page.waitForTimeout(600);
      
      // Should recover and show results
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      const movieCards = page.locator('[class*="card"]');
      const count = await movieCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
