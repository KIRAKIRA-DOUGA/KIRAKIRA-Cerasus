import { LocaleIdentifiers } from "./types";

const TChinese: LocaleIdentifiers = {
	colon: "：",
	semicolon: "；",
	caesura: "、",
	welcome: "歡迎",
	home: "首頁",
	category: {
		_: "分類",
		anime: "動畫",
		music: "音樂",
		otomad: "音MAD",
		tech: "科技",
		design: "設計",
		game: "遊戲",
		other: "綜合",
	},
	content: "內容",
	search: "搜尋",
	button: "按鈕",
	button_disabled: "按鈕已禁用",
	button_clicked: "我被點擊了 呜呜呜~",
	confetti: "五彩紙屑",
	send: "送出",
	query: "查詢",
	show_alert: "顯示警告框",
	toggle_switch: "切換開關",
	on: "開",
	off: "關",
	disabled: "已禁用",
	background: "背景",
	animated_background: "動態背景",
	custom_background: "自訂背景",
	light: "淺色主題",
	dark: "深色主題",
	system: "跟隨系統",
	pink: "萌妹粉",
	sky: "天空藍",
	blue: "智乃藍",
	green: "千夜綠",
	orange: "心愛橙",
	purple: "理世紫",
	custom: "自訂",
	checkbox: "核取方塊",
	search_settings: "搜尋設定",
	appearance: "外觀",
	scheme: "主題",
	palette: "個性色彩",
	language: "語言",
	tag: "標籤",
	all: "全部",
	video: "影片",
	image: "圖片",
	logo_hidden: "隱藏LOGO",
	logo_half: "半顯示LOGO",
	logo_show: "完全顯示LOGO",
	comments: "評論",
	uploaders_lovin_it: "UP主愛啦",
	finish: "操作成功完成",
	you_know_too_much: "你知道得太多了。",
	dashboard: "資訊儀表板",
	account: "賬戶",
	profile: "個人資料",
	traces: "痕跡",
	privacy: "隱私",
	security: "安全",
	login_options: "登入選項",
	password: {
		_: "密碼",
		forgot: "忘記密碼",
		retype: "確認密碼",
		change: "修改密碼",
		current: "目前密碼",
		new: "新密碼",
		new_retype: "確認新密碼",
		hint: "密碼提示",
	},
	account_linking: "關聯社交平台",
	blocklist: {
		_: "黑名單",
		ban: {
			_: "封禁", // NEW
			description: "不想与其交流的用户，该用户将被禁止与你互动。", // NEW
		},
		hide: {
			_: "隐藏", // NEW
			description: "不想看到的用户，其将会从你的视角消失（除非你主动进入其个人主页）。", // NEW
		},
		tags: {
			description: "使用标签匹配不想看到的内容。", // NEW
		},
		keywords: {
			description: "使用关键词匹配不想看到的内容。", // NEW
		},
		regexp: {
			description: "使用正则表达式匹配不想看到的内容。", // NEW
		},
	},
	player: {
		_: "播放器", // NEW
		speed: {
			resample_audio: "重採樣音頻", // NEW
			continuous: "無級變速", // NEW
		},
	},
	danmaku: {
		_: "彈幕",
		send: "送出彈幕",
		history: "彈幕歷史",
		format: {
			mode: {
				rtl: "滾動",
				top: "頂部",
				bottom: "底部",
				ltr: "逆向",
			},
			send_as_creator: "創作者專屬漸變",
		},
		list: {
			loading: "弹幕装填中⋯⋯", // NEW
			thead: {
				time: "时间", // NEW
				content: "内容", // NEW
				sending_time: "发送时间", // NEW
			},
		},
	},
	preference: "偏好",
	accessibility: "無障礙",
	about: "關於",
	experimental: "實驗",
	user_settings: "使用者設定",
	app_settings: "應用程式設定",
	male: "男性",
	female: "女性",
	birthday: "生日",
	email: "電子郵件",
	email_address: "電子郵件地址",
	authenticator: "身分驗證器",
	current_email: "目前電子郵件",
	modification_date: "修改日期",
	addition_date: "新增日期",
	modify: "修改",
	save: "儲存",
	add: "新增",
	apply: "套用",
	reset: "重設",
	history: "歷史",
	favorite: "收藏",
	favorites: "收藏",
	favorite_verb: "收藏",
	feed: "動態",
	upload: "上傳",
	messages: "訊息",
	login: "登入",
	logout: "登出",
	register: "註冊",
	verification_code: "驗證碼",
	close: "關閉",
	current_page_label: "第{0}頁，共{1}頁",
	switch_page_label: "切換到第{0}頁",
	selected_item_label: "選中項目：",
	happy: "開心",
	greet: "問候",
	awa: "賣萌",
	sad: "憂傷",
	embarrassed: "無語",
	upvote: "加分",
	downvote: "減分",
	share: "分享",
	play: "播放",
	pause: "暫停",
	rating: "評分",
	bold: "粗體",
	italic: "斜體",
	underline: "底線",
	strikethrough: "刪除線",
	at_person: "提及",
	kaomoji: "表情符號",
	associate_existing: "關聯現有內容",
	reply: "回覆",
	more: "更多",
	delete: "刪除",
	copy: "複製", // NEW
	pin: "置頂",
	unpin: "取消置頂",
	report: "檢舉",
	original: "原創",
	repost: "轉載",
	authorized_repost: "授權轉載",
	ensure_original: "我聲明此作品為原創",
	original_author: "原作者",
	original_link: "原連結",
	title: "標題",
	tags: "標籤",
	press_enter_to_add: "按Enter鍵添加",
	description: "簡介",
	push_to_feed: "推送到動態",
	cover: "封面",
	select_cover: "選擇封面",
	series: "系列",
	audio: "音訊",
	photo: "相片",
	album: "專輯",
	follow: "追蹤",
	following: "已追蹤",
	fans: "粉絲",
	watched: "觀看",
	join_time: "加入時間",
	user_info: "個人資訊",
	acknowledgement: "鳴謝",
	friendly_links: "友情連結",
	latest: "最新",
	test: "測試",
	error_pages: "錯誤頁面",
	upload_date: "上傳日期",
	sort: {
		by: "排序",
		view: "播放量",
		danmaku: "彈幕量",
		comment: "評論量",
		favorite: "收藏量",
	},
	view: {
		_: "視圖",
		list: "清單",
		grid: "網格",
		tile: "磁貼",
	},
	duration: "持續時間",
	viewers: "觀看者",
	are_watching: "人正在觀看",
	step: {
		next: "下一步",
		previous: "上一步",
		ok: "完成",
		cancel: "取消",
	},
	loginwindow: {
		login_welcome: "歡迎回家",
		login_to_forgot: "我忘記了密碼",
		login_to_register: "我沒有賬戶？註冊",
		register_to_login: "我已有賬戶？登入",
		forgot_to_login: "我想起密碼了",
		register_email_sent_info: "我們已向您的郵箱發送了驗證碼，請在此處輸入驗證碼。\n如未收到，您可以重新發送。",
		forgot_info: "請在此處輸入您的郵箱，\n我們將會給您的郵箱發送一封郵件，請點擊郵件中的鏈接重設密碼。",
		reset_successful_info: "驗證成功！\n請輸入並務必牢記您的新密碼。",
	},
	settings_unselected: "請選擇一項設定",
	combobox_unselected: "請選擇一項",
	settings: {
		_: "設定",
		profile: {
			edit_banner: "點擊更換封面",
			edit_avatar: "點擊更換頭像",
		},
		privacy: {
			allow_cookies: "允许网站使用Cookies", // NEW
			info_visibility: "信息可见性", // NEW
		},
		appearance: {
			other: {
				sharp_mode: "直角模式", // NEW
				flat_mode: "扁平模式", // NEW
				colorful_navbar: "彩色导航栏", // NEW
			},
		},
		about: {
			repositories: "程式庫",
			creative_team: "創作團隊",
			staff: {
				webmistress: "站娘",
				designer: "設計",
				frontend: "前端",
				backend: "後端",
				translator: "翻譯",
			},
			technologies_used: "使用技術",
		},
	},
	user: {
		name: "暱稱",
		name_requirements: "1~20個字元，僅可包含大小寫拉丁字母、數字、常用平/片假名、漢字、特殊符號 ｢-｣ ｢_｣",
		bio: "個性簽名",
		gender: "性別",
		memo: "備注", // NEW
		age: "年齡",
	},
	zhs: "簡體中文",
	zht: "繁體中文",
	en: "英文",
	ja: "日文",
	ko: "韩文",
	vi: "越南文",
	development_test_page: "開發測試頁面",
	components_test_page: "元件測試頁面",
	view_cover: "查看封面",
	watch_later: "稍後觀看",
	download_video: "下載影片",
	report_creation: "稿件檢舉",
	forgot_password: "忘記密碼",
	reset_password: "重設密碼",
	format: "格式",
	text: {
		_: "文字",
		size: "字號",
	},
	color: "顏色",
	mode: "模式",
	size: {
		_: "大小",
		mini: "迷你",
		small: "小",
		medium: "中",
		large: "大",
		extra_large: "超大",
	},
	unknown: "未知", // NEW
	shortcut_key: "快捷键", // NEW
	guide: "指南", // NEW
	regexp: "正则表达式", // NEW
	keywords: "关键词", // NEW
	user_page: {
		_: "个人主页", // NEW
		title_affix: "{0}的个人主页", // NEW
	},
	manage_content: "稿件管理", // NEW
	add_to_blocklist: "加入黑名单", // NEW
	platform: {
		bilibili: "嗶哩嗶哩",
		niconico: "Niconico",
		otomad_wiki: "音MAD維基",
		weibo: "微博",
		twitter: "Twitter",
		qq: "QQ",
		youtube: "YouTube",
		discord: "Discord",
		telegram: "Telegram",
		midishow: "MidiShow",
	},
	modify_memo: "修改备注", // NEW
	add_to_group: "加入分组", // NEW
	navigation: {
		_: "导航", // NEW
		back: "返回", // NEW
	},
	other: "其它", // NEW
	color_picker: "调色板", // NEW
} as const;

export default TChinese;
