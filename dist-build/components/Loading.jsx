"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Loading;
const Backdrop_1 = __importDefault(require("@mui/material/Backdrop"));
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
/**
 * 加载状态组件
 *
 * 显示一个半透明背景的圆形进度条，用于表示页面或内容正在加载中。
 * 使用 Material-UI 的 Backdrop 和 CircularProgress 组件实现。
 */
function Loading() {
    return (<Backdrop_1.default open={true} sx={{ zIndex: 3, background: 'transparent' }}>
      <CircularProgress_1.default />
    </Backdrop_1.default>);
}
