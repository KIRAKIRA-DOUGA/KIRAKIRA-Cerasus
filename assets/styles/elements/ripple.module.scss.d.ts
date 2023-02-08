export type Styles = {
	focusAlways: string;
	isFading: string;
	rippleButton: string;
	rippleCircle: string;
	rippleLighter: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
