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
	/** 为该评论减分的值。 */
	const dislike = defineModel("dislike", { default: 0 });
	const date = computed(() => formatDate(props.date, "yyyy-MM-dd hh:mm:ss"));

	// TODO: 转发、置顶等在右边的更多菜单还没做。另外仔细注意的话加减分逻辑是有问题的，难道可以不取消点击反而可以反复刷加分减分？
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
				<div v-if="index !== undefined">#{{ index }}</div>
				<div>{{ date }}</div>
				<div class="likes" @click="like++">
					<Icon name="thumb_up" />
					<span v-if="like">{{ like }}</span>
				</div>
				<div class="likes" @click="dislike++">
					<Icon name="thumb_down" />
					<span v-if="dislike">{{ dislike }}</span>
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

		.content > :not(:last-child) {
			margin-bottom: 8px;
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
		gap: 20px;
		color: c(icon-color);
		font-size: 13px;

		.likes {
			display: flex;
			gap: 11px;
			align-items: center;
			cursor: pointer;

			.icon {
				font-size: 18px;
			}

			&:any-hover .icon,
			&:active .icon {
				color: c(accent);
			}

			&:active .icon {
				scale: 0.9;
			}
		}
	}
</style>
