import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import houdini from 'houdini/preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
		houdini()
	],

	kit: {
		adapter: adapter(),
		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		alias: {
			$graphql: 'src/graphql',
			$houdini: '$houdini'
		},
		vite: {
			server: {
				fs: {
					allow: ['.']
				}
			}
		}
	}
};

export default config;
