import { test, expect } from '@playwright/test';

test.describe('Dark Mode Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Then clear localStorage and reload
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should start in system mode by default and respect system preference', async ({ page }) => {
    // Check that the theme toggle shows the correct initial state
    const themeToggle = page.getByRole('button', { name: /switch to light mode/i });
    await expect(themeToggle).toBeVisible();

    // Check that html element doesn't have dark class initially (assuming system is light)
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass || '').not.toContain('dark');

    // Verify localStorage has system theme
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBeNull(); // Initially null, then becomes system
  });

  test('should cycle through themes: system -> light -> dark -> system', async ({ page }) => {
    // Start with system mode, click to go to light mode
    await page.getByRole('button', { name: /switch to light mode/i }).click();

    // Should now be in light mode
    let themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(themeToggle).toBeVisible();
    let theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('light');

    // Click to go to dark mode
    await themeToggle.click();

    // Should now be in dark mode
    themeToggle = page.getByRole('button', { name: /switch to system mode/i });
    await expect(themeToggle).toBeVisible();
    theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');

    // Verify dark class is applied
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');

    // Click to go to system mode
    await themeToggle.click();

    // Should now be in system mode
    themeToggle = page.getByRole('button', { name: /switch to light mode/i });
    await expect(themeToggle).toBeVisible();
    theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('system');
  });

  test('should persist theme preference across page reloads', async ({ page }) => {
    // Set theme to dark
    await page.getByRole('button', { name: /switch to light mode/i }).click(); // system -> light
    await page.getByRole('button', { name: /switch to dark mode/i }).click(); // light -> dark

    // Verify dark mode is active
    let htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Theme should still be dark
    htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');

    const themeToggle = page.getByRole('button', { name: /switch to system mode/i });
    await expect(themeToggle).toBeVisible();

    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  test('should apply dark mode styles to all UI components', async ({ page }) => {
    // Switch to dark mode
    await page.getByRole('button', { name: /switch to light mode/i }).click(); // system -> light
    await page.getByRole('button', { name: /switch to dark mode/i }).click(); // light -> dark

    // Verify dark mode styles are applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Check that CSS variables are being used
    const mainBg = page.locator('div.min-h-screen'); // Main container
    await expect(mainBg).toHaveClass(/bg-background/);

    // Check sidebar uses CSS variables
    const sidebar = page.locator('.w-80');
    await expect(sidebar).toHaveClass(/bg-card/);

    // Check text uses CSS variables
    const mainTitle = page.getByRole('heading', { name: 'Name Shuffle' });
    await expect(mainTitle).toHaveClass(/text-foreground/);

    const sidebarTitle = page.getByRole('heading', { name: 'Names' });
    await expect(sidebarTitle).toHaveClass(/text-card-foreground/);
  });

  test('should maintain dark mode functionality with names persistence', async ({ page }) => {
    // Add a name
    const nameInput = page.getByPlaceholder('Enter a name');
    await nameInput.fill('Test Name');
    await page.getByRole('button', { name: /plus/i }).click();

    // Verify name is added
    await expect(page.getByText('Test Name')).toBeVisible();

    // Switch to dark mode
    await page.getByRole('button', { name: /switch to light mode/i }).click(); // system -> light
    await page.getByRole('button', { name: /switch to dark mode/i }).click(); // light -> dark

    // Name should still be visible in dark mode
    await expect(page.getByText('Test Name')).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Both name and dark mode should persist
    await expect(page.getByText('Test Name')).toBeVisible();
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');

    // Verify localStorage has both theme and names
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    const names = await page.evaluate(() => localStorage.getItem('nameShuffle-people'));
    expect(theme).toBe('dark');
    expect(names).toContain('Test Name');
  });

  test('should show correct theme toggle icons', async ({ page }) => {
    // System mode should show monitor icon
    let themeButton = page.getByRole('button', { name: /switch to light mode/i });
    await expect(themeButton).toBeVisible();

    // Switch to light mode - should show sun icon
    await themeButton.click();
    themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(themeButton).toBeVisible();

    // Switch to dark mode - should show moon icon
    await themeButton.click();
    themeButton = page.getByRole('button', { name: /switch to system mode/i });
    await expect(themeButton).toBeVisible();
  });

  test('should handle shuffle functionality in dark mode', async ({ page }) => {
    // Add multiple names
    const nameInput = page.getByPlaceholder('Enter a name');

    await nameInput.fill('Alice');
    await page.getByRole('button', { name: /plus/i }).click();

    await nameInput.fill('Bob');
    await page.getByRole('button', { name: /plus/i }).click();

    await nameInput.fill('Charlie');
    await page.getByRole('button', { name: /plus/i }).click();

    // Switch to dark mode
    await page.getByRole('button', { name: /switch to light mode/i }).click(); // system -> light
    await page.getByRole('button', { name: /switch to dark mode/i }).click(); // light -> dark

    // Verify names are visible in dark mode
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
    await expect(page.getByText('Charlie')).toBeVisible();

    // Test shuffle functionality
    const shuffleButton = page.getByRole('button', { name: /shuffle/i });
    await expect(shuffleButton).toBeEnabled();

    await shuffleButton.click();

    // Should show shuffling animation with dark mode styles
    await expect(page.getByText('🎲')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Shuffling...' })).toBeVisible();

    // Wait for shuffle to complete
    await expect(page.getByRole('paragraph').filter({ hasText: 'Shuffling...' })).toBeHidden({ timeout: 5000 });

    // Should show a selected name
    const selectedNames = ['Alice', 'Bob', 'Charlie'];
    const selectedName = await page.locator('.text-3xl.font-bold').textContent();
    expect(selectedNames).toContain(selectedName);
  });

  test('should maintain accessible theme toggle across all states', async ({ page }) => {
    // Check accessibility in system mode
    let themeToggle = page.getByRole('button', { name: /switch to light mode/i });
    await expect(themeToggle).toHaveAttribute('aria-label');

    // Switch to light mode and check accessibility
    await themeToggle.click();
    themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(themeToggle).toHaveAttribute('aria-label');

    // Switch to dark mode and check accessibility
    await themeToggle.click();
    themeToggle = page.getByRole('button', { name: /switch to system mode/i });
    await expect(themeToggle).toHaveAttribute('aria-label');

    // Verify theme toggle is always in the top-right corner
    const togglePosition = await themeToggle.boundingBox();
    expect(togglePosition?.x).toBeGreaterThan(1000); // Should be on the right side
    expect(togglePosition?.y).toBeLessThan(100); // Should be near the top
  });
});