var express = require("express");
var app = express();
var server = require("http").Server(app);
var path = require("path");
var logger = require("morgan");

var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();


app.set("port", 3000);
app.set("ip", "127.0.0.1");

app.use(logger("dev"));

app.post("/photo", function (req, res) {
	alchemyapi.getFace("")
});

app.get("/temp", function (req, res) {
	//get temp
	//calculate response based on age?
});

server.listen(app.get("port"), function () {
  console.log("Server running at %s:%d", app.get("ip"), app.get("port"));
});

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    console.log({error: err});
    res.send(err);
});

