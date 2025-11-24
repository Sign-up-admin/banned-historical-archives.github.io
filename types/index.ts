/**
 * 标签类型定义
 * 用于标识文章、书籍等资源的内容分类和属性
 */
export type Tag = {
  /** 可选的标签唯一标识符 */
  id?: string;
  /** 标签名称 */
  name: string;
  /** 标签类型，如 '文稿大类'、'地点' 等 */
  type: string;
};

/**
 * 注释类型定义
 * 表示文档中特定位置的注释信息
 */
export type Comment = {
  /** 注释编号，从 0 开始 */
  index: number;
  /** 内容部分索引，指向具体的段落或内容块 */
  part_idx: number;
  /** 注释的唯一标识符 */
  id: string;
  /** 在内容中的偏移位置，表示注释应插入的字符索引 */
  offset: number;
  /** 注释的文本内容 */
  text: string;
};
/**
 * 内容块类型定义
 * 表示文档中的一个内容单元，如段落、标题等
 */
export type Content = {
  /** 内容块的唯一标识符 */
  id: string;
  /** 内容块的类型，如 'paragraph'、'title' 等 */
  type: ContentType;
  /** 内容块的文本内容 */
  text: string;
  /** 内容块在文档中的顺序索引 */
  index: number;
};
/**
 * 文章类型定义
 * 表示一个历史文献的基本信息结构
 */
export type Article = {
  /** 文章标题 */
  title: string;
  /** 文章作者列表 */
  author: string[];
  /** 文章日期列表，支持多个日期或日期范围 */
  dates: Date[];
  /** 是否为日期范围（true 表示一段时间，false 表示多个时间点） */
  is_range_date: boolean;
  /** 可选的文章来源信息 */
  origin?: string;
  /** 可选的文章别名 */
  alias?: string;
  /** 文章的标签列表，用于分类和检索 */
  tags: Tag[];
};

/**
 * 书籍元数据类型定义
 * 描述书籍资源的基本属性和文件信息
 */
export type BookMetaData = {
  /** 书籍的唯一标识符 */
  id: string;
  /** 书籍名称 */
  name: string;
  /** 是否为内部资料 */
  internal: boolean;
  /** 是否为官方出版物 */
  official: boolean;
  /** 资源类型：图片、PDF、数据库或其他 */
  type: 'img' | 'pdf' | 'db' | 'unknown';
  /** 书籍作者 */
  author: string;
  /** 关联的文件列表 */
  files: string[];
};

export type ResourceMetaData =
  | BookMetaData
  | MusicMetaData
  | PictureMetaData
  | VideoMetaData;

/**
 * 文章大类枚举
 * 定义历史文献的主要分类
 */
export enum ArticleCategory {
  /** 中央文件 */
  centralFile = '中央文件',
  /** 重要报刊和社论 */
  editorial = '重要报刊和社论',
  /** 关键人物文稿 */
  keyFigures = '关键人物文稿',
  /** 群众运动重要文献 */
  keyPapersFromTheMasses = '群众运动重要文献',
}

/**
 * 标签类型枚举
 * 定义所有可能的标签分类
 */
export enum TagType {
  /** 文稿大类 */
  articleCategory = '文稿大类',
  /** 文稿类型 */
  articleType = '文稿类型',
  /** 地点 */
  place = '地点',
  /** 人物 */
  character = '人物',
  /** 出版方/发行方 */
  issuer = '出版方/发行方',
  /** 主题/事件 */
  subject = '主题/事件',
  /** 记录 */
  recorder = '记录',
  /** 审核 */
  reviewer = '审核',
  /** 翻译 */
  translator = '翻译',
  /** 翻印/传抄 */
  reprint = '翻印/传抄',
}

/**
 * 内容类型枚举
 * 定义文档内容块的所有可能类型
 */
export enum ContentType {
  /** 称呼 */
  appellation = 'appellation',
  /** 标题 */
  title = 'title',
  /** 作者 */
  authors = 'authors',
  /** 地点 */
  place = 'place',
  /** 副标题 */
  subtitle = 'subtitle',
  /** 二级副标题 */
  subtitle2 = 'subtitle2',
  /** 三级副标题 */
  subtitle3 = 'subtitle3',
  /** 四级副标题 */
  subtitle4 = 'subtitle4',
  /** 五级副标题 */
  subtitle5 = 'subtitle5',
  /** 子日期 */
  subdate = 'subdate',
  /** 段落 */
  paragraph = 'paragraph',
  /** 引用 */
  quotation = 'quotation',
  /** 签名 */
  signature = 'signature',
  /** 图片 */
  image = 'image',
  /** 图片描述 */
  image_description = 'image_description',
}

export type ContentPartRaw = {
  text: string;
  type: ContentType;
};
export type ContentPart = {
  text: string;
  type: ContentType;
};

/**
 * 日期类型定义
 * 表示一个可选的年月日日期结构
 */
export type Date = {
  /** 可选的年份 */
  year?: number;
  /** 可选的月份（1-12） */
  month?: number;
  /** 可选的日期（1-31） */
  day?: number;
};

/**
 * 音乐歌词类型定义
 * 描述一首歌的歌词和对应的音频信息
 */
export type MusicLyric = {
  /** 作词人列表 */
  lyricists: string[];
  /** 歌词版本标识 */
  version: string;
  /** 歌词文本内容 */
  content: string;
  /** 对应的音频资源列表 */
  audios: {
    /** 音频文件URL */
    url: string;
    /** 音频来源列表 */
    sources: string[];
    /** 艺术形式，如 '合唱'、'说书' 等 */
    art_forms: string[];
    /** 艺术家列表 */
    artists: {
      /** 艺术家姓名 */
      name: string;
      /** 艺术家类型，如 '伴奏'、'合唱团'、'领唱'、'乐团' 等 */
      type: string;
    }[];
  }[];
};
/**
 * 音乐作品类型定义
 * 表示一个音乐作品的完整信息
 */
export type Music = {
  /** 音乐作品的唯一标识符 */
  id: string;
  /** 音乐作品名称 */
  name: string;
  /** 作曲家列表 */
  composers: string[];
  /** 作品描述 */
  description: string;
  /** 歌词列表，可能包含多个版本 */
  lyrics: MusicLyric[];
};
/**
 * 注释定位点类型定义
 * 用于标识注释在文档内容中的精确位置
 */
export type Pivot = {
  /** 内容部分索引，从 0 开始，指向具体的段落或内容块 */
  part_idx: number;
  /** 注释编号，用于标识特定的注释 */
  index: number;
  /** 字符偏移量，从 0 开始，表示注释应插入的字符位置 */
  offset: number;
};

/**
 * 解析结果类型定义
 * 表示文档解析后的完整结果，包含所有元数据和内容信息
 */
export type ParserResult = {
  /** 文档标题 */
  title: string;
  /** 可选的标题别名 */
  alias?: string;
  /** 文档日期列表 */
  dates: Date[];
  /** 是否为日期范围 */
  is_range_date: boolean;
  /** 作者列表 */
  authors: string[];
  /** 文档内容部分列表 */
  parts: ContentPart[];
  /** 注释内容列表 */
  comments: string[];
  /** 注释定位点列表 */
  comment_pivots: Pivot[];
  /** 文档描述 */
  description: string;
  /** 起始页码 */
  page_start: number;
  /** 结束页码 */
  page_end: number;
  /** 可选的来源信息 */
  origin?: string;
  /** 可选的标签列表 */
  tags?: {
    /** 标签名称 */
    name: string;
    /** 标签类型 */
    type: TagType;
  }[];
  /** 可选的文件标识符 */
  file_id?: string;

  /** 可选的原始标题（解析前的格式） */
  title_raw?: string;
  /** 可选的原始日期字符串 */
  date_raw?: string;
  /** 可选的原始内容部分（解析前的格式） */
  parts_raw?: ContentPartRaw[];
};

/**
 * 文章类型枚举
 * 定义历史文献的具体类型
 */
export enum ArticleType {
  /** 文章 */
  writings = '文章',
  /** 书信 */
  mail = '书信',
  /** 发言 */
  lecture = '发言',
  /** 对话 */
  talk = '对话',
  /** 宣言 */
  declaration = '宣言',
  /** 指示 */
  instruction = '指示',
  /** 批示 */
  comment = '批示',
  /** 通讯 */
  telegram = '通讯',
}

export type OCRPosition = [number, number];
export type OCRResult = {
  // 坐标轴原点在左上角，y轴朝下
  // 左上，右上，右下，左下
  box: [OCRPosition, OCRPosition, OCRPosition, OCRPosition];
  text: string;
};
export type LACType =
  | 'n' // 普通名词
  | 'f' // 方位名词
  | 's' // 处所名词
  | 't' // 时间
  | 'nr' // 人名
  | 'ns' // 地名
  | 'nt' // 机构名
  | 'nw' // 作品名
  | 'nz' // 其他专名
  | 'v' // 普通动词
  | 'vd' // 动副词
  | 'vn' // 名动词
  | 'a' // 形容词
  | 'ad' // 副形词
  | 'an' // 名形词
  | 'd' // 副词
  | 'm' // 数量词
  | 'q' // 量词
  | 'r' // 代词
  | 'p' // 介词
  | 'c' // 连词
  | 'u' // 助词
  | 'xc' // 其他虚词
  | 'w' // 标点符号
  | 'PER' // 人名
  | 'LOC' // 地名
  | 'ORG' // 机构名
  | 'TIME'; // 时间

export type LACResult = {
  text: string;
  count: number;
  type: LACType;
};

export type AutomatedEntryBookOption = {
  resource_type?: 'book';
  source_name: string;
  archive_id?: number;
  internal?: boolean;
  official?: boolean;
  author: string;
  articles: {
    title: string;
    authors: string[]; // 作者
    dates: Date[]; // 时间 或者 时间范围 或者 多个时间点
    is_range_date?: boolean; // 如果为 true 表示一段时间，如果为false表示多/单个时间点
    alias?: string; // 标题别名
    ocr?: Partial<OCRParameter & OCRParameterAdvanced>; // 此参数比全局ocr参数的优先级高，默认为空
    ocr_exceptions?: {
      [key: string]: Partial<OCRParameter & OCRParameterAdvanced>;
    };
    tags?: { name: string; type: keyof typeof TagType }[];
    page_start: number;
    page_end: number;
  }[];
  ext?: string;
  pdf_no_ocr?: boolean; // 如果为true，表示pdf不进行ocr，使用pdf内的文本
  ocr?: Partial<OCRParameter & OCRParameterAdvanced>; // ocr 全局参数
  ocr_exceptions?: {
    [key: string]: Partial<OCRParameter & OCRParameterAdvanced>;
  }; // 例外， 比如第三页的ocr参数与其他页面不同，默认为空，此参数比articles中的优先级高
};

export type AutomatedEntryMusicOption = {
  resource_type: 'music';
  archive_id?: number;
} & Omit<MusicMetaData, 'id'>;

export type AutomatedEntryPictureOption = {
  resource_type: 'picture';
  archive_id?: number;
} & Omit<PictureMetaData, 'id'>;

export type AutomatedEntryVideoOption = {
  resource_type: 'video';
  archive_id?: number;
} & Omit<VideoMetaData, 'id'>;

export type AutomatedEntryOption =
  | AutomatedEntryBookOption
  | AutomatedEntryPictureOption
  | AutomatedEntryVideoOption
  | AutomatedEntryMusicOption;

export type MusicMetaData = {
  id: string;
  name: string;
  composers: string[];
  description: string;
  tags?: string[];
  lyrics: MusicLyric[];
};

export type PictureMetaData = {
  id: string;
  name: string;
  description: string;
  source: string;
  url: string;
  year?: number;
  month?: number;
  day?: number;
  tags: { name: string; type: string }[];
};

export type VideoMetaData = PictureMetaData;

export type OCRParameter = {
  image_dir: string;

  use_gpu: boolean; //False,
  use_xpu: boolean; //False,
  use_npu: boolean; //False,
  ir_optim: boolean; //True,
  use_tensorrt: boolean; //False,
  min_subgraph_size: number; //15,
  precision: 'fp32';
  gpu_mem: number; //500,
  gpu_id: number; //0,

  use_onnx: boolean; //False,
  page_num: number; //0,
  det_algorithm: 'DB';
  det_limit_side_len: number; //960,
  det_limit_type: 'max' | 'min'; // 'max'
  det_box_type: 'quad';
  det_model_dir: string;

  // DB parmas
  det_db_thresh: number; // 0.3,
  det_db_box_thresh: number; // 0.6,
  det_db_unclip_ratio: number; // 1.5,
  max_batch_size: number; // 10,
  use_dilation: boolean; // False,
  det_db_score_mode: 'fast';

  // EAST parmas
  det_east_score_thresh: number; // 0.8,
  det_east_cover_thresh: number; // 0.1,
  det_east_nms_thresh: number; // 0.2,

  // SAST parmas
  det_sast_score_thresh: number; // 0.5,
  det_sast_nms_thresh: number; // 0.2,

  // PSE parmas
  det_pse_thresh: number; // 0,
  det_pse_box_thresh: number; // 0.85,
  det_pse_min_area: number; // 16,
  det_pse_scale: number; // 1,

  // FCE parmas
  scales: number[]; // [8, 16, 32],
  alpha: number; // 1.0,
  beta: number; // 1.0,
  fourier_degree: number; // 5,

  // params for text recognizer
  rec_model_dir: string;
  rec_algorithm: 'SVTR_LCNet';
  rec_image_inverse: boolean; // True,
  rec_image_shape: '3, 48, 320';
  rec_batch_num: number; // 6,
  max_text_length: number; // 25,
  rec_char_dict_path: './paddle/ppocr_keys_v1.txt';
  use_space_char: boolean; // True,
  vis_font_path: string; // "./doc/fonts/simfang.ttf",
  drop_score: number; // 0.5,

  // params for e2e
  e2e_algorithm: string; // 'PGNet'
  e2e_model_dir: string;
  e2e_limit_side_len: number; // 768
  e2e_limit_type: 'max';

  // PGNet parmas
  e2e_pgnet_score_thresh: number; //0.5
  e2e_char_dict_path: './ppocr/utils/ic15_dict.txt';
  e2e_pgnet_valid_set: 'totaltext';
  e2e_pgnet_mode: 'fast';

  // params for text classifier
  use_angle_cls: boolean; // False,
  cls_model_dir: string;
  cls_image_shape: '3, 48, 192';
  label_list: ['0', '180'];
  cls_batch_num: number; // 6
  cls_thresh: number; // 0.9,

  enable_mkldnn: boolean; // false,
  cpu_threads: number; // 10,
  use_pdserving: boolean; // False,
  warmup: boolean; // False,

  // SR parmas
  sr_image_shape: '3, 32, 128';
  sr_batch_num: number; // 1,

  draw_img_save_dir: './inference_results';
  save_crop_res: boolean; // False,
  crop_res_save_dir: './output';

  // multi-process
  use_mp: boolean; // False
  total_process_num: number; // 1
  process_id: number; // 0,

  benchmark: boolean; //  False,
  save_log_path: './log_output/';

  show_log: boolean; // False,
};

export type ParserOption = AutomatedEntryBookOption & {
  page_limits: [number, number][];

  /*legacy*/
  page_width?: number;
  content_min_x?: number;
  name?: string;
  header_min_height?: number;

  meta?: any;
  id?: any;

  idx?: number;
};

export type OCRParameterLegacy = {
  rec_model: string;
  rec_backend: string;
  det_model: string;
  det_backend: string;
  resized_shape: number;
  box_score_thresh: number;
  min_box_size: number;
};

export type OCRParameterAdvanced = {
  extract_text_from_pdf: boolean;
  line_merge_threshold: number; // 单位像素，如果小于这个阈值将被视为同一行
  standard_paragraph_merge_strategy_threshold: number; // 标准段落合并策略，超过 threshold * width 的表示新段落，否则向上合并
  differential_paragraph_merge_strategy_threshold: number; // 差分段落合并策略，x[i] - x[i-1] > threshold 的表示新段落，否则向上合并，单位像素
  content_thresholds: [number, number, number, number]; // 通常需要忽略在页面边缘的页眉，页码或者噪声，数组内4个数值分别表示上下左右相对于宽高的比例， 例如 [0.1,0,0,0] 表示忽略顶部占总高度百分之10的内容
  auto_vsplit: boolean; // 用于分页或者处理特殊的排版。如果为 ture，当页面宽度大于高度时，将ocr结果中页面中间(vsplit的位置)分开
  vsplit: number; // 如果设置为0.5，ocr结果将从页面宽度的50%处分割，如果为0表示不分割。当auto_vsplit为false且vsplit不为0时，表示任何页面都进行分割。
};

export type BookConfig = {
  resource_type: 'book';
  entity: Partial<BookMetaData>;
  path: string;
  parser_option: ParserOption;
  parser_id: string;
  parser: (path: string, opt: ParserOption) => Promise<ParserResult[]>;
  version?: number;
};

export type MusicConfig = {
  resource_type: 'music';
  version?: number;
  entity: MusicMetaData;
};

export type PictureConfig = {
  resource_type: 'picture';
  version?: number;
  entity: PictureMetaData;
};

export type VideoConfig = {
  resource_type: 'video';
  version?: number;
  entity: VideoMetaData;
};

export type Config = BookConfig | MusicConfig | PictureConfig | VideoConfig;

export type Patch = {
  parts: { [idx: string]: string };
  comments: { [idx: string]: string };
  description: string;
};

export type StringDiff = string;

export type PartDiff = {
  insertBefore?: ContentPart[];
  insertAfter?: ContentPart[];
  delete?: boolean;
  diff?: StringDiff;
  type?: ContentType;
};

export type CommentDiff = {
  insertBefore?: { id?: string; text: StringDiff }[];
  insertAfter?: { id?: string; text: StringDiff }[];
  delete?: boolean;
  diff?: StringDiff;
};

export type PatchV2 = {
  version: 2;
  parts: { [idx: string]: PartDiff }; // text中包含注释
  comments: { [idx: string]: CommentDiff }; // 从非空注释状态下提交的变更
  newComments?: string[]; // 从空注释状态下提交的变更
  description?: StringDiff; // 如果为空字符串表示无变更，如果不存在，表示删除
};

export type ArticleListV2 = {
  articles: {
    id: string;
    title: string;
    authors: string[];
    dates: any;
    is_range_date: boolean;
    book_ids: number[];
    tag_ids: number[];
  }[];
  books: string[];
  tags: { name: string; type: string }[];
};
/**
 * 文章列表类型
 * 表示文章概览信息的数组
 */
export type ArticleList = ArticleListItem[];
/**
 * 文章列表项类型定义
 * 表示文章在列表中的简要信息
 */
export type ArticleListItem = {
  /** 文章的唯一标识符 */
  id: string;
  /** 文章标题 */
  title: string;
  /** 作者列表 */
  authors: string[];
  /** 日期列表 */
  dates: Date[];
  /** 是否为日期范围 */
  is_range_date: boolean;
  /** 关联的书籍ID列表 */
  book_ids: number[];
  /** 可选的书籍名称列表 */
  books?: string[];
  /** 可选的标签列表 */
  tags?: Tag[];
  /** 标签ID列表 */
  tag_ids: number[];
};
/**
 * 文章索引类型定义
 * 将文章ID映射到书籍ID数组，用于快速查找文章所属的书籍
 */
export type ArticleIndexes = { [aid: string]: number[] }; // book_number_id
/**
 * 标签索引类型定义
 * 标签的元组数组，每个元组包含 [类型, 名称]
 */
export type TagIndexes = [string, string][]; // type, name
/**
 * 带有书籍信息的文章索引类型定义
 * 将文章ID映射到书籍信息数组，每个书籍信息包含 [ID, 名称, 档案ID]
 */
export type ArticleIndexesWithBookInfo = {
  [aid: string]: [string, string, number][];
}; // id, name, archive_id
/**
 * 音乐索引类型定义
 * 音乐条目的完整索引信息，包含元数据和标签
 */
export type MusicIndex = [
  /** 音乐ID */
  string,
  /** 音乐标题 */
  string,
  /** 起始年份 */
  number,
  /** 结束年份 */
  number,
  /** 艺术家列表 */
  string[],
  /** 作曲家列表 */
  string[],
  /** 演唱者列表 */
  string[],
  /** 标签列表 */
  { name: string; type: string }[],
  /** 相关书籍ID列表 */
  string[],
  string[],
]; // id, name, archive_id, lryic_length, tags, composers, lyricists, artists, sources, art forms
/**
 * 音乐索引数组类型定义
 * 所有音乐条目的索引信息数组
 */
export type MusicIndexes = MusicIndex[];
/**
 * 画廊索引类型定义
 * 包含视频和图片元数据的联合数组
 */
export type GalleryIndexes = (VideoMetaData | PictureMetaData)[];
