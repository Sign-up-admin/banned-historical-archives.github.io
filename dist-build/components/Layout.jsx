"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
const Stack_1 = __importDefault(require("@mui/material/Stack"));
const react_1 = require("react");
const Navbar_1 = __importDefault(require("./Navbar"));
const Footer_1 = __importDefault(require("./Footer"));
const Skeleton_1 = __importDefault(require("@mui/material/Skeleton"));
const router_1 = require("next/router");
/**
 * 应用主布局组件
 *
 * 提供整个应用的统一布局结构，包含导航栏、页脚和页面内容区域。
 * 同时处理页面切换时的加载状态显示。
 *
 * @param children - 子组件，通常是页面内容
 */
function Layout({ children }) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const handleStart = (url) => {
            setLoading(true);
        };
        const handleStop = () => {
            setLoading(false);
        };
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);
        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);
    return (<>
      <Stack_1.default sx={{ position: 'absolute', height: '100%', width: '100%' }} direction="column">
        <Navbar_1.default />
        {loading ? (<Stack_1.default spacing={1} p={2}>
            <Skeleton_1.default variant="text" sx={{ fontSize: '1rem' }}/>
            <Skeleton_1.default variant="rectangular" height={60}/>
            <Skeleton_1.default variant="rectangular" height={60}/>
            <Skeleton_1.default variant="rectangular" height={60}/>
            <Skeleton_1.default variant="rectangular" height={60}/>
          </Stack_1.default>) : (<main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {children}
          </main>)}
        <Footer_1.default />
      </Stack_1.default>
    </>);
}
