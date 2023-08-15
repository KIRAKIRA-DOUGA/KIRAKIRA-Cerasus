export default defineEventHandler(event => {
	return getRequestURL(event);
});
