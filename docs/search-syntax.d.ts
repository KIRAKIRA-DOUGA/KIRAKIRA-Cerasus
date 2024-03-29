/**
 * # 搜索高级语法
 */
type SearchParams = {
	/**
	 * ## 普通关键词
	 * 直接输入内容。
	 *
	 * 此处内容比较随意，与搜索引擎类似，可以包含全部内容，也可包含部分内容，比较大众化的搜索。
	 */
	keyword: string;
	/**
	 * ## 必须包含关键词
	 * ```
	 * +(关键词)
	 * ```
	 *
	 * 此处的关键词必须包括在搜索结果内，不得被剔除。
	 */
	includeKeyword: string[];
	/**
	 * ## 完整包含关键词
	 * ```
	 * "关键词"
	 * ```
	 *
	 * 此处的关键词必须完整地被包含，不得被中文分词技术给拆分到其它词汇，也不得被同义词替换。
	 */
	constrainKeyword: string[];
	/**
	 * ## 不得包含关键词
	 * ```
	 * -(关键词)
	 * ```
	 *
	 * 此处的关键词不会被包含在搜索结果内。
	 */
	excludeKeyword: string[];
	/**
	 * ## 指定标签
	 * ```
	 * #标签#
	 * ```
	 *
	 * 此处表示搜索结果中必须包含该标签。
	 *
	 * 由于中文特性，无法共享与其它语言相同的空格结束语法。
	 */
	tag: string[];
	/**
	 * ## 排除标签
	 * ```
	 * -#标签#
	 * ```
	 *
	 * 在搜索结果中排除指定标签。
	 */
	excludeTag: string[];
	/**
	 * ## 指定作者
	 * ```
	 * @作者
	 * ```
	 *
	 * 在指定作者的作品中搜索该标签。
	 */
	author: string;
	/**
	 * ## 排除作者
	 * ```
	 * -@作者
	 * ```
	 *
	 * 排除指定作者的作品。
	 */
	excludeAuthor: string[];
	/**
	 * 对视频长度筛选做出限制。
	 *
	 * 如某个方向不需要限制，可填入 `±Infinity`。
	 */
	length: [number, number];
	/**
	 * 对作品投稿时间筛选做出限制。
	 *
	 * 如某个方向不需要限制，可填入 `null`。
	 */
	date: [Date, Date];
	/**
	 * 指定搜索位置。
	 *
	 * 可以是全站、某个分区、某个人的收藏夹。
	 */
	target: string | string[];
};
