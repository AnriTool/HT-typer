import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	root: 'src',
	server: {
		port: 3000,
		open: true // Автоматически открывать браузер
	},
	base: './',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		sourcemap: true,
		assetsInlineLimit: 4096 * 10,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src:'assets/chars/*',
					dest:'assets/chars/'
				},
				{
					src:'assets/audio/*',
					dest:'assets/audio/'
				}
			]
		})
	]
})