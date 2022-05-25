const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
