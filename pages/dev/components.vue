<script setup lang="ts">
	import animationData from "lotties/spinner-dev1.json";
	import beepSrc from "assets/audios/NOVA 2022.1 Alert Quick.ogg";
	import type { ToastEvent } from "composables/toast";

	const useSyncKiraCookieOptions = { isWatchCookieRef: true, isSyncSettings: true, isListenLoginEvent: true };

	// 主题
	const cookieThemeType = useKiraCookie<ThemeSetType>(COOKIE_KEY.themeTypeCookieKey, SyncUserSettings.updateOrCreateUserThemeTypeSetting, useSyncKiraCookieOptions);
	// 个性色
	const cookieThemeColor = useKiraCookie<string>(COOKIE_KEY.themeColorCookieKey, SyncUserSettings.updateOrCreateUserThemeColorSetting, useSyncKiraCookieOptions);

	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(7);
	const toggle = ref(false);
	const isClicked = ref(false);
	const theme = cookieThemeType;
	const palette = cookieThemeColor;
	const timeoutId = ref<Timeout>();
	const isTagChecked = ref(false);
	const tagInput = ref<string>("输入标签名称");
	const volume = ref(100);
	const pitch = ref(0);
	const selectedTab = ref("all");
	const logoTextForm = ref<LogoTextFormType>("full");
	const showAlert = ref(false);
	const showModal = ref(false);
	const showProgress = ref(true);
	const progressRingSize = ref(40);
	const progressRingThickness = ref(4);
	const progressBarHeight = ref(4);
	const progressPercent = ref(30);
	const progressIndeterminate = ref(true);
	const progressValue = computed(() => progressIndeterminate.value ? NaN : progressPercent.value);
	const inputValue = ref("");
	const menu = ref<MenuModel>();
	const beep = ref<HTMLAudioElement>();
	const isUploaderLovinIt = ref(true);
	const kiraGoods = ref(["kawaii", "nice"]);
	const isSelectAll = computed<CheckState>(() => kiraGoods.value.length >= 3 ? "checked" : kiraGoods.value.length === 0 ? "unchecked" : "indeterminate");
	const onSelectAllChange = (e: { value: string; checkState: CheckState; checked: boolean }) => {
		kiraGoods.value = [];
		if (e.checked) kiraGoods.value.push("kawaii", "nijigen", "nice");
	};
	const toastMessage = ref("");
	const toastSeverity = ref<ToastEvent["severity"]>("success");
	const longTextTest = "那只敏捷的棕毛狐狸跳过了一只懒惰的狗".repeat(20);
	const selectedSegmented = ref("list");
	const flyout = ref<FlyoutModel>();
	const flyoutKaomoji = ref<FlyoutModel>();
	const showFlyout = (e: MouseEvent, placement?: Placement) => flyout.value = [e, placement];
	const [DefinePopoverSlot, PopoverSlot] = createReusableTemplate();
	const comboBoxValue = ref("obtuse angle");
	const settingsGridItemSelect = ref("");
	const color = ref(Color.fromHex("#f00"));

	/**
	 * 单击按钮事件。
	 * @param e - 鼠标事件。
	 */
	async function onClickButton(e: MouseEvent) {
		clearTimeout(timeoutId.value);
		const button = e.target as HTMLButtonElement;
		await animateSize(button, () => isClicked.value = true);
		await new Promise(resolve => timeoutId.value = setTimeout(resolve, 2000));
		await animateSize(button, () => isClicked.value = false);
	}

	/**
	 * 滑动滑动条完成后事件。
	 * @param _value - 滑动条数值。
	 */
	function onSlided(_value: number) {
		const b = beep.value;
		if (!b) return;
		b.currentTime = 0;
		b.play();
		b.preservesPitch = false;
		b.volume = (volume.value / 100) ** 2;
		b.playbackRate = 2 ** (pitch.value / 12);
	}

	useHead({ title: t.components_test_page });
</script>

<template>
	<div class="container">
		<DefinePopoverSlot>
			<div class="modal-content">
				<div>
					<p>视频标题</p>
					<TextBox v-model="inputValue" placeholder="视频标题" />
				</div>
				<div>
					<p>视频分P</p>
					<TextBox v-model="inputValue" placeholder="视频分P" />
				</div>
			</div>
		</DefinePopoverSlot>

		<div class="component-test">
			<Pagination v-model="page" :pages :displayPageCount enableArrowKeyMove />
			<Segmented v-model="selectedSegmented" :style="{ '--ease': 'ease-in-out' }">
				<SegmentedItem id="list" icon="list">列表</SegmentedItem>
				<SegmentedItem id="grid" icon="grid">网格</SegmentedItem>
				<SegmentedItem id="tile" icon="tile">磁贴</SegmentedItem>
			</Segmented>
			<div class="buttons">
				<Button class="test-button" @click="onClickButton">{{ isClicked ? "我被单击了 呜呜呜~" : "主要按钮" }}</Button>
				<Button disabled>主要按钮被禁用</Button>
				<Button @click="showConfetti">{{ t.confetti }}</Button>
				<Button icon="send">{{ t.send }}</Button>
				<Button @click="showAlert = true">显示警告框</Button>
				<Button @click="showModal = true">显示模态框</Button>
				<Button @click="showFlyout">显示浮窗</Button>
				<Button @click="e => flyoutKaomoji = [e, 'y']">显示颜文字浮窗</Button>
				<Button class="secondary">次要按钮</Button>
				<Button class="secondary" disabled>次要按钮被禁用</Button>
				<Button class="tertiary">从要按钮</Button>
				<Button class="tertiary" disabled>从要按钮被禁用</Button>
			</div>
			<Alert v-model="showAlert" static />
			<Modal v-model="showModal" title="标题栏">
				<PopoverSlot />
			</Modal>
			<Flyout v-model="flyout">
				<PopoverSlot />
			</Flyout>
			<FlyoutKaomoji v-model="flyoutKaomoji" />
			<ToggleSwitch v-model="toggle">切换开关 {{ toggle ? t.on : t.off }}</ToggleSwitch>
			<ToggleSwitch disabled>{{ t.disabled }} {{ t.off }}</ToggleSwitch>
			<ToggleSwitch on disabled>{{ t.disabled }} {{ t.on }}</ToggleSwitch>
			<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle">{{ t.background.animated }}</ToggleSwitch>
			<RadioButton v-model="theme" value="light">{{ t.scheme.light }}</RadioButton>
			<RadioButton v-model="theme" value="dark">{{ t.scheme.dark }}</RadioButton>
			<RadioButton v-model="theme" value="system">{{ t.scheme.system }}</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">{{ t.palette.pink }}</RadioButton>
			<RadioButton v-model="palette" value="sky">{{ t.palette.sky }}</RadioButton>
			<RadioButton v-model="palette" value="blue">{{ t.palette.blue }}</RadioButton>
			<RadioButton v-model="palette" value="orange">{{ t.palette.orange }}</RadioButton>
			<RadioButton v-model="palette" value="purple">{{ t.palette.purple }}</RadioButton>
			<RadioButton v-model="palette" value="green">{{ t.palette.green }}</RadioButton>
			<RadioButton v-model="palette" value="custom" disabled>{{ t.custom }}</RadioButton>
			<RadioButton checked disabled>{{ t.disabled }} {{ t.on }}</RadioButton>
			<hr />
			<p>请问您喜欢KIRAKIRA的地方有：</p>
			<Checkbox :checkState="isSelectAll" @change="onSelectAllChange">全选</Checkbox>
			<Checkbox v-model="kiraGoods" value="kawaii">可爱</Checkbox>
			<Checkbox v-model="kiraGoods" value="nice">好康</Checkbox>
			<Checkbox v-model="kiraGoods" value="nijigen">二次元</Checkbox>
			<Checkbox disabled checkState="unchecked">鼠鼠我呀最讨厌了</Checkbox>
			<Checkbox disabled checkState="checked">欢迎白嫖</Checkbox>
			<hr />
			<ThumbGrid>
				<SettingsGridItem id="a" v-model="settingsGridItemSelect" title="a" />
				<SettingsGridItem id="b" v-model="settingsGridItemSelect" title="b" />
			</ThumbGrid>
			<hr />
			<TextBox v-model="inputValue" placeholder="小小的软软的香香的" :style="{ '--size': 'small' }" />
			<TextBox v-model="inputValue" type="email" required placeholder="请输入正确的邮箱" />
			<TextBox v-model="inputValue" icon="lock" type="password" placeholder="密码" :style="{ '--size': 'large' }" />
			<SendVerificationCode v-model="inputValue" />
			<em>所有输入框的内容同时输入属正常现象，因为懒得做三个变量。</em>
			<hr />
			<p>他有没有可能是演的，他是不是演的呢？</p>
			<ComboBox v-for="size in ['small', 'normal', 'large']" :key="size" v-model="comboBoxValue" :style="{ '--size': size }">
				<ComboBoxItem id="not">不是</ComboBoxItem>
				<ComboBoxItem id="maybe not">有可能不是</ComboBoxItem>
				<ComboBoxItem id="obtuse angle">钝角</ComboBoxItem>
				<ComboBoxItem id="sa">สา</ComboBoxItem>
				<ComboBoxItem id="archosyrinx">肛瘘</ComboBoxItem>
				<ComboBoxItem id="voice lost">襳襺覛覝襻襼襾謕覧誖誗</ComboBoxItem>
				<ComboBoxItem id="who ask you">谁问你了</ComboBoxItem>
				<ComboBoxItem id="select a">选A</ComboBoxItem>
				<ComboBoxItem id="option 75">选项75</ComboBoxItem>
				<ComboBoxItem id="blmfy">blmfy</ComboBoxItem>
				<ComboBoxItem id="A.UV">༼</ComboBoxItem>
				<ComboBoxItem id="long worm">缠腰龙</ComboBoxItem>
				<ComboBoxItem id="OV">⤳</ComboBoxItem>
				<ComboBoxItem id="snap">咔哄呃昵吖</ComboBoxItem>
				<ComboBoxItem id="eyelid scrub">轮刮眼眶</ComboBoxItem>
			</ComboBox>
			<hr />
			<HeadingComments :count="233" />
			<hr />
			<Subheader>加载条</Subheader>
			<ToggleSwitch v-model="showProgress">开启加载</ToggleSwitch>
			<p>大小</p><Slider v-model="progressRingSize" :min="1" :max="150" />
			<p>粗细</p><Slider v-model="progressRingThickness" :min="1" :max="60" />
			<p>高度</p><Slider v-model="progressBarHeight" :min="1" :max="100" />
			<ToggleSwitch v-model="progressIndeterminate">不定状态</ToggleSwitch>
			<p>进度</p><Slider v-model="progressPercent" />
			<div class="buttons">
				<Button :loading="showProgress">加载中的按钮</Button>
				<Button :loading="showProgress" disabled>加载中的禁用按钮</Button>
			</div>
			<ProgressRing :hidden="!showProgress" :style="{ '--size': progressRingSize + 'px', '--thickness': progressRingThickness + 'px' }" :value="progressValue" />
			<ProgressBar :hidden="!showProgress" :style="{ height: progressBarHeight + 'px' }" :value="progressValue" />
			<!-- <Lottie loop autoplay :animationData="animationData" /> -->
			<hr />
			<Tag v-model="isTagChecked">{{ t.tag }}</Tag>
			<Tag v-model:input="tagInput" />
			<br />
			<Spoiler>你知道的<ruby>太<rt>tài</rt>多<rt>duō</rt></ruby>了。</Spoiler>
			<Spoiler color="var(--accent)">你知道的<ruby>太<rt>tài</rt>多<rt>duō</rt></ruby>了。</Spoiler>
			<p>音量</p><Slider v-model="volume" :defaultValue="100" @changed="onSlided" />
			<p>音调</p><Slider v-model="pitch" :min="-24" :max="24" :defaultValue="0" @changed="onSlided" />
			<div class="capsule-range-container">
				<CapsuleSlider v-model="volume" :defaultValue="100" :displayValue="Math.round" @changed="onSlided" />
			</div>
			<Slider v-model="volume" :defaultValue="100" :style="{ '--size': 'large' }" @changed="onSlided" />
			<em>单击鼠标中键或触摸屏长按组件以还原默认值。</em>
			<audio ref="beep" :src="beepSrc"></audio>
			<TabBar v-model="selectedTab">
				<TabItem id="all">{{ t.all }}</TabItem>
				<TabItem id="video">{{ t.video }}</TabItem>
				<TabItem id="images">{{ t.image }}</TabItem>
				<TabItem id="long" badge="角标">测试很长很长很长</TabItem>
				<TabItem id="short">短</TabItem>
			</TabBar>
			<TabBar v-model="selectedTab" vertical>
				<TabItem id="all">{{ t.all }}</TabItem>
				<TabItem id="video">{{ t.video }}</TabItem>
				<TabItem id="images">{{ t.image }}</TabItem>
				<TabItem id="long" badge="角标">测试很长很长很长</TabItem>
				<TabItem id="short">短</TabItem>
			</TabBar>
			<hr />
			<div>
				<Button :style="{ marginBottom: '1rem' }" @click="menu = null">显示菜单</Button>
				<Menu v-model="menu">
					<MenuItem icon="copy">复制</MenuItem>
					<MenuItem icon="cut">剪切</MenuItem>
					<MenuItem icon="paste">粘贴</MenuItem>
					<hr />
					<MenuItem icon="delete">删除</MenuItem>
				</Menu>
			</div>
			<hr />
			<div class="toast-test">
				<RadioButton v-model="toastSeverity" value="info">信息</RadioButton>
				<RadioButton v-model="toastSeverity" value="success">成功</RadioButton>
				<RadioButton v-model="toastSeverity" value="warning">警告</RadioButton>
				<RadioButton v-model="toastSeverity" value="error">错误</RadioButton>
				<section>
					<TextBox v-model="toastMessage" placeholder="发送消息到消息框" />
					<Button icon="send" @click="useToast(toastMessage, toastSeverity)">发送到消息框</Button>
				</section>
			</div>
			<hr />
			<RadioButton v-model="logoTextForm" value="hidden">LOGO隐藏</RadioButton>
			<RadioButton v-model="logoTextForm" value="half">LOGO半显示</RadioButton>
			<RadioButton v-model="logoTextForm" value="full">LOGO全显示</RadioButton>
			<LogoText :style="{ '--form': logoTextForm }" />
			<hr />
			<div class="flyout-bg" :style="{ width: '344px' }">
				<ColorPicker v-model="color" enableAlpha />
			</div>
			<hr />
			<div :style="{ height: '500px' }">
				<ImageCropper />
			</div>
			<hr />
			<Accordion autoCollapse>
				<AccordionItem title="第1个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="第2个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="第3个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="➕❤️">
					<ToggleSwitch v-model="isUploaderLovinIt" :style="{ marginBottom: '0.75rem' }">➕❤️</ToggleSwitch>
					<UploaderAira :hidden="!isUploaderLovinIt" />
				</AccordionItem>
				<AccordionItem title="滚动条测试">
					<div class="scroll-test">
						<div class="scroll-test-item"></div>
					</div>
				</AccordionItem>
				<AccordionItem title="工具提示测试">
					注意触摸屏设备不会触发。
					<div class="tooltip-test">
						<Button v-tooltip="{ title: '上方', placement: 'top' }">上方</Button>
						<Button v-tooltip="{ title: '右方', placement: 'right' }">右方</Button>
						<Button v-tooltip="{ title: '下方', placement: 'bottom' }">下方</Button>
						<Button v-tooltip="{ title: '左方', placement: 'left' }">左方</Button>
						<Button v-tooltip="{ title: '自动寻找离页边最远的垂直方向', placement: 'y' }">垂直方向缺省</Button>
						<Button v-tooltip="{ title: '自动寻找离页边最远的水平方向', placement: 'x' }">水平方向缺省</Button>
						<Button v-tooltip="'缺省设定位置则会自动寻找离页边最远的方向'">全方向缺省</Button>
						<Button v-tooltip="longTextTest">长文本</Button>
					</div>
				</AccordionItem>
				<AccordionItem title="浮窗测试">
					<div class="tooltip-test">
						<Button @click="e => showFlyout(e, 'top')">上方</Button>
						<Button @click="e => showFlyout(e, 'right')">右方</Button>
						<Button @click="e => showFlyout(e, 'bottom')">下方</Button>
						<Button @click="e => showFlyout(e, 'left')">左方</Button>
						<Button @click="e => showFlyout(e, 'y')">垂直方向缺省</Button>
						<Button @click="e => showFlyout(e, 'x')">水平方向缺省</Button>
						<Button @click="e => showFlyout(e)">全方向缺省</Button>
						<br />
						<Button @click="e => flyoutKaomoji = [e, 'top']">向上展开颜文字</Button>
						<Button @click="e => flyoutKaomoji = [e, 'bottom']">向下展开颜文字</Button>
					</div>
				</AccordionItem>
				<AccordionItem title="分页器测试">
					<div class="pagination-test">
						<Pagination :current="1" :pages="1" :displayPageCount="7" />
						<Pagination :current="1" :pages="2" :displayPageCount="7" />
						<Pagination :current="1" :pages="3" :displayPageCount="7" />
						<Pagination :current="1" :pages="6" :displayPageCount="7" />
						<Pagination :current="1" :pages="10" :displayPageCount="7" />
					</div>
				</AccordionItem>
				<AccordionItem title="让你的前端设计师气到脑中风">
					<section class="marquee-section">
						<marquee>KiRAKiRA☆DOUGA</marquee>
						<marquee direction="up">让你的前端设计师气到脑中风</marquee>
						<marquee direction="down" width="250" height="200" behavior="alternate" class="marquee">
							<marquee behavior="alternate">DVD</marquee>
						</marquee>
					</section>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.component-test > :deep(*) {
		margin: 0.8rem 0.5rem;
	}

	.marquee {
		font-size: 3rem;
		font-style: italic;
		border: red solid;
	}

	.marquee-section {
		color: red;
		font-weight: 900;

		> :not(.marquee) {
			font-family: "Comic Sans MS", "华文彩云", fantasy;
		}
	}

	em {
		display: block;
	}

	.toast-test {
		> * {
			margin: 0.8rem 0;
		}

		> section {
			@include flex-center;
			gap: 10px;

			> button {
				flex-shrink: 0;
			}

			> .text-box {
				width: 100%;
			}
		}
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 400px;

		> * {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	}

	.test-button :deep(*) {
		text-align: left;
	}

	.scroll-test {
		width: 100%;
		height: 500px;
		overflow: overlay;

		.scroll-test-item {
			@include square(200%);
		}
	}

	.tooltip-test {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		padding: 1rem 0;
	}

	.pagination-test {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.capsule-range-container {
		@include round-large;
		max-width: 400px;
		padding: 1rem;
		background-color: black;
	}

	.flyout-bg {
		@include dropdown-flyouts;
		@include round-large;
		@include set-max-size;
		@include acrylic-background;
		padding: 0.75rem 1rem;
	}
</style>
