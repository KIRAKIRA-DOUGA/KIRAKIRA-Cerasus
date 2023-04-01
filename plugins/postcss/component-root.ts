import path from "path";
import { AcceptedPlugin } from "postcss";
import { VariableName } from "../../classes/VariableName";

type PostCSSPlugin = { postcss: true } & ((opts?: Object) => AcceptedPlugin);
const componentPseudo = /:comp(onent)?(?![A-Za-z0-9\-_])/g;

const componentRoot: PostCSSPlugin = (_opts = {}) => {
	return {
		postcssPlugin: "postcss-component-root",
		/* Declaration(declaration, helper) {
			if (declaration.value === "#ffffff")
				declaration.value = "white";
		},
		Comment(comment) {
			comment.text = "";
		}, */
		Rule(rule, _helper) {
			if (rule.selector.match(componentPseudo)) {
				const filePath = rule.source?.input.file;
				if (!filePath) return;
				let fileName: string | undefined = path.parse(filePath).name;
				if (fileName.includes("vue&type=style")) {
					// 若为 Vue 组件名，例如：TextBox.vue?vue&type=style&index=0&scoped=bf5e516a&lang.scss
					fileName = fileName.match(/\w+(?=\.vue)/i)?.[0];
					if (!fileName) return;
				}
				const componentName = new VariableName(fileName).kebab;
				rule.selector = rule.selector.replace(componentPseudo, "kira-component." + componentName);
			}
		},
	};
};
componentRoot.postcss = true;

export default componentRoot;
