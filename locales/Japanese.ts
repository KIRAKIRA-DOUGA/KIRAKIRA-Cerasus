/**
 * 说明：
 * 1. 在日语中请为片假名中的外来语单词之间增添空格。
 * 2. 在对按钮等标签的引用，需要在外面用方括号括起来。例如：[OK] ボタンをクリックして続行します。
 * 3. 请在新添加的键之后标注注释，方便定位未翻译内容的位置。
 * 4. 部分因为长度过长会出现无法显示完全的情况（如忘记密码），需要考虑对策。
 */

import { LocaleIdentifiers } from "./types";

const Japanese: LocaleIdentifiers = {
	colon: "：",
	semicolon: "；",
	caesura: "・",
	home: "ホーム",
	category: {
		_: "カテゴリ",
		anime: "アニメ",
		music: "音楽",
		otomad: "音MAD",
		tech: "技術",
		design: "デザイン",
		game: "ゲーム",
		other: "総合",
	},
	content: "コンテンツ",
	search: "検索",
	custom: "カスタム",
	scheme: {
		_: "スキーム",
		light: "ライト テーマ",
		dark: "ライト テーマ",
		system: "システムのテーマ設定を使用する",
	},
	palette: {
		_: "色",
		pink: "カワイイ ピンク",
		sky: "空色",
		blue: "チノ 青",
		green: "千夜 緑",
		orange: "ココア オレンジ",
		purple: "リゼ 紫",
	},
	language: {
		_: "言語",
		zhs: "簡体字中国語",
		zht: "繁体字中国語",
		en: "英語",
		ja: "日本語",
		ko: "韓国語",
		vi: "ベトナム語",
		id: "インドネシア語",
	},
	background: {
		_: "背景",
		animated: "動く背景",
		custom: "カスタム背景",
	},
	appearance: {
		_: "外観",
		sharp_mode: "直角スタイル",
		flat_mode: "フラットスタイル",
		colorful_navbar: "カラフル ナビバー",
	},
	confetti: "紙吹雪",
	send: "送信",
	query: "検索",
	on: "オン",
	off: "オフ",
	disabled: "無効化されたスイッチ",
	tag: {
		_: "タグ",
		search: "搜索标签", // NEW
		new: "创建新标签", // NEW
	},
	all: "すべて",
	video: "動画",
	image: "画像",
	series: "シリーズ",
	audio: "音声",
	photo: "画像",
	album: "アルバム",
	comments: "コメント",
	you_know_too_much: "あなたは知りすぎた。",
	settings: {
		_: "設定",
		search: "設定を検索",
		user: "個人設定",
		app: "アプリの設定",
	},
	dashboard: "ダッシュボード",
	account: "アカウント",
	profile: {
		_: "プロフィール",
		edit_banner: "バナー画像の変更",
		edit_avatar: "プロフィールアイコンの変更",
	},
	traces: "閲覧履歴",
	privacy: {
		_: "プライバシー",
		cookie: "クッキー☆",
		allow_cookies: "Cookieの利用を同意する",
		info_visibility: "情報の公開範囲",
		public: "公开", // NEW
		private: "私密", // NEW
		following: "仅你关注的人可见", // NEW
	},
	security: "セキュリティ",
	login_options: "ログイン オプション",
	password: {
		_: "パスワード",
		forgot: "パスワードをお忘れの場合",
		reset: "パスワードの再設定",
		retype: "パスワードを確認",
		change: "パスワードの変更",
		current: "現在のパスワード",
		new: "新しいパスワード",
		new_retype: "新しいパスワードの確認",
		hint: "パスワードのヒント",
	},
	account_linking: "SNSリンク",
	blocklist: {
		_: "ブロックリスト",
		ban: {
			_: "ブロック",
			description: "交流したくないのユーザー、あなたと交流できなくなります",
		},
		hide: {
			_: "隠す",
			description: "目にしたくないのユーザー、あなたの視点から消えさせます(対象のプロフィールにアクセス場合を除く)",
		},
		tags: {
			description: "タグで目にしたくない投稿を選択します",
		},
		keywords: {
			description: "キーワードで目にしたくない投稿を選択します",
		},
		regexp: {
			description: "正規表現で目にしたくない投稿を選択します",
		},
	},
	player: {
		_: "プレーヤー",
		speed: {
			resample: "重采样音频", // NEW
			continuous: "无级变速", // NEW
		},
	},
	danmaku: {
		_: "弾幕",
		send: "弾幕を送信",
		history: "弾幕履歴",
		format: {
			mode: {
				rtl: "スクロール",
				top: "中央上",
				bottom: "中央下",
				ltr: "逆スクロール",
			},
			send_as_creator: "クリエイター専用グラデーション",
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
	preference: "プリファレンス",
	experimental: "実験",
	accessibility: "アクセシビリティ",
	shortcut_key: {
		_: "ショートカットキー",
		player_page: "播放页", // NEW
		play_pause: "播放/暂停", // NEW
		exit_fullscreen: "退出全屏", // NEW
		pagination: "分页器", // NEW
		page_turning: "翻页", // NEW
		comment_area: "评论区", // NEW
		quick_insert_kaomoji: "快捷插入颜文字", // NEW
	},
	guide: "ガイド",
	about: {
		_: "KIRAKIRAについて",
		repositories: {
			_: "リポジトリ",
			frontend: "GitHub前端仓库地址与问题反馈", // NEW
			backend: "GitHub后端仓库地址与问题反馈", // NEW
			markdown: "个人主页Markdown仓库地址与问题反馈", // NEW
		},
		team: "開発チーム",
		staff: {
			webmistress: "WEBミストレス",
			designer: "デザイナー",
			frontend: "フロントエンド",
			backend: "バックエンド",
			translator: "翻訳者",
		},
		technologies_used: "使用されている技術",
		slogan: "一个可爱的视频网站，\n献给可爱的你！", // NEW
	},
	acknowledgement: "スペシャルサンクス",
	friendly_links: "相互リンク",
	regexp: "正規表現",
	keywords: "キーワード",
	email: "メール",
	email_address: "メールアドレス",
	authenticator: "オーセンティケーター",
	current_email: "現在のメールアドレス",
	modification_date: "変更日",
	addition_date: "追加日",
	history: "履歴",
	favorite: "お気に入り",
	favorite_verb: "お気に入りに追加",
	favorites: {
		_: "お気に入り",
		my_favorites: "我的收藏夹", // NEW
		subscribed_favorites: "订阅收藏夹", // NEW
		modify_info: "修改信息", // NEW
		clear_expired: "清理已失效视频", // NEW
		subscribe: "订阅收藏", // NEW
		play_all: "播放全部", // NEW
		play_selected: "播放选中", // NEW
		select_all_this_page: "全选本页", // NEW
		add: "添加视频", // NEW
		remove: "取消收藏", // NEW
		copy_to: "复制到", // NEW
		move_to: "移动到", // NEW
		multi_select: "批量选择", // NEW
	},
	feed: "フィード",
	upload: {
		_: "投稿",
		drag_to_upload: "拖到此处上传", // NEW
		format_info: "支持MP4、WMV、WEBM等主流格式", // NEW
	},
	messages: "メッセージ",
	login: "ログイン",
	logout: "ログアウト",
	register: "新規登録",
	verification_code: "確認コード",
	current_page_label: "{0}/{1}ページ",
	switch_page_label: "{0}ページに切り替える",
	selected_item_label: "選択しているアイテムは：",
	upvote: "高評価",
	downvote: "低評価",
	share: "共有",
	play: "再生",
	pause: "一時停止",
	rating: "評価",
	kaomoji: {
		_: "顔文字",
		happy: "嬉しい",
		greet: "挨拶",
		awa: "萌え",
		sad: "悲しみ",
		embarrassed: "困惑",
	},
	associate_existing: "関連コンテンツ登録",
	reply: "返信",
	more: "詳細",
	delete: "削除",
	copy: "コピー",
	pin: "固定",
	unpin: "固定解除",
	report: "通報",
	original: "自作",
	repost: "転載",
	authorized_repost: "許可を得た転載",
	ensure_original: "この作品は自作であることを声明します",
	original_author: "原作者",
	original_link: "転載元リンク",
	title: "タイトル",
	press_enter_to_add: "Enterキーで追加",
	description: "説明文",
	push_to_feed: "タイムラインにも投稿",
	cover: "サムネイル",
	select_cover: "サムネイル選択",
	follow: "フォロー",
	following: "フォロワー",
	fans: "ファン",
	watched: "再生数",
	latest: "新着",
	upload_date: "投稿日時",
	sort: {
		by: "並べ替え",
		view: "再生数",
		danmaku: "弾幕数",
		comment: "コメント数",
		favorite: "お気に入り登録数",
	},
	view: {
		_: "表示形式",
		list: "リスト",
		grid: "グリッド",
		tile: "タイル",
	},
	duration: "長さ",
	are_watching: "人が視聴中",
	step: {
		next: "次へ",
		previous: "戻る",
		ok: "OK", // NEW
		cancel: "キャンセル",
		finish: "完了",
		close: "閉じる",
		modify: "変更",
		save: "保存",
		add: "追加",
		apply: "適用",
		reset: "リセット",
	},
	loginwindow: {
		login_welcome: "ようこそ",
		login_to_forgot: "パスワードをお忘れの場合",
		login_to_register: "新規登録",
		register_to_login: "すでにアカウントをお持ちですか？",
		forgot_to_login: "パスワードを思い出した",
		register_email_sent_info: "確認コードを送信しました。受け取ったコードを入力してください。\n届いてない場合、コードを再送信することができます。",
		forgot_info: "アカウントのメールアドレスを入力してください。\nこのアドレス宛にメールを送ります。メールの中のリンクをクリックしてパスワード再設定の手続を続行します。",
		reset_successful_info: "本人確認ができました！\n新しいパスワードを設定してください。そして忘れないようにしてください。",
	},
	unselected: {
		combobox: "请选择一项", // NEW
		settings: "请选择一项设置", // NEW
		tag: "请搜索标签", // NEW
		language: "选择语言", // NEW
	},
	user: {
		name: "ニックネーム",
		name_requirements: "1~20文字、大小英数字、ひらがな/カタカナ、漢字、特殊記号の｢-｣と｢_｣のみ使用できます。",
		bio: "自己紹介",
		gender: "性別",
		memo: "メモ",
		age: "年齢",
		male: "男",
		female: "女",
		birthday: "生年月日",
		info: "ユーザー情報",
		join_time: "アカウントの登録日",
	},
	development_test_page: "デベロップメント テストページ",
	components_test_page: "コンポーネンツ テストページ",
	view_cover: "サムネイルの確認",
	watch_later: "後で見る",
	download_video: "ダウンロード",
	report_creation: "通報",
	format: {
		_: "フォーマット",
		bold: "太字",
		italic: "斜体",
		underline: "下線",
		strikethrough: "取り消し線",
		at_person: "メンション",
	},
	text: {
		_: "テキスト",
		size: "フォント サイズ",
	},
	color: "文字色",
	mode: "モード",
	size: {
		_: "サイズ",
		tiny: "微", // NEW
		small: "小",
		medium: "中",
		large: "大",
		huge: "巨", // NEW
	},
	user_page: {
		_: "プロフィール",
		title_affix: "{0}のプロフィール",
	},
	manage_content: "投稿管理", // NEW
	add_to_blocklist: "ブロックする",
	platform: {
		twitter: "Twitter",
		qq: "QQ",
		bilibili: "ビリビリ",
		niconico: "ニコニコ",
		youtube: "YouTube",
		otomad_wiki: "音MADウィキ",
		weibo: "微博",
		discord: "Discord",
		telegram: "Telegram",
		midishow: "MidiShow",
	},
	modify_memo: "メモの編集",
	add_to_group: "グループに追加",
	navigation: {
		_: "ナビ",
		back: "戻る",
	},
	other: "その他",
	color_picker: "Color Picker",
	video_count: "{0}个视频", // NEW
	video_recommendations: "相关视频", // NEW
	page_not_found_info: "你似乎来到了一个很新的页面。", // NEW
	click_to_refresh: "点击刷新", // NEW
	toast: {
		finish: "操作は正常に完了しました",
		unsupported_file: "不支持上传所选文件！", // NEW
		no_cover: "请上传封面！", // NEW
		login_failed: "登录失败！用户名或密码错误。", // NEW
		password_mismatch: "两次输入密码不一致！", // NEW
		copied: "已复制！", // NEW
		modification_failed: "修改失败！", // NEW
		failed_to_disable_cookies: "禁用Cookie失败！", // NEW
	},
	confirm: {
		cancel_upload: "确定要取消本次上传吗？", // NEW
	},
};

export default Japanese;

/*
 * 备注：
 * loginwindow_register_to_login
 * 	原译作“すでにアカウントをお持ちですか？ログイン”,因文字列过长影响页面展示，故割爱
 * 关于“弹幕 danmaku”与“评论 comment”
 * 	日语语境中“弾幕”指同屏评论（コメント）数量如弹幕游戏一般多到盖住画面的现象
 * 	而中文里指在视频画面上滚动的评论本身而不是现象
 * 	此处暂且将视频中的评论译为“弾幕”，页面下方的评论作“コメント”
 * forgot_password (230819)
 *  作为登录组件忘记密码时的标题，目前存在长度过长影响展示的情况
 */
