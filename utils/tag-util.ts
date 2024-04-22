/**
 * 用于显示的 TAG 类型
 */
export type DisplayVideoTagType = {
	tagId: number; // TAG ID
	tagNameList: string[]; // 当前语言下的 TAG 名称列表
	defaultTagName?: string; //
	originTagName?: string;
};

/**
 * 获取当前语言的正确视频 TAG 数据，如果没有当前使用的语言，则使用
 * @param language 当前语言
 * @param tagData 获取到的 TAG 数据
 * @returns TAG 数据
 */
export function getVideoTagNaveWithCurrentLanguage(language: string, tagData?: VideoTag): DisplayVideoTagType {
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

		const originTagName = sourceTagNameList?.filter(tagNameList => tagNameList.tagName.filter(tagName => tagName.isOriginalTagName).length > 0)?.[0]?.tagName?.[0]?.name;

		return { tagId, tagNameList, defaultTagName, originTagName };
	} else return { tagId: -1, tagNameList: [""], defaultTagName: "", originTagName: "" };
}
