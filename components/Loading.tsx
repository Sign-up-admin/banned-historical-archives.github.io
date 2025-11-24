import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * 加载状态组件
 *
 * 显示一个半透明背景的圆形进度条，用于表示页面或内容正在加载中。
 * 使用 Material-UI 的 Backdrop 和 CircularProgress 组件实现。
 */
export default function Loading() {
  return (
    <Backdrop open={true} sx={{ zIndex: 3, background: 'transparent' }}>
      <CircularProgress />
    </Backdrop>
  );
}
