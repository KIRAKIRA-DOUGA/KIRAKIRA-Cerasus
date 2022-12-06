export function getPath(target: unknown): Element[] {
	if (!(target instanceof Element)) return [];
	const path: Element[] = [];
	while (target instanceof Element) {
		path.push(target);
		target = target.parentElement;
	}
	return path;
}
