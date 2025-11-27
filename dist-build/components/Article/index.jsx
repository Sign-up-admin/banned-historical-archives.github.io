"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleComponent;
const material_1 = require("@mui/material");
const PlayCircle_1 = __importDefault(require("@mui/icons-material/PlayCircle"));
const StopCircle_1 = __importDefault(require("@mui/icons-material/StopCircle"));
const react_1 = require("react");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const PatchableArticle_1 = __importDefault(require("./PatchableArticle"));
function PureArticle({ description, comments, contents, }) {
    const ssu = (0, react_1.useRef)();
    const containerRef = (0, react_1.useRef)(null);
    const [playing, setPlaying] = (0, react_1.useState)(false);
    const [pitch, setPitch] = (0, react_1.useState)(1);
    const [rate, setRate] = (0, react_1.useState)(1);
    const [anchorEl, setAnchorEl] = (0, react_1.useState)(null);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const [voices, setVoices] = (0, react_1.useState)([]);
    const [selectedVoice, setSelectedVoice] = (0, react_1.useState)();
    const [currentTTSIndex, setCurrentTTSIndex] = (0, react_1.useState)(-1);
    (0, react_1.useEffect)(() => {
        if (currentTTSIndex < 0)
            return;
        ssu.current = new SpeechSynthesisUtterance(contents[currentTTSIndex].text);
        ssu.current.voice = voices.find((i) => i.name == selectedVoice);
        ssu.current.pitch = pitch;
        ssu.current.rate = rate;
        speechSynthesis.speak(ssu.current);
        ssu.current.onerror = (event) => console.error('发生错误：', event.error);
        ssu.current.onend = () => {
            if (contents.length - 1 > currentTTSIndex)
                setCurrentTTSIndex(currentTTSIndex + 1);
            else {
                setPlaying(false);
                ssu.current.onend = null;
                speechSynthesis.cancel();
                setCurrentTTSIndex(-1);
            }
        };
    }, [currentTTSIndex, contents]);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (!window.speechSynthesis) {
                return;
            }
            let v = speechSynthesis.getVoices();
            while (!v.length) {
                v = speechSynthesis.getVoices();
                await (0, utils_1.sleep)(100);
            }
            setVoices(v.sort((a, b) => (a.lang > b.lang ? 1 : -1)));
            setSelectedVoice(localStorage.getItem('tts_voice') ||
                v.find((i) => i.lang.startsWith('zh_CN'))?.name ||
                v.find((i) => i.lang.startsWith('zh-CN'))?.name ||
                v.find((i) => i.name.indexOf('中国') >= 0)?.name ||
                v.find((i) => i.name.indexOf('中文') >= 0)?.name ||
                v[0]?.name);
            setPitch(parseFloat(localStorage.getItem('tts_pitch') || '1'));
            setRate(parseFloat(localStorage.getItem('tts_rate') || '1'));
        })();
    }, []);
    const contentsComponent = (0, react_1.useMemo)(() => contents.map((part, idx) => {
        const highlight = idx === currentTTSIndex;
        const x = highlight
            ? (e) => {
                if (e) {
                    e.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                }
            }
            : undefined;
        const ext_css = highlight ? { color: '#cf0000' } : {};
        const s = [];
        const part_comments = comments.filter((i) => i.part_idx === part.index);
        const text = part.text;
        let t = 0;
        const texts = [];
        if (part_comments.length) {
            for (const part_comment of part_comments) {
                const p = text.substr(t, part_comment.offset - t);
                texts.push(p);
                t += p.length;
            }
            if (t < text.length) {
                texts.push(text.substr(t));
            }
        }
        else {
            texts.push(text);
        }
        const content = [];
        texts.forEach((text, idx) => {
            content.push(<span key={`${(0, utils_1.crypto_md5)(text)}-${idx}`}>{text}</span>);
            s.push(text);
            if (part_comments.length) {
                const comment_idx = part_comments.shift().index;
                s.push(`〔${comment_idx}〕`);
                content.push(<a id={`comment${comment_idx}_content`} key={Math.random()} href={`#comment${comment_idx}_comment`} style={{ userSelect: 'none' }}>
                {utils_1.bracket_left}
                {comment_idx}
                {utils_1.bracket_right}
              </a>);
            }
        });
        if (part.type === types_1.ContentType.title)
            s.unshift('# ');
        else if (part.type === types_1.ContentType.subtitle)
            s.unshift('## ');
        else if (part.type === types_1.ContentType.subtitle2)
            s.unshift('### ');
        else if (part.type === types_1.ContentType.subtitle3)
            s.unshift('#### ');
        const key = part.id;
        if (part.type === types_1.ContentType.title) {
            return (<material_1.Typography key={key} ref={x} variant="h5" sx={{ textAlign: 'center', margin: 4, ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.appellation) {
            return (<material_1.Typography key={key} ref={x} variant="body1" sx={{ margin: 0.5, fontWeight: 'bold', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.image) {
            return (<img alt="" ref={x} key={key} src={part.text} style={{
                    width: '50%',
                    display: 'block',
                    margin: 'auto',
                    marginTop: '1.25em',
                }}/>);
        }
        else if (part.type === types_1.ContentType.image_description) {
            return (<material_1.Typography key={key} ref={x} variant="subtitle1" sx={{ textAlign: 'center', marginBottom: '1.25em', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.subdate) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{ textAlign: 'center', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.place) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{ textAlign: 'center', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.authors) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{ textAlign: 'center', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.signature) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{ textAlign: 'right', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.subtitle) {
            return (<material_1.Typography key={key} ref={x} variant="subtitle1" sx={{
                    textAlign: 'center',
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    margin: '1.25em 0 1.25em 0',
                    ...ext_css,
                }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.subtitle2) {
            return (<material_1.Typography key={key} ref={x} variant="subtitle1" sx={{
                    textAlign: 'center',
                    fontSize: '1.17em',
                    fontWeight: 'bold',
                    margin: '1.25em 0 1.25em 0',
                    ...ext_css,
                }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.subtitle3) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    margin: '0.625em 0 0.625em 0',
                    ...ext_css,
                }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.subtitle4 ||
            part.type === types_1.ContentType.subtitle5) {
            return (<material_1.Typography ref={x} key={key} variant="subtitle1" sx={{ textAlign: 'center', ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.paragraph) {
            return (<material_1.Typography key={key} variant="body1" ref={x} sx={{ textIndent: '2em', margin: 0.5, ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
        else if (part.type === types_1.ContentType.quotation) {
            return (<material_1.Stack ref={x} spacing={1} key={key}>
              {part.text
                    .split('\n')
                    .filter((j) => j)
                    .map((j, j_idx) => (<material_1.Typography variant="body1" key={j_idx} sx={{
                        color: 'grey',
                        padding: '0.625em 2.5em 0.625em 2.5em',
                        borderLeft: '2px solid',
                        ...ext_css,
                    }}>
                    {j}
                  </material_1.Typography>))}
            </material_1.Stack>);
        }
        else {
            return (<material_1.Typography key={key} ref={x} variant="body1" sx={{ textIndent: '2em', margin: 0.5, ...ext_css }}>
              {content}
            </material_1.Typography>);
        }
    }), [contents, currentTTSIndex]);
    const descriptionComponent = description ? (<>
      <material_1.Divider sx={{ mt: 2, mb: 2 }}/>
      <material_1.Typography variant="h6" sx={{ mb: 2 }}>
        描述
      </material_1.Typography>
      <material_1.Stack spacing={1}>
        {description
            .split('\n')
            .filter((j) => j)
            .map((j, j_idx) => (<material_1.Typography variant="body1" key={j_idx}>
              {j}
            </material_1.Typography>))}
      </material_1.Stack>
    </>) : null;
    const commentsComponent = comments.filter((i) => i.index !== -1).length ? (<>
      <material_1.Divider sx={{ mt: 2, mb: 2 }}/>
      <material_1.Typography variant="h6" sx={{ mb: 2 }}>
        注释
      </material_1.Typography>
      {comments
            .filter((i) => i.index !== -1)
            .map((i, i_idx) => (<material_1.Stack direction="row" key={i.id}>
            <span>
              <a id={`comment${i_idx + 1}_comment`} href={`#comment${i_idx + 1}_content`} style={{ userSelect: 'none' }}>
                {utils_1.bracket_left}
                {i_idx + 1}
                {utils_1.bracket_right}
              </a>
            </span>
            <material_1.Stack spacing={1}>
              {i.text
                .split('\n')
                .filter((j) => j)
                .map((j, j_idx) => (<material_1.Typography variant="body1" key={j_idx}>
                    {j}
                  </material_1.Typography>))}
            </material_1.Stack>
          </material_1.Stack>))}
    </>) : null;
    return (<>
      <div style={{ position: 'relative' }}>
        <material_1.Button sx={{
            position: 'absolute',
            visibility: selectedVoice ? 'visible' : 'hidden',
            top: 4,
            left: 0,
            minWidth: 0,
            opacity: '0.5',
            width: '20px',
            height: '20px',
            borderRadius: '10px',
        }} ref={(e) => {
            setAnchorEl(e);
        }} onClick={() => {
            if (!playing) {
                setShowSettings(!showSettings);
            }
            else {
                setPlaying(false);
                ssu.current.onend = null;
                speechSynthesis.cancel();
                setCurrentTTSIndex(-1);
            }
        }}>
          {playing ? <StopCircle_1.default /> : <PlayCircle_1.default />}
        </material_1.Button>
        <material_1.Popover open={showSettings} anchorEl={anchorEl} onClose={() => setShowSettings(false)} sx={{
            marginTop: '10px',
        }} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}>
          <material_1.Grid2 container alignItems="center" justifyContent="center" sx={{ p: 2, width: '400px' }} spacing={2} rowSpacing={1}>
            <material_1.Grid2 size={12}>
              <material_1.FormControl fullWidth>
                <material_1.InputLabel id="demo-simple-select-label">语音</material_1.InputLabel>
                <material_1.Select labelId="demo-simple-select-label" value={selectedVoice} label="语音" onChange={(e) => {
            setSelectedVoice(e.target.value);
            localStorage.setItem('tts_voice', e.target.value);
        }}>
                  {voices.map((i) => (<material_1.MenuItem key={i.name} value={i.name}>
                      {i.lang}-{i.name}
                    </material_1.MenuItem>))}
                </material_1.Select>
              </material_1.FormControl>
            </material_1.Grid2>
            <material_1.Grid2 size={2}>
              <material_1.Typography>速度</material_1.Typography>
            </material_1.Grid2>
            <material_1.Grid2 size={10}>
              <material_1.Slider value={rate} valueLabelDisplay="auto" step={0.1} marks min={0.1} max={2} onChange={(e, value) => {
            setRate(value);
            localStorage.setItem('tts_rate', value.toString());
        }}/>
            </material_1.Grid2>
            <material_1.Grid2 size={2}>
              <material_1.Typography>音高</material_1.Typography>
            </material_1.Grid2>
            <material_1.Grid2 size={10}>
              <material_1.Slider value={pitch} valueLabelDisplay="auto" step={0.1} marks min={0.1} max={2} onChange={(e, value) => {
            setPitch(value);
            localStorage.setItem('tts_pitch', value.toString());
        }}/>
            </material_1.Grid2>
            <material_1.Grid2 size={12}>
              <material_1.Button variant="outlined" onClick={() => {
            setPlaying(true);
            setShowSettings(false);
            setCurrentTTSIndex(0);
        }}>
                朗读
              </material_1.Button>
            </material_1.Grid2>
          </material_1.Grid2>
        </material_1.Popover>
        <div ref={containerRef}>
          {contentsComponent}
          {descriptionComponent}
          {commentsComponent}
        </div>
      </div>
    </>);
}
function ArticleComponent({ article, articleId, comments, patchable, contents, publicationId, publicationName, description, }) {
    contents = contents.sort((a, b) => (a.index > b.index ? 1 : -1));
    comments = comments.sort((a, b) => a.index - b.index);
    return patchable ? (<PatchableArticle_1.default articleId={articleId} article={article} comments={comments} contents={contents} description={description} publicationId={publicationId} publicationName={publicationName}/>) : (<PureArticle description={description} comments={comments} contents={contents}/>);
}
