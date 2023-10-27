export const getCorrectUri = (): string => {
	return environment.production ? "https://rosales.kirakira.moe" : "https://localhost:9999";
};
