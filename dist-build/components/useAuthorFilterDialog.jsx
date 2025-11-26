"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthorFilterDialog = useAuthorFilterDialog;
const react_1 = require("react");
const Button_1 = __importDefault(require("@mui/material/Button"));
const DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const material_1 = require("@mui/material");
const x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
const locales_1 = require("@mui/x-data-grid/locales");
/**
 * 作者筛选对话框 Hook
 *
 * 提供一个用于筛选作者的对话框组件，显示所有可用作者的列表，
 * 用户可以选择特定的作者进行筛选。使用 Material-UI DataGrid 显示作者列表。
 *
 * @param authors_all - 所有可用的作者列表
 * @param onChange - 作者选择变化时的回调函数
 * @returns 返回对话框的显示控制和组件
 */
function useAuthorFilterDialog(authors_all, onChange) {
    const [show, setShow] = (0, react_1.useState)(false);
    const [selected, setSelected] = (0, react_1.useState)(authors_all[0]);
    const columns = (0, react_1.useRef)([
        {
            field: 'name',
            headerName: '作者',
            minWidth: 350,
            flex: 1,
            renderCell: (params) => {
                return (<material_1.Chip sx={{ m: 0.5 }} key={params.row.name} onClick={() => {
                        setSelected(params.row.name);
                    }} label={params.row.name} color={params.row.selected ? 'primary' : 'default'} variant={params.row.selected ? 'filled' : 'outlined'}/>);
            },
        },
    ]);
    const authors = (0, react_1.useMemo)(() => authors_all.map((i) => ({ name: i, selected: selected == i })), [authors_all, selected]);
    const AuthorDialog = (<Dialog_1.default onClose={() => {
            setShow(false);
        }} open={show} fullWidth maxWidth="lg">
      <DialogTitle_1.default>选择作者</DialogTitle_1.default>
      <DialogContent_1.default sx={{ height: 600 }}>
        <x_data_grid_pro_1.DataGridPro headerFilters disableColumnFilter getRowId={(row) => row.name} disableRowSelectionOnClick rows={authors} columns={columns.current} localeText={locales_1.zhCN.components.MuiDataGrid.defaultProps.localeText} pageSizeOptions={[100]}/>
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
        AuthorDialog,
        showAuthorDialog: () => setShow(true),
    };
}
