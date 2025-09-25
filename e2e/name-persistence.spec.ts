import { test, expect } from '@playwright/test';

test.describe('Name Persistence', () => {
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

  test('should persist names across page reloads', async ({ page }) => {
    // Add multiple names
    const nameInput = page.getByPlaceholder('Enter a name');

    await nameInput.fill('Alice');
    await page.getByRole('button', { name: /plus/i }).click();
    await expect(page.getByText('Alice')).toBeVisible();

    await nameInput.fill('Bob');
    await page.getByRole('button', { name: /plus/i }).click();
    await expect(page.getByText('Bob')).toBeVisible();

    await nameInput.fill('Charlie');
    await page.keyboard.press('Enter'); // Test Enter key functionality
    await expect(page.getByText('Charlie')).toBeVisible();

    // Verify localStorage contains the names
    const savedNames = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      return saved ? JSON.parse(saved) : null;
    });

    expect(savedNames).toHaveLength(3);
    expect(savedNames.map((p: { name: string }) => p.name)).toContain('Alice');
    expect(savedNames.map((p: { name: string }) => p.name)).toContain('Bob');
    expect(savedNames.map((p: { name: string }) => p.name)).toContain('Charlie');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Names should still be visible
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
    await expect(page.getByText('Charlie')).toBeVisible();

    // Verify localStorage still contains the names after reload
    const savedNamesAfterReload = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      return saved ? JSON.parse(saved) : null;
    });

    expect(savedNamesAfterReload).toHaveLength(3);
  });

  test('should handle name removal and persist changes', async ({ page }) => {
    // Add names
    const nameInput = page.getByPlaceholder('Enter a name');

    await nameInput.fill('Alice');
    await page.getByRole('button', { name: /plus/i }).click();

    await nameInput.fill('Bob');
    await page.getByRole('button', { name: /plus/i }).click();

    // Verify both names are added
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();

    // Remove Alice (first name)
    const trashButtons = page.getByRole('button', { name: /trash/i });
    await trashButtons.first().click();

    // Alice should be gone, Bob should remain
    await expect(page.getByText('Alice')).toBeHidden();
    await expect(page.getByText('Bob')).toBeVisible();

    // Reload page to verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Only Bob should be visible
    await expect(page.getByText('Alice')).toBeHidden();
    await expect(page.getByText('Bob')).toBeVisible();

    // Verify localStorage
    const savedNames = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      return saved ? JSON.parse(saved) : null;
    });

    expect(savedNames).toHaveLength(1);
    expect(savedNames[0].name).toBe('Bob');
  });

  test('should maintain empty state when no names are added', async ({ page }) => {
    // Verify initial empty state
    await expect(page.getByText('No names added yet')).toBeVisible();
    await expect(page.getByText('Add some names to get started')).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still show empty state
    await expect(page.getByText('No names added yet')).toBeVisible();
    await expect(page.getByText('Add some names to get started')).toBeVisible();

    // localStorage should be empty or have empty array
    const savedNames = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      return saved ? JSON.parse(saved) : null;
    });

    expect(savedNames === null || savedNames.length === 0).toBe(true);
  });

  test('should handle localStorage corruption gracefully', async ({ page }) => {
    // Corrupt the localStorage data
    await page.evaluate(() => {
      localStorage.setItem('nameShuffle-people', 'invalid-json');
    });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show empty state (graceful fallback)
    await expect(page.getByText('No names added yet')).toBeVisible();

    // Should be able to add new names
    const nameInput = page.getByPlaceholder('Enter a name');
    await nameInput.fill('Test Name');
    await page.getByRole('button', { name: /plus/i }).click();

    await expect(page.getByText('Test Name')).toBeVisible();

    // Reload to verify the fix worked
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Test Name')).toBeVisible();
  });

  test('should preserve name properties (color, icon, id) across reloads', async ({ page }) => {
    // Add a name
    const nameInput = page.getByPlaceholder('Enter a name');
    await nameInput.fill('Alice');
    await page.getByRole('button', { name: /plus/i }).click();

    // Get the person's details from localStorage
    const personBefore = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      const people = saved ? JSON.parse(saved) : [];
      return people[0];
    });

    expect(personBefore).toBeDefined();
    expect(personBefore.id).toBeDefined();
    expect(personBefore.name).toBe('Alice');
    expect(personBefore.color).toBeDefined();
    expect(personBefore.icon).toBeDefined();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Name should still be visible
    await expect(page.getByText('Alice')).toBeVisible();

    // Person's details should be preserved
    const personAfter = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      const people = saved ? JSON.parse(saved) : [];
      return people[0];
    });

    expect(personAfter.id).toBe(personBefore.id);
    expect(personAfter.name).toBe(personBefore.name);
    expect(personAfter.color).toBe(personBefore.color);
    expect(personAfter.icon).toBe(personBefore.icon);
  });

  test('should handle special characters and unicode in names', async ({ page }) => {
    // Add names with special characters
    const nameInput = page.getByPlaceholder('Enter a name');
    const specialNames = ['José', '李小明', 'André', 'Müller', '🎭 Actor', "O'Connor"];

    for (const name of specialNames) {
      await nameInput.fill(name);
      await page.getByRole('button', { name: /plus/i }).click();
      await expect(page.getByText(name)).toBeVisible();
    }

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // All special names should persist
    for (const name of specialNames) {
      await expect(page.getByText(name)).toBeVisible();
    }

    // Verify localStorage
    const savedNames = await page.evaluate(() => {
      const saved = localStorage.getItem('nameShuffle-people');
      return saved ? JSON.parse(saved) : null;
    });

    expect(savedNames).toHaveLength(specialNames.length);
    const savedNamesArray = savedNames.map((p: { name: string }) => p.name);
    for (const name of specialNames) {
      expect(savedNamesArray).toContain(name);
    }
  });
});