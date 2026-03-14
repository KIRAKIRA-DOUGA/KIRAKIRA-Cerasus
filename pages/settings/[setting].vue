<docs>
	# 缺省未设计的设置子页面
</docs>

<template>
	<ContentUnavailable :title="$t('settings.title')" :description="$t('unselected.settings')" page>
		<template #icon>
			<LogoSettings />
		</template>
	</ContentUnavailable>
</template>
