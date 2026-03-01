<script lang="ts">
	const voices = environment.client ? speechSynthesis.getVoices() : [];
	const onlineVoices = voices.filter(voice => !voice.localService);
	const availableOnlineLanguages = new Set(onlineVoices.map(voice => voice.lang));
	const availableLanguages = new Set(voices.map(voice => voice.lang));

	const k1b0d: [text: string, lang: string][] = [
		["铝合金键盘", "zh-CN"],
		["鋁合金鍵盤", "zh-TW"],
		["鋁合金鍵盤", "zh-HK"],
		["lyu her jean jane pan", "en-US"],
		["lue her jean jane pan", "en-GB"],
		["lyu her jean jane pan", "en-IN"],
		["lue her jin jane pan", "fr-FR"],
		["lü hear jin jane pan", "de-DE"],
		["li hea jean jane pan", "id-ID"],
		["li her jean jane pan", "it-IT"],
		["li hie gin jane pan", "pl-PL"],
		["li hi jin jane pan", "es-ES"],
		["li her jin jan pam", "pt-BR"],
		["li her gin jane pan", "nl-NL"],
		["лы хе жин жян пан", "ru-RU"],
		["リューホージンージャンーパンー", "ja-JP"],
		["뤼허진쟌판", "ko-KR"],
		["lữ hợp kim kiện bàn", "vi-VN"],
	];

	const getSlotText = (slots: { default: Slot }) => slots.default?.()[0].children?.toString();
</script>

<script setup lang="ts">
	const isApple = getPlatform() === "Apple", isLinux = getPlatform() === "Linux";
	const Ctrl = computed(() => isApple ? "⌘" : isLinux ? "Control" : "Ctrl");
	const Esc = computed(() => isApple ? "esc" : "Esc");
	const Shift = computed(() => isApple ? "⇧" : "Shift");
	const Enter = computed(() => isApple ? "⏎" : "Enter");
	const [DefineKbd, Kbd] = createReusableTemplate();
	const [DefineH, H] = createReusableTemplate();
	const [DefineP, P] = createReusableTemplate();
	const lang = computed(() => {
		const lang = new Intl.Locale(getCurrentLocaleLangCode(undefined, true)).maximize();
		return `${lang.language}-${lang.region}`;
	});

	/**
	 * 朗读文本。
	 * @param text - 要大声朗读的文本。
	 * @param voiceLanguage - 要使用的语言的语言代码。默认为 `undefined`。
	 * - `Intl.UnicodeBCP47LocaleIdentifier`: 使用该语言的任意语音朗读文本，优先在线语音。
	 * - `undefined`: 使用网页当前语言的任意语音朗读文本，优先在线语音。
	 * - `null`: 使用本地默认语音朗读文本。
	 */
	function speak(text?: string, voiceLanguage?: Intl.UnicodeBCP47LocaleIdentifier | undefined | null) {
		speechSynthesis.cancel();
		if (!text) return;
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = (() => {
			if (voiceLanguage === null || onlineVoices.length === 0)
				return voices.find(voice => voice.default) ?? voices[0] ?? null;
			if (voiceLanguage === undefined) voiceLanguage = lang.value;
			let currentLanguageVoices: SpeechSynthesisVoice[];
			if (availableOnlineLanguages.has(voiceLanguage)) currentLanguageVoices = onlineVoices.filter(voice => voice.lang === voiceLanguage);
			else if (availableLanguages.has(voiceLanguage)) currentLanguageVoices = voices.filter(voice => voice.lang === voiceLanguage);
			else return null;
			return randomOne(currentLanguageVoices);
		})();
		if (!utterance.voice) return;
		speechSynthesis.speak(utterance);
	}

	function speakRandomK1b0d() {
		for (const langSet of [availableOnlineLanguages, availableLanguages]) {
			const all = k1b0d.slice();
			while (all.length > 0) {
				const item = randomOne(all);
				arrayRemoveItem(all, item);
				if (langSet.has(item[1])) {
					speak(...item);
					return;
				}
			}
		}
	}

	useEventListener("window", "keydown", e => {
		speak(e.key.match(/[^0-9a-z]/i) ? e.code : e.key, null);
	});
</script>

<template>
	<div>
		<DefineKbd v-slot="{ $slots }">
			<kbd @click="speakRandomK1b0d()">
				<component :is="$slots.default" />
			</kbd>
		</DefineKbd>

		<DefineH v-slot="{ $slots }">
			<h3 @click="speak(getSlotText($slots))">
				<component :is="$slots.default" />
			</h3>
		</DefineH>

		<DefineP v-slot="{ $slots }">
			<p @click="speak(getSlotText($slots))">
				<component :is="$slots.default" />
			</p>
		</DefineP>

		<Subheader icon="keyboard">{{ $t("guide") }}</Subheader>
		<div class="table">
			<!-- #region 播放页 -->
			<H>{{ $t("shortcut_key.player_page") }}</H>

			<P>{{ $t("shortcut_key.play_pause") }}</P>
			<p><Kbd>␣</Kbd></p>

			<P>{{ $t("shortcut_key.exit_fullscreen") }}</P>
			<p><Kbd>{{ Esc }}</Kbd></p>

			<P>{{ $t("shortcut_key.fullscreen") }}</P>
			<p><Kbd>F</Kbd> <Kbd>F11</Kbd></p>

			<P>{{ $t("danmaku.title") }}</P>
			<p><Kbd>D</Kbd></p>

			<P>{{ $t("shortcut_key.mute") }}</P>
			<p><Kbd>M</Kbd></p>

			<P>{{ $t("shortcut_key.volume") }}</P>
			<p><Kbd>↑</Kbd> <Kbd>↓</Kbd></p>

			<P>{{ $t("shortcut_key.fast_rewind") }} / {{ $t("shortcut_key.fast_forward") }}</P>
			<p><Kbd>←</Kbd> <Kbd>→</Kbd></p>

			<P>{{ $t("shortcut_key.slow_down") }} / {{ $t("shortcut_key.speed_up") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>←</Kbd> <Kbd>→</Kbd></p>
			<!-- #endregion -->

			<!-- #region 分页器 -->
			<H>{{ $t("shortcut_key.pagination") }}</H>

			<P>{{ $t("shortcut_key.page_turning") }}</P>
			<p><Kbd>←</Kbd> <Kbd>→</Kbd></p>
			<!-- #endregion -->

			<!-- #region 评论区 -->
			<H>{{ $t("shortcut_key.comment_area") }}</H>

			<P>{{ $t("format.bold") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>B</Kbd></p>

			<P>{{ $t("format.italic") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>I</Kbd></p>

			<P>{{ $t("format.underline") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>U</Kbd></p>

			<P>{{ $t("format.strikethrough") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>{{ Shift }}</Kbd> + <Kbd>X</Kbd></p>

			<P>{{ $t("shortcut_key.quick_insert_kaomoji") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>M</Kbd></p>

			<P>{{ $t("send") }}</P>
			<p><Kbd>{{ Ctrl }}</Kbd> + <Kbd>{{ Enter }}</Kbd></p>
			<!-- #endregion -->
		</div>
	</div>
</template>

<style scoped lang="scss">
	h3 {
		color: c(accent);
	}

	.table {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 8px;
		align-items: center;

		h3 {
			grid-column-end: span 2;
			margin: 0.35rem 0 0.25rem;

			&:first-of-type {
				margin-top: 0;
			}
		}

		h3,
		p {
			width: fit-content;
		}
	}
</style>
