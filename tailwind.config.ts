import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				midnight: {
					50: "#EDEDED",
					100: "#DBDBDB",
					200: "#BABABA",
					300: "#969696",
					400: "#757575",
					500: "#535051",
					600: "#322A2A",
					700: "#0F0A0A",
					800: "#080707",
					900: "#050505",
					950: "#030303",
				},
				twilight: {
					50: "#E0E1FF",
					100: "#C7CEFF",
					200: "#8EA9FB",
					300: "#6195F0",
					400: "#3989DF",
					500: "#287CB3",
					600: "#24657F",
					700: "#1C4750",
					800: "#0F2021",
					900: "#071113",
					950: "#020608",
				},
				dusk: {
					50: "#E8E7F4",
					100: "#CDD0E9",
					200: "#95A6D5",
					300: "#5D8AC6",
					400: "#3679A5",
					500: "#215C6E",
					600: "#0F3538",
					700: "#0C2127",
					800: "#09141B",
					900: "#04070B",
					950: "#030407",
				},
				cloud: {
					50: "#ECF2F9",
					100: "#D7E5EF",
					200: "#B2CEDC",
					300: "#8FB9C7",
					400: "#6FA4AE",
					500: "#578A8E",
					600: "#496767",
					700: "#325052",
					800: "#1F3337",
					900: "#0F1B1F",
					950: "#060B0E",
				},
				fog: {
					50: "#F4F4F6",
					100: "#E8E9ED",
					200: "#CED3D9",
					300: "#B8C2C7",
					400: "#9EB1B3",
					500: "#87A19E",
					600: "#678183",
					700: "#4E5D64",
					800: "#343A42",
					900: "#1B1D22",
					950: "#0D0E11",
				},
				radiance: {
					50: "#F9EBEB",
					100: "#F6D7D5",
					200: "#F2B2A6",
					300: "#F19174",
					400: "#F4783E",
					500: "#FF6600",
					600: "#C1450B",
					700: "#8B2B0E",
					800: "#59190D",
					900: "#2A0B09",
					950: "#140606",
				},
				warmth: {
					50: "#FFF4E5",
					100: "#FFE9CC",
					200: "#FFD399",
					300: "#FFBD66",
					400: "#FFA733",
					500: "#FF9200",
					600: "#CC7400",
					700: "#995700",
					800: "#663A00",
					900: "#331D00",
					950: "#190E00",
				},
				shine: {
					50: "#FFFFD6",
					100: "#FFF8A8",
					200: "#FFE357",
					300: "#FFBE00",
					400: "#DBB700",
					500: "#B8A800",
					600: "#949400",
					700: "#626B00",
					800: "#3C4700",
					900: "#1B2400",
					950: "#0E1400",
				},
				gleam: {
					50: "#FAF7E5",
					100: "#F8EFC9",
					200: "#F8E08E",
					300: "#ECD26A",
					400: "#DEC544",
					500: "#C7B22E",
					600: "#958A2D",
					700: "#6A662A",
					800: "#403F21",
					900: "#1F1F14",
					950: "#0E0E0C",
				},
				bright: {
					50: "#FCFCF8",
					100: "#FAFAF0",
					200: "#E5E8CA",
					300: "#CDD4AB",
					400: "#AEB98D",
					500: "#8D9975",
					600: "#6F7368",
					700: "#525252",
					800: "#363636",
					900: "#1C1C1C",
					950: "#0D0D0D",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
				display: ["Atkinson Hyperlegible", ...fontFamily.sans],
				block: ["Humane", ...fontFamily.sans],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
