import { test, expect } from '@playwright/test'

test('sidebar is visible with nav links', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.sidebar')).toBeVisible()
  await expect(page.locator('.sidebar-nav a[href="/"]')).toBeVisible()
  await expect(page.locator('.sidebar-nav a[href="/restocking"]')).toBeVisible()
})

test('dashboard loads with stat cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.kpi-grid')).toBeVisible({ timeout: 10000 })
})

test('restocking tab loads and shows budget slider', async ({ page }) => {
  await page.goto('/restocking')
  await expect(page.locator('input[type="range"]')).toBeVisible()
})

test('orders tab loads', async ({ page }) => {
  await page.goto('/orders')
  await expect(page.locator('.orders-table')).toBeVisible({ timeout: 8000 })
})

test('sidebar collapses on toggle click', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.app')).not.toHaveClass(/sidebar-collapsed/)
  await page.locator('.sidebar-toggle').click()
  await expect(page.locator('.app')).toHaveClass(/sidebar-collapsed/)
})
