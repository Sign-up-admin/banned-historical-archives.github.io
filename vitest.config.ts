import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 测试环境：jsdom 用于 React 组件测试
    environment: 'jsdom',
    // 启用全局 API（describe, it, expect 等）
    globals: true,
    // 测试设置文件（可选）
    setupFiles: ['./test/setup.ts'],
    // 测试文件匹配模式
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    // 覆盖率配置（Vitest 4.0+ 版本）
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/out/',
        '**/build/',
        '**/.next/',
        'docs/',
        'scripts/',
        'migration/',
        'public/',
        'styles/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    // 输出 JUnit 格式的测试结果，用于 CI/CD 报告
    reporters: ['default', 'junit'],
    outputFile: './coverage/junit.xml',
  },
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
