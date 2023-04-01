import postcss from "postcss";
import plugin from "./component-root";

postcss().use(plugin()).process(`
:component > .demo {
	color: #fff;
	font-size: 14px; /* this is a comment */
}`, {
	from: "css/test.css",
}).then(result => {
	console.log(result.css);
});
