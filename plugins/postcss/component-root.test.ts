/* eslint-disable no-console */
import postcss from "postcss";
import plugin from "./component-root";

postcss().use(plugin()).process(`
foo .bar:comp:hover > .demo,
foo.bar:comp:hover > .demo {
	color: #fff;
	font-size: 14px; /* this is a comment */
}

section :comp > div + :comp {
	color: red;
}
`, {
	from: "style/TextBox.module.scss",
}).then(result => {
	console.log(result.css);
});
