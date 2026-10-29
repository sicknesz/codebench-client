/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },    
  css: [],
  whitelistPatternsChildren: [/monaco-editor/], // so it handles .monaco-editor .foo .bar
  defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
  
}



export default config
