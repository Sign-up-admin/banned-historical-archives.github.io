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
exports.default = ArticleViewer;
const react_1 = __importStar(require("react"));
const diff_match_patch_1 = require("diff-match-patch");
const head_1 = __importDefault(require("next/head"));
const Select_1 = __importDefault(require("@mui/material/Select"));
const Menu_1 = __importDefault(require("@mui/material/Menu"));
const InputLabel_1 = __importDefault(require("@mui/material/InputLabel"));
const FormControl_1 = __importDefault(require("@mui/material/FormControl"));
const Grid2_1 = __importDefault(require("@mui/material/Grid2"));
const OutlinedInput_1 = __importDefault(require("@mui/material/OutlinedInput"));
const MenuItem_1 = __importDefault(require("@mui/material/MenuItem"));
const Chip_1 = __importDefault(require("@mui/material/Chip"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const react_pdf_1 = require("react-pdf");
const Layout_1 = __importDefault(require("../../components/Layout"));
const DiffViewer_1 = require("../../components/DiffViewer");
const Tags_1 = __importDefault(require("../../components/Tags"));
const Authors_1 = __importDefault(require("../../components/Authors"));
const utils_1 = require("../../utils");
const Article_1 = __importDefault(require("../../components/Article"));
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs-dist/legacy/build/pdf.worker.min.js`;
const commit_hash = process.env.COMMIT_HASH;
const virtual_publication_id = '--preview-patch--';
/**
 * 对比类型枚举
 * Comparison type enumeration
 */
let CompareType;
(function (CompareType) {
    CompareType["none"] = "none";
    CompareType["origin"] = "origin";
    CompareType["originProofread"] = "originProofread";
    CompareType["version"] = "version";
})(CompareType || (CompareType = {}));
/**
 * 将内容数组连接为单个字符串
 * Join content array into a single string
 *
 * @param contents - 包含text属性的内容对象数组 / Array of content objects with text property
 * @returns 连接后的字符串 / Joined string
 */
function join_text(contents) {
    let s = '';
    contents.forEach((i) => (s += i.text));
    return s;
}
/**
 * 将日期对象转换为字符串格式
 * Convert date object to string format
 *
 * @param date - 日期对象 / Date object
 * @returns 格式化的日期字符串 (年.月.日) / Formatted date string (year.month.day)
 */
function date_to_string(date) {
    return [date.year || '', date.month || '', date.day || '']
        .filter((j) => j)
        .join('.');
}
/**
 * 对比模式枚举
 * Comparison mode enumeration
 */
let CompareMode;
(function (CompareMode) {
    CompareMode["line"] = "\u9010\u884C\u5BF9\u6BD4";
    CompareMode["literal"] = "\u9010\u5B57\u5BF9\u6BD4";
    CompareMode["description_and_comments"] = "\u63CF\u8FF0\u548C\u6CE8\u91CA";
})(CompareMode || (CompareMode = {}));
/**
 * 文章查看器组件
 * Article Viewer Component
 *
 * 用于显示和对比历史档案文章的详细内容，支持：
 * - 多版本文章对比（逐行、逐字、描述和注释对比）
 * - PDF预览功能
 * - OCR补丁预览
 * - 版本选择和管理
 *
 * Displays and compares detailed content of historical archive articles, supporting:
 * - Multi-version article comparison (line-by-line, character-by-character, description and comments)
 * - PDF preview functionality
 * - OCR patch preview
 * - Version selection and management
 *
 * @example
 * ```tsx
 * // 通过URL参数访问文章
 * // Access article via URL parameter
 * // /article?id=883eeb87ad
 * // /article?id=883eeb87ad&publication_id=mao1966
 * ```
 */
function ArticleViewer() {
    const [books, setBooks] = (0, react_1.useState)([]);
    const [articleId, setArticleId] = (0, react_1.useState)();
    const booksRef = (0, react_1.useRef)(books);
    const [previewScale, setPreviewScale] = (0, react_1.useState)(1);
    const [showMore, setShowMore] = (0, react_1.useState)(true);
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    const [compareType, setCompareType] = (0, react_1.useState)(CompareType.none);
    const [comparedPublication, setComparePublication] = (0, react_1.useState)();
    const [compareMode, setCompareMode] = (0, react_1.useState)(CompareMode.line);
    const [selectedPublication, setSelectedPublication] = (0, react_1.useState)();
    const isLocalhost = (global || window)['location']?.hostname === 'localhost';
    (0, react_1.useEffect)(() => {
        (async () => {
            const id = new URLSearchParams(location.search).get('id');
            const data = await (await fetch(`https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/json/json/${id.slice(0, 3)}/${id}.json`)).json();
            setArticleId(id);
            setBooks(data.books);
            booksRef.current = data.books;
            setComparePublication(data.books[data.books.length - 1].id);
            setSelectedPublication(data.books[0].id);
        })();
    }, []);
    /**
     * 添加OCR补丁预览版本
     * Add OCR patch preview version
     *
     * 将OCR补丁应用到指定出版物，创建一个虚拟的预览版本用于对比
     * Applies OCR patch to specified publication and creates a virtual preview version for comparison
     *
     * @param publicationId - 出版物ID / Publication ID
     * @param patch - OCR补丁数据 / OCR patch data
     */
    const addOCRComparisonPublicationV2 = (0, react_1.useCallback)((publicationId, patch) => {
        booksRef.current = booksRef.current.filter((i) => i.id != virtual_publication_id);
        booksRef.current.push({
            id: virtual_publication_id,
            type: '',
            tags: [],
            files: [],
            name: '#OCR补丁预览#',
            article: (0, utils_1.apply_patch_v2)(booksRef.current.find((i) => i.id == publicationId).article, patch),
        });
    }, []);
    (0, react_1.useEffect)(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('publication_id')) {
            setSelectedPublication(params.get('publication_id'));
        }
    }, []);
    const [articleDiff, setArticleDiff] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (!comparedPublication || !selectedPublication) {
            setArticleDiff([]);
            return;
        }
        if (compareType !== CompareType.version || !(typeof window !== 'undefined')) {
            setArticleDiff([]);
            return;
        }
        const article_a = booksRef.current.find((i) => i.id == selectedPublication).article;
        const article_b = booksRef.current.find((i) => i.id == comparedPublication).article;
        const comments_a = article_a.comments;
        const comments_b = article_b.comments;
        const contents_a = article_a.parts;
        const contents_b = article_b.parts;
        let res = [];
        if (compareMode === CompareMode.literal) {
            res = [
                new diff_match_patch_1.diff_match_patch().diff_main(join_text([{ text: join_text(contents_a) }]), join_text([{ text: join_text(contents_b) }])),
            ];
        }
        else if (compareMode === CompareMode.description_and_comments) {
            const max_n_comment = Math.max(comments_a.length, comments_b.length);
            res = [
                new diff_match_patch_1.diff_match_patch().diff_main(article_a.description || '', article_b.description || ''),
                ...new Array(max_n_comment)
                    .fill(0)
                    .map((x, p) => new diff_match_patch_1.diff_match_patch().diff_main(comments_a[p] || '', comments_b[p] || '')),
            ];
        }
        else {
            const max_len = Math.max(contents_a.length, contents_b.length);
            let i = 0;
            while (i < max_len) {
                const a = contents_a[i] ? contents_a[i].text : '';
                const b = contents_b[i] ? contents_b[i].text : '';
                res.push(new diff_match_patch_1.diff_match_patch().diff_main(a, b));
                ++i;
            }
        }
        setArticleDiff(res);
    }, [selectedPublication, compareType, compareMode, comparedPublication]);
    const showCompareMenu = !!anchorEl;
    const book = books.find((i) => i.id == selectedPublication);
    const comparedBook = books.find((i) => i.id == comparedPublication);
    const article = book?.article;
    if (!article || !comparedBook)
        return null;
    const aliases = [];
    books.forEach((book) => {
        if (book.article.alias)
            aliases.push(book.article.alias);
    });
    const { description, parts, comments, page_start, page_end, comment_pivots } = article;
    const articleComments = comments.map((i, idx) => ({
        text: i,
        id: idx.toString(),
        offset: comment_pivots[idx]?.offset,
        index: comment_pivots[idx]?.index,
        part_idx: comment_pivots[idx]?.part_idx,
    }));
    const articleContents = parts.map((i, idx) => ({
        ...i,
        index: idx,
        id: idx.toString(),
    }));
    const comparedArticleComments = comparedBook.article.comments.map((i, idx) => ({ text: i, id: idx.toString(), ...comment_pivots[idx] }));
    const comparedArticleContents = comparedBook.article.parts.map((i, idx) => ({ ...i, index: idx, id: idx.toString() }));
    const all_tags = new Map();
    books.forEach((i) => {
        i.tags.forEach((j) => {
            all_tags.set(j.type + '##' + j.name, j);
        });
    });
    const compare_elements = [];
    compare_elements.push(<Stack_1.default sx={{
            flex: 1,
            overflowY: 'scroll',
            p: 1,
        }} key="version_a">
      {selectedPublication ? (<Article_1.default article={article} articleId={articleId} publicationId={selectedPublication} publicationName={book.name} description={description} comments={articleComments} contents={articleContents} patchable={compareType === CompareType.originProofread}/>) : null}
    </Stack_1.default>);
    if (compareType === CompareType.origin ||
        compareType === CompareType.originProofread) {
        compare_elements.push(<Stack_1.default key="origin" sx={{ flex: 1, overflowY: 'scroll' }}>
        <Stack_1.default direction="row" spacing="10px" sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1,
                opacity: 0.7,
            }}>
          <Button_1.default onClick={() => setPreviewScale(previewScale + 0.1)} variant="contained" sx={{
                borderRadius: '100%',
                width: '50px',
                minWidth: '50px',
                height: '50px',
            }}>
            +
          </Button_1.default>
          <Button_1.default onClick={() => setPreviewScale(previewScale - 0.1)} variant="contained" sx={{
                borderRadius: '100%',
                width: '50px',
                minWidth: '50px',
                height: '50px',
            }}>
            -
          </Button_1.default>
        </Stack_1.default>
        {book.type !== 'db' ? (book.type === 'pdf' ? (<>
              <Typography_1.default variant="subtitle1">
                来源文件(页码{page_start}-{page_end})
                <a href={book.files[0]} target="__blank">
                  [下载]
                </a>
              </Typography_1.default>
              <react_pdf_1.Document file={book.files[0] || ''} options={{
                    cMapUrl: `/pdfjs-dist/cmaps/`,
                    cMapPacked: true,
                }}>
                {new Array(page_end - page_start + 1).fill(0).map((i, idx) => (<react_pdf_1.Page pageNumber={idx + page_start} key={idx} width={500 * previewScale}/>))}
              </react_pdf_1.Document>
            </>) : book.type === 'img' ? (book.files
                .filter((i, idx) => idx + 1 >= page_start && idx + 1 <= page_end)
                .map((f) => (<img alt="" key={f} src={f} width={previewScale * 500}/>))) : (<>未知类型</>)) : ('无法预览（来自数据库文件）')}
      </Stack_1.default>);
    }
    else if (compareType === CompareType.version) {
        compare_elements.push(<Stack_1.default key="version_b" sx={{ flex: 1 }}>
        <FormControl_1.default>
          <InputLabel_1.default>对比目标</InputLabel_1.default>
          <Select_1.default size="small" value={comparedPublication} input={<OutlinedInput_1.default label="对比目标"/>} onChange={(e) => {
                setComparePublication(e.target.value);
            }}>
            {books.map((i) => (<MenuItem_1.default key={i.id} value={i.id}>
                {i.name}
              </MenuItem_1.default>))}
          </Select_1.default>
        </FormControl_1.default>
        <Stack_1.default sx={{
                overflowY: 'scroll',
            }}>
          {comparedPublication && articleId ? (<Article_1.default description={comparedBook.article.description} articleId={articleId} article={comparedBook.article} publicationId={comparedPublication} comments={comparedArticleComments} contents={comparedArticleContents}/>) : null}
        </Stack_1.default>
      </Stack_1.default>, <Stack_1.default key="result" sx={{ flex: 1 }}>
        <FormControl_1.default>
          <InputLabel_1.default>对比模式</InputLabel_1.default>
          <Select_1.default size="small" value={compareMode} input={<OutlinedInput_1.default label="对比模式"/>} onChange={(e) => {
                setCompareMode(e.target.value);
            }}>
            <MenuItem_1.default value={CompareMode.line}>{CompareMode.line}</MenuItem_1.default>
            <MenuItem_1.default value={CompareMode.literal}>
              {CompareMode.literal}
            </MenuItem_1.default>
            <MenuItem_1.default value={CompareMode.description_and_comments}>
              {CompareMode.description_and_comments}
            </MenuItem_1.default>
          </Select_1.default>
        </FormControl_1.default>
        <Stack_1.default sx={{ overflowY: 'scroll' }}>
          <DiffViewer_1.DiffViewer diff={articleDiff}/>
        </Stack_1.default>
      </Stack_1.default>);
    }
    const details = (<>
      <Grid2_1.default size={{ md: 6, xs: 12 }}>
        <Stack_1.default direction="row" spacing={1} alignItems="center">
          <Typography_1.default variant="body1">作者：</Typography_1.default>
          <Stack_1.default direction="row" sx={{ overflowX: 'scroll', flex: 1 }}>
            <Authors_1.default authors={article.authors}/>
          </Stack_1.default>
          {books.map((i) => (<img alt="" style={{ cursor: 'pointer' }} key={i.id} onClick={() => window.open(`https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues?q=+${encodeURIComponent(`is:issue "${articleId}" "${i.id}"`)}+`, '_blank')} src={`https://img.shields.io/github/issues-search/banned-historical-archives/banned-historical-archives.github.io?style=for-the-badge&color=%23cc0000&label=%E6%A0%A1%E5%AF%B9%E8%AE%B0%E5%BD%95&query=${encodeURIComponent(`is:issue "${articleId}" "${i.id}"`)}`}/>))}
        </Stack_1.default>
      </Grid2_1.default>
      <Grid2_1.default size={{ md: 3, xs: 12 }}>
        <Typography_1.default variant="body1" sx={{ overflowX: 'scroll' }}>
          时间：
          {article.is_range_date
            ? `${date_to_string(article.dates[0])}-${date_to_string(article.dates[1])}`
            : article.dates.map((i) => date_to_string(i)).join(',')}
        </Typography_1.default>
      </Grid2_1.default>
      <Grid2_1.default size={{ xs: 12, md: 3 }}>
        <Stack_1.default direction="row" alignItems="center">
          <Typography_1.default variant="body1">标签：</Typography_1.default>
          <Stack_1.default direction="row" spacing={1} alignItems="center" sx={{ flex: 1, overflowX: 'scroll' }}>
            <Tags_1.default tags={Array.from(all_tags.values())}/>
          </Stack_1.default>
        </Stack_1.default>
      </Grid2_1.default>
      <Grid2_1.default size={{ xs: 12, md: 6 }}>
        <Stack_1.default direction="row" alignItems="center" spacing={1}>
          <Typography_1.default variant="body1">选择来源：</Typography_1.default>
          <Stack_1.default direction="row" spacing={1} sx={{ flex: 1, overflowX: 'scroll' }}>
            {books.map((i) => (<Chip_1.default key={i.id} label={i.name} variant={selectedPublication === i.id ? 'filled' : 'outlined'} color={selectedPublication === i.id ? 'primary' : 'default'} onClick={(e) => {
                setSelectedPublication(i.id);
            }}/>))}
          </Stack_1.default>

          <Button_1.default variant="outlined" aria-controls={showCompareMenu ? 'basic-menu' : undefined} aria-haspopup="true" size="small" aria-expanded={showCompareMenu ? 'true' : undefined} onClick={(event) => setAnchorEl(event.currentTarget)}>
            对比
          </Button_1.default>
          <Menu_1.default id="basic-menu" anchorEl={anchorEl} open={showCompareMenu} onClose={() => setAnchorEl(null)} MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}>
            <MenuItem_1.default onClick={() => {
            setCompareType(CompareType.origin);
            setAnchorEl(null);
        }}>
              对比原始文件
            </MenuItem_1.default>
            <MenuItem_1.default onClick={() => {
            setCompareType(CompareType.originProofread);
            setAnchorEl(null);
        }}>
              对比原始文件并校对
            </MenuItem_1.default>
            <MenuItem_1.default onClick={() => {
            setComparePublication(booksRef.current.length === 1
                ? booksRef.current[0].id
                : booksRef.current.find((i) => i.id !== book.id).id);
            setCompareType(CompareType.version);
            setAnchorEl(null);
        }}>
              对比不同来源解析后的文本
            </MenuItem_1.default>
            <MenuItem_1.default onClick={() => {
            let str = prompt('导入代码') || '';
            str = str.replace(/^\{OCR补丁\}/, '');
            str = str.substr(0, str.lastIndexOf('}') + 1);
            try {
                const patchWrap = JSON.parse(str);
                addOCRComparisonPublicationV2(patchWrap.publicationId, patchWrap.patch);
                setComparePublication(virtual_publication_id);
                setSelectedPublication(patchWrap.publicationId);
                setCompareType(CompareType.version);
                setAnchorEl(null);
            }
            catch (e) {
                alert('解析错误');
            }
        }}>
              导入代码对比OCR校对结果
            </MenuItem_1.default>
            <MenuItem_1.default onClick={() => {
            setCompareType(CompareType.none);
            setAnchorEl(null);
        }}>
              取消
            </MenuItem_1.default>
          </Menu_1.default>
        </Stack_1.default>
      </Grid2_1.default>
    </>);
    return (<>
      <Stack_1.default sx={{
            height: '100%',
            boxSizing: 'border-box',
            background: 'white',
            zIndex: 1,
            top: 0,
            left: 0,
        }} pb={0}>
        <Grid2_1.default container alignItems="center" sx={{ pt: 2, pl: 2, pr: 2 }} spacing={2}>
          <Grid2_1.default size={{ md: 6, xs: 10 }}>
            <Typography_1.default variant="body1" sx={{ overflowX: 'scroll' }}>
              标题：
              {article.title}
              {aliases.length ? `(别名:${aliases.join(',')})` : ''}
            </Typography_1.default>
          </Grid2_1.default>
          <Grid2_1.default size={2} sx={{ display: { md: 'none', xs: 'flex' }, justifyContent: 'end' }}>
            <Button_1.default onClick={() => setShowMore(!showMore)}>
              {showMore ? '隐藏' : '展开'}
            </Button_1.default>
          </Grid2_1.default>
          {showMore ? details : null}
        </Grid2_1.default>
        <Stack_1.default direction="row" divider={<Divider_1.default orientation="vertical" flexItem/>} spacing={2} sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {compare_elements}
        </Stack_1.default>
      </Stack_1.default>
      <head_1.default>
        <title>
          {article.title} - 和谐历史档案馆 Banned Historical Archives
        </title>
      </head_1.default>
    </>);
}
ArticleViewer.getLayout = (page) => <Layout_1.default>{page}</Layout_1.default>;
