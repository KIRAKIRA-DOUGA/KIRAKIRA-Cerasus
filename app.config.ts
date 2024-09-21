export default defineAppConfig({
	version: {
		branch: process.env.VERCEL_GIT_COMMIT_REF,
		commit: process.env.VERCEL_GIT_COMMIT_SHA,
	}
});
