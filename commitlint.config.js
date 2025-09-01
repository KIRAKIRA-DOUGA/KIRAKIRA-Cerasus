import { RuleConfigSeverity } from "@commitlint/types";

/** @type {import("@commitlint/types").UserConfig} */
export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-full-stop": [RuleConfigSeverity.Disabled, "never", [".", "。"]],
		"body-leading-blank": [RuleConfigSeverity.Error, "always"],
		"body-max-line-length": [RuleConfigSeverity.Warning, "always", 100000],
		"subject-case": [RuleConfigSeverity.Error, "never",
			["sentence-case", "start-case", "pascal-case", "upper-case", "snake-case"],
		],
		"subject-full-stop": [RuleConfigSeverity.Error, "never", [".", "。"]],
		"scope-case": [RuleConfigSeverity.Error, "always", "lower-case"],
		"type-enum": [RuleConfigSeverity.Error, "always",
			["build", "chore", "conflict", "ci", "delete", "docs", "feat", "fix", "font", "perf", "refactor", "revert", "stash", "style", "test", "try"],
		],
	},
	prompt: {
		settings: {
			enableMultipleScopes: true,
			scopeEnumSeparator: ",",
		},
		messages: {
			skip: "（按回车键跳过）",
			max: "最多 %d 个字",
			min: "最少 %d 个字",
			emptyWarning: "不能为空",
			upperLimitWarning: "字数超过限制",
			lowerLimitWarning: "字数不足",
		},
		questions: {
			type: {
				description: "选择您要提交的更改类型",
				enum: {
					feat: {
						description: "添加一个新功能",
						title: "Features",
						emoji: "✨",
					},
					fix: {
						description: "修复一个错误",
						title: "Bug Fixes",
						emoji: "🐛",
					},
					docs: {
						description: "文档增删改查",
						title: "Documentation",
						emoji: "📚",
					},
					style: {
						description: "不影响代码含义的样式更改（空格、格式、缺少分号等）",
						title: "Styles",
						emoji: "💎",
					},
					refactor: {
						description: "既不修复错误也不添加功能的代码重构更改",
						title: "Code Refactoring",
						emoji: "📦",
					},
					perf: {
						description: "优化性能",
						title: "Performance Improvements",
						emoji: "🚀",
					},
					test: {
						description: "增加或修正测试",
						title: "Tests",
						emoji: "🚨",
					},
					build: {
						description: "影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）",
						title: "Builds",
						emoji: "🛠",
					},
					ci: {
						description: "对持续集成配置文件和脚本的更改（示例范围：Travis、Circle、BrowserStack、SauceLabs）",
						title: "Continuous Integrations",
						emoji: "⚙️",
					},
					chore: {
						description: "除源码目录或测试文件以外的更改",
						title: "Chores",
						emoji: "♻️",
					},
					revert: {
						description: "回退历史版本",
						title: "Reverts",
						emoji: "🗑",
					},
					conflict: {
						description: "修改冲突",
						title: "Conflict",
						emoji: "🥊",
					},
					font: {
						description: "字体文件更新",
						title: "Fonts",
						emoji: "🔣",
					},
					delete: {
						description: "删除功能或文件",
						title: "Delete Features or Files",
						emoji: "🚮",
					},
					stash: {
						description: "暂存文件",
						title: "Stash Files",
						emoji: "🗃️",
					},
					try: {
						description: "尝试做什么但是不起作用，因此仅仅提交来备份代码",
						title: "Try Something Useless",
						emoji: "🤷",
					},
				},
			},
			scope: {
				description: "这个变更的范围是什么（例如组件或文件名，如有多个可用逗号分隔）",
			},
			subject: {
				description: "写一个简短的修改描述",
			},
			body: {
				description: "可以提供一个更长的修改描述",
			},
			isBreaking: {
				description: "有什么重大的变化吗？",
			},
			breakingBody: {
				description: "一个重大变化的提交需要一个说明。请输入一个更长的说明",
			},
			breaking: {
				description: "请描述重大变化的内容",
			},
			isIssueAffected: {
				description: "这个变化会影响任何已开放的议题吗？",
			},
			issuesBody: {
				description: "如果本次提交可以关闭某些议题，则提交需要提供一个说明。请输入需要提交的说明",
			},
			issues: {
				description: "添加一个或多个已经存在的议题（例如：“fix #123”、“re #123”；关闭多个议题示例：“fix #1, fix #2”。）",
			},
		},
	},
};
