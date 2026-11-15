// Run with: node --test tests/content-management.test.mjs
// Exercise the actual Vue setup handlers with in-memory state and API stubs.
// These are isolated regression tests, not browser or live-backend tests.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load selected Vue setup handlers with explicit mocked bindings.
 * @param relativePath - Component path relative to the repository.
 * @param names - Setup declarations to exercise.
 * @param bindings - Dependencies provided to those declarations.
 * @returns The executable setup declarations.
 */
function loadHandlers(relativePath, names, bindings) {
	const source = fs.readFileSync(path.resolve(testDirectory, "..", relativePath), "utf8");
	const script = source.match(/<script setup[^>]*>([\s\S]*?)<\/script>/)[1];
	const sourceFile = ts.createSourceFile(relativePath, script, ts.ScriptTarget.Latest, true);
	const nodes = sourceFile.statements.filter((node) => {
		if (ts.isFunctionDeclaration(node)) return names.includes(node.name.text);
		return ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => names.includes(declaration.name.getText(sourceFile)));
	});
	assert.equal(nodes.length, names.length, "Every selected setup handler must exist");
	const printer = ts.createPrinter();
	const selected = nodes.map(node => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)).join("\n");
	const compiled = ts.transpileModule(selected, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
	}).outputText;
	const context = { ...bindings, console: { info() {}, error() {} } };
	vm.runInNewContext(compiled + "\nglobalThis.handlers = {" + names.join(",") + "};", context);
	return context.handlers;
}

/**
 * Prepare an upload or edit handler without making network requests.
 * @param action - Submission handler name.
 * @param response - Result or exception returned by the fake API.
 * @returns Mutable state and the submission handler.
 */
function setupSubmission(action, response) {
	const state = { requests: [], messages: [], navigations: [], confetti: 0 };
	const bindings = {
		props: action === "editVideo" ? { isEditing: true, kvid: 1 } : { isEditing: false, files: [{ name: "video.webm" }] },
		cloudflareVideoId: { value: "uploaded" },
		descriptionEditor: { value: { validate: () => true } },
		isNetworkImage: { value: false }, BASE_THUMBNAIL_ID: "cover", tags: new Map(),
		isCommitButtonLoading: { value: false },
		useSelfUserInfoStore: () => ({ userInfo: { uid: 7 } }),
		getCloudflareMpdVideoUrl: () => "https://example.com/video.mpd",
		api: { video: { [action]: async (request) => {
			state.requests.push(request);
			if (response instanceof Error) throw response;
			return response;
		} } },
		useToast: message => state.messages.push(message), t: key => key,
		delay: async () => assert.equal(bindings.isCommitButtonLoading.value, true),
		navigate: async url => state.navigations.push(url),
		showConfetti: () => state.confetti++,
	};
	for (const name of ["title", "description", "category", "thumbnailUrl", "copyright", "originalAuthor", "originalLink"])
		bindings[name] = { value: "example" };
	for (const name of ["pushToFeed", "ensureOriginal"])
		bindings[name] = { value: false };
	return { bindings, state, run: loadHandlers("components/UploadEditor.vue", [action], bindings)[action] };
}

for (const action of ["editVideo", "commitVideo"]) {
	for (const [scenario, response] of [
		["business failure", { success: false }],
		["network error", new Error("offline")],
		["missing response", undefined],
		["missing video ID", { success: true }],
	]) {
		test(`${action}: ${scenario} restores the button and shows an error`, async () => {
			const { bindings, state, run } = setupSubmission(action, response);
			await run();
			assert.equal(bindings.isCommitButtonLoading.value, false);
			assert.equal(state.requests.length, 1);
			assert.equal(state.messages.length, 1);
			assert.equal(state.navigations.length, 0);
		});
	}
	test(`${action}: success navigates only once and releases the loading state`, async () => {
		const { bindings, state, run } = setupSubmission(action, { success: true, videoId: 1 });
		await run();
		assert.equal(bindings.isCommitButtonLoading.value, false);
		assert.deepEqual(state.navigations, ["/video/kv1"]);
		assert.equal(state.messages.length, 0);
	});
	test(`${action}: an in-flight submission cannot be duplicated`, async () => {
		const { bindings, state, run } = setupSubmission(action, { success: true, videoId: 1 });
		bindings.isCommitButtonLoading.value = true;
		await run();
		assert.equal(state.requests.length, 0);
	});
}

/**
 * Prepare the card's deletion handler with an in-memory API.
 * @param response - Result or exception returned by the fake API.
 * @returns Mutable state and the deletion handler.
 */
function setupDeletion(response) {
	const state = { requests: [], emitted: [], messages: [] };
	const bindings = {
		props: { videoId: 1 }, isDeleting: { value: false }, flyoutDeleteConfirm: { value: "anchor" },
		api: { video: { deleteSelfVideo: async (request) => {
			state.requests.push(request);
			if (response instanceof Error) throw response;
			return response;
		} } },
		emits: (...args) => state.emitted.push(args),
		useToast: message => state.messages.push(message), t: key => key,
	};
	return { state, bindings, run: loadHandlers("components/ContentsManagementVideoCard.vue", ["deleteVideo"], bindings).deleteVideo };
}

test("successful deletion closes the dialog and notifies the list", async () => {
	const { state, bindings, run } = setupDeletion({ success: true });
	await run();
	assert.deepEqual(state.emitted, [["deleted", 1]]);
	assert.equal(bindings.flyoutDeleteConfirm.value, undefined);
	assert.equal(bindings.isDeleting.value, false);
	assert.equal(state.requests[0].videoId, 1);
});

for (const [scenario, response] of [["business failure", { success: false }], ["network error", new Error("offline")]]) {
	test(`deletion ${scenario} keeps the card and allows retry`, async () => {
		const { state, bindings, run } = setupDeletion(response);
		await run();
		assert.equal(state.emitted.length, 0);
		assert.equal(bindings.flyoutDeleteConfirm.value, "anchor");
		assert.equal(bindings.isDeleting.value, false);
		assert.equal(state.messages.length, 1);
		await run();
		assert.equal(state.requests.length, 2);
	});
}

test("an in-flight deletion cannot be duplicated", async () => {
	const { state, bindings, run } = setupDeletion({ success: true });
	bindings.isDeleting.value = true;
	await run();
	assert.equal(state.requests.length, 0);
});

/**
 * Prepare list loading and statistics without fetching real videos.
 * @param getVideos - In-memory video listing function.
 * @returns Mutable state and the list handlers.
 */
function setupList(getVideos = async () => ({ success: true, videosCount: 0, videos: [] })) {
	const bindings = {
		videos: { value: undefined },
		computed: getter => ({ get value() { return getter(); } }),
		selfUserInfoStore: { isLoggedIn: true, userInfo: { uid: 7 } },
		api: { video: { getVideoByUid: getVideos } },
	};
	const handlers = loadHandlers("pages/contents-management/upload.vue", ["videoRequestId", "totalViewCount", "fetchUserVideoData", "removeVideo"], bindings);
	return { bindings, handlers };
}

test("list statistics use actual data and update after deletion, including zero", () => {
	const { bindings, handlers } = setupList();
	assert.equal(handlers.totalViewCount.value, undefined);
	bindings.videos.value = { success: true, videosCount: 2, videos: [{ videoId: 1, watchedCount: 120 }, { videoId: 2, watchedCount: 0 }] };
	assert.equal(handlers.totalViewCount.value, 120);
	handlers.removeVideo(1);
	assert.equal(bindings.videos.value.videosCount, 1);
	assert.equal(handlers.totalViewCount.value, 0);
	handlers.removeVideo(1);
	assert.equal(bindings.videos.value.videosCount, 1);
	handlers.removeVideo(2);
	assert.equal(bindings.videos.value.videosCount, 0);
});

test("late list responses cannot replace a different user's videos", async () => {
	const pending = [];
	const { bindings, handlers } = setupList(() => new Promise(resolve => pending.push(resolve)));
	const first = handlers.fetchUserVideoData();
	bindings.selfUserInfoStore.userInfo.uid = 8;
	const second = handlers.fetchUserVideoData();
	pending[1]({ success: true, videosCount: 1, videos: [{ videoId: 2 }] });
	await second;
	pending[0]({ success: true, videosCount: 1, videos: [{ videoId: 1 }] });
	await first;
	assert.equal(bindings.videos.value.videos[0].videoId, 2);
});

test("failed list requests do not display a fabricated zero total", async () => {
	const { bindings, handlers } = setupList(async () => ({ success: false, message: "offline", videosCount: 0, videos: [] }));
	await handlers.fetchUserVideoData();
	assert.equal(bindings.videos.value, undefined);
	assert.equal(handlers.totalViewCount.value, undefined);
});

test("card displays known zero views and omits unavailable counts; list has no mock metrics", () => {
	const card = fs.readFileSync(path.resolve(testDirectory, "../components/ContentsManagementVideoCard.vue"), "utf8");
	const viewCondition = card.match(/v-if="([^"]+)" icon="play"/)[1];
	assert.equal(vm.runInNewContext(viewCondition, { viewCount: 0 }), true);
	assert.equal(vm.runInNewContext(viewCondition, { viewCount: undefined }), false);
	assert.match(card, /<DateTime :dateTime="date \?\? null" showTime/);
	const list = fs.readFileSync(path.resolve(testDirectory, "../pages/contents-management/upload.vue"), "utf8");
	assert.doesNotMatch(list, /:(upvoteCount|downvoteCount|commentCount|danmakuCount|collectCount)="\d/);
	assert.doesNotMatch(card, /2333\/33\/33/);
});
