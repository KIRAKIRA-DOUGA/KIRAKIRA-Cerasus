import SChinese from "./SChinese";

type FunctionPrototypeKeys = "apply" | "bind" | "call" | "toString" | "Symbol";
export type I18nArgsFunction<R = string> = Omit<{
	(...args: Readable[]): R;
	(args: Readable[] | RecordValue<Readable>): R;
}, FunctionPrototypeKeys>;
type UnknownKeyDeclaration = Readonly<Record<string, string & I18nArgsFunction>>;

type IncludesInterpolation<S extends string> = S extends `${string}{${string}` ? S & I18nArgsFunction<S> : S;
type NestLocaleWithDefaultValue<L> = {
	[key in keyof L]:
		L[key] extends string ? IncludesInterpolation<L[key]> :
		L[key] extends { _: infer D } ? D & NestLocaleWithDefaultValue<L[key]> & I18nArgsFunction<D> :
		NestLocaleWithDefaultValue<L[key]>;
} & UnknownKeyDeclaration;
type DiscardConstString<L> = {
	[key in keyof L]: L[key] extends object ? DiscardConstString<L[key]> : string;
};

export type LocaleWithDefaultValue = NestLocaleWithDefaultValue<typeof SChinese>;
export type LocaleIdentifiers = DiscardConstString<typeof SChinese>;
