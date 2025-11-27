"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tags;
const Chip_1 = __importDefault(require("@mui/material/Chip"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const react_1 = require("react");
const Popover_1 = __importDefault(require("@mui/material/Popover"));
/**
 * 标签显示组件
 *
 * 显示标签列表，每个标签以 Material-UI Chip 组件呈现。
 * 支持鼠标悬停显示标签类型提示，以及点击导航到相关文章页面。
 *
 * @param tags - 要显示的标签数组
 * @param onClick - 可选的点击处理函数，默认为导航到标签搜索页面
 */
function Tags({ tags, onClick, }) {
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    const [label, setLabel] = (0, react_1.useState)('');
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (<>
      <Popover_1.default open={open} anchorEl={anchorEl} disableRestoreFocus sx={{
            pointerEvents: 'none',
            marginTop: '10px',
        }} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}>
        <Typography_1.default sx={{ p: 1 }}>{label}</Typography_1.default>
      </Popover_1.default>

      {tags.map((tag) => (<Chip_1.default key={tag.type + '##' + tag.name} onMouseEnter={(event) => {
                setLabel(tag.type);
                setAnchorEl(event.currentTarget);
            }} onMouseLeave={handleClose} onClick={() => {
                if (onClick) {
                    onClick(tag);
                }
                else {
                    window.open(`/articles?tag=${encodeURIComponent(tag.name)}`, '_blank');
                }
            }} sx={{ m: 0.3, lineHeight: '34px', float: 'left' }} label={tag.name}/>))}
    </>);
}
