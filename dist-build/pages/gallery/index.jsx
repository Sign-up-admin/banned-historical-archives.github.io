"use strict";
const __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    let desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
const __importStar = (this && this.__importStar) || (function () {
    let ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            const ar = [];
            for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        const result = {};
        if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Gallery;
const react_1 = __importStar(require("react"));
const head_1 = __importDefault(require("next/head"));
const Layout_1 = __importDefault(require("../../components/Layout"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
const utils_1 = require("../../utils");
const ImageTags_1 = __importDefault(require("../../components/ImageTags"));
const locales_1 = require("@mui/x-data-grid/locales");
const ClickToShow = ({ url }) => {
    const [clicked, setClicked] = (0, react_1.useState)(false);
    return clicked ? (<img alt="" src={url} style={{ width: '100%' }}/>) : (<Button_1.default onClick={() => setClicked(true)}>显示</Button_1.default>);
};
const columns = [
    {
        field: 'url',
        headerName: '预览',
        minWidth: 350,
        flex: 1,
        renderCell: (params) => (<ClickToShow url={params.row.url}/>),
    },
    {
        field: 'name',
        headerName: '名称',
        minWidth: 350,
        flex: 1,
        renderCell: (params) => (<div>{params.row.name}</div>),
    },
    {
        field: 'description',
        headerName: '描述',
        minWidth: 150,
        flex: 1,
        renderCell: (params) => (<div>{params.row.description}</div>),
    },
    {
        field: 'source',
        headerName: '来源',
        flex: 1,
        renderCell: (params) => (<div>{params.row.source}</div>),
    },
    {
        field: 'dates',
        headerName: '时间',
        minWidth: 150,
        flex: 1,
        valueGetter: (_, row) => row.year
            ? [
                row.year || '----',
                (0, utils_1.ensure_two_digits)(row.month, '--'),
                (0, utils_1.ensure_two_digits)(row.day, '--'),
            ]
                .filter((j) => j)
                .join('/')
            : '----/--/--',
        renderCell: (params) => (<Stack_1.default spacing={1}>
        <Typography_1.default variant="caption">
          {params.row.year
                ? [
                    params.row.year,
                    (0, utils_1.ensure_two_digits)(params.row.month),
                    (0, utils_1.ensure_two_digits)(params.row.day),
                ]
                    .filter((j) => j)
                    .join('/')
                : '----/--/--'}
        </Typography_1.default>
      </Stack_1.default>),
    },
    {
        field: 'tags',
        headerName: '标签',
        minWidth: 150,
        flex: 1,
        sortComparator: (tags_a, tags_b) => {
            return tags_a > tags_b ? 1 : -1;
        },
        valueGetter: (tags) => tags.map((i) => i.name).join(','),
        renderCell: (params) => (<div style={{ overflow: 'visible' }}>
        <ImageTags_1.default tags={params.row.tags}/>
      </div>),
    },
];
function Gallery() {
    const [gallery, setGallery] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        (async () => {
            setGallery(await (await fetch('https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/gallery.json')).json());
        })();
    }, []);
    return (<Stack_1.default p={2} sx={{ height: '100%', overflow: 'scroll' }}>
      <head_1.default>
        <title>和谐历史档案馆 Banned Historical Archives</title>
      </head_1.default>
      <Typography_1.default variant="h4" sx={{ mb: 1 }}>
        图库
      </Typography_1.default>
      <Stack_1.default sx={{ flex: 1, width: '100%', height: '500px' }}>
        <x_data_grid_pro_1.DataGridPro getRowId={(row) => row.id} getRowHeight={() => 'auto'} rows={gallery} columns={columns} localeText={locales_1.zhCN.components.MuiDataGrid.defaultProps.localeText} pageSizeOptions={[100]}/>
      </Stack_1.default>
    </Stack_1.default>);
}
Gallery.getLayout = (page) => <Layout_1.default>{page}</Layout_1.default>;
