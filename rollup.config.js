
const babel = require('rollup-plugin-babel')
module.exports = {
  input: './index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    name: 'SDK'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 防止转译第三方模块
    })
  ]
}