/* eslint-disable no-console */
import postcss from "postcss";
import plugin from "./any-hover";

const run = (rules: string) => new Promise<string>(resolve =>
	postcss().use(plugin()).process(rules).then(result => resolve(result.css)));

const log = (...args: string[]) => {
	const newArgs: string[] = [];
	args.forEach((arg, i) => newArgs.push(...(i ? ["\n", arg] : [arg])));
	console.log(...args);
};

log("works with a single selector",
	await run(`
		.this-is-a-class:hover {

		}
	`),
	/* expect:
		@media (hover: hover) {
			.this-is-a-class:hover {

			}
		}
	*/
	await run(`
		.this-is-a-class:any-hover {

		}
	`),
);

log("works when rule contains CSS declarations",
	await run(`
		.this-is-a-class:hover {
			text-decoration: underline;
		}
	`),
	/* expect:
		@media (hover: hover) {
			.this-is-a-class:hover {
				text-decoration: underline;
			}
		}
	*/
	await run(`
		.this-is-a-class:any-hover {
			text-decoration: underline;
		}
	`),
);

log("works with descendant selectors",
	await run(`
		.s-some-scope p a:any-hover p {

		}
	`),
	/* expect:
		@media (hover: hover) {
			.s-some-scope p a:hover p {

			}
		}
	*/
	await run(`
		.js .link:any-hover .thing {

		}
	`),
	/* expect:
		@media (hover: hover) {
			.js .link:hover .thing {

			}
		}
	*/
);

log("works with multiple selectors",
	await run(`
		.this-is-a-class:any-hover,
		.banana {
			text-decoration: underline;
		}
	`),
	/* expect:
		.banana {

		}

		@media (hover: hover) {
			.this-is-a-class:hover {

			}
		}
	*/
	await run(`
		.this-is-a-class:any-hover,
		.banana:any-hover {
			text-decoration: underline;
		}
	`),
	/* expect:
		@media (hover: hover) {
			.this-is-a-class:hover,
			.banana:hover {

			}
		}
	*/
	await run(`
		.this-is-a-class:any-hover,
		.banana:hover {
			text-decoration: underline;
		}
	`),
);

log("skips rules contained within '@media (hover: hover) {}'",
	await run(`
		@media (hover: hover) {
			.btn:any-hover {

			}
		}
	`),
	/* expect:
		@media (hover: hover) {
			.btn:hover {

			}
		}
	*/
	await run(`
		.p-index {
			@media (any-hover: hover) {
				.btn:any-hover {

				}
			}
		}
	`),
	/* expect:
		.p-index {
			@media (hover: hover) {
				.btn:hover {

				}
			}
		}
	*/
);

log("works with pseudo-class functions that accept selector lists as an argument",
	await run(`
		:is(button, [role="button"]):any-hover {
			background-color: transparent;
		}
	`),
	/* expect:
		@media (hover: hover) {
			:is(button, [role=button]):hover {
				background-color: transparent;
			}
		}
	*/
);

log("ignores :hover pseudo-class selectors within :not pseudo-class selector lists",
	await run(`
		.list__item:not(:any-hover, .is-editing) .show-on-hover {
			visibility: hidden;
		}
	`),
	/* expect:
		.list__item:not(:hover, .is-editing) .show-on-hover {
			visibility: hidden;
		}
	*/
);

log("merge multiple any-hover media into one",
	await run(`
		.foo {
			color: red;
		}
		.foo:any-hover {
			color: green;
		}
		.foo:not(:any-hover) {
			color: blue;
		}
		.bar {
			color: yellow;
		}
		.bar:any-hover {
			color: cyan;
		}
	`),
);
