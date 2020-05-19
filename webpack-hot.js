const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const compiler = webpack(webpackConfig);

const devServer = new WebpackDevServer(compiler, {
  contentBase: '/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  quiet: true,
  noInfo: false,
  lazy: false,
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false,
  },
  watchOptions: {
    poll: true
  },
});

devServer.listen(port, host, err => {
  if (err) {
    console.error(err);
  }
  console.log(`=> \u{1f525} webpack dev server running on port ${port}`);
});
