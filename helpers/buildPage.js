const buildPage = async ({ fileName, directory }, buildFolder) => {
	const path = require("path");
	const fs = require("fs");
	const parseMarkdown = require("./parseMarkdown");
	const getPageTemplate = require("./getPageTemplate");

	const pageName = fileName
		.split(path.resolve(process.cwd(), "./pages"))[1] // Get the full file name for the markdown file
		.split(".md")[0] // Remove the .md extension;
		.replace("\\", "/"); // Remove opposite slashes from the path

	console.log("Building page: ", pageName);
	const markdownContent = fs.readFileSync(fileName, "utf-8");
	const { html: convertedHTML, title = "" } = parseMarkdown(markdownContent);

	if (directory)
		fs.mkdirSync(`${buildFolder}${directory}`, { recursive: true });

	// Check if there is any template present for this page.
	const template = getPageTemplate(pageName);
	let outputHTML = convertedHTML;
	if (template)
		// Replace the  {{ content }} block with the converted markdown HTML
		outputHTML = template
			.replace("{{ content }}", outputHTML)
			.replace("{{ title }}", title);
	// Minifying HTML output
	const htmlMinifier = require("html-minifier").minify;
	outputHTML = htmlMinifier(outputHTML, minifierConfig);

	fs.writeFileSync(`${buildFolder}/${pageName}.html`, outputHTML);
};

var minifierConfig = {
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	includeAutoGeneratedTags: false,
	minifyCSS: true,
	minifyJS: true,
	minifyURLs: true,
	preventAttributesEscaping: true,
	processConditionalComments: true,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true,
	trimCustomFragments: true,
	useShortDoctype: true,
};

module.exports = buildPage;
