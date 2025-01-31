import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import nodeFetch from 'node-fetch';

global.fetch = nodeFetch as unknown as typeof fetch;
global.Response = nodeFetch.Response as unknown as typeof Response;

// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// テスト後のクリーンアップ
afterEach(() => {
  cleanup();
});
