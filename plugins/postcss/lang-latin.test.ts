/* eslint-disable no-console */
import postcss from "postcss";
import plugin from "./lang-latin";

postcss().use(plugin()).process(`
foo.bar:lang-latin {
	color: red;
}
`, {
	from: "style/TextBox.module.scss",
}).then(result => {
	console.log(result.css);
});
