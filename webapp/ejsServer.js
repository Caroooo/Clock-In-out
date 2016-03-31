/**
 * Created by Caroline on 31.03.2016.
 */

var express = require("express");
var path = require("path");

var app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use("/css", express.static(__dirname + '/css'));
app.use(express.static(__dirname + '../'));
//app.use("../", express.static(__dirname + '../'));
//app.use("/controller", express.static(__dirname + '/controller'));


app.get("/", function(req, res){
    res.render("index");
});

app.listen(8080, function(){
    console.log("ready...")
});