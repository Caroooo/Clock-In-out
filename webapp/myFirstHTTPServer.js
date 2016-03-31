var dispatcher = require('httpdispatcher');

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
//const PORT=8080;

//We need a function which handll);
//        //Disptaches requests and send response
//function handleRequest(request, response){
//    try {
//        //log the request on console
//        console.log(request.ur
//        dispatcher.dispatch(request, response);
//    } catch(err) {
//        console.log(err);
//    }}
//
////Create a server
//var server = http.createServer(handleRequest);
//
////Lets start our server
//server.listen(PORT, function(){
//    //Callback triggered when server is successfully listening. Hurray!
//    console.log("Server listening on: http://localhost:%s", PORT);
//});

//For all your static (js/css/images/etc.) set the directory name (relative path).
//dispatcher.setStatic('webapp');
//
////A sample GET request
//dispatcher.onGet("/page1", function(req, res) {
//    res.writeHead(200, {'Content-Type': 'text/html'});
//    res.end("<!DOCTYPE html>"
//        + "<html>"
//        + "<head>"
//        + "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>"
//        + "<meta charset=\"UTF-8\">"
//        + "<link rel=\"stylesheet\" href=\"CSS/blum.css\">"
//        + "<title>Blum App</title>"
//        + "<script "
//        + "id=\"sap-ui-bootstrap\" "
//        + "src=\"/resources/sap-ui-core.js\" "
//        + "data-sap-ui-theme=\"sap_bluecrystal\" "
//        + "data-sap-ui-libs=\"sap.m\" "
//        + "data-sap-ui-compatVersion=\"edge\" "
//        + "data-sap-ui-preload=\"async\" "
//        + "data-sap-ui-resourceroots=\"{\"sap.ui.demo.wt\": \"./\"}\">"
//        + "</script>"
//        + "<script>"
//        + "sap.ui.getCore().attachInit(function () {"
//        + "new sap.m.Shell({"
//        + "app:new sap.ui.core.ComponentContainer({"
//        + "name: \"sap.ui.demo.wt\","
//        + "height: \"100%\""
//        + "})"
//        + "}).placeAt(\"content\");"
//        + "});"
//        + "</script>"
//        + "</head>"
//        + "<body class=\"sapUiBody\" id=\"content\">"
//        + "</body>"
//        + "</html>"
//
//    );
//});
//
////A sample POST request
//    dispatcher.onPost("/post1", function (req, res) {
//        res.writeHead(200, {'Content-Type': 'text/plain'});
//        res.end('Got Post Data');
//    });

dispatcher.setStatic('C:/Users/Caroline/Documents/GitHub/Clock-In-out/webapp');
var server = http.createServer(function(request, response){
    console.log("got a request" +request.url);

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write("<!DOCTYPE html>"
        + "<html>"
        + "<head>"
        + "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>"
        + "<meta charset=\"UTF-8\"/>"
        + "<link type=\"text/css\" rel=\"stylesheet\" href=\"/CSS/blum.css\" />"
        + "<title>Blum App</title>"
        + "<script "
        + "id=\"sap-ui-bootstrap\" "
        + "src=\"/resources/sap-ui-core.js\" "
        + "data-sap-ui-theme=\"sap_bluecrystal\" "
        + "data-sap-ui-libs=\"sap.m\" "
        + "data-sap-ui-compatVersion=\"edge\" "
        + "data-sap-ui-preload=\"async\" "
        + "data-sap-ui-resourceroots='{\"sap.ui.demo.wt\": \"./\"}' > "
        + "sap.ui.getCore().attachInit(function () {"
        + "new sap.m.Shell({"
        + "app:new sap.ui.core.ComponentContainer({"
        + "name: \"sap.ui.demo.wt\", "
        + "height: \"100%\" "
        + "})"
        + "}).placeAt(\"content\");"
        + "}); "
        + "</script>"
        + "</head>"
        + "<body class=\"sapUiBody\" id=\"content\">"
        + "</body>"
        + "</html>");
    response.end();
});

server.listen(8080);