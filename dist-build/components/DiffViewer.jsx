"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffViewer = DiffViewer;
const Typography_1 = __importDefault(require("@mui/material/Typography"));
/**
 * 差异查看器组件
 *
 * 用于显示文本差异对比结果，使用 diff-match-patch 库生成的差异数据。
 * 添加内容显示为绿色，删除内容显示为红色，相同内容正常显示。
 *
 * @param diff - 差异数据数组，每个元素包含多个 Diff 对象
 */
function DiffViewer({ diff }) {
    if (!diff)
        return null;
    return (<>
      {diff.map((i, idx) => (<Typography_1.default key={idx} variant="body1" sx={{ margin: 0.5 }}>
          {i.map((j, idx2) => (<span key={idx2} style={{
                    color: j[0] === 1 ? 'green' : j[0] === -1 ? 'red' : 'inherit',
                }}>
              {j[1]}
            </span>))}
        </Typography_1.default>))}
    </>);
}
