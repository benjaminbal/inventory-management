import { test, expect } from '@playwright/test'
import path from 'path'

const PAGES = [
  { name: 'dashboard',   path: '/',            waitFor: '.kpi-grid' },
  { name: 'inventory',   path: '/inventory',   waitFor: '.card' },
  { name: 'orders',      path: '/orders',      waitFor: '.stats-grid' },
  { name: 'spending',    path: '/spending',    waitFor: '.card' },
  { name: 'demand',      path: '/demand',      waitFor: '.card' },
  { name: 'reports',     path: '/reports',     waitFor: '.card' },
  { name: 'restocking',  path: '/restocking',  waitFor: 'input[type="range"]' },
]

test('screenshot dashboard', async ({ page }) => {
  await page.goto('/')
  await page.locator('.kpi-grid').waitFor({ timeout: 10000 })
  await page.screenshot({ path: 'tests/e2e/screenshots/dashboard.png', fullPage: true })
})

for (const { name, path: route, waitFor } of PAGES) {
  test(`navigate to ${name} and verify it loads`, async ({ page }) => {
    await page.goto(route)
    const el = page.locator(waitFor).first()
    await expect(el).toBeVisible({ timeout: 10000 })
    await page.screenshot({
      path: `tests/e2e/screenshots/${name}.png`,
      fullPage: true
    })
  })
}
