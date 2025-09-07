<script setup lang="ts">
	const selfUserInfo = useSelfUserInfoStore();
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言

	const isClickAddButton = ref(false); // 是否点击了添加屏蔽按钮（是否正在获取待屏蔽目标的信息）
	const isShowAlert = ref(false); // 是否正在显示待屏蔽数据
	const isAddButtonUnclickalbe = computed(() => isClickAddButton.value || isShowAlert.value); // 不能点击添加按钮的情况

	const blockUserList = ref<GetBlockListResponseDto>(); // 被屏蔽的用户列表
	const blockUserListPage = ref(1); // 被屏蔽的用户列表的页码
	const blockUserListPageSize = ref(10); // 被屏蔽的用户列表的每页数量
	const blockUserListPageCount = computed(() => Math.max(1, Math.ceil((blockUserList.value?.blocklistCount ?? 1) / blockUserListPageSize.value))); // 被屏蔽的用户列表的总页数
	const inputPendingBlockUid = ref(""); // 用户输入的待屏蔽用户 UID
	const isFetchPendingBlockUserInfo = ref(false); // 是否正在请求待屏蔽用户数据
	const isShowAddBlockUserAlert = ref(false); // 是否展示待屏蔽用户信息对话框
	const pendingBlockUserInfo = ref<GetUserInfoByUidResponseDto["result"]>(); // 待屏蔽用户信息
	const isBlockingUser = ref(false); // 是否正在屏蔽用户
	const unblockingUserUid = ref<number>(); // 正在解除屏蔽的用户 UID

	const hideUserList = ref<GetBlockListResponseDto>(); // 被隐藏的用户列表
	const hideUserListPage = ref(1); // 被隐藏的用户列表的页码
	const hideUserListPageSize = ref(10); // 被隐藏的用户列表的每页数量
	const hideUserListPageCount = computed(() => Math.max(1, Math.ceil((hideUserList.value?.blocklistCount ?? 1) / hideUserListPageSize.value))); // 被隐藏的用户列表的总页数
	const inputPendingHideUid = ref(""); // 用户输入的待隐藏用户 UID
	const isFetchPendingHideUserInfo = ref(false); // 是否正在请求待隐藏用户数据
	const isShowAddHideUserAlert = ref(false); // 是否展示待隐藏用户信息对话框
	const pendingHideUserInfo = ref<GetUserInfoByUidResponseDto["result"]>(); // 待隐藏用户信息
	const isHidingUser = ref(false); // 是否正在隐藏用户
	const showingUserUid = ref<number>(); // 正在设为显示的用户 UID

	const blockTagList = ref<Map<VideoTag["tagId"], VideoTag>>(new Map()); // 视频标签
	const displayBlockTagList = computed<DisplayVideoTag[]>(() => [...blockTagList.value.values()].map(tagName => getDisplayVideoTagWithCurrentLanguage(currentLanguage.value, tagName))); // 用于显示的 TAG，相较于上方的 tags 数据结构更简单。
	const blockTagListPage = ref(0); // TODO: TAG 的翻页功能（？）
	const blockTagListPageSize = ref(0); // TODO: TAG 的翻页功能（？）
	const flyoutTag = ref<FlyoutModel>(); // TAG 的删除浮窗
	const contextualToolbar = ref<FlyoutModel>(); // TAG 的工具烂浮窗
	const hoveredTagContent = ref<[number, string]>(); // 鼠标 hover 的 TAG
	const hideTimeoutId = ref<Timeout>(); // 隐藏 TAG 编辑菜单的 setTimeout

	const MAX_KEYWORD_LENGTH = 30; // 关键词长度限制
	const blockKeywordList = ref<GetBlockListResponseDto["result"]>(); // 屏蔽的关键词列表
	const blockKeywordListPage = ref(0); // 屏蔽的关键词列表页码
	const blockKeywordListPageSize = ref(0); // 屏蔽的关键词列表每页数量
	const inputPendingBlockKeyword = ref(""); // 用户输入的待屏蔽关键词
	const isLooksLikeRegexStringDebounce = useDebounce(isLooksLikeRegexString, 500); // 防抖，检测一个字符串是否看起来像是正则表达式
	const isInvalidKeyword = computed(() => { // 用户输入的关键词是否合法
		const keyword = inputPendingBlockKeyword.value;
		if (keyword.length > MAX_KEYWORD_LENGTH)
			return "关键词不能超过 20 个字符"; // TODO: 使用多语言
		else if (isLooksLikeRegexStringDebounce(keyword))
			return "禁止输入正则表达式"; // TODO: 使用多语言
		else
			return false;
	});
	const isBlockKeyword = ref(false); // 是否正在屏蔽关键词
	const unblockingKeyword = ref(""); // 正在被解除屏蔽的关键词

	const MAX_REGEX_LENGTH = 30; // 正则表达式长度限制
	const blockRegexList = ref<GetBlockListResponseDto["result"]>(); // 用于屏蔽内容的正则表达式列表
	const blockRegexListPage = ref(0); // 用于屏蔽内容的正则表达式列表页码
	const blockRegexListPageSize = ref(0); // 用于屏蔽内容的正则表达式每页数量
	const inputPendingAddRegex = ref(""); // 用户输入的用于屏蔽内容的正则表达式
	const isIllegalRegexStringDebounce = useDebounce(isIllegalRegexString, 500); // 防抖，检测是否为非法正则表达式
	const isInvalidRegex = computed(() => {
		const regex = inputPendingAddRegex.value;
		if (regex.length > MAX_REGEX_LENGTH)
			return "正则表达式不能超过 20 个字符"; // TODO: 使用多语言
		else if (isIllegalRegexStringDebounce(regex))
			return "您输入的正则表达式不合法"; // TODO: 使用多语言
		else
			return false;
	}); // 用户输入的正则表达式是否非法
	const isAddRegex = ref(false); // 是否正在添加用于屏蔽内容的正则表达式
	const removingRegex = ref(""); // 正在移除用于屏蔽内容的正则表达式字符串

	/**
	 * 获取待屏蔽用户的信息
	 */
	async function getPendingBlockUserInfo() {
		isClickAddButton.value = true;
		try {
			const blockUid = parseInt(inputPendingBlockUid.value || "-1", 10);

			if (blockUid === undefined || blockUid === null || blockUid < 1) {
				console.error("ERROR", "待屏蔽用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("待屏蔽用户的 UID 格式不正确", "error", 5000);
				isClickAddButton.value = false;
				return;
			}

			const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
				uid: blockUid,
			};
			const pendingBlockUserInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest);
			if (pendingBlockUserInfoResult.success) {
				pendingBlockUserInfo.value = pendingBlockUserInfoResult.result;
				isShowAddBlockUserAlert.value = true;
				isShowAlert.value = true;
			} else {
				console.error("ERROR", "获取待屏蔽用户信息失败");
				// TODO: 使用多语言
				useToast("获取待屏蔽用户信息失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "获取待屏蔽用户信息时出错", error);
			// TODO: 使用多语言
			useToast("获取待屏蔽用户信息时出错", "error", 5000);
		}
		isClickAddButton.value = false;
	}

	/**
	 * 屏蔽一个用户
	 */
	async function blockUser() {
		isBlockingUser.value = true;
		try {
			const blockUid = parseInt(inputPendingBlockUid.value || "-1", 10);

			if (blockUid === undefined || blockUid === null || blockUid < 1) {
				console.error("ERROR", "屏蔽用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("屏蔽用户的 UID 格式不正确", "error", 5000);
				isBlockingUser.value = false;
				return;
			}

			if (selfUserInfo.userInfo.uid === blockUid) {
				console.error("ERROR", "不能屏蔽自己");
				// TODO: 使用多语言
				useToast("不能屏蔽自己", "error", 5000);
				isBlockingUser.value = false;
				return;
			}

			const blockUserByUidRequest: BlockUserByUidRequestDto = {
				blockUid,
			};
			const blockUserResult = await api.block.blockUserController(blockUserByUidRequest);
			if (blockUserResult.success) {
				const blockUserListResult = await getBlockList("block", blockUserListPage.value, blockUserListPageSize.value);
				if (blockUserListResult && blockUserListResult.success) blockUserList.value = blockUserListResult;
				// TODO: 使用多语言
				useToast("屏蔽用户成功", "success");
				closeBlockUserAlert();
				inputPendingBlockUid.value = "";
				pendingBlockUserInfo.value = undefined;
			} else {
				console.error("ERROR", "屏蔽用户失败");
				// TODO: 使用多语言
				useToast("屏蔽用户失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "屏蔽用户时出错", error);
			// TODO: 使用多语言
			useToast("屏蔽用户时出错", "error", 5000);
		}
		isBlockingUser.value = false;
	}

	/**
	 * 关闭待屏蔽用户信息对话框
	 */
	function closeBlockUserAlert() {
		isShowAlert.value = false;
		isShowAddBlockUserAlert.value = false;
	}

	/**
	 * 解除屏蔽用户
	 * @param blockUserUid - 被屏蔽的用户 UID
	 */
	async function unblockUser(blockUserUid: number) {
		try {
			if (blockUserUid === undefined || blockUserUid === null || blockUserUid < 1) {
				console.error("ERROR", "解除屏蔽用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("解除屏蔽用户的 UID 格式不正确", "error", 5000);
				return;
			}

			unblockingUserUid.value = blockUserUid;

			const unblockUserByUidRequest: UnblockUserByUidRequestDto = {
				blockUid: blockUserUid,
			};
			const unblockUserResult = await api.block.unblockUserController(unblockUserByUidRequest);
			if (unblockUserResult.success) {
				const blockUserListResult = await getBlockList("block", blockUserListPage.value, blockUserListPageSize.value);
				if (blockUserListResult && blockUserListResult.success) blockUserList.value = blockUserListResult;
				// TODO: 使用多语言
				useToast("解除屏蔽用户成功", "success");
			} else {
				console.error("ERROR", "解除屏蔽用户失败");
				// TODO: 使用多语言
				useToast("解除屏蔽用户失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "解除屏蔽用户时出错", error);
			// TODO: 使用多语言
			useToast("解除屏蔽用户时出错", "error", 5000);
		}
		unblockingUserUid.value = undefined;
	}

	/**
	 * 获取待隐藏用户的信息
	 */
	async function getPendingHideUserInfo() {
		isClickAddButton.value = true;
		try {
			const hideUid = parseInt(inputPendingHideUid.value || "-1", 10);

			if (hideUid === undefined || hideUid === null || hideUid < 1) {
				console.error("ERROR", "待隐藏用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("待隐藏用户的 UID 格式不正确", "error", 5000);
				isClickAddButton.value = false;
				return;
			}

			const getUserInfoByUidRequest: GetUserInfoByUidRequestDto = {
				uid: hideUid,
			};
			const pendingHideUserInfoResult = await api.user.getUserInfo(getUserInfoByUidRequest);
			if (pendingHideUserInfoResult.success) {
				pendingHideUserInfo.value = pendingHideUserInfoResult.result;
				isShowAddHideUserAlert.value = true;
				isShowAlert.value = true;
			} else {
				console.error("ERROR", "获取待隐藏用户信息失败");
				// TODO: 使用多语言
				useToast("获取待隐藏用户信息失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "获取待隐藏用户信息时出错", error);
			// TODO: 使用多语言
			useToast("获取待隐藏用户信息时出错", "error", 5000);
		}
		isClickAddButton.value = false;
	}

	/**
	 * 隐藏一个用户
	 */
	async function hideUser() {
		isHidingUser.value = true;
		try {
			const hideUid = parseInt(inputPendingHideUid.value || "-1", 10);

			if (hideUid === undefined || hideUid === null || hideUid < 1) {
				console.error("ERROR", "隐藏用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("隐藏用户的 UID 格式不正确", "error", 5000);
				isHidingUser.value = false;
				return;
			}

			if (selfUserInfo.userInfo.uid === hideUid) {
				console.error("ERROR", "不能隐藏自己");
				// TODO: 使用多语言
				useToast("不能隐藏自己", "error", 5000);
				isHidingUser.value = false;
				return;
			}

			const hideUserByUidRequest: HideUserByUidRequestDto = {
				hideUid,
			};
			const hideUserResult = await api.block.hideUserController(hideUserByUidRequest);
			if (hideUserResult.success) {
				const hideUserListResult = await getBlockList("hide", hideUserListPage.value, hideUserListPageSize.value);
				if (hideUserListResult && hideUserListResult.success) hideUserList.value = hideUserListResult;
				// TODO: 使用多语言
				useToast("隐藏用户成功", "success");
				closeHideUserAlert();
				inputPendingHideUid.value = "";
				pendingHideUserInfo.value = undefined;
			} else {
				console.error("ERROR", "隐藏用户失败");
				// TODO: 使用多语言
				useToast("隐藏用户失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "隐藏用户时出错", error);
			// TODO: 使用多语言
			useToast("隐藏用户时出错", "error", 5000);
		}
		isHidingUser.value = false;
	}

	/**
	 * 关闭待隐藏用户信息对话框
	 */
	function closeHideUserAlert() {
		isShowAlert.value = false;
		isShowAddHideUserAlert.value = false;
	}

	/**
	 * 恢复显示用户
	 * @param hideUserUid - 被屏蔽的用户 UID
	 */
	async function showUser(hideUserUid: number) {
		try {
			if (hideUserUid === undefined || hideUserUid === null || hideUserUid < 1) {
				console.error("ERROR", "恢复显示用户的 UID 格式不正确，不能为空或小于零");
				// TODO: 使用多语言
				useToast("恢复显示用户的 UID 格式不正确", "error", 5000);
				return;
			}

			showingUserUid.value = hideUserUid;

			const showUserByUidRequest: ShowUserByUidRequestDto = {
				hideUid: hideUserUid,
			};
			const showUserResult = await api.block.showUserController(showUserByUidRequest);
			if (showUserResult.success) {
				const hideUserListResult = await getBlockList("hide", hideUserListPage.value, hideUserListPageSize.value);
				if (hideUserListResult && hideUserListResult.success) hideUserList.value = hideUserListResult;
				// TODO: 使用多语言
				useToast("恢复显示用户成功", "success");
			} else {
				console.error("ERROR", "解除屏蔽用户失败");
				// TODO: 使用多语言
				useToast("恢复显示用户失败", "error", 5000);
			}
		} catch (error) {
			console.error("ERROR", "解除屏蔽用户时出错", error);
			// TODO: 使用多语言
			useToast("恢复显示用户时出错", "error", 5000);
		}

		showingUserUid.value = undefined;
	}

	/**
	 * 显示标签的上下文工具栏。
	 * @param key - 标签键名。
	 * @param tag - 标签内容。
	 * @param e - 鼠标事件。
	 */
	function showContextualToolbar(key: number, tag: string, e: MouseEvent) {
		if (!tag) return;
		if ((e.currentTarget as HTMLSpanElement).querySelector(".text-box:focus")) return;
		reshowContextualToolbar();
		if (hoveredTagContent.value?.[0] === key && hoveredTagContent.value?.[1] === tag) return;
		hoveredTagContent.value = [key, tag];
		useEvent("component:hideAllContextualToolbar");
		contextualToolbar.value = [e, "top", 0];
	}

	/**
	 * 隐藏标签的上下文工具栏。
	 */
	function hideContextualToolbar() {
		hideTimeoutId.value = setTimeout(() => {
			contextualToolbar.value = undefined;
			hoveredTagContent.value = undefined;
		}, 100);
	}

	/**
	 * 解除屏蔽 TAG
	 * @param tagId - 标签 ID
	 */
	async function removeTag(tagId: number) {
		try {
			if (tagId === undefined || tagId === null) return;

			const unblockTagRequest: UnblockTagRequestDto = {
				tagId,
			};

			const unblockTagResult = await api.block.unblockTagController(unblockTagRequest);

			if (unblockTagResult.success) {
				blockTagList.value.delete(tagId);
				// TODO: 使用多语言
				useToast("解除屏蔽 TAG 成功", "success");
			} else {
				console.error(`解除屏蔽 TAG 失败，请求失败，tagId: '${tagId}', error message: ${unblockTagResult.message}`);
				// TODO: 使用多语言
				useToast("解除屏蔽 TAG 失败，请求失败", "error", 5000);
			}
		} catch (error) {
			console.error("解除屏蔽 TAG 失败", error);
			// TODO: 使用多语言
			useToast("解除屏蔽 TAG 失败", "error", 5000);
		}
	}

	/**
	 * 屏蔽一个 TAG
	 * @param tag - 标签
	 */
	async function handleAddNewBlockTag(tag: VideoTag) {
		try {
			if (!tag || !("tagId" in tag) || tag.tagId === undefined || tag.tagId === null) return;

			const blockTagRequest: BlockTagRequestDto = {
				tagId: tag.tagId,
			};

			const blockTagResult = await api.block.blockTagController(blockTagRequest);

			if (blockTagResult.success) {
				blockTagList.value.set(tag.tagId, tag);
				// TODO: 使用多语言
				useToast("屏蔽 TAG 成功", "success");
			} else {
				console.error("屏蔽 TAG 失败，请求失败", blockTagResult.message);
				// TODO: 使用多语言
				useToast("屏蔽 TAG 失败，请求失败", "error", 5000);
			}
		} catch (error) {
			console.error("屏蔽 TAG 失败", error);
			// TODO: 使用多语言
			useToast("屏蔽 TAG 失败", "error", 5000);
		}
	}

	/**
	 * 鼠标移入区域，取消 TAG 编辑器自动隐藏。
	 */
	function reshowContextualToolbar() {
		clearTimeout(hideTimeoutId.value);
	}

	/**
	 * 屏蔽一个关键词
	 */
	async function addBlockKeyword() {
		isBlockKeyword.value = true;
		try {
			const keyword = inputPendingBlockKeyword.value.trim();
			if (!keyword) {
				isBlockKeyword.value = false;
				useToast("关键词不合法", "error", 5000);
				return;
			}

			const blockKeywordRequest: BlockKeywordRequestDto = {
				blockKeyword: keyword,
			};

			const blockKeywordResult = await api.block.blockKeywordController(blockKeywordRequest);
			const blockKeywordListResult = await getBlockList("keyword", blockKeywordListPage.value, blockKeywordListPageSize.value);
			if (blockKeywordListResult.success) blockKeywordList.value = blockKeywordListResult.result;
			if (blockKeywordResult.success)
				// TODO: 使用多语言
				useToast("屏蔽关键词成功", "success");
			else {
				console.error(`屏蔽关键词失败, error: ${blockKeywordResult.message}`);
				// TODO: 使用多语言
				useToast("屏蔽关键词失败，请求失败", "error", 5000);
			}
			inputPendingBlockKeyword.value = "";
		} catch (error) {
			console.error("屏蔽关键词失败", error);
			// TODO: 使用多语言
			useToast("屏蔽关键词失败", "error", 5000);
		}
		isBlockKeyword.value = false;
	}

	/**
	 * 解除屏蔽关键词
	 * @param keyword - 待解除屏蔽的关键词
	 */
	async function unBlockKeyword(keyword: string) {
		try {
			if (!keyword) return;

			unblockingKeyword.value = keyword;

			const unblockKeywordRequest: UnblockKeywordRequestDto = {
				blockKeyword: keyword,
			};

			const unblockKeywordResult = await api.block.unblockKeywordController(unblockKeywordRequest);
			const blockKeywordListResult = await getBlockList("keyword", blockKeywordListPage.value, blockKeywordListPageSize.value);
			if (blockKeywordListResult.success) blockKeywordList.value = blockKeywordListResult.result;
			if (unblockKeywordResult.success)
				// TODO: 使用多语言
				useToast("解除屏蔽关键词成功", "success");
			else {
				console.error(`解除屏蔽关键词失败, error: ${unblockKeywordResult.message}`);
				// TODO: 使用多语言
				useToast("解除屏蔽关键词失败，请求失败", "error", 5000);
			}
		} catch (error) {
			console.error("解除屏蔽关键词失败", error);
			// TODO: 使用多语言
			useToast("解除屏蔽关键词失败", "error", 5000);
		}
		unblockingKeyword.value = "";
	}

	/**
	 * 添加用于屏蔽内容的正则表达式
	 */
	async function addRegex() {
		isAddRegex.value = true;
		try {
			const regex = inputPendingAddRegex.value.trim();
			if (!regex) {
				isAddRegex.value = false;
				useToast("正则表达式不合法", "error", 5000);
				return;
			}

			const addRegexRequest: AddRegexRequestDto = {
				blockRegex: regex,
			};

			const addRegexResult = await api.block.addRegexController(addRegexRequest);
			const blockRegexListResult = await getBlockList("regex", blockRegexListPage.value, blockRegexListPageSize.value);
			if (blockRegexListResult.success) blockRegexList.value = blockRegexListResult.result;
			if (addRegexResult.success)
				// TODO: 使用多语言
				useToast("添加正则表达式成功", "success");
			else {
				console.error(`添加正则表达式失败, error: ${addRegexResult.message}`);
				// TODO: 使用多语言
				useToast("添加正则表达式失败，请求失败", "error", 5000);
			}
			inputPendingAddRegex.value = "";
		} catch (error) {
			console.error("添加正则表达式失败", error);
			// TODO: 使用多语言
			useToast("添加正则表达式失败", "error", 5000);
		}
		isAddRegex.value = false;
	}

	/**
	 * 移除用于屏蔽内容的正则表达式
	 * @param regexString - 待移除用于屏蔽内容的正则表达式
	 */
	async function removeRegex(regexString: string) {
		try {
			if (!regexString) return;

			removingRegex.value = regexString;

			const removeRegexRequest: RemoveRegexRequestDto = {
				blockRegex: regexString,
			};

			const removeRegexResult = await api.block.removeRegexController(removeRegexRequest);
			const blockRegexListResult = await getBlockList("regex", blockRegexListPage.value, blockRegexListPageSize.value);
			if (blockRegexListResult.success) blockRegexList.value = blockRegexListResult.result;
			if (removeRegexResult.success)
				// TODO: 使用多语言
				useToast("移除正则表达式成功", "success");
			else {
				console.error(`移除正则表达式失败, error: ${removeRegexResult.message}`);
				// TODO: 使用多语言
				useToast("移除正则表达式失败，请求失败", "error", 5000);
			}
		} catch (error) {
			console.error("移除正则表达式失败", error);
			// TODO: 使用多语言
			useToast("移除正则表达式失败", "error", 5000);
		}
		removingRegex.value = "";
	}

	/**
	 * 获取屏蔽数据
	 * @param blockListType - 屏蔽的类型
	 * @param page - 页号
	 * @param pageSize - 每页数量
	 * @returns 获取的屏蔽数据
	 */
	async function getBlockList(blockListType: string, page: number, pageSize: number): Promise<GetBlockListResponseDto> {
		const getBlockListRequest: GetBlockListRequestDto = {
			type: blockListType,
			pagination: {
				page,
				pageSize,
			},
		};
		const blockListResult = await api.block.getBlockListController(getBlockListRequest);
		if (blockListResult.success)
			return blockListResult;
		else {
			console.error("ERROR", `获取 ${blockListType} 类型的黑名单失败`);
			return { success: false, message: `获取 ${blockListType} 类型的黑名单失败` };
		}
	}

	/**
	 * 获取每一项屏蔽数据
	 */
	async function getAllBlockList() {
		try {
			const blockUserListResultPromise = getBlockList("block", blockUserListPage.value, blockUserListPageSize.value);
			const hideUserListResultPromise = getBlockList("hide", hideUserListPage.value, hideUserListPageSize.value);
			const blockTagListResultPromise = getBlockList("tag", blockTagListPage.value, blockTagListPageSize.value);
			const blockKeywordListResultPromise = getBlockList("keyword", blockKeywordListPage.value, blockKeywordListPageSize.value);
			const blockRegexListResultPromise = getBlockList("regex", blockRegexListPage.value, blockRegexListPageSize.value);

			const [
				// eslint-disable-next-line @stylistic/no-multi-spaces
				blockUserListResult,        hideUserListResult,        blockTagListResult,        blockKeywordListResult,        blockRegexListResult,
			] = await Promise.all([
				blockUserListResultPromise, hideUserListResultPromise, blockTagListResultPromise, blockKeywordListResultPromise, blockRegexListResultPromise,
			]);

			if (blockUserListResult && blockUserListResult.success) blockUserList.value = blockUserListResult;
			if (hideUserListResult && hideUserListResult.success) hideUserList.value = hideUserListResult;
			// if (blockTagListResult && blockTagListResult.success) blockTagList.value = blockTagListResult.result?.map(blockTag => getDisplayVideoTagWithCurrentLanguage(currentLanguage.value, blockTag.tag)) ?? [];
			if (blockTagListResult && blockTagListResult.success) blockTagList.value = new Map(blockTagListResult.result?.map(blockTag => [parseInt(blockTag.value, 10), blockTag.tag ?? { tagId: -1, tagNameList: [] }]));
			if (blockKeywordListResult && blockKeywordListResult.success) blockKeywordList.value = blockKeywordListResult.result;
			if (blockRegexListResult && blockRegexListResult.success) blockRegexList.value = blockRegexListResult.result;
		} catch (error) {
			console.error("ERROR", "获取黑名单失败", error);
			// TODO: 使用多语言
			useToast("获取黑名单失败", "error", 5000);
		}
	}

	onMounted(getAllBlockList);

	/**
	 * 屏蔽用户发生翻页
	 */
	watch(blockUserListPage, async () => {
		const blockUserListResult = await getBlockList("block", blockUserListPage.value, blockUserListPageSize.value);
		if (blockUserListResult && blockUserListResult.success) blockUserList.value = blockUserListResult;
	});

	/**
	 * 隐藏用户发生翻页
	 */
	watch(hideUserListPage, async () => {
		const hideUserListResult = await getBlockList("hide", hideUserListPage.value, hideUserListPageSize.value);
		if (hideUserListResult && hideUserListResult.success) hideUserList.value = hideUserListResult;
	});
</script>

<template>
	<div>
		<Subheader icon="block">{{ $t('block_and_hide.block.title') }}</Subheader>
		<span>{{ $t('block_and_hide.block.description') }}</span>
		<section>
			<SettingsChipItem
				v-for="blockUser in blockUserList?.result"
				:key="blockUser.uid"
				:image="blockUser.avatar"
				icon="placeholder"
				:details="$t('addition_date') + $t('colon') + formatLocalizationSemanticDateTime(blockUser.createDateTime, 2)"
				trailingIcon="delete"
				:trailingIconDisabled="unblockingUserUid === blockUser.uid"
				@trailingIconClick="unblockUser(blockUser.uid ?? -1)"
			>{{ blockUser.username }}</SettingsChipItem>
		</section>
		<Pagination v-if="blockUserList?.blocklistCount" v-model="blockUserListPage" :pages="blockUserListPageCount" :displayPageCount="7" />
		<div class="add">
			<TextBox v-model="inputPendingBlockUid" type="number" icon="person" />
			<Button icon="add" @click="getPendingBlockUserInfo" :disabled="isAddButtonUnclickalbe" :loading="isFetchPendingBlockUserInfo">{{ $t('step.add') }}</Button>
		</div>

		<Subheader icon="visibility_off">{{ $t('block_and_hide.hide.title') }}</Subheader>
		<span>{{ $t('block_and_hide.hide.description') }}</span>
		<section>
			<SettingsChipItem
				v-for="hideUser in hideUserList?.result"
				:key="hideUser.uid"
				:image="hideUser.avatar"
				icon="placeholder"
				:details="$t('addition_date') + $t('colon') + formatLocalizationSemanticDateTime(hideUser.createDateTime, 2)"
				trailingIcon="delete"
				:trailingIconDisabled="showingUserUid === hideUser.uid"
				@trailingIconClick="showUser(hideUser.uid ?? -1)"
			>{{ hideUser.username }}</SettingsChipItem>
		</section>
		<Pagination v-if="hideUserList?.blocklistCount" v-model="hideUserListPage" :pages="hideUserListPageCount" :displayPageCount="7" />
		<div class="add">
			<TextBox v-model="inputPendingHideUid" type="number" icon="person" />
			<Button icon="add" @click="getPendingHideUserInfo" :disabled="isAddButtonUnclickalbe" :loading="isFetchPendingHideUserInfo">{{ $t('step.add') }}</Button>
		</div>

		<hr />

		<Subheader icon="tag">{{ $t('tag', 0) }}</Subheader>
		<span>{{ $t('block_and_hide.tag.description') }}</span>

		<div class="tags">
			<Tag
				v-for="tag in displayBlockTagList"
				:key="tag.tagId"
				:query="{ q: tag.tagId }"
				@mouseenter="e => showContextualToolbar(tag.tagId, tag.mainTagName, e)"
				@mouseleave="hideContextualToolbar"
			>
				<div v-if="tag.tagId >= 0" class="display-tag">
					<div v-if="tag.mainTagName">{{ tag.mainTagName }}</div>
					<div v-if="tag.originTagName" class="original-tag-name">{{ tag.originTagName }}</div>
				</div>
			</Tag>
			<Tag v-if="!isAddButtonUnclickalbe" key="add-block-tag-button" class="add-tag" :checkable="false" @click="e => flyoutTag = [e, 'y']">
				<Icon name="add" />
			</Tag>
		</div>
		<FlyoutTag v-model="flyoutTag" v-model:tags="blockTagList" @addNewTag="handleAddNewBlockTag" />
		<Flyout
			v-if="!isAddButtonUnclickalbe"
			v-model="contextualToolbar"
			noPadding
			class="contextual-toolbar"
			@mouseenter="reshowContextualToolbar"
			@mouseleave="hideContextualToolbar"
		>
			<Button icon="close" @click="removeTag(hoveredTagContent![0])">{{ $t('delete') }}</Button>
		</Flyout>

		<Subheader icon="key">{{ $t('keyword', 0) }}</Subheader>
		<span>{{ $t('block_and_hide.keyword.description') }}</span>
		<section>
			<SettingsChipItem
				v-for="(blockKeyword, index) in blockKeywordList"
				:key="index + '-' + blockKeyword.value"
				:details="$t('addition_date') + $t('colon') + formatLocalizationSemanticDateTime(blockKeyword.createDateTime, 2)"
				trailingIcon="delete"
				:trailingIconDisabled="unblockingKeyword === blockKeyword.value"
				@trailingIconClick="unBlockKeyword(blockKeyword.value)"
			>{{ blockKeyword.value }}</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="inputPendingBlockKeyword" :invalid="isInvalidKeyword" icon="key" />
			<Button icon="add" :disabled="isAddButtonUnclickalbe || isBlockKeyword" :loading="isBlockKeyword" @click="addBlockKeyword">{{ $t('step.add') }}</Button>
		</div>

		<Subheader icon="regexp">{{ $t('regexp') }}</Subheader>
		<!-- TODO: 使用多语言 -->
		<span>{{ $t('block_and_hide.regexp.description') + "（前后无需添加斜线 '/'）" }}</span>
		<section>
			<SettingsChipItem
				v-for="(blockRegex, index) in blockRegexList"
				:key="index + '-' + blockRegex.value"
				:details="$t('addition_date') + $t('colon') + formatLocalizationSemanticDateTime(blockRegex.createDateTime, 2)"
				trailingIcon="delete"
				:trailingIconDisabled="removingRegex === blockRegex.value"
				@trailingIconClick="removeRegex(blockRegex.value)"
			>{{ blockRegex.value }}</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="inputPendingAddRegex" :invalid="isInvalidRegex" icon="regexp" />
			<Button icon="add" :disabled="isAddButtonUnclickalbe || isAddRegex" :loading="isAddRegex" @click="addRegex">{{ $t('step.add') }}</Button>
		</div>

		<Alert v-model="isShowAddBlockUserAlert" static>
			<!-- TODO: 使用多语言 -->
			<h4>确定要屏蔽这个用户吗？</h4>
			<div class="user-info-alert-display">
				<div class="user">
					<UserAvatar :avatar="pendingBlockUserInfo?.avatar" />
					<div class="texts">
						<div class="names">
							<span class="username">{{ pendingBlockUserInfo?.username }}</span> <span v-if="pendingBlockUserInfo?.userNickname">/{{ pendingBlockUserInfo?.userNickname }}</span>
							<!-- <span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span> -->
							<span class="icons">
								<Icon v-if="pendingBlockUserInfo?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="pendingBlockUserInfo?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ pendingBlockUserInfo?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ pendingBlockUserInfo?.signature }}</div>
					</div>
				</div>
			</div>
			<template #footer-left>
				<Button @click="blockUser" :loading="isBlockingUser" :disabled="isBlockingUser">确认屏蔽</Button>
			</template>
			<template #footer-right>
				<Button @click="closeBlockUserAlert" class="secondary">取消</Button>
			</template>
		</Alert>

		<Alert v-model="isShowAddHideUserAlert" static>
			<!-- TODO: 使用多语言 -->
			<h4>确定要隐藏这个用户吗？</h4>
			<div class="user-info-alert-display">
				<div class="user">
					<UserAvatar :avatar="pendingHideUserInfo?.avatar" />
					<div class="texts">
						<div class="names">
							<span class="username">{{ pendingHideUserInfo?.username }}</span> <span v-if="pendingHideUserInfo?.userNickname">/{{ pendingHideUserInfo?.userNickname }}</span>
							<!-- <span v-if="memoParen" class="memo" :class="[memoParen]">{{ user?.bio }}</span> -->
							<span class="icons">
								<Icon v-if="pendingHideUserInfo?.gender === 'male'" name="male" class="male" />
								<Icon v-else-if="pendingHideUserInfo?.gender === 'female'" name="female" class="female" />
								<span v-else class="other-gender">{{ pendingHideUserInfo?.gender }}</span>
							</span>
						</div>
						<div class="bio">{{ pendingHideUserInfo?.signature }}</div>
					</div>
				</div>
			</div>
			<template #footer-left>
				<Button @click="hideUser" :loading="isHidingUser" :disabled="isHidingUser">确认隐藏</Button>
			</template>
			<template #footer-right>
				<Button @click="closeHideUserAlert" class="secondary">取消</Button>
			</template>
		</Alert>
	</div>
</template>

<style scoped lang="scss">
	span {
		color: c(icon-color);
	}

	.subheader {
		margin-top: 1rem;

		&:first-child {
			margin-top: 0;
		}
	}

	.add {
		display: flex;
		gap: 8px;

		.text-box {
			width: 100%;
		}

		button {
			flex-shrink: 0;
		}
	}

	hr {
		margin-top: 1rem;
	}

	.user-info-alert-display {
		height: 60px;

		.user {
			display: flex;
			gap: 16px;
			align-items: center;
			margin-top: 20px;

			.names {
				display: flex;
				font-size: 24px;

				> * {
					flex-shrink: 0;
					user-select: text;
				}

				.username {
					color: c(text-color);
					font-weight: bold;

					+ .icons {
						margin-left: 10px;
					}
				}

				.memo {
					color: c(icon-color);

					&.fullwidth {
						&::before {
							content: "（";
						}

						&::after {
							content: "）";
						}
					}

					&.halfwidth {
						&::before {
							content: "\a0(";
						}

						&::after {
							content: ")\a0";
						}
					}
				}

				.icons {
					@include flex-center;

					.male {
						color: c(blue);
					}

					.female {
						color: c(pink);
					}

					.other-gender {
						background: linear-gradient(to right, #58c8f2, #eda4b2);
						background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}

			.bio {
				margin-top: 6px;
				color: c(icon-color);
				user-select: text;
			}
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.add-tag {
			aspect-ratio: 1 / 1;
			padding: 6px;
			color: c(icon-color);
			font-size: 18px;
		}
	}

	.display-tag {
		display: flex;
		flex-direction: row;

		.original-tag-name {
			padding-left: 0.5em;
			color: c(text-color, 50%);
		}
	}
</style>
