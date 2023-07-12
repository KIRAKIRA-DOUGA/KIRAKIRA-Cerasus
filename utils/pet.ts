/* eslint-disable no-new-func */
/* eslint-disable no-eval */
/* eslint-disable require-jsdoc */

type Sex = "male" | "female";

export interface Pet {
	name: string;
	age: number;
	sex: Sex;
	pet: Pet;
	food: string;
	likes: string;
	dislikes: string;
	canIntoSpace: boolean;
	börk: string;
	eat: () => void;
	kill: () => void;
}

const g = globalThis as AnyObject;

const say = eval(eval("([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[+[]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]"));

function create(name: string, birth: Date, sex: Sex, börk: string) {
	return (function () {
		const likes = new Set<string>(), dislikes = new Set<string>();
		let food = "";
		return {
			get name() { return name; },
			get sex() { return sex; },
			set sex(value) { if (value === sex) return; if (!"male,female".split(",").includes(value)) throw new TypeError(value); say("Oh no!"); sex = value; },
			get age() { return (new Date().valueOf() - birth.valueOf()) / 31_536_000_000 | 0; },
			get pet() { return this; },
			get food() { return food; },
			set food(value) { food = value; },
			get likes() { return [...likes].join(", "); },
			set likes(value) { likes.add(value); },
			get dislikes() { return [...dislikes].join(", "); },
			set dislikes(value) { dislikes.add(value); },
			get canIntoSpace() { return false; },
			get börk() { return börk; },
			eat() { say(this.food + "!!!"); },
			kill() {
				say("Successed!");
				delete g[this.name];
				delete g[this.name.toLowerCase()];
			},
		} as Pet;
	})();
}

function mount(a: Pet) {
	const { name } = a;
	const constructor = new Function(`return class ${name} {};`)();
	Object.setPrototypeOf(a, constructor.prototype);
	g[name] = a;
	g[name.toLowerCase()] = a;
}

export function loadEgg() {
	const a = create("Aira", new Date(eval("[!+[]+!+[]]+[+[]]+[+[]]+[!+[]+!+[]+!+[]]+(![]+[+[]])[([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]]+[+!+[]]+[!+[]+!+[]]+(![]+[+[]])[([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]]")), "female", "草");
	a.food = "\u{1f35c}";
	a.likes = "icecream";
	a.dislikes = "pigeon";
	a.food = "yarn";
	mount(a);
}
