/**
 * TAG 类型。
 */
type CurrentLanguageVideoTag = {
	tagId: number; // TAG ID
	tagNameList: string[]; // 当前语言下的 TAG 名称列表
	defaultTagName?: string; // 当前语言下的默认 TAG
	originTagName?: string;
};

/**
 * 用于显示的 TAG 类型。
 */
export type DisplayVideoTag = {
	tagId: number; // TAG ID
	mainTagName: string; // 主 TAG 名
	originTagName?: string; // 次要 TAG 名（原名）
};

/**
 * 获取当前语言的正确视频 TAG 数据，如果没有当前使用的语言，则使用。
 * @param language - 当前语言。
 * @param tagData - 获取到的 TAG 数据。
 * @returns TAG 数据。
 */
function getVideoTagNameWithCurrentLanguage(language: string, tagData?: VideoTag): CurrentLanguageVideoTag {
	if (tagData) {
		const { tagId, tagNameList: sourceTagNameList } = tagData;

		let tagNameList;
		let defaultTagName;
		if (language) {
			const currentLanguageTagNameList = sourceTagNameList.filter(tag => tag.lang === language);

			if (currentLanguageTagNameList.length > 0) {
				const currentLanguageTagNameList = sourceTagNameList.filter(tag => tag.lang === language);
				tagNameList = currentLanguageTagNameList[0]?.tagName?.map(tagName => tagName.name);
				defaultTagName = currentLanguageTagNameList[0]?.tagName.filter(tagName => tagName.isDefault)?.[0]?.name;
			} else {
				const otherLanguageTagNameList = sourceTagNameList.filter(tag => tag.lang === "other");
				if (otherLanguageTagNameList.length > 0) {
					tagNameList = otherLanguageTagNameList?.[0].tagName?.map(tagName => tagName.name);
					defaultTagName = otherLanguageTagNameList?.[0].tagName?.filter(tagName => tagName.isDefault)?.[0]?.name;
				} else {
					tagNameList = sourceTagNameList?.[0].tagName?.map(tagName => tagName.name);
					defaultTagName = sourceTagNameList?.[0].tagName?.filter(tagName => tagName.isDefault)?.[0]?.name;
				}
			}
		} else {
			tagNameList = sourceTagNameList?.[0].tagName?.map(tagName => tagName.name);
			defaultTagName = sourceTagNameList?.[0].tagName?.filter(tagName => tagName.isDefault)?.[0]?.name;
		}

		let originTagName = "";
		sourceTagNameList?.forEach(tagNameList => tagNameList.tagName.forEach(tagName => {
			if (tagName.isOriginalTagName) originTagName = tagName.name;
		}));

		return { tagId, tagNameList, defaultTagName, originTagName };
	} else return { tagId: -1, tagNameList: [""], defaultTagName: "", originTagName: "" };
}

/**
 * 获取当前语言用于显示的 TAG 数据。
 * @param language - 当前语言。
 * @param tagData - 获取到的 TAG 数据。
 * @returns 用于显示的 TAG 数据。
 */
export function getDisplayVideoTagWithCurrentLanguage(language: string, tagData?: VideoTag): DisplayVideoTag {
	const tagName = getVideoTagNameWithCurrentLanguage(language, tagData);
	if (tagName && tagName.tagId >= 0) {
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
	return tagListSearchResult.some(tag => tag.tagNameList.some(tagNameList => tagNameList.tagName.some(tagName => halfwidth(tagName.name.trim().replaceAll(/\s+/g, " ").toLowerCase()) === halfwidth(inputTagName.trim().replaceAll(/\s+/g, " ").toLowerCase()))));
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
	const hitTag = tag.tagNameList.filter(tagName => tagName?.tagName?.some(name => regex.test(name.name)))?.[0]?.tagName?.[0].name;
	return hitTag !== displayTagData.mainTagName ? hitTag : undefined;
}
