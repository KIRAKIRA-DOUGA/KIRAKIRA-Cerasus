import postcss from "postcss";
import plugin from "./component-root";

postcss().use(plugin()).process(`
foo .bar:component:hover > .demo,
foo.bar:component:hover > .demo {
	color: #fff;
	font-size: 14px; /* this is a comment */
}`, {
	from: "style/TextBox.module.scss",
}).then(result => {
	console.log(result.css);
});
