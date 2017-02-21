/**
 * Created by Administrator on 2017-01-07.
 */
$(function(){
    $("#room").css("height",$(window).height());
    $("#userList .panel-body").css("height",$(window).height()-120);
    $("#messages").css("height",$(window).height()-140);

    var socket=io();
    var num=0;//记录在线人数
    var curCid=null;
    var curNk=null;
    var curSex=null;
    var selUser=null;

    socket.on("getCustList",function(data){
        num=data.length;
        $("span.num").html(num);//更新在线用户数
        for(var i=0;i<data.length;i++){
            //新用户昵称显示在用户列表
            $("#userList").find("div.panel-body").append("<div data-cid='"+data[i].cid+"'><img src='"+data[i].headImg+"' /><span>"+data[i].nk+"</span></div>");
        };
        curCid=data[data.length-1].cid;//用户ID
        curNk=data[data.length-1].nk;//用户昵称
        curSex=data[data.length-1].sex;//用户性别
        $("#messages").append("<div class='bg-danger'>" + curNk+curSex+"进入房间</div>");
        $("#userList").find("div.panel-body").scrollTop($("#userList").find("div.panel-body").prop("scrollHeight"));
    });

    socket.on("message",function(data){
        var type=data.type;//事件类型
        switch(type){
            case "进入":
                num++;
                $("span.num").html(num);//更新在线用户数
                $("#userList").find("div.panel-body").append("<div data-cid='"+data.cid+"'><img src='"+data.headImg+"' /><span>"+data.nk+"</span></div>");
                $("#userList").find("div.panel-body").scrollTop($("#userList").find("div.panel-body").prop("scrollHeight"));
                $("#messages").append("<div class='bg-danger'>" + data.nk+data.sex+"进入房间</div>");
                $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                break;
            case "消息":
                if(data.chatType=="全屏"){
                    $("#messages").append("<div>" + data.msg + "</div>");
                }else{
                    if(data.selUser==curNk){
                        $("#messages").append("<div class='red'>" + data.msg + "</div>");
                    };
                };
                $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                break;
            case "离开":
                num--;
                $("span.num").html(num);//更新在线用户数
                $("#userList").find("div.panel-body").find("div[data-cid="+data.cid+"]").remove();
                $("#messages").append("<div class='bg-danger'>" + data.nk+data.sex+"离开房间</div>");
                $("#messages").scrollTop($("#messages").prop("scrollHeight"));
                break;
        };
    });

    //点击发送按钮
    $(".btn").on("click",function(){
        var msg=$("#msg").val();//输入文本内容
        var chatType=$("select").val();//聊天模式（全屏 私聊）
        var content="";
        var flag=false;
        //发送消息，进行验证
        if(msg==""){
            $("#sendError").html("不能发空消息");
            return false;
        }else if(chatType=="私聊" && $("#userList").find("div.panel-body").find("span.bg-primary").length==0){
            $("#sendError").html("请指定一个用户私聊");
            return false;
        };

        $("#sendError").html("");
        //判断是否指定用户发送消息
        if(selUser){
            if(chatType=="全屏"){
                content=curNk+"对"+selUser+"说：";
            }else{
                content=curNk+"悄悄地对"+"你说：";
            };
        }else{
            content=curNk+"说：";
        };
        var data={
            type:"消息",
            cid:curCid,
            nk:curNk,
            sex:curSex,
            msg:content+msg,
            chatType:chatType,
            selUser:selUser
        };
        socket.send(data);
        if(selUser){
            if(data.chatType=="全屏"){
                content="我对"+selUser+"说：";
            }else{
                content="我悄悄地对"+selUser+"说：";
                flag=true;
            };
        }else{
            content="我说：";
        };
        if(flag){
            $("#messages").append("<div class='red'>" +content+msg + "</div>");
        }else{
            $("#messages").append("<div>" +content+msg + "</div>");
        };
        $("#messages").scrollTop($("#messages").prop("scrollHeight"));
        $("#msg").val(null);
    });

    //回车
    $("#msg").on("keyup",function(e){
        if(e.keyCode==13){
            $(".btn").click();
        };
    });

    //选择要对话的用户
    $("#userList").find("div.panel-body")
        .on("click","div",function(e){
            e.stopPropagation();
            $(this).find("span").addClass("bg-primary").parent().siblings("div").find("span").removeClass("bg-primary");
            selUser=$(this).find("span").html();
        })
        .on("dblclick","div",function(e){//双击解除绑定
            e.stopPropagation();
            $(this).find("span").removeClass("bg-primary");
            selUser=null;
        });
});