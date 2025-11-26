"use strict";
/**
 * Vitest 测试设置文件
 * 用于配置测试环境的全局设置
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// 配置 @testing-library/jest-dom，提供额外的 DOM 断言
require("@testing-library/jest-dom");
// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.COMMIT_HASH = 'test-commit-hash';
// 全局 fetch mock
const mockFetch = vitest_1.vi.fn(() => Promise.resolve({
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
    type: 'basic',
}));
vitest_1.vi.stubGlobal('fetch', mockFetch);
// Next.js Router mock
const mockRouter = {
    pathname: '/',
    query: {},
    asPath: '/',
    push: vitest_1.vi.fn(() => Promise.resolve(true)),
    replace: vitest_1.vi.fn(() => Promise.resolve(true)),
    reload: vitest_1.vi.fn(),
    back: vitest_1.vi.fn(),
    prefetch: vitest_1.vi.fn(() => Promise.resolve()),
    beforePopState: vitest_1.vi.fn(),
    events: {
        on: vitest_1.vi.fn(),
        off: vitest_1.vi.fn(),
        emit: vitest_1.vi.fn(),
    },
};
vitest_1.vi.mock('next/router', () => ({
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
        assign: vitest_1.vi.fn(),
        reload: vitest_1.vi.fn(),
        replace: vitest_1.vi.fn(),
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
    }
    catch (error) {
        // 如果加载失败，创建一个简单的 polyfill
        // If loading fails, create a simple polyfill
        console.warn('Failed to load DOMMatrix polyfill:', error);
        globalThis.DOMMatrix = class DOMMatrix {
            constructor(init) {
                // 简单的实现，仅用于测试环境
                // Simple implementation for test environment only
            }
            static fromMatrix(other) {
                return new DOMMatrix();
            }
            static fromFloat32Array(array32) {
                return new DOMMatrix();
            }
            static fromFloat64Array(array64) {
                return new DOMMatrix();
            }
        };
    }
}
// 如果需要配置其他全局设置，可以在这里添加
// 例如：全局 mock、测试工具配置等
