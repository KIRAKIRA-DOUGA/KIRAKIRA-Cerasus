<script setup lang="ts">
	const props = defineProps<{
		/** 图标，暂时无用。 */
		icon?: DeclaredIcons;
		/** 标识符。 */
		id: string;
		/** 在首次单击该项时优先显示为升序/降序，缺省时为升序。 */
		preferOrder?: SortOrder;
	}>();
</script>
