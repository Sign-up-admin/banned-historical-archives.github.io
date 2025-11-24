import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { ReactElement, useState, useEffect, useMemo } from 'react';
import Popover from '@mui/material/Popover';
import { Tag } from '../types';

/**
 * 标签显示组件
 *
 * 显示标签列表，每个标签以 Material-UI Chip 组件呈现。
 * 支持鼠标悬停显示标签类型提示，以及点击导航到相关文章页面。
 *
 * @param tags - 要显示的标签数组
 * @param onClick - 可选的点击处理函数，默认为导航到标签搜索页面
 */
export default function Tags({
  tags,
  onClick,
}: {
  tags: Tag[];
  onClick?: Function;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [label, setLabel] = useState('');

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableRestoreFocus
        sx={{
          pointerEvents: 'none',
          marginTop: '10px',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 1 }}>{label}</Typography>
      </Popover>

      {tags.map((tag) => (
        <Chip
          key={tag.type + '##' + tag.name}
          onMouseEnter={(event) => {
            setLabel(tag.type);
            setAnchorEl(event.currentTarget);
          }}
          onMouseLeave={handleClose}
          onClick={() => {
            if (onClick) {
              onClick(tag);
            } else {
              window.open(
                `/articles?tag=${encodeURIComponent(tag.name)}`,
                '_blank',
              );
            }
          }}
          sx={{ m: 0.3, lineHeight: '34px', float: 'left' }}
          label={tag.name}
        />
      ))}
    </>
  );
}
