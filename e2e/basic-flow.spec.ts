import { test, expect } from '@playwright/test';

test.describe('基本的なユーザーフロー', () => {
  test('トップページが正しく表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('都道府県別人口推移グラフ');
    
    // 都道府県選択セクションが表示されることを確認
    await expect(page.getByRole('heading', { name: '都道府県を選択', exact: true })).toBeVisible();
    
    // グラフセクションが表示されることを確認
    await expect(page.getByRole('heading', { name: '人口推移グラフ', exact: true })).toBeVisible();
  });

  test('都道府県を選択してグラフが表示される', async ({ page }) => {
    await page.goto('/');
    
    // 都道府県選択
    const checkbox = page.getByRole('checkbox', { name: '東京都を選択', exact: true });
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();
    
    // グラフが表示されることを確認
    await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 10000 });
  });

  test('複数の都道府県を選択できる', async ({ page }) => {
    await page.goto('/');
    
    // 複数の都道府県を選択
    const tokyoCheckbox = page.getByRole('checkbox', { name: '東京都を選択', exact: true });
    const osakaCheckbox = page.getByRole('checkbox', { name: '大阪府を選択', exact: true });
    
    await expect(tokyoCheckbox).toBeVisible({ timeout: 10000 });
    await expect(osakaCheckbox).toBeVisible({ timeout: 10000 });
    
    await tokyoCheckbox.check();
    await osakaCheckbox.check();
    
    // 選択状態の確認
    await expect(tokyoCheckbox).toBeChecked();
    await expect(osakaCheckbox).toBeChecked();
    
    // 選択状態の表示を確認
    await expect(page.getByText(/選択中: 2 \/ /)).toBeVisible();
  });

  test('全選択・全解除が機能する', async ({ page }) => {
    await page.goto('/');
    
    // 全選択ボタンをクリック
    const selectAllButton = page.getByRole('button', { name: '全て選択', exact: true });
    await expect(selectAllButton).toBeVisible({ timeout: 10000 });
    await selectAllButton.click();
    
    // 全ての都道府県が選択されていることを確認
    await expect(page.getByText(/選択中: 47 \/ /)).toBeVisible({ timeout: 10000 });
    
    // 全解除ボタンをクリック
    const unselectButton = page.getByRole('button', { name: '選択解除', exact: true });
    await expect(unselectButton).toBeVisible();
    await unselectButton.click();
    
    // 全ての都道府県の選択が解除されていることを確認
    await expect(page.getByText(/選択中: 0 \/ /)).toBeVisible();
  });
}); 