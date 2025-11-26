"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateFilterDialog = useDateFilterDialog;
const react_1 = require("react");
const Button_1 = __importDefault(require("@mui/material/Button"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
function to_number(s) {
    const n = parseInt(s);
    if (!isNaN(n) && n != Infinity && n != -Infinity) {
        return n;
    }
    return undefined;
}
function useDateFilterDialog(default_date_filter, onChange) {
    const dateFilter = (0, react_1.useRef)(default_date_filter);
    const [show, setShow] = (0, react_1.useState)(false);
    const [_, forceUpdate] = (0, react_1.useState)(0);
    const onConfirm = (0, react_1.useCallback)(() => {
        const d = dateFilter.current;
        const res = {};
        if (d.year_a && d.year_b && d.year_b >= d.year_a) {
            res.year_a = d.year_a;
            res.year_b = d.year_b;
        }
        if (d.month_a &&
            d.month_b &&
            d.month_a >= 1 &&
            d.month_a <= 12 &&
            d.month_b >= 1 &&
            d.month_b <= 12) {
            res.month_a = d.month_a;
            res.month_b = d.month_b;
        }
        if (d.day_a &&
            d.day_b &&
            d.day_a >= 1 &&
            d.day_a <= 31 &&
            d.day_b >= 1 &&
            d.day_b <= 31) {
            res.day_a = d.day_a;
            res.day_b = d.day_b;
        }
        if (res.year_a && res.month_a && res.day_a) {
            onChange(res);
            setShow(false);
            dateFilter.current = res;
            forceUpdate((x) => x + 1);
        }
    }, []);
    const DateFilterDialog = (<Dialog_1.default onClose={() => setShow(false)} open={show}>
      <DialogTitle_1.default>时间过滤器</DialogTitle_1.default>
      <DialogContent_1.default>
        <Stack_1.default spacing={1}>
          <Typography_1.default variant="subtitle1">开始时间</Typography_1.default>
          <TextField_1.default label="年" value={dateFilter.current.year_a} size="small" onChange={(e) => {
            dateFilter.current.year_a = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
          <TextField_1.default label="月" value={dateFilter.current.month_a} size="small" onChange={(e) => {
            dateFilter.current.month_a = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
          <TextField_1.default label="日" value={dateFilter.current.day_a} size="small" onChange={(e) => {
            dateFilter.current.day_a = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
          <Typography_1.default variant="subtitle1">结束时间</Typography_1.default>
          <TextField_1.default label="年" value={dateFilter.current.year_b} size="small" onChange={(e) => {
            dateFilter.current.year_b = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
          <TextField_1.default label="月" value={dateFilter.current.month_b} size="small" onChange={(e) => {
            dateFilter.current.month_b = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
          <TextField_1.default label="日" value={dateFilter.current.day_b} size="small" onChange={(e) => {
            dateFilter.current.day_b = to_number(e.target.value);
            forceUpdate((x) => x + 1);
        }}/>
        </Stack_1.default>
      </DialogContent_1.default>
      <DialogActions_1.default>
        <Button_1.default onClick={() => setShow(false)}>取消</Button_1.default>
        <Button_1.default onClick={onConfirm} autoFocus>
          确定
        </Button_1.default>
      </DialogActions_1.default>
    </Dialog_1.default>);
    return {
        DateFilterDialog,
        showDateFilterDialog: () => setShow(true),
    };
}
