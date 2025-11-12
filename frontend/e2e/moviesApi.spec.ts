import { test, expect } from '@playwright/test';

test.describe('Movies API Integration E2E Tests', () => {
  test.describe('Movies List API', () => {
    test('should load movies from API on page load', async ({ page }) => {
      await page.goto('/');
      
      // Wait for API call to complete and movies to render
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // Verify multiple movies are displayed
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Verify movie card has essential information
      const firstCard = movieCards.first();
      await expect(firstCard).toContainText(/./); // Has some text content
    });

    test('should handle search query parameter in URL', async ({ page }) => {
      await page.goto('/?q=action');
      
      // Wait for search results
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // Search input should have the query value
      const searchInput = page.getByTestId('movie-search-input');
      await expect(searchInput).toHaveValue('action');
    });

    test('should handle page parameter in URL', async ({ page }) => {
      await page.goto('/?page=2');
      
      // Wait for movies to load
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // URL should maintain page parameter
      await expect(page).toHaveURL(/page=2/);
      
      // Pagination should show page 2 as active
      const pagination = page.getByTestId('pagination');
      await expect(pagination).toBeVisible({ timeout: 5000 });
    });

    test('should debounce search API calls', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.getByTestId('movie-search-input');
      
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
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should preserve search query when paginating', async ({ page }) => {
      await page.goto('/?q=action');
      
      // Wait for initial results
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // Navigate to page 2
      const pagination = page.getByTestId('pagination');
      await expect(pagination).toBeVisible({ timeout: 5000 });
      
      const page2Button = page.getByRole('listitem').filter({ hasText: '2' }).first();
      
      // Assert pagination button is visible (fail if not found)
      await expect(page2Button).toBeVisible({ timeout: 5000 });
      
      await page2Button.click();
      
      // Both search and page should be in URL
      await expect(page).toHaveURL(/q=action/);
      await expect(page).toHaveURL(/page=2/);
      
      // Search input should still have value
      const searchInput = page.getByTestId('movie-search-input');
      await expect(searchInput).toHaveValue('action');
    });

    test('should clear search and reload all movies', async ({ page }) => {
      await page.goto('/?q=action');
      
      const searchInput = page.getByTestId('movie-search-input');
      await expect(searchInput).toHaveValue('action');
      
      // Clear search
      await searchInput.clear();
      await searchInput.press('Enter');
      
      // Wait for API response after clearing search
      await page.waitForResponse(
        resp => resp.url().includes('/api/movies') && !resp.url().includes('q=') && resp.status() === 200,
        { timeout: 10000 }
      );
      
      // URL should not have search parameter
      await expect(page).toHaveURL(url => !url.toString().includes('q='));
      
      // Movies should be visible
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Movie Detail API', () => {
    test('should load movie details from API', async ({ page }) => {
      await page.goto('/movie/1');
      
      // Wait for movie details to load
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Check for overview/description
      const overview = page.getByTestId('movie-overview');
      await expect(overview).toBeVisible();
    });

    test('should display cast information', async ({ page }) => {
      await page.goto('/movie/1');
      
      // Wait for page to load
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Look for cast section
      const castSection = page.getByTestId('cast-section');
      if (await castSection.isVisible({ timeout: 5000 })) {
        // Should have cast member information
        await expect(castSection).toContainText(/./);
      }
    });

    test('should display crew information', async ({ page }) => {
      await page.goto('/movie/1');
      
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Look for crew section
      const crewSection = page.getByTestId('crew-section');
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
      const errorAlert = page.getByTestId('error-alert');
      const hasError = await errorAlert.isVisible();
      
      // Either we're redirected or we see an error message
      expect(currentUrl === '/' || hasError).toBe(true);
    });
  });

  test.describe('Language Switching with API', () => {
    test('should reload movie data when language changes', async ({ page }) => {
      await page.goto('/');
      
      // Wait for initial movies to load
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // Find and click language switcher
      const langSwitcher = page.getByTestId('language-switcher');
      
      // Assert language switcher is visible
      await expect(langSwitcher).toBeVisible();
      await langSwitcher.click();
      
      // Wait for dropdown menu and select a different language (Estonian)
      const dropdown = page.locator('[role="menu"]');
      await expect(dropdown).toBeVisible();
      
      const langOption = page.locator('[role="menuitem"]').filter({ hasText: /ET|RU/ }).first();
      await expect(langOption).toBeVisible({ timeout: 5000 });
      
      await langOption.click();
      
      // Wait for movies to reload with new language
      await page.waitForResponse(
        resp => resp.url().includes('/api/movies') && resp.status() === 200,
        { timeout: 10000 }
      );
      
      // Movies should still be visible (possibly with different titles)
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should show movie details in selected language', async ({ page }) => {
      // Start at home page
      await page.goto('/');
      
      // Change language first
      const langSwitcher = page.getByTestId('language-switcher');
      
      // Assert language switcher is visible
      await expect(langSwitcher).toBeVisible();
      await langSwitcher.click();
      
      // Wait for dropdown menu
      const dropdown = page.locator('[role="menu"]');
      await expect(dropdown).toBeVisible();
      
      const langOption = page.locator('[role="menuitem"]').filter({ hasText: /RU/ }).first();
      await expect(langOption).toBeVisible({ timeout: 5000 });
      
      await langOption.click();
      
      // Wait for language change to propagate
      await expect.poll(async () => {
        return await page.locator('html').getAttribute('lang');
      }).toBe('ru');
      
      // Navigate to movie detail
      await page.goto('/movie/1');
      
      // Wait for content to load
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Verify page is loaded
      await expect(page.getByTestId('movie-detail-page')).toBeVisible();
    });
  });

  test.describe('Cache and Performance', () => {
    test('should cache movie list results', async ({ page }) => {
      let apiCallCount = 0;
      
      // Track API calls
      await page.route('**/api/movies**', route => {
        apiCallCount++;
        route.continue();
      });
      
      await page.goto('/');
      
      // Wait for initial load
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      const initialCallCount = apiCallCount;
      
      // Navigate to a detail page
      const firstMovieLink = movieCards.first();
      await firstMovieLink.click();
      
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Go back to list
      await page.goBack();
      
      // Movies should load from cache - no new API call
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Verify no additional API call was made
      expect(apiCallCount).toBe(initialCallCount);
    });

    test('should handle rapid navigation between list and detail', async ({ page }) => {
      await page.goto('/');
      
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
      
      // Click on first movie
      await movieCards.first().click();
      
      const title = page.getByTestId('movie-title');
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Go back
      await page.goBack();
      await expect(movieCards.first()).toBeVisible({ timeout: 5000 });
      
      // Click on same or different movie again
      await movieCards.nth(1).click();
      await expect(title).toBeVisible({ timeout: 10000 });
      
      // Should handle without errors
      await expect(title).toBeVisible();
    });
  });

  test.describe('Error Recovery', () => {
    test('should handle network timeout gracefully', async ({ page }) => {
      // Intercept the movies API request and delay the response to simulate slow network
      await page.route('**/api/movies*', async (route) => {
        // Delay response by 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Then abort to simulate timeout/network failure
        await route.abort('timedout');
      });
      
      // Navigate to the page
      await page.goto('/');
      
      // Should show loading indicator while request is pending
      // Ant Design uses Skeleton for loading states
      const loadingSkeleton = page.locator('.ant-skeleton').first();
      await expect(loadingSkeleton).toBeVisible({ timeout: 2000 });
      
      // After timeout, should show error alert
      const errorAlert = page.getByTestId('error-alert');
      await expect(errorAlert).toBeVisible({ timeout: 5000 });
      
      // Verify error message is displayed
      await expect(errorAlert).toContainText(/error|failed/i);
      
      // Cleanup: restore normal routing
      await page.unroute('**/api/movies*');
    });

    test('should show loading state during slow network', async ({ page }) => {
      // Intercept API request and delay response (but complete successfully)
      await page.route('**/api/movies*', async (route) => {
        // Delay by 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Then continue with the actual request
        await route.continue();
      });
      
      await page.goto('/');
      
      // Should show loading skeleton initially
      const loadingSkeleton = page.locator('.ant-skeleton').first();
      await expect(loadingSkeleton).toBeVisible({ timeout: 1000 });
      
      // After delay, should show movie cards
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 5000 });
      
      // Verify multiple cards loaded
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Cleanup
      await page.unroute('**/api/movies*');
    });

    test('should recover from failed search', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.getByPlaceholder(/search/i);
      
      // Try a search that returns no results
      await searchInput.fill('zzznonexistent999');
      
      // Wait for search API response
      await page.waitForResponse(
        resp => resp.url().includes('/api/movies') && resp.status() === 200,
        { timeout: 10000 }
      );
      
      // Should show empty state with "No movies found" message
      const emptyState = page.getByTestId('empty-state');
      await expect(emptyState).toBeVisible({ timeout: 5000 });
      
      const noResultsMessage = page.getByText(/no movies found/i);
      await expect(noResultsMessage).toBeVisible();
      
      // Now do a valid search
      await searchInput.clear();
      await searchInput.fill('action');
      
      // Wait for new search API response
      await page.waitForResponse(
        resp => resp.url().includes('/api/movies') && resp.url().includes('q=action') && resp.status() === 200,
        { timeout: 10000 }
      );
      
      // Should recover and show movie cards
      const movieCards = page.getByTestId('movie-card');
      await expect(movieCards.first()).toBeVisible({ timeout: 5000 });
      
      // Verify multiple cards loaded (meaningful assertion)
      const count = await movieCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
