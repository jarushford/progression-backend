// const Server = require('./server');
const path = require('path');
const express = require('express');
const cors = require('express-cors');
var bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const progressionusers = require('./routes/usersApi');
const environment = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}


app.use(express.static('app'));

app.use('/api', progressionusers);

app.listen(port);

console.log(`Listening at http://localhost:${port}`);
