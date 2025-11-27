"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageTags;
const Chip_1 = __importDefault(require("@mui/material/Chip"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const react_1 = require("react");
const Popover_1 = __importDefault(require("@mui/material/Popover"));
/**
 * 图片标签显示组件
 *
 * 专门用于图片库的标签显示组件，显示标签名称和类型提示。
 * 与 Tags 组件类似，但专门用于图片相关的标签展示。
 *
 * @param tags - 要显示的标签数组，每个标签包含 name 和 type 属性
 */
function ImageTags({ tags, }) {
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    const [label, setLabel] = (0, react_1.useState)('');
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (<>
      <Popover_1.default open={open} anchorEl={anchorEl} disableRestoreFocus sx={{
            pointerEvents: 'none',
        }} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}>
        <Typography_1.default sx={{ p: 2 }}>{label}</Typography_1.default>
      </Popover_1.default>

      {tags.map((tag) => (<Chip_1.default key={tag.type + '##' + tag.name} onMouseEnter={(event) => {
                setLabel(tag.type);
                setAnchorEl(event.currentTarget);
            }} onMouseLeave={handleClose} sx={{ m: 0.3 }} label={tag.name}/>))}
    </>);
}
