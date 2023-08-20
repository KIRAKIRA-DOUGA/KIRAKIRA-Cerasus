import SChinese from "./SChinese";

export type I18nArgsFunction<R = string> = {
	(...args: Readable[]): R;
	(args: Readable[] | RecordValue<Readable>): R;
};

type IncludesInterpolation<S extends string> = S extends `${string}{${string}` ? S & I18nArgsFunction<S> : S;
type NestLocaleWithDefaultValue<L> = {
	[key in keyof L]:
		L[key] extends string ? IncludesInterpolation<L[key]> :
		L[key] extends { _: infer D } ? NestLocaleWithDefaultValue<L[key]> & I18nArgsFunction<D> :
		NestLocaleWithDefaultValue<L[key]>;
};

export type LocaleWithDefaultValue = NestLocaleWithDefaultValue<typeof SChinese>;
export type LocaleIdentifiers = Record<keyof typeof SChinese, string>;
