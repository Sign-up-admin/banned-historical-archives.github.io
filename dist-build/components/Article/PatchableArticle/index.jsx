"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatchableArticle;
const material_1 = require("@mui/material");
const diff_match_patch_1 = require("diff-match-patch");
const react_1 = require("react");
const CommentEditor_1 = __importDefault(require("./CommentEditor"));
const PartEditor_1 = __importDefault(require("./PartEditor"));
/**
 * 可编辑文章组件
 *
 * 提供文章的完整编辑功能，包括内容修改、注释编辑和版本控制。
 * 支持实时预览修改差异，可以提交修改补丁到系统。
 * 使用 diff-match-patch 库处理文本差异比较。
 *
 * @param articleId - 文章唯一标识符
 * @param description - 文章描述（可选）
 * @param contents - 文章内容数组
 * @param comments - 文章注释数组
 * @param article - 解析后的文章数据
 * @param publicationName - 出版物名称（可选）
 * @param publicationId - 出版物ID
 */
const commit_hash = process.env.COMMIT_HASH;
function PatchableArticle({ contents, comments, description, article, articleId, publicationId, publicationName, }) {
    const changes = (0, react_1.useRef)({
        version: 2,
        parts: {},
        comments: {},
        description: '',
    });
    const [popoverContent, setPopoverContent] = (0, react_1.useState)('');
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    return (<>
      <material_1.Stack sx={{ mb: 1 }} spacing={1} direction="row">
        <material_1.Button variant="outlined" size="small" onClick={() => window.open('https://github.com/banned-historical-archives/banned-historical-archives.github.io/wiki/%E6%A0%87%E5%87%86%E5%8C%96%E6%96%87%E7%A8%BF%E5%BD%95%E5%85%A5%E4%B8%8E%E6%A0%A1%E5%AF%B9', '_blank')}>
          校对注意事项
        </material_1.Button>
      </material_1.Stack>
      <material_1.Popover open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <material_1.TextField multiline value={popoverContent}/>
      </material_1.Popover>
      {contents.map((content, idx) => (<PartEditor_1.default key={content.id} onChange={(partDiff) => {
                if (partDiff.diff ||
                    partDiff.delete ||
                    (partDiff.type && partDiff.type !== content.type) ||
                    partDiff.insertAfter ||
                    partDiff.insertBefore) {
                    changes.current.parts[idx] = partDiff;
                }
                else {
                    delete changes.current.parts[idx];
                }
            }} idx={idx} comments={comments} content={content}/>))}
      <material_1.Divider sx={{ mt: 2, mb: 2 }}/>
      <material_1.Typography variant="h6" sx={{ mb: 2 }}>
        描述
      </material_1.Typography>
      {((comment) => {
            return (<material_1.TextField defaultValue={comment.text} multiline onChange={(e) => {
                    if (e.target.value.length === 0) {
                        delete changes.current.description;
                        return;
                    }
                    const diff = new diff_match_patch_1.diff_match_patch().diff_main(comment.text, e.target.value);
                    if (comment.text && diff.length === 1) {
                        changes.current.description = '';
                    }
                    else {
                        changes.current.description =
                            new diff_match_patch_1.diff_match_patch().diff_toDelta(diff);
                    }
                }}/>);
        })(comments.find((i) => i.index === -1) || {
            index: -1,
            text: '',
        })}
      <material_1.Divider sx={{ mt: 2, mb: 2 }}/>
      <material_1.Typography variant="h6" sx={{ mb: 2 }}>
        注释
      </material_1.Typography>
      <ol>
        {!comments.filter((i) => i.index !== -1).length ? (<CommentEditor_1.default key="virtual" content={''} onChange={(diff) => {
                if (diff.diff || diff.insertAfter || diff.insertBefore) {
                    changes.current.newComments = [
                        ...(diff.insertBefore || []).map((i) => i.text),
                        ...(diff.diff
                            ? [
                                new diff_match_patch_1.diff_match_patch()
                                    .diff_fromDelta('', diff.diff)
                                    .filter((i) => i[0] !== -1)
                                    .map((i) => i[1])
                                    .join(''),
                            ]
                            : []),
                        ...(diff.insertAfter || []).map((i) => i.text),
                    ];
                }
                else {
                    delete changes.current.newComments;
                }
            }}/>) : (comments
            .filter((i) => i.index !== -1)
            .map((comment, idx) => {
            return (<CommentEditor_1.default key={idx} content={comment.text} onChange={(commentDiff) => {
                    if (commentDiff.diff ||
                        commentDiff.delete ||
                        commentDiff.insertAfter ||
                        commentDiff.insertBefore) {
                        changes.current.comments[comment.index] = commentDiff;
                    }
                    else {
                        delete changes.current.comments[comment.index];
                    }
                }}/>);
        }))}
      </ol>
      <material_1.Stack spacing={1}>
        <material_1.Button variant="contained" size="small" sx={{ width: 80, mt: 1 }} onClick={() => {
            const params = JSON.stringify({
                articleId: articleId,
                publicationId: publicationId,
                commitHash: commit_hash,
                patch: changes.current,
            });
            const url = `https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues/new?title=${encodeURIComponent(`[OCR patch]${article.title}[${publicationName}][${articleId}][${publicationId}]`)}&body=${encodeURIComponent(`{OCR补丁}
${params}
请复制以上代码在对比选项中粘贴进行预览：https://banned-historical-archives.github.io/articles/${articleId}
`)}`;
            window.open(url, '_blank');
        }}>
          提交变更
        </material_1.Button>
        <material_1.Typography>
          如果出现 Your request URL is too long 的错误，请点击
          <material_1.Button size="small" onClick={(e) => {
            const params = JSON.stringify({
                articleId: articleId,
                publicationId: publicationId,
                commitHash: commit_hash,
                patch: changes.current,
            });
            const text = `{OCR补丁}
${params}
请复制以上代码在对比选项中粘贴进行预览：https://banned-historical-archives.github.io/articles/${articleId}`;
            navigator.clipboard.writeText(text);
            const url = `https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues/new?title=${encodeURIComponent(`[OCR patch]${article.title}[${publicationName}][${articleId}][${publicationId}]`)}`;
            window.open(url, '_blank');
            setPopoverContent(text);
            setAnchorEl(e.currentTarget);
        }}>
            复制代码并跳转
          </material_1.Button>
          ，粘贴代码再提交。
        </material_1.Typography>
        <material_1.Typography>
          如果核对无误也可以提交，使其他人知道此文稿已经被校对（可多次提交，表示多次核对）
        </material_1.Typography>
      </material_1.Stack>
    </>);
}
