import { test, expect } from '@playwright/test';

test.describe('パフォーマンステスト', () => {
  test('ページロードのパフォーマンス測定', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // 主要なコンテンツが表示されるまでを計測
    await page.getByRole('heading', { name: '都道府県を選択' }).isVisible();
    const loadTime = Date.now() - startTime;
    
    // 3秒以内にロードされることを期待
    expect(loadTime).toBeLessThan(3000);
  });

  test('都道府県選択の応答性', async ({ page }) => {
    await page.goto('/');
    
    // チェックボックスクリックからグラフ表示までの時間を計測
    const checkbox = page.getByRole('checkbox', { name: '東京都を選択 東京都' });
    await checkbox.waitFor({ state: 'visible' });
    const startTime = Date.now();
    
    await checkbox.check();
    await page.locator('.recharts-wrapper').waitFor({ state: 'visible' });
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(1000); // 1秒以内の応答を期待
  });

  test('複数選択時のパフォーマンス', async ({ page }) => {
    await page.goto('/');
    
    // 複数の都道府県を選択したときの応答時間を計測
    const startTime = Date.now();
    
    // 全選択ボタンをクリック
    const selectAllButton = page.getByRole('button', { name: '全て選択' });
    await selectAllButton.waitFor({ state: 'visible' });
    await selectAllButton.click();
    
    // グラフが更新されるまで待機
    await page.locator('.recharts-wrapper').waitFor({ state: 'visible' });
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(3000); // 3秒以内の応答を期待
  });

  test('APIレスポンスのパフォーマンス', async ({ page }) => {
    // 都道府県一覧APIのレスポンス時間を計測
    const [prefecturesResponse] = await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/api/v1/prefectures') && 
        response.status() === 200
      ),
      page.goto('/')
    ]);
    
    // レスポンスサイズの確認
    const responseSize = (await prefecturesResponse.body()).length;
    expect(responseSize).toBeLessThan(50 * 1024); // 50KB以下を期待
    
    // レスポンスヘッダーでキャッシュの設定を確認
    const headers = prefecturesResponse.headers();
    expect(headers['cache-control']).toBeTruthy();
  });

  test('メモリ使用量の監視', async ({ page }) => {
    await page.goto('/');
    
    // 初期メモリ使用量を記録（Chromiumのみ）
    const initialMemory = await page.evaluate(() => {
      const perf = window.performance as any;
      return perf?.memory?.usedJSHeapSize || 0;
    });
    
    // 複数の操作を実行
    for (let i = 0; i < 5; i++) {
      const selectAllButton = page.getByRole('button', { name: '全て選択' });
      const unselectButton = page.getByRole('button', { name: '選択解除' });
      
      await selectAllButton.click();
      await page.locator('.recharts-wrapper').waitFor({ state: 'visible' });
      await unselectButton.click();
      await page.waitForTimeout(500); // 操作間の待機時間
    }
    
    // 最終メモリ使用量を確認（Chromiumのみ）
    const finalMemory = await page.evaluate(() => {
      const perf = window.performance as any;
      return perf?.memory?.usedJSHeapSize || 0;
    });
    
    // メモリ使用量の増加が20%以内であることを確認
    if (initialMemory > 0) {  // メモリ情報が取得できる場合のみチェック
      expect(finalMemory).toBeLessThan(initialMemory * 1.2);
    }
  });
}); 