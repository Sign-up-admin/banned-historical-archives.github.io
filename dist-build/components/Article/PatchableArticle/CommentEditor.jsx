"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommentEditor;
const material_1 = require("@mui/material");
const diff_match_patch_1 = require("diff-match-patch");
const react_1 = require("react");
function removeIds(p) {
    const diff = {
        ...p,
        insertBefore: p.insertBefore.map((i) => ({ text: i.text })),
        insertAfter: p.insertAfter.map((i) => ({ text: i.text })),
    };
    if (!diff.insertBefore.length) {
        delete diff.insertBefore;
    }
    if (!diff.insertAfter.length) {
        delete diff.insertAfter;
    }
    return diff;
}
function InsertCommentDialog(props) {
    const { onClose } = props;
    const [text, setText] = (0, react_1.useState)('');
    return (<material_1.Dialog onClose={() => onClose()} open={true}>
      <material_1.DialogTitle>插入</material_1.DialogTitle>
      <material_1.Stack spacing={2} p={2}>
        <material_1.TextField size="small" value={text} onChange={(e) => setText(e.target.value)} multiline autoFocus/>
        <material_1.ButtonGroup>
          <material_1.Button onClick={() => onClose(text)}>确定</material_1.Button>
          <material_1.Button onClick={() => onClose()}>取消</material_1.Button>
        </material_1.ButtonGroup>
      </material_1.Stack>
    </material_1.Dialog>);
}
function CommentEditor({ content, onChange, }) {
    const [showInsertBefore, setShowInsertBefore] = (0, react_1.useState)(false);
    const [showInsertAfter, setShowInsertAfter] = (0, react_1.useState)(false);
    const [insertBefore, setInsertBefore] = (0, react_1.useState)([]);
    const [insertAfter, setInsertAfter] = (0, react_1.useState)([]);
    const [deleted, setDeleted] = (0, react_1.useState)(!content);
    const commentDiff = (0, react_1.useRef)({
        insertBefore: [],
        insertAfter: [],
    });
    const originText = content;
    const [text, setText] = (0, react_1.useState)(originText);
    const center = (<material_1.Stack direction="row" sx={{ mt: 1, mb: 1 }} spacing={1}>
      <material_1.TextField sx={{ flex: 1 }} size="small" onChange={(e) => {
            const newCommentDiff = { ...commentDiff.current };
            if (!e.target.value.length) {
                newCommentDiff.delete = true;
                setDeleted(true);
            }
            else {
                delete newCommentDiff.delete;
                setDeleted(false);
                const diff = new diff_match_patch_1.diff_match_patch().diff_main(originText, e.target.value);
                if (originText) {
                    if (diff.length !== 1) {
                        newCommentDiff.diff = new diff_match_patch_1.diff_match_patch().diff_toDelta(diff);
                    }
                    else {
                        delete newCommentDiff.diff;
                    }
                }
                else {
                    newCommentDiff.diff = new diff_match_patch_1.diff_match_patch().diff_toDelta(diff);
                }
            }
            commentDiff.current = newCommentDiff;
            onChange(removeIds(newCommentDiff));
            setText(e.target.value);
        }} value={text} multiline/>
      <material_1.Stack spacing={1}>
        <material_1.Button size="small" variant="outlined" onClick={() => setShowInsertBefore(true)}>
          上方插入
        </material_1.Button>
        <material_1.Button size="small" variant="outlined" onClick={() => setShowInsertAfter(true)}>
          下方插入
        </material_1.Button>
        <material_1.FormControlLabel control={<material_1.Checkbox size="small" checked={deleted} onChange={(e) => {
                if (!text.length) {
                    return;
                }
                setDeleted(e.target.checked);
                commentDiff.current = {
                    ...commentDiff.current,
                    delete: e.target.checked,
                };
                onChange(removeIds(commentDiff.current));
            }}/>} label="删除"/>
      </material_1.Stack>
    </material_1.Stack>);
    return (<>
      {insertBefore.map((i) => (<li key={i.id}>
          <material_1.Stack direction="row" spacing={1}>
            <material_1.TextField disabled multiline sx={{ flex: 1 }} value={i.text}/>
            <material_1.Button variant="outlined" size="small" onClick={() => {
                commentDiff.current.insertBefore = insertBefore.filter((j) => j.id !== i.id);
                setInsertBefore(commentDiff.current.insertBefore);
                onChange(removeIds(commentDiff.current));
            }}>
              删除
            </material_1.Button>
          </material_1.Stack>
        </li>))}
      {showInsertBefore ? (<InsertCommentDialog onClose={(text) => {
                if (!text) {
                    setShowInsertBefore(false);
                    return;
                }
                const newInsertBefore = [
                    ...insertBefore,
                    {
                        id: Math.random().toString(),
                        text,
                    },
                ];
                setInsertBefore(newInsertBefore);
                setShowInsertBefore(false);
                commentDiff.current.insertBefore = newInsertBefore;
                onChange(removeIds(commentDiff.current));
            }}/>) : null}
      {showInsertAfter ? (<InsertCommentDialog onClose={(text) => {
                if (!text) {
                    setShowInsertAfter(false);
                    return;
                }
                const newInsertAfter = [
                    ...insertAfter,
                    {
                        id: Math.random().toString(),
                        text,
                    },
                ];
                setInsertAfter(newInsertAfter);
                setShowInsertAfter(false);
                commentDiff.current.insertAfter = newInsertAfter;
                onChange(removeIds(commentDiff.current));
            }}/>) : null}
      {deleted ? center : <li key="center">{center}</li>}
      {insertAfter.map((i) => (<li key={i.id}>
          <material_1.Stack direction="row" spacing={1}>
            <material_1.TextField disabled multiline sx={{ flex: 1 }} value={i.text}/>
            <material_1.Button variant="outlined" size="small" onClick={() => {
                commentDiff.current.insertAfter = insertAfter.filter((j) => j.id !== i.id);
                setInsertAfter(commentDiff.current.insertAfter);
                onChange(removeIds(commentDiff.current));
            }}>
              删除
            </material_1.Button>
          </material_1.Stack>
        </li>))}
    </>);
}
