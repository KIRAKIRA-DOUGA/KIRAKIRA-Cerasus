<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 评论发布者头像网址。 */
		avatar?: string;
		/** 评论发布者昵称。 */
		username?: string;
		/** 是否已置顶？ */
		pinned?: boolean;
		/** 评论序号。 */
		index?: number; // 我不赞成在序号前导 0，因为你怎敢假定评论数在绝大多数情况下小于或等于两位数？
		/** 评论发布日期。 */
		date?: Date;
	}>(), {
		avatar: undefined,
		username: "匿名",
		index: undefined,
		date: () => new Date(),
	});

	/** 为该评论加分的值。 */
	const like = defineModel("like", { default: 0 });
	/** 是否已点击加分？ */
	const likeClicked = defineModel("likeClicked", { default: false });
	/** 为该评论减分的值。 */
	const dislike = defineModel("dislike", { default: 0 });
	/** 是否已点击减分？ */
	const dislikeClicked = defineModel("dislikeClicked", { default: false });
	const date = computed(() => formatDate(props.date, "yyyy-MM-dd hh:mm:ss"));
	const menu = ref<MenuModel>(); // TODO: 菜单需要新增功能，使其像浮窗一样可以贴附某个元素展开。

	/**
	 * 点击加分、减分按钮事件。
	 * @param button - 点击的按钮是加分还是减分。
	 * @param [noNestingDolls=false] - 禁止套娃，防止递归调用。
	 */
	function onClickLikes(button: "like" | "dislike", noNestingDolls: boolean = false) {
		const states = { like, likeClicked, dislike, dislikeClicked };
		const value = states[button], clicked = states[`${button}Clicked`]; // 面向字符串编程。
		const another = button === "like" ? "dislike" : "like";
		const isActive = clicked.value = !clicked.value, gain = isActive ? 1 : -1;
		value.value += gain;
		if (isActive && states[`${another}Clicked`].value && !noNestingDolls) onClickLikes(another, true);
	}
</script>

<template>
	<Comp>
		<UserAvatar :avatar="avatar" />
		<div class="content">
			<div class="header">
				<Icon v-if="pinned" name="pin" class="pin" />
				<span class="username">{{ username }}</span>
			</div>
			<div class="comments">
				<slot></slot>
			</div>
			<div class="footer">
				<div class="left">
					<div v-if="index !== undefined">#{{ index }}</div>
					<div>{{ date }}</div>
					<div class="likes-wrapper">
						<div class="likes" :class="{ active: likeClicked }">
							<SoftButton icon="thumb_up" @click="onClickLikes('like')" />
							<span v-if="like">{{ like }}</span>
						</div>
						<div class="likes" :class="{ active: dislikeClicked }">
							<SoftButton icon="thumb_down" @click="onClickLikes('dislike')" />
							<span v-if="dislike">{{ dislike }}</span>
						</div>
					</div>
				</div>
				<div class="right">
					<SoftButton icon="reply" />
					<SoftButton icon="more_vert" @click="e => menu = e" />
					<Menu v-model="menu">
						<MenuItem icon="delete">删除</MenuItem>
						<MenuItem icon="pin">置顶</MenuItem>
						<hr />
						<MenuItem icon="flag">举报</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		gap: 16px;
		margin: 20px 0;
		color: c(text-color);

		.content {
			width: 100%;
			
			> :not(:last-child) {
				margin-bottom: 8px;
			}
		}
	}

	.header {
		display: flex;
		gap: 4px;
		align-items: center;

		.icon.pin {
			color: c(icon-color);
			font-size: 24px;
		}

		.username {
			font-weight: 700;
			font-size: 16px;
		}
	}

	.comments {
		text-align: justify;
		user-select: text;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		color: c(icon-color);
		font-size: 13px;
		
		> * {
			display: flex;
			gap: 20px;
		}
		
		.likes-wrapper {
			display: flex;
			gap: 14px;
		}

		.likes {
			display: flex;
			gap: 11px;
			align-items: center;
			cursor: pointer;
			
			&.active .soft-button {
				color: c(accent);
			}
		}

		.soft-button {
			--wrapper-size: 20px;
			--ripple-size: 40px;
			--icon-size: 18px;
		}
	}
</style>