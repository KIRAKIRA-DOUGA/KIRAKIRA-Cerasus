/*
 * 说明：
 * 1. 当任意一门语言文件的字符串声明缺少或多余其它语言文件时都会报错，因此请务必及时为所有语言文件补齐字符串声明。
 * 2. 提倡尽量多复用少分类，虽然目前已支持分类以使归纳更清晰，但在保证各语言均不会有太大差异的情况下应尽可能多的复用来减少文件体积。
 * 3. `{ } @ $ |` 是 Vue i18n 中定义的元字符，因此不能在字符串中使用这些字符，除非你想使用它们在 Vue i18n 中表达的特殊含义。
 * 4. `apply bind call toString Symbol` 等作为关键字，不得用作字符串的键名，即便是在嵌套分类当中。
 */

const SChinese = {
	colon: "：",
	semicolon: "；",
	caesura: "、",
	welcome: "欢迎",
	home: "首页",
	category: {
		_: "分区",
		anime: "动画",
		music: "音乐",
		otomad: "音MAD",
		tech: "科技",
		design: "设计",
		game: "游戏",
		other: "综合",
	},
	content: "内容",
	search: "搜索",
	button: "按钮",
	button_disabled: "按钮被禁用",
	button_clicked: "我被单击了 呜呜呜~",
	confetti: "五彩纸屑",
	send: "发送",
	query: "查询",
	show_alert: "显示警告框",
	toggle_switch: "切换开关",
	on: "开",
	off: "关",
	disabled: "禁用",
	background: "背景",
	animated_background: "动态背景",
	custom_background: "自定义背景",
	light: "浅色主题",
	dark: "深色主题",
	system: "跟随系统",
	pink: "萌妹粉",
	sky: "天空蓝",
	blue: "智乃蓝",
	green: "千夜绿",
	orange: "心爱橙",
	purple: "理世紫",
	custom: "自定义",
	checkbox: "复选框",
	search_settings: "搜索设置",
	appearance: "外观",
	scheme: "主题",
	palette: "个性色",
	language: "语言",
	tag: "标签",
	all: "全部",
	video: "视频",
	image: "图片",
	logo_hidden: "LOGO隐藏",
	logo_half: "LOGO半显示",
	logo_show: "LOGO全显示",
	comments: "评论",
	uploaders_lovin_it: "UP主爱啦",
	finish: "操作成功完成",
	you_know_too_much: "你知道的太多了。",
	dashboard: "数据",
	account: "账号",
	profile: "资料",
	traces: "印迹",
	privacy: "隐私",
	security: "安全",
	login_options: "登入选项",
	password: {
		_: "密码",
		forgot: "忘记密码",
		retype: "确认密码",
		change: "修改密码",
		current: "当前密码",
		new: "新密码",
		new_retype: "确认新密码",
		hint: "密码提示",
	},
	account_linking: "关联社交平台",
	blocklist: {
		_: "黑名单",
		ban: {
			_: "封禁",
			description: "不想与其交流的用户，他将被禁止与你互动。",
		},
		hide: {
			_: "隐藏",
			description: "不想看到的用户，其将会从你的视角消失（除非你主动进入其个人主页）。",
		},
		tags: {
			description: "使用标签匹配不想看到的内容。",
		},
		keywords: {
			description: "使用关键词匹配不想看到的内容。",
		},
		regexp: {
			description: "使用正则表达式匹配不想看到的内容。",
		},
	},
	player: {
		_: "播放器",
		speed: {
			resample_audio: "重采样音频",
			continuous: "无级变速",
		},
	},
	danmaku: {
		_: "弹幕",
		send: "发送弹幕",
		history: "弹幕历史",
		format: {
			mode: {
				rtl: "滚动",
				top: "顶部",
				bottom: "底部",
				ltr: "逆向",
			},
			send_as_creator: "创作者专属渐变",
		},
		list: {
			loading: "弹幕装填中⋯⋯",
			thead: {
				time: "时间",
				content: "内容",
				sending_time: "发送时间",
			},
		},
	},
	preference: "偏好",
	accessibility: "无障碍",
	about: "关于",
	experimental: "实验",
	user_settings: "用户设置",
	app_settings: "应用设置",
	male: "男",
	female: "女",
	birthday: "生日",
	email: "电子邮件",
	email_address: "电子邮箱",
	authenticator: "身份验证器",
	current_email: "当前邮箱",
	modification_date: "修改日期",
	addition_date: "添加日期",
	modify: "修改",
	save: "保存",
	add: "添加",
	apply: "应用",
	reset: "重设",
	history: "历史",
	favorite: "收藏",
	favorites: "收藏",
	favorite_verb: "收藏",
	feed: "发现",
	upload: "投稿",
	messages: "消息",
	login: "登入",
	logout: "登出",
	register: "注册",
	verification_code: "验证码",
	close: "关闭",
	current_page_label: "第{0}页，共{1}页",
	switch_page_label: "切换到第{0}页",
	selected_item_label: "选中项为：",
	happy: "开心",
	greet: "问候",
	awa: "卖萌",
	sad: "忧伤",
	embarrassed: "无语",
	upvote: "加分",
	downvote: "减分",
	share: "分享",
	play: "播放",
	pause: "暂停",
	rating: "评分",
	bold: "加粗",
	italic: "倾斜",
	underline: "下划线",
	strikethrough: "删除线",
	at_person: "提及",
	kaomoji: "颜文字",
	associate_existing: "关联现有内容",
	reply: "回复",
	more: "更多",
	delete: "删除",
	copy: "复制",
	pin: "置顶",
	unpin: "取消置顶",
	report: "投诉",
	original: "原创",
	repost: "转载",
	authorized_repost: "授权转载",
	ensure_original: "我声明此作品为原创",
	original_author: "原作者",
	original_link: "原链接",
	title: "标题",
	tags: "标签",
	press_enter_to_add: "按回车键添加",
	description_of_creation: "简介",
	push_to_feed: "推送到动态",
	cover: "封面",
	select_cover: "选择封面",
	series: "合集",
	audio: "音频",
	photo: "相册",
	album: "专辑",
	follow: "关注",
	following: "已关注",
	fans: "粉丝",
	views_video: "观看",
	join_time: "加入时间",
	user_info: "个人信息",
	acknowledgement: "鸣谢",
	friendly_links: "友情链接",
	latest: "最新",
	test: "测试",
	error_pages: "错误页",
	upload_date: "上传日期",
	sort: {
		by: "排序",
		view: "播放量",
		danmaku: "弹幕量",
		comment: "评论量",
		favorite: "收藏量",
	},
	view: {
		_: "视图",
		list: "列表",
		grid: "网格",
		tile: "磁贴",
	},
	duration: "时长",
	viewers: "观看者",
	are_watching: "人正在看",
	step: {
		next: "下一步",
		previous: "上一步",
		ok: "完成",
		cancel: "取消",
	},
	loginwindow: {
		login_welcome: "欢迎回家",
		login_to_forgot: "我忘记了密码",
		login_to_register: "我没有账号？注册",
		register_to_login: "我已有账号？登入",
		forgot_to_login: "我想起来密码了",
		register_email_sent_info: "我们已向您的邮箱中发送了验证码，请在此输入验证码。\n如未收到，您可以重新发送。",
		forgot_info: "请在此输入您的邮箱，\n我们将会给您的邮箱发送一封邮件，请点击邮件中的链接重置密码。",
		reset_successful_info: "验证成功！\n请输入并务必牢记您的新密码。",
	},
	settings_unselected: "请选择一项设置",
	combobox_unselected: "请选择一项",
	settings: {
		_: "设置",
		profile: {
			edit_banner: "点击更换封面",
			edit_avatar: "点击更换头像",
		},
		privacy: {
			allow_cookies: "允许网站使用Cookies",
			info_visibility: "信息可见性",
		},
		appearance: {
			other: {
				sharp_mode: "直角模式",
				flat_mode: "扁平模式",
				colorful_navbar: "彩色导航栏",
			},
		},
		about: {
			repositories: "代码仓库",
			creative_team: "创作团队",
			staff: {
				webmistress: "站娘",
				designer: "设计",
				frontend: "前端",
				backend: "后端",
				translator: "翻译",
			},
			technologies_used: "使用技术",
		},
	},
	user: {
		name: "昵称",
		name_requirements: "1~20个字符，仅可包含大小写拉丁字母、数字、常用平/片假名、汉字、特殊符号 ｢-｣ ｢_｣",
		bio: "个性签名",
		gender: "性别",
		memo: "备注",
		age: "年龄",
	},
	zhs: "简体中文",
	zht: "繁体中文",
	en: "英语",
	ja: "日语",
	ko: "韩语",
	vi: "越南语",
	development_test_page: "开发测试页面",
	components_test_page: "组件测试页面",
	view_cover: "查看封面",
	watch_later: "稍后观看",
	download_video: "下载视频",
	report_creation: "稿件投诉",
	forgot_password: "忘记密码",
	reset_password: "重设密码",
	format: "格式",
	text: {
		_: "文本",
		size: "字号",
	},
	color: "颜色",
	mode: "模式",
	size: {
		_: "大小",
		mini: "迷你",
		small: "小",
		medium: "中",
		large: "大",
		extra_large: "超大",
	},
	unknown: "未知",
	shortcut_key: "快捷键",
	guide: "指南",
	regexp: "正则表达式",
	keywords: "关键词",
	user_page: {
		_: "个人主页",
		title_affix: "的个人主页",
	},
	manage_content: "稿件管理",
	add_to_blocklist: "加入黑名单",
	platform: {
		bilibili: "哔哩哔哩",
		niconico: "Niconico",
		otomad_wiki: "音MAD维基",
		weibo: "微博",
		twitter: "Twitter", // 官方对于自身的称呼并未汉化，因此应使用原名作称呼。
		qq: "QQ",
		youtube: "YouTube",
		discord: "Discord",
		telegram: "Telegram",
		midishow: "MidiShow",
	},
	modify_memo: "修改备注",
	add_to_group: "加入分组",
	navigation: {
		_: "导航",
		back: "返回",
	},
	other: "其它",
	color_picker: "调色板",
} as const;

export default SChinese;
