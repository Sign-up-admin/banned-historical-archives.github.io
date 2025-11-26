"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = __importDefault(require("react"));
const head_1 = __importDefault(require("next/head"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const README_md_1 = __importDefault(require("../README.md"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const Layout_1 = __importDefault(require("../components/Layout"));
function Home() {
    return (<>
      <head_1.default>
        <title>和谐历史档案馆 Banned Historical Archives</title>
      </head_1.default>
      <Stack_1.default className={'markdown'} p={2} style={{ overflow: 'scroll', flex: 1, height: '100%' }}>
        <react_markdown_1.default remarkPlugins={[remark_gfm_1.default]}>
          {README_md_1.default}
        </react_markdown_1.default>
      </Stack_1.default>
    </>);
}
Home.getLayout = (page) => <Layout_1.default>{page}</Layout_1.default>;
