const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public')
    }
  },
  devtool: 'inline-source-map',
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public/index.html'),
    base: '/regl-starter',
    publicPath: '/regl-starter'
  })],
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }
    ]
  }
}
