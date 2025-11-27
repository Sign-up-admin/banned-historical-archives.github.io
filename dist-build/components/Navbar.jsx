"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const react_1 = require("react");
const styles_1 = require("@mui/material/styles");
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemButton_1 = __importDefault(require("@mui/material/ListItemButton"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Block_1 = __importDefault(require("@mui/icons-material/Block"));
const Menu_1 = __importDefault(require("@mui/icons-material/Menu"));
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const AppBar_1 = __importDefault(require("@mui/material/AppBar"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Drawer_1 = __importDefault(require("@mui/material/Drawer"));
const Toolbar_1 = __importDefault(require("@mui/material/Toolbar"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Container_1 = __importDefault(require("@mui/material/Container"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const MenuBook_1 = __importDefault(require("@mui/icons-material/MenuBook"));
const router_1 = require("next/router");
const GitHub_1 = __importDefault(require("@mui/icons-material/GitHub"));
const InputBase_1 = __importDefault(require("@mui/material/InputBase"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const Search_1 = __importDefault(require("@mui/icons-material/Search"));
const Search = (0, styles_1.styled)('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (0, styles_1.alpha)(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: (0, styles_1.alpha)(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));
const SearchIconWrapper = (0, styles_1.styled)('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = (0, styles_1.styled)(InputBase_1.default)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
/**
 * 导航栏组件
 *
 * 提供网站的主要导航功能，包括：
 * - 网站标题和logo
 * - 全站搜索功能（支持本地搜索引擎和Google搜索）
 * - 页面导航菜单
 * - GitHub讨论链接
 * - 移动端响应式抽屉菜单
 */
const routes = [
    {
        name: '首页',
        path: '/',
    },
    {
        name: '文档',
        path: '/articles',
    },
    {
        name: '音乐',
        path: '/music',
    },
    {
        name: '图库',
        path: '/gallery',
    },
];
function Navbar() {
    const router = (0, router_1.useRouter)();
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [mobileOpen, setMobileOpen] = (0, react_1.useState)(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const drawer = (<Box_1.default onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List_1.default>
        {routes.map((item) => (<ListItem_1.default key={item.name} disablePadding>
            <ListItemButton_1.default sx={{ textAlign: 'center' }} href={item.path} target="_blank">
              <ListItemText_1.default primary={item.name}/>
            </ListItemButton_1.default>
          </ListItem_1.default>))}
      </List_1.default>
    </Box_1.default>);
    return (<>
      <AppBar_1.default position="static">
        <Container_1.default maxWidth="xl">
          <Toolbar_1.default disableGutters>
            <Stack_1.default sx={{ position: 'relative', ml: 1, transform: 'translateY(4px)' }}>
              <Block_1.default sx={{
            width: 20,
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
        }}/>
              <MenuBook_1.default />
            </Stack_1.default>
            <Typography_1.default variant="h6" noWrap component="a" sx={{
            ml: 1,
            mr: 2,
            fontWeight: 700,
            letterSpacing: '.3rem',
            textDecoration: 'none',
            cursor: 'pointer',
        }} style={{
            color: 'white',
        }} href="/" onClick={() => router.push('/')}>
              和谐历史档案馆
            </Typography_1.default>

            <Search sx={{
            display: {
                xs: 'none',
                sm: 'none',
                md: 'flex',
                lg: 'flex',
                xl: 'flex',
            },
        }}>
              <SearchIconWrapper>
                <Search_1.default />
              </SearchIconWrapper>
              <StyledInputBase placeholder="全站搜索" onKeyDown={(e) => {
            if (e.key === 'Enter') {
                if (process?.env?.LOCAL_SEARCH_ENGINE) {
                    window.open(`${location.protocol}//${location.host}/search?keyword=` +
                        encodeURIComponent(inputValue), '_blank');
                    return;
                }
                window.open('https://www.google.com/search?q=' +
                    encodeURIComponent('site:banned-historical-archives.github.io ' +
                        inputValue), '_blank');
            }
        }} value={inputValue} onChange={(x) => setInputValue(x.target.value)} inputProps={{ 'aria-label': 'search' }}/>
            </Search>
            <Stack_1.default sx={{ flex: 1 }}/>
            <Stack_1.default sx={{ display: { xs: 'none', sm: 'flex' } }} direction="row" justifyContent="flex-end">
              {routes.map(({ name, path }) => {
            return (<Button_1.default key={path} sx={{ color: 'white' }} onClick={() => router.push(path)}>
                    {name}
                  </Button_1.default>);
        })}
              <Button_1.default href="https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues" target="_blank" sx={{ color: 'white' }}>
                <GitHub_1.default sx={{
            mr: 1,
        }}/>
                讨论
              </Button_1.default>
            </Stack_1.default>
            <IconButton_1.default size="small" edge="start" color="inherit" aria-label="menu" sx={{
            display: {
                xs: 'flex',
                sm: 'none',
            },
        }} onClick={handleDrawerToggle}>
              <Menu_1.default />
            </IconButton_1.default>
          </Toolbar_1.default>
        </Container_1.default>
      </AppBar_1.default>
      <Box_1.default component="nav">
        <Drawer_1.default variant="temporary" anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{
            keepMounted: true, // Better open performance on mobile.
        }} sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}>
          {drawer}
        </Drawer_1.default>
      </Box_1.default>
    </>);
}
