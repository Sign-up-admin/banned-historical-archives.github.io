"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Part;
const material_1 = require("@mui/material");
const diff_match_patch_1 = require("diff-match-patch");
const react_1 = require("react");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
function InsertPartDialog(props) {
    const { onClose } = props;
    const [text, setText] = (0, react_1.useState)('');
    const [type, setType] = (0, react_1.useState)(types_1.ContentType.paragraph);
    return (<material_1.Dialog onClose={() => onClose()} open={true}>
      <material_1.DialogTitle>插入段落</material_1.DialogTitle>
      <material_1.Stack spacing={2} p={2}>
        <material_1.TextField size="small" value={text} onChange={(e) => setText(e.target.value)} multiline autoFocus/>
        <material_1.Typography>类型：</material_1.Typography>
        <material_1.Select sx={{ width: 130 }} size="small" defaultValue={type} onChange={(e) => {
            setType(e.target.value);
        }}>
          {Object.keys(types_1.ContentType).map((i) => (<material_1.MenuItem key={i} value={i}>
              {i}
            </material_1.MenuItem>))}
        </material_1.Select>
        <material_1.ButtonGroup>
          <material_1.Button onClick={() => onClose(type, text)}>确定</material_1.Button>
          <material_1.Button onClick={() => onClose()}>取消</material_1.Button>
        </material_1.ButtonGroup>
      </material_1.Stack>
    </material_1.Dialog>);
}
function removeIds(p) {
    const diff = {
        ...p,
        insertBefore: p.insertBefore.map((i) => ({ type: i.type, text: i.text })),
        insertAfter: p.insertAfter.map((i) => ({ type: i.type, text: i.text })),
    };
    if (!diff.insertBefore.length) {
        delete diff.insertBefore;
    }
    if (!diff.insertAfter.length) {
        delete diff.insertAfter;
    }
    return diff;
}
function Part({ idx, content, comments, onChange, }) {
    const [showInsertBefore, setShowInsertBefore] = (0, react_1.useState)(false);
    const [showInsertAfter, setShowInsertAfter] = (0, react_1.useState)(false);
    const [insertBefore, setInsertBefore] = (0, react_1.useState)([]);
    const [insertAfter, setInsertAfter] = (0, react_1.useState)([]);
    const [deleted, setDeleted] = (0, react_1.useState)(false);
    const partDiff = (0, react_1.useRef)({
        insertBefore: [],
        insertAfter: [],
    });
    const originText = (0, react_1.useMemo)(() => {
        const text_arr = Array.from(content.text);
        comments
            .filter((i) => i.part_idx === idx)
            .sort((a, b) => b.index - a.index)
            .forEach((i) => text_arr.splice(i.offset, 0, `${utils_1.bracket_left}${i.index}${utils_1.bracket_right}`));
        return text_arr.join('');
    }, [content, comments, idx]);
    const [text, setText] = (0, react_1.useState)(originText);
    return (<>
      {insertBefore.map((i) => (<material_1.Stack key={i.id} direction="row" spacing={1}>
          <material_1.TextField disabled multiline sx={{ flex: 1 }} value={i.text}/>
          <material_1.Typography variant="caption">{i.type}</material_1.Typography>
          <material_1.Button variant="outlined" size="small" onClick={() => {
                partDiff.current.insertBefore = insertBefore.filter((j) => j.id !== i.id);
                setInsertBefore(partDiff.current.insertBefore);
                onChange(removeIds(partDiff.current));
            }}>
            删除
          </material_1.Button>
        </material_1.Stack>))}
      {showInsertBefore ? (<InsertPartDialog onClose={(type, text) => {
                if (!type || !text) {
                    return;
                }
                const newInsertBefore = [
                    ...insertBefore,
                    {
                        id: Math.random().toString(),
                        type,
                        text,
                    },
                ];
                setInsertBefore(newInsertBefore);
                setShowInsertBefore(false);
                partDiff.current.insertBefore = newInsertBefore;
                onChange(removeIds(partDiff.current));
            }}/>) : null}
      {showInsertAfter ? (<InsertPartDialog onClose={(type, text) => {
                if (!type || !text) {
                    return;
                }
                const newInsertAfter = [
                    ...insertAfter,
                    {
                        id: Math.random().toString(),
                        type,
                        text,
                    },
                ];
                setInsertAfter(newInsertAfter);
                setShowInsertAfter(false);
                partDiff.current.insertAfter = newInsertAfter;
                onChange(removeIds(partDiff.current));
            }}/>) : null}
      <material_1.Stack direction="row" sx={{ mt: 1, mb: 1 }} spacing={1}>
        <material_1.TextField sx={{ flex: 1 }} size="small" key={content.id} onChange={(e) => {
            const newPartDiff = { ...partDiff.current };
            if (!e.target.value.length) {
                newPartDiff.delete = true;
                delete newPartDiff.diff;
                setDeleted(true);
            }
            else {
                delete newPartDiff.delete;
                setDeleted(false);
                const diff = new diff_match_patch_1.diff_match_patch().diff_main(originText, e.target.value);
                if (diff.length !== 1 || !originText) {
                    newPartDiff.diff = new diff_match_patch_1.diff_match_patch().diff_toDelta(diff);
                }
                else {
                    delete newPartDiff.diff;
                }
            }
            partDiff.current = newPartDiff;
            onChange(removeIds(newPartDiff));
            setText(e.target.value);
        }} value={text} multiline/>
        <material_1.Stack spacing={1}>
          <material_1.Select sx={{ width: 130 }} size="small" defaultValue={content.type} onChange={(e) => {
            partDiff.current = {
                ...partDiff.current,
                type: e.target.value,
            };
            onChange(removeIds(partDiff.current));
        }}>
            {Object.keys(types_1.ContentType).map((i) => (<material_1.MenuItem key={i} value={i}>
                {i}
              </material_1.MenuItem>))}
          </material_1.Select>
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
                partDiff.current = {
                    ...partDiff.current,
                    delete: e.target.checked,
                };
                onChange(removeIds(partDiff.current));
            }}/>} label="删除"/>
        </material_1.Stack>
      </material_1.Stack>
      {insertAfter.map((i) => (<material_1.Stack key={i.id} direction="row" spacing={1}>
          <material_1.TextField disabled multiline sx={{ flex: 1 }} value={i.text}/>
          <material_1.Typography variant="caption">{i.type}</material_1.Typography>
          <material_1.Button variant="outlined" size="small" onClick={() => {
                partDiff.current.insertAfter = insertAfter.filter((j) => j.id !== i.id);
                setInsertAfter(partDiff.current.insertAfter);
                onChange(removeIds(partDiff.current));
            }}>
            删除
          </material_1.Button>
        </material_1.Stack>))}
    </>);
}
