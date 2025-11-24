import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { ReactElement, useState, useEffect, useMemo } from 'react';
import Popover from '@mui/material/Popover';
import { ArticleCategory, ArticleType, TagType } from '../types';
import { Tag } from '../types';

/**
 * 图片标签显示组件
 *
 * 专门用于图片库的标签显示组件，显示标签名称和类型提示。
 * 与 Tags 组件类似，但专门用于图片相关的标签展示。
 *
 * @param tags - 要显示的标签数组，每个标签包含 name 和 type 属性
 */
export default function ImageTags({
  tags,
}: {
  tags: { name: string; type: string }[];
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
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>{label}</Typography>
      </Popover>

      {tags.map((tag) => (
        <Chip
          key={tag.type + '##' + tag.name}
          onMouseEnter={(event) => {
            setLabel(tag.type);
            setAnchorEl(event.currentTarget);
          }}
          onMouseLeave={handleClose}
          sx={{ m: 0.3 }}
          label={tag.name}
        />
      ))}
    </>
  );
}
