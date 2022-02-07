const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/web/index.html'
  })],
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          {
            loader: 'glslify-loader'
          }
        ]
      }
    ]
  }
}
