const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
var mongoose = require('mongoose');

const routes = require('./routes/routes')

// mongoose setup
mongoose.Promise = require('bluebird');
var dbHost = process.env.DB_HOST || 'localhost';
var dbName = process.env.DB_NAME;
var dbUser = process.env.DB_USERNAME;
var dbPass = process.env.DB_PASSWORD;
var dbPort = process.env.DB_PORT || "27017";
mongoose
  .connect("mongodb://" + dbUser + ":" + dbPass + "@" + dbHost + ":" + dbPort + "/" + dbName, { promiseLibrary: require("bluebird"), useNewUrlParser: true })
  .then(() => console.log("connection succesful"))
  .catch(err => console.error(err));


const app = express()
app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.REACT_APP_SERVER_ENVIORNMENT !== 'dev') {
  app.use(favicon(path.join(__dirname, '/../build/favicon.ico')))
}

app.use(express.static(path.join(__dirname, '/../build')))

app.get("/static/*.js", function(req, res, next) {
  req.url = req.url + ".gz"
  res.set("Content-Encoding", "gzip")
  res.set("Content-Type", "text/javascript")
  next()
})

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
