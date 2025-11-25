/**
 * DOMMatrix polyfill for server-side rendering
 * This is required by react-pdf/pdfjs-dist in Node.js environments
 */

if (typeof globalThis.DOMMatrix === 'undefined') {
  try {
    // 尝试使用 dommatrix 包
    // Try to use dommatrix package
    const { DOMMatrix: DOMMatrixPolyfill } = require('dommatrix/dist/dommatrix.js');
    globalThis.DOMMatrix = DOMMatrixPolyfill;
  } catch (error) {
    // 如果加载失败，创建一个简单的 polyfill
    // If loading fails, create a simple polyfill
    console.warn('Failed to load DOMMatrix polyfill, using minimal implementation');
    
    // 最小化实现，仅用于服务器端
    // Minimal implementation for server-side only
    globalThis.DOMMatrix = class DOMMatrix {
      constructor(init) {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        
        if (typeof init === 'string') {
          // 简单的矩阵字符串解析（仅用于基本支持）
          // Simple matrix string parsing (for basic support only)
          const match = init.match(/matrix\(([^)]+)\)/);
          if (match) {
            const values = match[1].split(',').map(Number);
            if (values.length >= 6) {
              this.a = values[0];
              this.b = values[1];
              this.c = values[2];
              this.d = values[3];
              this.e = values[4];
              this.f = values[5];
            }
          }
        } else if (Array.isArray(init) && init.length >= 6) {
          this.a = init[0];
          this.b = init[1];
          this.c = init[2];
          this.d = init[3];
          this.e = init[4];
          this.f = init[5];
        }
      }
      
      static fromMatrix(other) {
        if (other instanceof DOMMatrix) {
          return new DOMMatrix([other.a, other.b, other.c, other.d, other.e, other.f]);
        }
        return new DOMMatrix();
      }
      
      static fromFloat32Array(array32) {
        if (array32 && array32.length >= 6) {
          return new DOMMatrix(Array.from(array32));
        }
        return new DOMMatrix();
      }
      
      static fromFloat64Array(array64) {
        if (array64 && array64.length >= 6) {
          return new DOMMatrix(Array.from(array64));
        }
        return new DOMMatrix();
      }
    };
  }
}

