/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				aldrich: ['Aldrich', 'sans-serif']
			},
			colors: {
				redColor: 'var(--color-doctype)',
				greenColor: 'var(--color-html)',
				blueColor: 'var(--color-head)',
				yellowColor: 'var(--color-body)',
				orangeColor: 'var(--color-footer)',
				whiteColor: 'var(--color-white)',
				blackColor: 'var(--color-black)',
			},
			fontSize: {
				_step2: 'var(--step--2)',
				_step1: 'var(--step--1)',
				step0: 'var(--step-0)',
				step1: 'var(--step-1)',
				step2: 'var(--step-2)',
				step3: 'var(--step-3)',
				step4: 'var(--step-4)',
				step5: 'var(--step-5)',				
			}
		},
	},
	plugins: [],
}
