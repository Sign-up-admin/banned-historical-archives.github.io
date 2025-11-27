"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSourceFilterDialog = useSourceFilterDialog;
const react_1 = require("react");
const Button_1 = __importDefault(require("@mui/material/Button"));
const DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const material_1 = require("@mui/material");
function useSourceFilterDialog(sources_all, onChange) {
    const [show, setShow] = (0, react_1.useState)(false);
    const [selected, setSelected] = (0, react_1.useState)(sources_all[0]);
    const SourceDialog = (<Dialog_1.default onClose={() => setShow(false)} open={show} fullWidth maxWidth="lg">
      <DialogTitle_1.default>选择来源</DialogTitle_1.default>
      <DialogContent_1.default>
        {sources_all.map((i) => (<material_1.Chip sx={{ m: 0.5 }} key={i} onClick={() => setSelected(i)} label={i} color={selected === i ? 'primary' : 'default'} variant={selected === i ? 'filled' : 'outlined'}/>))}
      </DialogContent_1.default>
      <DialogActions_1.default>
        <Button_1.default onClick={() => {
            setShow(false);
        }}>
          取消
        </Button_1.default>
        <Button_1.default onClick={() => {
            onChange(selected);
            setShow(false);
        }} autoFocus>
          确定
        </Button_1.default>
      </DialogActions_1.default>
    </Dialog_1.default>);
    return {
        SourceDialog,
        showSourceDialog: () => setShow(true),
    };
}
