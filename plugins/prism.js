import Prism from "prismjs";

// Include a theme:
// import "./prism.css";

import "./prism-toolbar";
import "./prism-language";
import "./prism-filename";
import "./prism-copy";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-highlight/prism-line-highlight";

// Set vue SFC to markdown
Prism.languages.vue = Prism.languages.markup;

export default Prism;
