import { test, expect } from '@playwright/test';

test.describe('Movies List Page', () => {
  test('should display page title and search input', async ({ page }) => {
    await page.goto('/');
    
    // Check for search input
    const searchInput = page.getByTestId('movie-search-input');
    await expect(searchInput).toBeVisible();
    
    // Check for main content area
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display movie cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load
    const movieCards = page.getByTestId('movie-card');
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
    
    // Should have multiple movie cards
    const count = await movieCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for movies', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByTestId('movie-search-input');
    await searchInput.fill('action');
    
    // URL should contain search query
    await expect(page).toHaveURL(/q=action/);
  });

  test('should navigate to movie detail page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load and click first movie card
    const firstMovieCard = page.getByTestId('movie-card').first();
    await expect(firstMovieCard).toBeVisible({ timeout: 10000 });
    await firstMovieCard.click();
    
    // Should navigate to movie detail page
    await expect(page).toHaveURL(/\/movie\/\d+/);
    
    // Wait for movie detail content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('should paginate through results', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pagination to appear
    await page.waitForSelector('[data-testid="pagination"]', { timeout: 10000 });
    
    // Click on page 2 or next button
    const nextButton = page.getByRole('button', { name: /next|2/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // URL should update with page parameter
    await expect(page).toHaveURL(/page=2/);
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByTestId('movie-search-input');
    await searchInput.fill('zzzzznonexistentmovie123');
    
    // Wait for search API response to complete
    await page.waitForResponse(
      resp => resp.url().includes('/api/movies') && resp.status() === 200,
      { timeout: 10000 }
    );
    
    // Should show empty state with "No movies found" message
    const noResultsMessage = page.getByText(/no movies found|no results found/i);
    await expect(noResultsMessage).toBeVisible({ timeout: 5000 });
    
    // Verify the hint message is also displayed
    const hintMessage = page.getByText(/we couldn't find any movies matching/i);
    await expect(hintMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Movie Detail Page', () => {
  test('should display movie information', async ({ page }) => {
    // Go directly to a movie detail page
    await page.goto('/movie/1');
    
    // Wait for content to load
    const title = page.getByTestId('movie-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    
    // Should have a back button
    const backButton = page.getByTestId('back-button');
    await expect(backButton).toBeVisible();
  });

  test('should navigate back to list', async ({ page }) => {
    await page.goto('/movie/1');
    
    // Wait for back button
    const backButton = page.getByTestId('back-button');
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    // Should return to home page
    await expect(page).toHaveURL('/');
  });
});

test.describe('Theme Switching', () => {
  test('should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button using test id
    const themeToggle = page.getByTestId('theme-toggle');
    
    // Assert the theme toggle is visible (fail if not found)
    await expect(themeToggle).toBeVisible();
    
    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    
    // Click toggle
    await themeToggle.click();
    
    // Wait for theme change using Playwright's polling mechanism
    await expect.poll(async () => {
      return await page.locator('html').getAttribute('data-theme');
    }).not.toBe(initialTheme);
    
    // Verify the theme actually changed to the opposite value
    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
    await expect(page.locator('html')).toHaveAttribute('data-theme', expectedTheme);
  });
});

test.describe('Language Switching', () => {
  test('should switch between languages', async ({ page }) => {
    await page.goto('/');
    
    // Find language switcher button
    const langSwitcher = page.getByTestId('language-switcher');
    
    // Assert the language switcher is visible (fail if not found)
    await expect(langSwitcher).toBeVisible();
    
    // Verify initial language is English
    const searchInput = page.getByTestId('movie-search-input');
    await expect(searchInput).toHaveAttribute('placeholder', 'Search movies');
    
    // Click the language switcher to open menu
    await langSwitcher.click();
    
    // Wait for dropdown menu to appear
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Select Estonian (ET) from the menu
    const estonianOption = page.locator('[role="menuitem"]').filter({ hasText: 'ET' });
    await estonianOption.click();
    
    // Wait for language change to propagate
    await page.waitForTimeout(500);
    
    // Verify the language changed by checking a translatable element
    // Search placeholder should now be "Otsi filme" (Estonian)
    await expect(searchInput).toHaveAttribute('placeholder', 'Otsi filme');
    
    // Additionally verify the HTML lang attribute changed
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('et');
    
    // Verify language switcher shows current language
    await expect(langSwitcher).toContainText('ET');
  });
});
