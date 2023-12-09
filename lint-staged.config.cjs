module.exports = {
	"*.{js,jsx,ts,tsx,astro}": ["pnpm run lint"],
	"**/*.ts?(x)": () => "pnpm run types:check",
	"*.json": ["prettier --write"],
};
