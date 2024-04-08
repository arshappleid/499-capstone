/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./src/Components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				futura: ['Lato', 'sans-serif'],
			},
			colors: {
				customBlue: '#094872',
			},
		},
	},
	plugins: [],
};
