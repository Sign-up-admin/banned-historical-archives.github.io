"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleType = exports.ContentType = exports.TagType = exports.ArticleCategory = void 0;
/**
 * 文章大类枚举
 * 定义历史文献的主要分类
 */
let ArticleCategory;
(function (ArticleCategory) {
    /** 中央文件 */
    ArticleCategory["centralFile"] = "\u4E2D\u592E\u6587\u4EF6";
    /** 重要报刊和社论 */
    ArticleCategory["editorial"] = "\u91CD\u8981\u62A5\u520A\u548C\u793E\u8BBA";
    /** 关键人物文稿 */
    ArticleCategory["keyFigures"] = "\u5173\u952E\u4EBA\u7269\u6587\u7A3F";
    /** 群众运动重要文献 */
    ArticleCategory["keyPapersFromTheMasses"] = "\u7FA4\u4F17\u8FD0\u52A8\u91CD\u8981\u6587\u732E";
})(ArticleCategory || (exports.ArticleCategory = ArticleCategory = {}));
/**
 * 标签类型枚举
 * 定义所有可能的标签分类
 */
let TagType;
(function (TagType) {
    /** 文稿大类 */
    TagType["articleCategory"] = "\u6587\u7A3F\u5927\u7C7B";
    /** 文稿类型 */
    TagType["articleType"] = "\u6587\u7A3F\u7C7B\u578B";
    /** 地点 */
    TagType["place"] = "\u5730\u70B9";
    /** 人物 */
    TagType["character"] = "\u4EBA\u7269";
    /** 出版方/发行方 */
    TagType["issuer"] = "\u51FA\u7248\u65B9/\u53D1\u884C\u65B9";
    /** 主题/事件 */
    TagType["subject"] = "\u4E3B\u9898/\u4E8B\u4EF6";
    /** 记录 */
    TagType["recorder"] = "\u8BB0\u5F55";
    /** 审核 */
    TagType["reviewer"] = "\u5BA1\u6838";
    /** 翻译 */
    TagType["translator"] = "\u7FFB\u8BD1";
    /** 翻印/传抄 */
    TagType["reprint"] = "\u7FFB\u5370/\u4F20\u6284";
})(TagType || (exports.TagType = TagType = {}));
/**
 * 内容类型枚举
 * 定义文档内容块的所有可能类型
 */
let ContentType;
(function (ContentType) {
    /** 称呼 */
    ContentType["appellation"] = "appellation";
    /** 标题 */
    ContentType["title"] = "title";
    /** 作者 */
    ContentType["authors"] = "authors";
    /** 地点 */
    ContentType["place"] = "place";
    /** 副标题 */
    ContentType["subtitle"] = "subtitle";
    /** 二级副标题 */
    ContentType["subtitle2"] = "subtitle2";
    /** 三级副标题 */
    ContentType["subtitle3"] = "subtitle3";
    /** 四级副标题 */
    ContentType["subtitle4"] = "subtitle4";
    /** 五级副标题 */
    ContentType["subtitle5"] = "subtitle5";
    /** 子日期 */
    ContentType["subdate"] = "subdate";
    /** 段落 */
    ContentType["paragraph"] = "paragraph";
    /** 引用 */
    ContentType["quotation"] = "quotation";
    /** 签名 */
    ContentType["signature"] = "signature";
    /** 图片 */
    ContentType["image"] = "image";
    /** 图片描述 */
    ContentType["image_description"] = "image_description";
})(ContentType || (exports.ContentType = ContentType = {}));
/**
 * 文章类型枚举
 * 定义历史文献的具体类型
 */
let ArticleType;
(function (ArticleType) {
    /** 文章 */
    ArticleType["writings"] = "\u6587\u7AE0";
    /** 书信 */
    ArticleType["mail"] = "\u4E66\u4FE1";
    /** 发言 */
    ArticleType["lecture"] = "\u53D1\u8A00";
    /** 对话 */
    ArticleType["talk"] = "\u5BF9\u8BDD";
    /** 宣言 */
    ArticleType["declaration"] = "\u5BA3\u8A00";
    /** 指示 */
    ArticleType["instruction"] = "\u6307\u793A";
    /** 批示 */
    ArticleType["comment"] = "\u6279\u793A";
    /** 通讯 */
    ArticleType["telegram"] = "\u901A\u8BAF";
})(ArticleType || (exports.ArticleType = ArticleType = {}));
