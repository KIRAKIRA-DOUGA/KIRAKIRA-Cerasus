/*
 * 说明：
 * 1. 使用管道符定义单复数，格式为 `单数 | 复数`。
 */

import { LocaleIdentifiers } from "./types";

const English: LocaleIdentifiers = {
	colon: ": ",
	semicolon: "; ",
	caesura: ", ",
	welcome: "Welcome",
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
	button: "Button",
	button_disabled: "Button Disabled",
	button_clicked: "I was clicked~",
	confetti: "Confetti",
	send: "Send",
	query: "Query",
	show_alert: "Show Alert",
	toggle_switch: "Toggle Switch",
	on: "On",
	off: "Off",
	disabled: "Disabled",
	background: "Background",
	animated_background: "Animated Background",
	custom_background: "Custom Background",
	light: "Light Theme",
	dark: "Dark Theme",
	system: "Follow System Theme",
	pink: "Kawaii Pink",
	sky: "Sky Blue",
	blue: "Chino Blue",
	green: "Chiya Green",
	orange: "Cocoa Orange",
	purple: "Rize Purple",
	custom: "Custom",
	checkbox: "Checkbox",
	search_settings: "Search Settings",
	appearance: "Appearance",
	scheme: "Scheme",
	palette: "Palette",
	language: "Language",
	tag: "Tag",
	all: "All",
	video: "Videos",
	image: "Images",
	logo_hidden: "Hidden Logo",
	logo_half: "Half hidden Logo",
	logo_show: "Full Logo",
	comments: "Comments",
	uploaders_lovin_it: "Uploader's lovin' it",
	finish: "Operation Completed Successfully",
	you_know_too_much: "You know too much.",
	dashboard: "Dashboard",
	account: "Account",
	profile: "Profile",
	traces: "Traces",
	privacy: "Privacy",
	security: "Security",
	login_options: "Login Options",
	password: {
		_: "Password",
		forgot: "I forgot",
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
	player: "Player",
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
			send_as_creator: "Creator's Gradient", // NEW
		},
	},
	preference: "Preference",
	accessibility: "Accessibility",
	about: "About",
	experimental: "Experimental",
	user_settings: "User Settings",
	app_settings: "App Settings",
	male: "Male",
	female: "Female",
	birthday: "Birthday",
	email: "Email",
	email_address: "Email",
	authenticator: "Authenticator",
	current_email: "Current Email",
	modification_date: "Modification Date",
	addition_date: "Addition Date",
	modify: "Modify",
	save: "Save",
	add: "Add",
	apply: "Apply",
	reset: "Reset",
	history: "History",
	favorite: "Favorite | Favorites",
	favorites: "Favorites",
	favorite_verb: "Add to Favorites",
	feed: "Feed",
	upload: "Upload",
	messages: "Messages",
	login: "Login",
	logout: "Logout",
	register: "Register",
	verification_code: "Verification Code",
	close: "Close",
	current_page_label: "Page {0} of {1}",
	switch_page_label: "Switch to page {0}",
	selected_item_label: "Selected item is: ",
	happy: "Happy",
	greet: "Greet",
	awa: "Moe",
	sad: "Sad",
	embarrassed: "Embarrassed",
	upvote: "Upvote",
	downvote: "Downvote",
	share: "Share",
	play: "Play",
	pause: "Pause",
	rating: "Rating",
	bold: "Bold",
	italic: "Italic",
	underline: "Underline",
	strikethrough: "Strikethrough",
	at_person: "At",
	kaomoji: "Kaomoji",
	associate_existing: "Associate Existing",
	reply: "Reply",
	more: "More",
	delete: "Delete",
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
	tags: "Tags",
	press_enter_to_add: "Press Enter to Add",
	description_of_creation: "Description",
	push_to_feed: "Push to Feed",
	cover: "Cover",
	select_cover: "Select Cover",
	series: "Series",
	audio: "Audio",
	photo: "Photo",
	album: "Album",
	follow: "Follow",
	following: "Following",
	fans: "Fan | Fans",
	views_video: "View | Views",
	join_time: "Join Time",
	user_info: "User Info",
	acknowledgement: "Acknowledgement",
	friendly_links: "Friendly Links",
	latest: "Latest",
	test: "Test",
	error_pages: "Error Pages",
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
	viewers: "Viewers",
	are_watching: "is watching | are watching",
	step: {
		next: "Next",
		previous: "Previous",
		ok: "OK",
		cancel: "Cancel",
	},
	loginwindow: {
		login_welcome: "Welcome",
		login_to_forgot: "I forgot my password",
		login_to_register: "I don't have an account",
		register_to_login: "I have an account",
		forgot_to_login: "I found my password",
		register_email_sent_info: "We have sent a verification code to your email, please enter the code here.\nIf you did not receive it, you can resend.",
		forgot_info: "Please enter your email.\nWe will send a verification code to your email.",
		reset_successful_info: "Verification successful!\nPlease enter and remember your new password.",
	},
	settings_unselected: "Please Select a Tab",
	combobox_unselected: "Please Select",
	settings: {
		_: "Settings",
		profile: {
			edit_banner: "Edit Banner",
			edit_avatar: "Edit Avatar",
		},
		privacy: {
			allow_cookies: "Allow to use Cookies",
			info_visibility: "Info Visilibity",
		},
		about: {
			repositories: "Repositories",
			creative_team: "Creative Team",
			staff: {
				webmistress: "Webmistress",
				designer: "Designer",
				frontend: "Frontend",
				backend: "Backend",
				translator: "Translator",
			},
			technologies_used: "Technologies Used",
		},
	},
	user: {
		name: "Name",
		name_requirements: '1~20 characters, including only upper & lower case Latin letters, numbers, common Hiragana/Katakana, CJK characters, special symbols "-", "_"',
		bio: "Bio",
		gender: "Gender",
		memo: "Memo",
		age: "Age",
	},
	zhs: "Simplified Chinese",
	en: "English",
	ja: "Japanese",
	development_test_page: "Development Test Page",
	components_test_page: "Components Test Page",
	view_cover: "View Cover",
	watch_later: "Watch Later",
	download_video: "Download Video",
	report_creation: "Report Creation",
	forgot_password: "Forgot Password",
	reset_password: "Reset Password",
	format: "Format",
	text: {
		_: "Text",
		size: "Text Size",
	},
	color: "Color",
	mode: "Mode",
	size: {
		_: "Size",
		mini: "Mini",
		small: "Small",
		medium: "Medium",
		large: "Large",
		extra_large: "Extra Large",
	},
	unknown: "Unknown",
	shortcut_key: "Shortcut Key",
	guide: "Guide",
	regexp: "Regular Expression",
	keywords: "Keywords",
	user_page: {
		_: "User Page",
		title_suffix: "'s User Page",
	},
	manage_content: "Manage Content",
	add_to_blocklist: "Add to Blocklist",
	platform: {
		bilibili: "Bilibili",
		niconico: "Niconico",
		otomad_wiki: "Otomad Wiki",
		weibo: "Weibo",
		twitter: "Twitter",
		qq: "QQ",
		youtube: "YouTube",
		discord: "Discord",
		telegram: "Telegram",
		midishow: "MidiShow",
	},
	modify_memo: "Modify Memo",
	add_to_group: "Add to Group",
	navigation: {
		_: "Navigation",
		back: "Back",
	},
};

export default English;
