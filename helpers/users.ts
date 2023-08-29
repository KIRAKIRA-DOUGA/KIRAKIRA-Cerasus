interface UserInfo {
	username: string;
	memo?: string;
	bio?: string;
	gender: "male" | "female" | (string & {});
	isFollowed: boolean;
	follow: number;
	fans: number;
	watches: number;
	rating: number;
	birthday: Date;
	joinTime: Date;
	uid: bigint;
}

const users = reactive<Record<string | number, UserInfo>>({
	2: {
		username: "艾了个拉",
		memo: "艾拉",
		bio: "Kind and Kawaii, Forever!~",
		gender: "female",
		isFollowed: true,
		follow: 233,
		fans: 233,
		watches: 233,
		rating: 233,
		birthday: new Date("2003-12-24"),
		joinTime: new Date(),
		uid: 2n,
	},
});

export default users;
