interface UserInfo {
	username: string;
	memo?: string;
	signature?: string;
	gender: "male" | "female" | (string & {});
	isFollowed: boolean;
}

const users: Record<string | number, UserInfo> = {
	2: {
		username: "艾了个拉",
		memo: "艾拉",
		signature: "Kind and Kawaii, Forever!~",
		gender: "female",
		isFollowed: true,
	},
};

export default users;
