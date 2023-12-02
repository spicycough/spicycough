module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:astro/recommended",
		"plugin:astro/jsx-a11y-strict",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/recommended",
		-"plugin:drizzle/recommended",
	],
	ignorePatterns: ["node_modules", "dist"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier", "drizzle", "astro"],
	project: "./tsconfig.json",
	rules: {
		"@typescript-eslint/no-var-requires": "warn",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ varsIgnorePattern: "Props", ignoreRestSiblings: true },
		],
	},
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
			},
			rules: {
				"prettier/prettier": "off",
				"astro/no-set-html-directive": "error",
				"astro/jsx-a11y/no-redundant-roles": [
					"error",
					{
						ul: ["list"],
					},
				],
			},
		},
	],
};
