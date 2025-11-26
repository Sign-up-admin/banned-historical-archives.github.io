/**
 * Vitest 测试设置文件
 * 用于配置测试环境的全局设置
 */

import { vi } from 'vitest';

// 配置 @testing-library/jest-dom，提供额外的 DOM 断言
import '@testing-library/jest-dom';

// 设置测试环境变量
(process.env as any).NODE_ENV = 'test';
process.env.COMMIT_HASH = 'test-commit-hash';

// 全局 fetch mock
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    clone: () => mockFetch(),
    headers: new Headers(),
    status: 200,
    statusText: 'OK',
    url: '',
    redirected: false,
    type: 'basic' as ResponseType,
  })
);

vi.stubGlobal('fetch', mockFetch);

// Next.js Router mock
const mockRouter = {
  pathname: '/',
  query: {},
  asPath: '/',
  push: vi.fn(() => Promise.resolve(true)),
  replace: vi.fn(() => Promise.resolve(true)),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(() => Promise.resolve()),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// 配置 location 对象 mock
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    protocol: 'http:',
    host: 'localhost:3000',
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
    assign: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});

// DOMMatrix polyfill（react-pdf 需要）
// DOMMatrix polyfill (required by react-pdf)
if (typeof globalThis.DOMMatrix === 'undefined') {
  try {
    // 尝试加载 dommatrix polyfill
    // Try to load dommatrix polyfill
    const { DOMMatrix: DOMMatrixPolyfill } = require('dommatrix/dist/dommatrix.js');
    globalThis.DOMMatrix = DOMMatrixPolyfill;
  } catch (error) {
    // 如果加载失败，创建一个简单的 polyfill
    // If loading fails, create a simple polyfill
    console.warn('Failed to load DOMMatrix polyfill:', error);
    globalThis.DOMMatrix = class DOMMatrix {
      constructor(init?: string | number[]) {
        // 简单的实现，仅用于测试环境
        // Simple implementation for test environment only
      }
      static fromMatrix() {
        return new DOMMatrix();
      }
      static fromFloat32Array() {
        return new DOMMatrix();
      }
      static fromFloat64Array() {
        return new DOMMatrix();
      }
    } as any;
  }
}

// 如果需要配置其他全局设置，可以在这里添加
// 例如：全局 mock、测试工具配置等
