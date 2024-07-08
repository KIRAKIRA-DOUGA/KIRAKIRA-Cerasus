/**
 * TAG 类型。
 */
interface CurrentLanguageVideoTag {
	/** TAG ID。 */
	tagId: number;
	/** 当前语言下的 TAG 名称列表。 */
	tagNameList: string[];
	/** 当前语言下的默认 TAG。 */
	defaultTagName?: string;
	/** 原名 TAG。 */
	originTagName?: string;
}

/**
 * 用于显示的 TAG 类型。
 */
export interface DisplayVideoTag {
	/** TAG ID。 */
	tagId: number;
	/** 主 TAG 名。 */
	mainTagName: string;
	/** 次要 TAG 名（原名）。 */
	originTagName?: string;
}

/**
 * 获取当前语言的正确视频 TAG 数据，如果没有当前使用的语言，则使用。
 * @param language - 当前语言。
 * @param tagData - 获取到的 TAG 数据。
 * @returns TAG 数据。
 */
function getVideoTagNameWithCurrentLanguage(language: string, tagData?: VideoTag): CurrentLanguageVideoTag {
	const { tagId, tagNameList: srcTags } = tagData ?? { tagId: -1, tagNameList: [""] as unknown as VideoTag["tagNameList"] };

	let tagNameList = [""], defaultTagName = "", originTagName = "", isSingleLang = false;
	if (tagData && language) {
		const currentLanguageTagNameList = srcTags.filter(tag => tag.lang === language);

		if (currentLanguageTagNameList.length) {
			const curLangTags = srcTags.filter(tag => tag.lang === language);
			tagNameList = curLangTags[0]?.tagName.map(tagName => tagName.name);
			defaultTagName = curLangTags[0]?.tagName.filter(tagName => tagName.isDefault)[0]?.name;
		} else {
			const otherLangTags = srcTags.filter(tag => tag.lang === "other");
			if (otherLangTags.length) {
				tagNameList = otherLangTags[0].tagName.map(tagName => tagName.name);
				defaultTagName = otherLangTags[0].tagName.filter(tagName => tagName.isDefault)[0]?.name;
			} else isSingleLang = true;
		}
	} else isSingleLang = true;
	if (isSingleLang) {
		const tagName = srcTags[0].tagName, isArray = Array.isArray(tagName);
		tagNameList = isArray ? tagName.map(tagName => tagName.name) : [tagName];
		defaultTagName = isArray ? tagName.filter(tagName => tagName.isDefault)[0]?.name : tagName;
	}
	srcTags?.forEach(tagNameList => tagNameList.tagName?.forEach?.(tagName => {
		if (tagName.isOriginalTagName) originTagName = tagName.name;
	})); // BUG: 示例视频《柴又》下声明的标签信息已经错乱，亟待修改！

	return { tagId, tagNameList, defaultTagName, originTagName };
}

/**
 * 获取当前语言用于显示的 TAG 数据。
 * @param language - 当前语言。
 * @param tagData - 获取到的 TAG 数据。
 * @returns 用于显示的 TAG 数据。
 */
export function getDisplayVideoTagWithCurrentLanguage(language: string, tagData?: VideoTag): DisplayVideoTag {
	const tagName = getVideoTagNameWithCurrentLanguage(language, tagData);
	if (tagName?.tagId >= 0) {
		const tagId = tagName.tagId;
		const mainTagName = tagName.defaultTagName ?? tagName.tagNameList?.find(name => !!name) ?? "";
		const originTagName = tagName.originTagName !== mainTagName ? tagName.originTagName : undefined;
		return { tagId, mainTagName, originTagName };
	} else return { tagId: -1, mainTagName: "" };
}

/**
 * 在搜索结果中检查当前输入的 TAG 是否重复。
 * @param inputTagName - 用户输入的 TAG。
 * @param tagListSearchResult - 搜索到的 TAG。
 * @returns 有重复？
 */
export function checkTagUnique(inputTagName: string, tagListSearchResult: VideoTag[]): boolean {
	return tagListSearchResult.some(tag =>
		tag.tagNameList.some(tagNameList =>
			tagNameList.tagName.some(tagName =>
				halfwidth(tagName.name.trim().replaceAll(/\s+/g, " ").toLowerCase()) ===
				halfwidth(inputTagName.trim().replaceAll(/\s+/g, " ").toLowerCase()))));
}

/**
 * 在搜索结果中获取第一个与当前用户输入内容匹配的 TAG（忽略大小写）。
 * @param inputTagName - 用户输入的 TAG。
 * @param language - 当前语言。
 * @param tag - 搜索到其中一个的 TAG。
 * @returns 与当前用户输入内容匹配的 TAG。
 */
export function getSearchHit(inputTagName: string, language: string, tag: VideoTag): string | undefined {
	const displayTagData = getDisplayVideoTagWithCurrentLanguage(language, tag);
	const text = halfwidth(inputTagName.trim().replaceAll(/\s+/g, " ").toLowerCase());
	const regex = new RegExp(text, "i"); // 忽略大小写
	const hitTag = tag.tagNameList.filter(tagName =>
		tagName.tagName.some(name => regex.test(name.name)))[0]?.tagName[0]?.name;
	return hitTag !== displayTagData.mainTagName ? hitTag : undefined;
}
