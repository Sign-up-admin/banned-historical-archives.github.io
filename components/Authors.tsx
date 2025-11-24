import Chip from '@mui/material/Chip';

/**
 * 作者显示组件
 *
 * 显示文章作者列表，每个作者以 Material-UI Chip 组件呈现。
 * 支持点击导航到该作者的文章列表页面。
 *
 * @param authors - 要显示的作者姓名数组
 * @param onClick - 可选的点击处理函数，默认为导航到作者搜索页面
 */
export default function Authors({
  authors,
  onClick,
}: {
  authors: string[];
  onClick?: Function;
}) {
  return (
    <>
      {authors.map((author) => (
        <Chip
          key={author}
          onClick={() => {
            if (onClick) {
              onClick(author);
            } else {
              window.open(
                `/articles?author=${encodeURIComponent(author)}`,
                '_blank',
              );
            }
          }}
          sx={{ m: 0.3 }}
          label={author}
        />
      ))}
    </>
  );
}
