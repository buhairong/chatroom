/**
 * Created by Administrator on 2017-01-07.
 */

var socketIO=require("socket.io");

module.exports=function(httpServer){
    var socketServer=socketIO.listen(httpServer);
    var datas=[];
    socketServer.on("connect",function(socket){
        socket.emit("getCustList",datas);
        if(datas.length>0){
            socket.cid=datas[datas.length-1].cid;
            socket.nk=datas[datas.length-1].nk;
            socket.sex=datas[datas.length-1].sex;
        };
        socket.on("message",function(data){
            var type=data.type;
            switch(type){
                //新用户进入
                case "进入":
                    datas.push(data);
                    newUser(socket,data);
                    break;
                //用户发送消息
                case "消息":
                    sendMsg(socket,data);
                    break;
            };
        });

        socket.on("disconnect",function(){
            userLeave(socket);
        });
    });

    //新用户进入
    function newUser(socket,data){

        //广播
        socket.broadcast.send(data);
    };

    //用户发送消息
    function sendMsg(socket,data){
        //广播
        socket.broadcast.send(data);
    };

    //用户离开
    function userLeave(socket){
        for(var i=0;i<datas.length;i++){
            if(datas[i].cid==socket.cid){
                datas.splice(i,1);
            };
        };
        var data={
            type:"离开",
            cid:socket.cid,
            nk:socket.nk,
            sex:socket.sex
        };
        socket.broadcast.send(data);
    };
};