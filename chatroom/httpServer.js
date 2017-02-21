/**
 * Created by Administrator on 2017-01-07.
 */

var http=require("http");
var express=require("express");
var app=express();

app.use(express.static("public"));

var httpServer=http.createServer(app);

require("./socketServer")(httpServer);

httpServer.listen(3001,function(){
    console.log("服务器正在运行3001端口...");
});