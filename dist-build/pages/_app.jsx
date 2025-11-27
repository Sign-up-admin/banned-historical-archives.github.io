"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/globals.css");
const head_1 = __importDefault(require("next/head"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const styles_1 = require("@mui/material/styles");
const styles_2 = require("@mui/material/styles");
const theme = (0, styles_1.createTheme)({
    palette: {
        primary: {
            main: '#cc0000',
        },
    },
    components: {},
});
function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);
    return (<styles_2.ThemeProvider theme={theme}>
      <head_1.default>
        <meta httpEquiv="content-language" content="zh-CN"/>
        <meta name="description" content="和谐历史档案馆 Banned Historical Archives"/>
        <meta name="color-scheme" content="light only"></meta>
      </head_1.default>
      <h1 style={{ position: 'fixed', left: '100%' }}>和谐历史档案馆</h1>
      {getLayout(<Component {...pageProps}/>)}
    </styles_2.ThemeProvider>);
}
exports.default = (0, dynamic_1.default)(() => Promise.resolve(MyApp), {
    ssr: false,
});
