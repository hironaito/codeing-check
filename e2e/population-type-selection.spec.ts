import { test, expect } from '@playwright/test';

test.describe('人口種別選択機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 都道府県を選択して、データを表示させる（テストの前提条件）
    await page.getByLabel('東京都を選択').click();
    await page.waitForResponse(response => response.url().includes('/api/v1/population/composition/perYear'));
  });

  test('初期状態で総人口が選択されている', async ({ page }) => {
    const totalPopulationButton = page.getByRole('button', { name: '総人口' });
    await expect(totalPopulationButton).toHaveClass(/bg-blue-600/);
  });

  test('各人口種別を選択できる', async ({ page }) => {
    const populationTypes = ['年少人口', '生産年齢人口', '老年人口'];

    for (const type of populationTypes) {
      await page.getByRole('button', { name: type }).click();
      // 選択されたボタンのスタイルを確認
      await expect(page.getByRole('button', { name: type })).toHaveClass(/bg-blue-600/);
      // グラフの更新を待機
      await page.waitForSelector('.recharts-line');
    }
  });

  test('選択した人口種別のグラフが正しく表示される', async ({ page }) => {
    // 年少人口を選択してテスト
    await page.getByRole('button', { name: '年少人口' }).click();
    await expect(page.getByRole('button', { name: '年少人口' })).toHaveClass(/bg-blue-600/);
    
    // グラフの表示を確認
    await expect(page.locator('.recharts-line')).toBeVisible();
    
    // データポイントが存在することを確認（最初のポイントをチェック）
    const firstDataPoint = page.locator('.recharts-dot').first();
    await expect(firstDataPoint).toBeVisible();
    
    // グラフのラベルが表示されていることを確認
    await expect(page.getByText('年少人口（人）')).toBeVisible();
  });

  test('人口種別を切り替えるとグラフが更新される', async ({ page }) => {
    // 生産年齢人口に切り替え
    await page.getByRole('button', { name: '生産年齢人口' }).click();
    await expect(page.getByRole('button', { name: '生産年齢人口' })).toHaveClass(/bg-blue-600/);
    
    // グラフの表示を確認
    await expect(page.locator('.recharts-line')).toBeVisible();
    
    // データポイントが存在することを確認（最初のポイントをチェック）
    const firstDataPoint = page.locator('.recharts-dot').first();
    await expect(firstDataPoint).toBeVisible();
    
    // グラフのラベルが表示されていることを確認
    await expect(page.getByText('生産年齢人口（人）')).toBeVisible();
  });
}); 