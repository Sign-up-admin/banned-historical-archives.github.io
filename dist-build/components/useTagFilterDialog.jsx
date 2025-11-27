"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTagFilterDialog = useTagFilterDialog;
const react_1 = require("react");
const Button_1 = __importDefault(require("@mui/material/Button"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const material_1 = require("@mui/material");
const types_1 = require("../types");
function useTagFilterDialog(tags_all, tags_all_order_by_type) {
    const [show, setTagDialog] = (0, react_1.useState)(false);
    const [tagFilter, setTagFilter] = (0, react_1.useState)(null);
    const [tags, setTags] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)(tags_all.length ? tags_all[0] : null);
    const onClose = (0, react_1.useCallback)(() => setTagDialog(false), []);
    const [default_tags, setDefaultTags] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const t = Array.from(tags_all_order_by_type.get(types_1.TagType.articleType)?.values() || []);
        setDefaultTags(t);
        setTags(t);
    }, [tags_all_order_by_type]);
    const onConfirm = (0, react_1.useCallback)(() => {
        setTags(selected ? [...default_tags, selected] : default_tags);
        setTagFilter(selected ? selected.id : null);
        setTagDialog(false);
    }, [selected, default_tags]);
    const TagDialog = (<Dialog_1.default onClose={onClose} open={show} fullWidth maxWidth="lg">
      <DialogTitle_1.default>选择标签</DialogTitle_1.default>
      <DialogContent_1.default>
        {Array.from(tags_all_order_by_type.keys()).map((type) => (<div key={type}>
            <Typography_1.default variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              {type}：
            </Typography_1.default>
            {Array.from(tags_all_order_by_type.get(type).values())
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((tag) => (<material_1.Chip sx={{ m: 0.5 }} key={tag.id} onClick={() => setSelected(tag)} label={tag.name} color={selected?.id === tag.id ? 'primary' : 'default'} variant={selected?.id === tag.id ? 'filled' : 'outlined'}/>))}
          </div>))}
      </DialogContent_1.default>
      <DialogActions_1.default>
        <Button_1.default onClick={onClose}>取消</Button_1.default>
        <Button_1.default onClick={onConfirm} autoFocus>
          确定
        </Button_1.default>
      </DialogActions_1.default>
    </Dialog_1.default>);
    return {
        TagDialog,
        tagFilter,
        setTagDialog,
        setTagFilter,
        tags,
    };
}
