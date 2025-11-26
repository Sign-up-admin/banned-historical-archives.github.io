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
exports.default = Music;
const events_1 = require("events");
const react_1 = __importStar(require("react"));
const x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
const head_1 = __importDefault(require("next/head"));
const diff_match_patch_1 = require("diff-match-patch");
const Popover_1 = __importDefault(require("@mui/material/Popover"));
const SkipNext_1 = __importDefault(require("@mui/icons-material/SkipNext"));
const PlayCircle_1 = __importDefault(require("@mui/icons-material/PlayCircle"));
const Layout_1 = __importDefault(require("../../components/Layout"));
const RepeatOne_1 = __importDefault(require("@mui/icons-material/RepeatOne"));
const FormatListNumbered_1 = __importDefault(require("@mui/icons-material/FormatListNumbered"));
const Shuffle_1 = __importDefault(require("@mui/icons-material/Shuffle"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const SpeedDial_1 = __importDefault(require("@mui/material/SpeedDial"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const SpeedDialAction_1 = __importDefault(require("@mui/material/SpeedDialAction"));
const Select_1 = __importDefault(require("@mui/material/Select"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const MenuItem_1 = __importDefault(require("@mui/material/MenuItem"));
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const PauseCircle_1 = __importDefault(require("@mui/icons-material/PauseCircle"));
const DiffViewer_1 = require("../../components/DiffViewer");
const material_1 = require("@mui/material");
const Tags_1 = __importDefault(require("../../components/Tags"));
const locales_1 = require("@mui/x-data-grid/locales");
const ee = new events_1.EventEmitter();
ee.setMaxListeners(9876543);
const getDetails = async (id, archives_id) => {
    const url = `https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives${archives_id}/parsed/${id.substr(0, 3)}/${id}/${id}.metadata`;
    const res = (await (await fetch(url)).json());
    return res;
};
function Song({ id, archiveId, name, }) {
    const [lyricLeft, setLyricLeft] = (0, react_1.useState)(0);
    const [lyricRight, setLyricRight] = (0, react_1.useState)(0);
    const [details, setDetails] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        getDetails(id, archiveId).then((res) => {
            setLoading(false);
            setDetails(res);
            setLyricRight(res.lyrics.length - 1);
        });
    }, []);
    const leftContents = (0, react_1.useMemo)(() => (details?.lyrics[lyricLeft] || details?.lyrics[0])?.content.split('\n'), [lyricLeft, details]);
    const rightContents = (0, react_1.useMemo)(() => (details?.lyrics[lyricRight] || details?.lyrics[0])?.content.split('\n'), [lyricRight, details]);
    const diff = (0, react_1.useMemo)(() => {
        if (!details)
            return [];
        const left = details?.lyrics[lyricLeft] || details?.lyrics[0];
        const right = details?.lyrics[lyricRight] || details?.lyrics[0];
        const leftContents = left.content.split('\n');
        const rightContents = right.content.split('\n');
        let i = 0;
        const max_len = Math.max(leftContents.length, rightContents.length);
        const res = [];
        while (i < max_len) {
            const a = leftContents[i] || '';
            const b = rightContents[i] || '';
            res.push(new diff_match_patch_1.diff_match_patch().diff_main(a, b));
            ++i;
        }
        return res;
    }, [lyricLeft, lyricRight, details]);
    if (loading)
        return (<Stack_1.default padding="20px" spacing="10px" width="800px" height="200px">
        <material_1.Skeleton variant="rectangular" width={'100%'} height={20}/>
        <material_1.Skeleton variant="rectangular" width={'100%'} height={20}/>
        <material_1.Skeleton variant="rectangular" width={'100%'} height={20}/>
        <material_1.Skeleton variant="rectangular" width={'100%'} height={20}/>
      </Stack_1.default>);
    return (<Stack_1.default sx={{ flex: 1, mx: 'auto', p: '20px', 'width': '800px', 'maxHeight': '500px' }}>
      <Typography_1.default variant="subtitle1" sx={{ mb: 2 }}>
        演唱/演奏版本：
      </Typography_1.default>
      <Stack_1.default>
        {details?.lyrics.map((lyric, idx) => (<Stack_1.default key={idx} sx={{ display: 'inline' }}>
            {lyric.audios.map((audio, aid) => {
                const displayName = `${details?.name}-${lyric.version}-${audio.artists.map((i) => `${i.name}(${i.type})`).join(' ') ||
                    '未知'}`;
                return (<Stack_1.default key={idx + '-' + aid} direction="row">
                  <Button_1.default sx={{ justifyContent: 'start', flex: 1 }} startIcon={<PlayCircle_1.default />} onClick={() => {
                        ee.emit('musicChanged', id, name, archiveId);
                        ee.emit('lyricChanged', lyric);
                        ee.emit('artistChanged', audio.artists);
                        ee.emit('musicStart', audio.url);
                    }}>
                    {displayName}
                  </Button_1.default>
                  <a href={lyric.audios[0].url} download>
                    <Button_1.default type="button">
                      下载
                    </Button_1.default>
                  </a>
                </Stack_1.default>);
            })}
          </Stack_1.default>))}
      </Stack_1.default>
      <Divider_1.default sx={{ mt: 2 }}/>
      {details?.lyrics.length && details?.lyrics.length > 1 ? (<Typography_1.default variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          歌词对比：
        </Typography_1.default>) : null}
      <Stack_1.default direction="row" spacing={2}>
        <Stack_1.default sx={{ flex: 1 }}>
          <Select_1.default size="small" value={details?.lyrics[lyricLeft] ? lyricLeft : 0} label="版本" sx={{
            mb: 1,
            display: details?.lyrics.length && details?.lyrics.length > 1
                ? 'block'
                : 'none',
        }} onChange={(e) => {
            setLyricLeft(parseInt(e.target.value));
        }}>
            {details?.lyrics.map((lyric, idx) => (<MenuItem_1.default key={idx} value={idx}>
                {lyric.version}
              </MenuItem_1.default>))}
          </Select_1.default>
          <Paper_1.default sx={{ p: '20px' }}>
            {leftContents?.map((line, idx) => (<Typography_1.default key={idx}>{line}</Typography_1.default>))}
          </Paper_1.default>
        </Stack_1.default>
        {details?.lyrics.length && details?.lyrics.length > 1 ? (<>
            <Stack_1.default sx={{ flex: 1 }}>
              <Select_1.default size="small" value={details?.lyrics[lyricRight] ? lyricRight : 0} label="版本" sx={{ mb: 1 }} onChange={(e) => {
                setLyricRight(parseInt(e.target.value));
            }}>
                {details?.lyrics.map((lyric, idx) => (<MenuItem_1.default key={idx} value={idx}>
                    {lyric.version}
                  </MenuItem_1.default>))}
              </Select_1.default>
              <Paper_1.default sx={{ p: '20px' }}>
                {rightContents?.map((line, idx) => (<Typography_1.default key={idx}>{line}</Typography_1.default>))}
              </Paper_1.default>
            </Stack_1.default>
            <Stack_1.default sx={{ flex: 1, pt: '48px' }}>
              <Paper_1.default sx={{ p: '20px' }}>
                <DiffViewer_1.DiffViewer diff={diff}/>
              </Paper_1.default>
            </Stack_1.default>
          </>) : null}
      </Stack_1.default>
    </Stack_1.default>);
}
const playing = { id: '' };
function SongWrap({ row }) {
    const anchorElRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, react_1.useState)(playing.id == row.id);
    (0, react_1.useEffect)(() => {
        const listener = (id) => {
            if (id == row.id) {
                setOpen(true);
            }
            else {
                setOpen(false);
            }
        };
        ee.on('musicChanged', listener);
        return () => {
            ee.off('musicChanged', listener);
        };
    }, [row]);
    const handleClick = (event) => {
        setOpen(!open);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (<>
      <div style={{ cursor: 'pointer', color: '#cc0000', padding: '5px' }} onClick={handleClick} ref={anchorElRef}>{row.name}</div>
      <Popover_1.default open={open} marginThreshold={10} anchorEl={() => anchorElRef.current} onClose={handleClose} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }} style={{
            overflow: 'scroll'
        }}>
        {open ? (<Song id={row.id} name={row.name} archiveId={row.archiveId}/>) : null}
      </Popover_1.default>
    </>);
}
var RepeatType;
(function (RepeatType) {
    RepeatType[RepeatType["all"] = 0] = "all";
    RepeatType[RepeatType["shuffle"] = 1] = "shuffle";
    RepeatType[RepeatType["one"] = 2] = "one";
})(RepeatType || (RepeatType = {}));
function Player({ apiRef, }) {
    const [playing, setPlaying] = (0, react_1.useState)(false);
    const [repeatType, setRepeatType] = (0, react_1.useState)(RepeatType.shuffle);
    const [songName, setSongName] = (0, react_1.useState)('');
    const [versionName, setVersionName] = (0, react_1.useState)('');
    const [artistName, setArtistName] = (0, react_1.useState)('');
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [cursorProgress, setCursorProgress] = (0, react_1.useState)(0);
    const audioRef = (0, react_1.useRef)(null);
    const playerPosRef = (0, react_1.useRef)({ width: 0, left: 0 });
    const curId = (0, react_1.useRef)('');
    (0, react_1.useEffect)(() => {
        function lyricChanged(lyric) {
            setVersionName(lyric.version);
        }
        function artistChanged(artists) {
            setArtistName(artists.map((i) => `${i.name}(${i.type})`).join(' '));
        }
        function musicChanged(id, name, archiveId, lyricIndex, // -1 -> random
        audioIndex, // -1 -> random
        autoplay) {
            ee.emit('musicPause');
            setSongName(name);
            curId.current = id;
            if (lyricIndex != undefined)
                getDetails(id, archiveId).then((first) => {
                    if (lyricIndex == -1) {
                        lyricIndex = Math.floor(Math.random() * first.lyrics.length);
                    }
                    ee.emit('lyricChanged', first.lyrics[lyricIndex]);
                    if (audioIndex != undefined) {
                        if (audioIndex == -1) {
                            audioIndex = Math.floor(Math.random() * first.lyrics[lyricIndex].audios.length);
                        }
                        ee.emit('artistChanged', first.lyrics[lyricIndex].audios[audioIndex].artists);
                        if (autoplay) {
                            ee.emit('musicStart', first.lyrics[lyricIndex].audios[audioIndex].url);
                        }
                        else {
                            audioRef.current?.setAttribute('src', first.lyrics[lyricIndex].audios[audioIndex].url);
                        }
                    }
                });
        }
        function musicPause() {
            setPlaying(false);
            audioRef.current?.pause();
        }
        function musicStart(url) {
            setPlaying(true);
            audioRef.current?.setAttribute('src', url);
            audioRef.current?.play().catch(() => { });
        }
        ee.on('musicPause', musicPause);
        ee.on('musicStart', musicStart);
        ee.on('artistChanged', artistChanged);
        ee.on('musicChanged', musicChanged);
        ee.on('lyricChanged', lyricChanged);
        function onTimeupdate(e) {
            setProgress(e.target.currentTime / e.target.duration);
        }
        audioRef.current?.addEventListener('timeupdate', onTimeupdate);
        return () => {
            audioRef.current?.removeEventListener('timeupdate', onTimeupdate);
            ee.off('musicPause', musicPause);
            ee.off('musicStart', musicStart);
            ee.off('artistChanged', artistChanged);
            ee.off('musicChanged', musicChanged);
            ee.off('lyricChanged', lyricChanged);
        };
    }, []);
    const playNext = (0, react_1.useCallback)(async () => {
        if (repeatType === RepeatType.one) {
            audioRef.current?.play().catch(() => { });
        }
        else if (repeatType === RepeatType.all) {
            const sorted = apiRef.current
                .getSortedRowIds()
                .filter((i) => apiRef.current.state.visibleRowsLookup[i]);
            let idx = apiRef.current.getRowIndexRelativeToVisibleRows(curId.current);
            if (sorted.length - 1 == idx) {
                idx = 0;
            }
            else if (idx >= 0) {
                idx++;
            }
            else {
                idx = 0;
            }
            const row = apiRef.current.getRow(sorted[idx]);
            ee.emit('musicChanged', row.id, row.name, row.archiveId, 0, 0, true);
        }
        else if (repeatType === RepeatType.shuffle) {
            const row_ids = Object.keys(apiRef.current.state.visibleRowsLookup).filter((i) => apiRef.current.state.visibleRowsLookup[i]);
            const m = Math.floor(row_ids.length * Math.random());
            const row = apiRef.current.getRow(row_ids[m]);
            ee.emit('musicChanged', row.id, row.name, row.archiveId, -1, -1, true);
        }
    }, [apiRef, repeatType]);
    return (<>
      <audio ref={audioRef} onEnded={() => {
            playNext();
        }} style={{ position: 'fixed', left: '100%' }}/>
      <Box_1.default sx={{
            bottom: 30,
            right: 30,
            height: 320,
            position: 'fixed',
            transform: 'translateZ(0px)',
            flexGrow: 1,
            zIndex: 20,
        }}>
        <Paper_1.default sx={{
            p: 2,
            pt: 1,
            pb: 1,
            pr: 4,
            mr: -2,
            position: 'absolute',
            bottom: 16 + 56 / 2,
            transform: 'translateY(50%)',
            zIndex: 10,
            right: 70,
            userSelect: 'none'
        }} onMouseEnter={(e) => {
            const { left } = e.target.getBoundingClientRect();
            playerPosRef.current = { width: window.innerWidth - left - 84, left };
        }} onMouseMove={(e) => {
            const { width, left } = playerPosRef.current;
            setCursorProgress((e.pageX - left) / width);
        }} onMouseLeave={(e) => {
            setCursorProgress(0);
        }} onClick={(e) => {
            if (audioRef.current)
                audioRef.current.currentTime = cursorProgress * audioRef.current.duration;
        }}>
          <Typography_1.default sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            width: {
                xs: '200px',
                sm: 'auto',
            },
        }}>
            {songName}-{versionName}-{artistName}
          </Typography_1.default>
            <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${cursorProgress * 100}%`,
            background: 'rgba(255,0,0,0.14)',
            height: '100%',
        }}/>
            <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${progress * 100}%`,
            background: 'rgba(255,0,0,0.14)',
            height: '100%',
        }}/>
        </Paper_1.default>
        <SpeedDial_1.default ariaLabel="player" sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={() => {
            if (playing)
                ee.emit('musicPause');
            else {
                setPlaying(true);
                audioRef.current?.play().catch(() => { });
            }
        }} open={true} onOpen={() => { }} onClose={() => { }} icon={playing ? <PauseCircle_1.default /> : <PlayCircle_1.default />}>
          <SpeedDialAction_1.default icon={<SkipNext_1.default />} onClick={(e) => {
            e.stopPropagation();
            playNext();
        }} tooltipTitle={'下一首'} open={true} onOpen={() => { }} onClose={() => { }}/>
          <SpeedDialAction_1.default icon={<Shuffle_1.default sx={{
                color: repeatType === RepeatType.shuffle ? '#cc0000' : 'inherit',
            }}/>} onClick={(e) => {
            e.stopPropagation();
            setRepeatType(RepeatType.shuffle);
        }} tooltipTitle={'随机播放'}/>
          <SpeedDialAction_1.default icon={<FormatListNumbered_1.default sx={{
                color: repeatType === RepeatType.all ? '#cc0000' : 'inherit',
            }}/>} onClick={(e) => {
            e.stopPropagation();
            setRepeatType(RepeatType.all);
        }} tooltipTitle={'顺序播放'}/>
          <SpeedDialAction_1.default icon={<RepeatOne_1.default sx={{
                color: repeatType === RepeatType.one ? '#cc0000' : 'inherit',
            }}/>} onClick={(e) => {
            e.stopPropagation();
            setRepeatType(RepeatType.one);
        }} tooltipTitle={'单曲循环'}/>
        </SpeedDial_1.default>
      </Box_1.default>
    </>);
}
function Music() {
    const filterModelRef = (0, react_1.useRef)({ items: [] });
    const [indexes, setIndexes] = (0, react_1.useState)([]);
    const apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
    (0, react_1.useEffect)(() => {
        (async () => {
            const data = await (await fetch('https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/music.json')).json();
            setIndexes(data.map((i) => ({
                id: i[0],
                name: i[1],
                archiveId: i[2],
                tags: i[4],
                nLyrics: i[3],
                composers: i[5],
                art_forms: i[9],
                lyricists: i[6],
                artists: i[7],
                sources: i[8],
            })));
            setTimeout(() => {
                const rows = apiRef.current.getSortedRows();
                const row = rows[0];
                ee.emit('musicChanged', row.id, row.name, row.archiveId, 0, 0);
            }, 500);
        })();
    }, []);
    const buildHeaderOnClick = (0, react_1.useCallback)((field) => {
        return (t) => {
            const newFilter = {
                ...filterModelRef.current,
                items: [
                    ...filterModelRef.current.items.filter((i) => i.field != field),
                    {
                        id: field,
                        field: field,
                        operator: 'contains',
                        value: t.name,
                    },
                ],
            };
            apiRef.current.setFilterModel(newFilter);
            filterModelRef.current = newFilter;
        };
    }, []);
    const columns = (0, react_1.useMemo)(() => [
        {
            field: 'name',
            headerName: '名称',
            minWidth: 250,
            flex: 1,
            valueGetter: (name) => name,
            renderCell: (params) => {
                return <SongWrap row={params.row}/>;
            },
        },
        {
            field: 'composers',
            headerName: '作曲',
            minWidth: 150,
            valueGetter: (_, row) => row.composers.join(','),
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.composers.map((i) => ({
                        name: i,
                        type: 'composer',
                    }))} onClick={buildHeaderOnClick('composers')}/>
            </div>);
            },
        },
        {
            field: 'lyricists',
            headerName: '作词',
            valueGetter: (_, row) => row.lyricists.join(','),
            minWidth: 150,
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.lyricists.map((i) => ({
                        name: i,
                        type: 'lyricist',
                    }))} onClick={buildHeaderOnClick('lyricists')}/>
            </div>);
            },
        },
        {
            field: 'artists',
            headerName: '艺术家',
            valueGetter: (_, row) => row.artists.map((i) => i.name).join(','),
            minWidth: 150,
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.artists.map((i) => ({
                        name: i.name,
                        type: i.type,
                    }))} onClick={buildHeaderOnClick('artists')}/>
            </div>);
            },
        },
        {
            field: 'sources',
            headerName: '来源',
            valueGetter: (_, row) => row.sources.join(','),
            minWidth: 150,
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.sources.map((i) => ({
                        name: i,
                        type: 'source',
                    }))} onClick={buildHeaderOnClick('sources')}/>
            </div>);
            },
        },
        {
            field: 'art_forms',
            headerName: '艺术形式',
            minWidth: 150,
            valueGetter: (_, row) => row.art_forms.join(','),
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.art_forms.map((i) => ({
                        name: i,
                        type: 'art_form',
                    }))} onClick={buildHeaderOnClick('art_forms')}/>
            </div>);
            },
        },
        {
            field: 'nLyrics',
            headerName: '歌词版本数量',
            minWidth: 150,
            renderCell: (params) => {
                return params.row.nLyrics;
            },
        },
        {
            field: 'tags',
            headerName: '标签',
            minWidth: 200,
            valueGetter: (_, row) => row.tags.join(','),
            renderCell: (params) => {
                return (<div style={{ overflow: 'scroll', height: '100%' }}>
              <Tags_1.default tags={params.row.tags.map((i) => ({
                        name: i,
                        type: 'tag',
                    }))} onClick={buildHeaderOnClick('tags')}/>
            </div>);
            },
        },
    ], []);
    (0, react_1.useEffect)(() => {
        function onChange(id) {
            playing.id = id;
            const idx = apiRef.current.getRowIndexRelativeToVisibleRows(id);
            try {
                apiRef.current.scrollToIndexes({
                    colIndex: 0,
                    rowIndex: idx,
                });
                apiRef.current.setExpandedDetailPanels([id]);
            }
            catch (e) { }
        }
        ee.on('musicChanged', onChange);
        return () => {
            ee.off('musicChanged', onChange);
        };
    }, []);
    return (<Stack_1.default p={2} sx={{ height: '100%', overflow: 'scroll' }}>
      <head_1.default>
        <title>和谐历史档案馆 Banned Historical Archives</title>
      </head_1.default>
      <Typography_1.default variant="h4" sx={{ mb: 1 }}>
        音乐
      </Typography_1.default>
      <Player apiRef={apiRef}/>
      <Stack_1.default sx={{ flex: 1, width: '100%', height: '500px' }}>
        <x_data_grid_pro_1.DataGridPro disableColumnFilter headerFilters apiRef={apiRef} initialState={{
            sorting: {
                sortModel: [{ field: 'nLyrics', sort: 'desc' }],
            },
        }} onFilterModelChange={(f) => {
            apiRef.current.setFilterModel(f);
            filterModelRef.current = f;
        }} getRowId={(row) => row.id} rows={indexes} columns={columns} localeText={locales_1.zhCN.components.MuiDataGrid.defaultProps.localeText} pageSizeOptions={[100]}/>
      </Stack_1.default>
    </Stack_1.default>);
}
Music.getLayout = (page) => <Layout_1.default>{page}</Layout_1.default>;
