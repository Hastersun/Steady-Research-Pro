/**
 * Tailwind 配置，扩展以支持 HyperUI 组件集常用的插件与配色。
 * HyperUI 本身是基于原生 Tailwind 原子类的组件集合，
 * 这里主要确保相关插件（forms / typography / aspect-ratio / line-clamp）可用。
 */
const plugin = require('tailwindcss/plugin')

module.exports = {
	content: [
		'./src/pages/**/*.{astro,html,js,ts,jsx,tsx}',
		'./src/components/**/*.{astro,html,js,ts,jsx,tsx}',
		'./src/layouts/**/*.{astro,html,js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				brand: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
				},
			},
			boxShadow: {
				soft: '0 2px 4px -2px rgba(0,0,0,0.08), 0 4px 10px -2px rgba(0,0,0,0.06)',
			},
			opacity: {
				15: '.15',
			},
			keyframes: {
				fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
				slideUp: { '0%': { transform: 'translateY(12px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
				scaleIn: { '0%': { transform: 'scale(.95)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
				shimmer: { '100%': { transform: 'translateX(100%)' } },
			},
			animation: {
				'fade-in': 'fadeIn .5s ease forwards',
				'slide-up': 'slideUp .55s cubic-bezier(.4,.6,.3,1) forwards',
				'scale-in': 'scaleIn .45s ease-out forwards',
				'shimmer': 'shimmer 1.2s ease-in-out infinite',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		// 自定义 utilities：滚动条与动画简化
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
				},
				'.scrollbar-hide::-webkit-scrollbar': {
					display: 'none',
				},
			})
		}),
	],
}
