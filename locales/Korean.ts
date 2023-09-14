import { LocaleIdentifiers } from "./types";

const Korean: LocaleIdentifiers = {
	colon: ": ",
	semicolon: "; ",
	caesura: ", ",
	home: "Home",
	category: {
		_: "Category",
		anime: "Anime",
		music: "Music",
		otomad: "Otomad",
		tech: "Tech",
		design: "Design",
		game: "Game",
		other: "Other",
	},
	content: "Content",
	search: "Search",
	custom: "Custom",
	scheme: {
		_: "Scheme",
		light: "Light Theme",
		dark: "Dark Theme",
		system: "Follow System Theme",
	},
	palette: {
		_: "Palette",
		pink: "Kawaii Pink",
		sky: "Sky Blue",
		blue: "Chino Blue",
		green: "Chiya Green",
		orange: "Cocoa Orange",
		purple: "Rize Purple",
	},
	language: {
		_: "언어",
		zhs: "중국어 간체",
		zht: "중국어 번체",
		en: "영어",
		ja: "일본어",
		ko: "한국인",
		vi: "베트남어",
		id: "인도네시아어",
	},
	background: {
		_: "Background",
		animated: "Animated Background",
		custom: "Custom Background",
	},
	appearance: {
		_: "Appearance",
		sharp_mode: "Sharp Mode",
		flat_mode: "Flat Mode",
		colorful_navbar: "Colorful Navigation Bar",
	},
	confetti: "Confetti",
	send: "Send",
	query: "Query",
	on: "On",
	off: "Off",
	disabled: "Disabled",
	tag: {
		_: "Tag",
		search: "Search Tags",
		new: "Create New Tag",
	},
	all: "All",
	video: "Videos",
	image: "Images",
	series: "Series",
	audio: "Audio",
	photo: "Photo",
	album: "Album",
	comments: "Comments",
	you_know_too_much: "You know too much.",
	settings: {
		_: "Settings",
		search: "Search Settings",
		user: "User Settings",
		app: "App Settings",
	},
	dashboard: "Dashboard",
	account: "Account",
	profile: {
		_: "Profile",
		edit_banner: "Edit Banner",
		edit_avatar: "Edit Avatar",
	},
	traces: "Traces",
	privacy: {
		_: "Privacy",
		cookie: "Cookie☆",
		allow_cookies: "Allow to use Cookies",
		info_visibility: "Info Visibility",
		public: "Public",
		private: "Private",
		following: "Visible for Your Following",
	},
	security: "Security",
	login_options: "Login Options",
	password: {
		_: "Password",
		forgot: "Forgot Password",
		reset: "Reset Password",
		retype: "Retype Password",
		change: "Change Password",
		current: "Current Password",
		new: "New Password",
		new_retype: "Retype New Password",
		hint: "Password Hint",
	},
	account_linking: "Account Linking",
	blocklist: {
		_: "Blocklist",
		ban: {
			_: "Ban",
			description: "Users you don't want to allow to intract with you.",
		},
		hide: {
			_: "Hide",
			description: "Users you don't want to see which will be disappeared (unless you enter their user pages directly).",
		},
		tags: {
			description: "Use tags to hide content you don't want to see.",
		},
		keywords: {
			description: "Use keywords to hide content you don't want to see.",
		},
		regexp: {
			description: "Use regular expression to hide content you don't want to see.",
		},
	},
	player: {
		_: "Player",
		speed: {
			resample: "Resample Audio",
			continuous: "Continuous Control",
		},
	},
	danmaku: {
		_: "Danmaku | Danmakus",
		send: "Send Danmaku",
		history: "Danmaku History",
		format: {
			mode: {
				rtl: "Scroll",
				top: "Top",
				bottom: "Bottom",
				ltr: "Reversed",
			},
			send_as_creator: "Creator's Gradient",
		},
		list: {
			loading: "Loading Danmakus…",
			thead: {
				time: "Time",
				content: "Content",
				sending_time: "Sending Time",
			},
		},
	},
	preference: "Preference",
	experimental: "Experimental",
	accessibility: "Accessibility",
	shortcut_key: {
		_: "Shortcut Key",
		player_page: "Player Page",
		play_pause: "Play/Pause",
		exit_fullscreen: "Exit Fullscreen",
		pagination: "Pagination",
		page_turning: "Page Turning",
		comment_area: "Comment Area",
		quick_insert_kaomoji: "Quick Insert Kaomoji",
	},
	guide: "Guide",
	about: {
		_: "About",
		repositories: {
			_: "Repositories",
			frontend: "GitHub Frontend Repositories and Issue Feedback",
			backend: "GitHub Backend Repositories and Issue Feedback",
			markdown: "User Page Markdown Repositories and Issue Feedback",
		},
		team: "Team",
		staff: {
			webmistress: "Webmistress",
			designer: "Designer",
			frontend: "Frontend",
			backend: "Backend",
			translator: "{0} Translator",
		},
		technologies_used: "Technologies Used",
		slogan: "A cute video site\xa0\nfor your loveliness!",
	},
	acknowledgement: "Acknowledgement",
	friendly_links: "Friendly Links",
	regexp: "Regular Expression",
	keywords: "Keywords",
	email: "Email",
	email_address: "Email",
	authenticator: "Authenticator",
	current_email: "Current Email",
	modification_date: "Modification Date",
	addition_date: "Addition Date",
	history: "History",
	favorite: "Favorite | Favorites",
	favorite_verb: "Add to Favorites",
	favorites: {
		_: "Favorites",
		my_favorites: "My Favorites",
		subscribed_favorites: "Subscribed Favorites",
		modify_info: "Modify Info",
		clear_expired: "Clear Expired Videos",
		subscribe: "Subscribe to This Favorite",
		play_all: "Play All",
		play_selected: "Play Selected",
		select_all_this_page: "Select All This Page",
		add: "Add Video",
		remove: "Unfavorite",
		copy_to: "Copy to",
		move_to: "Move to",
		multi_select: "Multi Select",
	},
	feed: "Feed",
	upload: {
		_: "Upload",
		drag_to_upload: "Drag Here to Upload",
		format_info: "Supports mainstream formats such as MP4, WMV, WEBM",
	},
	messages: "Messages",
	login: "Login",
	logout: "Logout",
	register: "Register",
	verification_code: "Verification Code",
	current_page_label: "Page {0} of {1}",
	switch_page_label: "Switch to page {0}",
	selected_item_label: "Selected item is: ",
	upvote: "Upvote",
	downvote: "Downvote",
	share: "Share",
	play: "Play",
	pause: "Pause",
	rating: "Rating",
	kaomoji: {
		_: "Kaomoji",
		happy: "Happy",
		greet: "Greet",
		awa: "Moe",
		sad: "Sad",
		embarrassed: "Embarrassed",
	},
	associate_existing: "Associate Existing",
	reply: "Reply",
	more: "More",
	delete: "Delete",
	copy: "Copy",
	pin: "Pin",
	unpin: "Unpin",
	report: "Report",
	original: "Original",
	repost: "Repost",
	authorized_repost: "Authorized Repost",
	ensure_original: "I declare that this creation is original",
	original_author: "Original Author",
	original_link: "Original Link",
	title: "Title",
	press_enter_to_add: "Press Enter to Add",
	description: "Description",
	push_to_feed: "Push to Feed",
	cover: "Cover",
	select_cover: "Select Cover",
	follow: "Follow",
	following: "Following",
	fans: "Fan | Fans",
	watched: "View | Views",
	latest: "Latest",
	upload_date: "Upload Date",
	sort: {
		by: "Sort by",
		view: "View Count",
		danmaku: "Danmaku Count",
		comment: "Comment Count",
		favorite: "Favorite Count",
	},
	view: {
		_: "View",
		list: "List",
		grid: "Grid",
		tile: "Tile",
	},
	duration: "Duration",
	are_watching: "is watching | are watching",
	step: {
		next: "Next",
		previous: "Previous",
		ok: "OK",
		cancel: "Cancel",
		finish: "Finish",
		close: "Close",
		modify: "Modify",
		save: "Save",
		add: "Add",
		apply: "Apply",
		reset: "Reset",
	},
	loginwindow: {
		login_welcome: "Welcome Home",
		login_to_forgot: "I forgot my password",
		login_to_register: "I don't have an account",
		register_to_login: "I have an account",
		forgot_to_login: "I found my password",
		forgot_title: "Forgot",
		reset_title: "Reset",
		register_email_sent_info: "We have sent a verification code to your email, please enter the code here.\nIf you did not receive it, you can resend.",
		forgot_info: "Please enter your email.\nWe will send a verification code to your email.",
		reset_successful_info: "Verification successful!\nPlease enter and remember your new password.",
	},
	unselected: {
		combobox: "Select a Item",
		settings: "Please Select a Setting",
		tag: "Please Search for Tags",
		language: "Select Language",
	},
	user: {
		name: "Name",
		name_requirements: "1~20 characters, including only upper & lower case Latin letters, numbers, common Hiragana/Katakana, CJK characters, special symbols \"-\", \"_\"",
		bio: "Bio",
		gender: "Gender",
		memo: "Memo",
		age: "Age",
		male: "Male",
		female: "Female",
		birthday: "Birthday",
		info: "User Info",
		join_time: "Join Time",
	},
	development_test_page: "Development Test Page",
	components_test_page: "Components Test Page",
	view_cover: "View Cover",
	watch_later: "Watch Later",
	download_video: "Download Video",
	report_creation: "Report Creation",
	format: {
		_: "Format",
		bold: "Bold",
		italic: "Italic",
		underline: "Underline",
		strikethrough: "Strikethrough",
		at_person: "At",
	},
	text: {
		_: "Text",
		size: "Text Size",
	},
	color: "Color",
	mode: "Mode",
	size: {
		_: "Size",
		tiny: "Tiny",
		small: "Small",
		medium: "Medium",
		large: "Large",
		huge: "Huge",
	},
	user_page: {
		_: "User Page",
		title_affix: "{0}'s User Page",
	},
	manage_content: "Manage Content",
	add_to_blocklist: "Add to Blocklist",
	platform: {
		twitter: "Twitter",
		qq: "QQ",
		bilibili: "Bilibili",
		niconico: "Niconico",
		youtube: "YouTube",
		otomad_wiki: "Otomad Wiki",
		weibo: "Weibo",
		discord: "Discord",
		telegram: "Telegram",
		midishow: "MidiShow",
	},
	modify_memo: "Modify Memo",
	add_to_group: "Add to Group",
	navigation: {
		_: "Navigation",
		back: "Back",
		return_to_home: "Return to Home",
	},
	other: "Other",
	color_picker: "Color Picker",
	video_count: "{0} Video | {0} Videos",
	video_recommendations: "Recommendations",
	page_not_found_info: "You seem to have arrived at a very new page.",
	click_to_refresh: "Click to refresh",
	toast: {
		finish: "Operation Completed Successfully",
		unsupported_file: "Uploading the selected file is not supported!",
		no_cover: "Please upload the cover!",
		login_failed: "Login failed! The username or password is incorrect.",
		password_mismatch: "The two passwords entered do not match!",
		copied: "Copied!",
		modification_failed: "Modification failed!",
		failed_to_disable_cookies: "Failed to disable cookies!",
		duplicate_label: "Duplicate label!",
		no_language_selected: "Please select a language first!",
	},
	confirm: {
		cancel_upload: "Are you sure you want to cancel this upload?",
	},
	current_time: "Current Time",
};

export default Korean;
