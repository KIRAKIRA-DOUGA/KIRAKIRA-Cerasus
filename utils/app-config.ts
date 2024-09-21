import { useStorage, type RemovableRef } from "@vueuse/core"; // 根据说明文档必须显式引入 useStorage，以和 nitro 同名变量让位。
import { defaults } from "../app.configs";

type AppConfigDefault = typeof defaults;
type Keys = keyof AppConfigDefault;

const appConfig = reactive({}) as {
	[key in Keys]: RemovableRef<AppConfigDefault[key]>;
};

for (const [key, def] of entries(defaults))
	appConfig[key] = useStorage(key, def) as RemovableRef<never>;

// export { appConfig };
