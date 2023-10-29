import { login, registration, userExistsCheck } from "api/User/UserController";
import { getHomePageThumbVideo, getVideoByKvid } from "api/Video/VideoController";

export default {
	user: {
		login, registration, userExistsCheck,
	},
	video: {
		getHomePageThumbVideo, getVideoByKvid,
	},
};
