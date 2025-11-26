"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Search;
const react_1 = __importStar(require("react"));
const head_1 = __importDefault(require("next/head"));
const Layout_1 = __importDefault(require("../../components/Layout"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
function Search() {
    const [es_size, setSize] = (0, react_1.useState)(10);
    const [es_from, setFrom] = (0, react_1.useState)(0);
    const [page, setPage] = (0, react_1.useState)(1);
    const [res, setRes] = (0, react_1.useState)();
    async function update(keyword, es_size, es_from) {
        const x = await (await fetch(`${location.hostname == 'localhost' || location.hostname == '127.0.0.1'
            ? `${location.protocol}//${location.host}:9200`
            : `${location.protocol}//${location.hostname}/search_api`}/article/_search/?source=${encodeURIComponent(JSON.stringify({
            //index: 'article',
            from: es_from,
            size: es_size,
            query: { match_phrase: { content: keyword } },
            highlight: {
                fields: { content: {} },
            },
        }))}&source_content_type=${encodeURIComponent('application/json')}`)).json();
        console.log(x);
        setRes(x.hits);
    }
    const [k, setK] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const keyword = new URLSearchParams(location.search).get('keyword');
        setK(keyword);
        update(keyword, es_size, es_from);
    }, [es_size, es_from]);
    (0, react_1.useEffect)(() => {
        setFrom(es_size * (page - 1));
    }, [page, es_size]);
    if (!res)
        return null;
    const total = Math.ceil(res.total.value / es_size);
    return (<Stack_1.default p={2} sx={{ height: '100%', overflow: 'scroll' }}>
      <head_1.default>
        <title>和谐历史档案馆 Banned Historical Archives</title>
      </head_1.default>
      <Typography_1.default variant="h4" sx={{ mb: 1 }}>
        搜索:{k}
      </Typography_1.default>
      {res.hits.map((i) => (<div key={i._id}>
          <a href={`/articles/${i._source.article_id}?publication_id=${i._source.publication_id}`} rel="noreferrer" target="_blank">
            {i._source.title}-{i._source.publication_name}
          </a>
          {i.highlight.content.map((j) => (<div key={j} style={{ marginLeft: 20, fontSize: 8 }} dangerouslySetInnerHTML={{ __html: j }}></div>))}
        </div>))}
      <div>
        <Button_1.default onClick={() => {
            if (page > 1)
                setPage(page - 1);
        }}>
          上一页
        </Button_1.default>
        {page}/{total}
        <Button_1.default onClick={() => {
            if (page < total)
                setPage(page + 1);
        }}>
          下一页
        </Button_1.default>
      </div>
    </Stack_1.default>);
}
Search.getLayout = (page) => <Layout_1.default>{page}</Layout_1.default>;
