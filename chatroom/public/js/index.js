/**
 * Created by Administrator on 2017-01-07.
 */

$(function(){
    var clientSocket = io();
    var $loginBox=$("#loginBox");
    var imgNum=127;//头像数量
    var $headImgs=$("div.headImgs");

    //动态添加所有头像
    for(var i=0;i<imgNum;i++){
        $headImgs.append("<img src='../images/qq_images/"+(i+1)+".bmp' data-index='"+(i+1)+"'/>");
    };

    //让登陆框绝对居中
    showCenter($loginBox);

    $headImgs.on("click","img",function(){
        $("span.headImg").empty();
        $("span.headImg").append("<img src='"+$(this).attr("src")+"' />");
    });

    //登陆按钮
    $(".btn").on("click",function(){
        // 生成一个随机客户id，发送给服务器
        var customerId = (Math.ceil(1000 + Math.random() * 100));
        var data={
            cid:customerId,
            type:"进入",
            inputNk:$("#nk").val(),
            nk:"["+customerId+"]"+$("#nk").val(),
            sex:$("input[name='sex']:checked").val(),
            headImg:$("span.headImg").find("img").attr("src")
        };
        if(validLogin(data)){
            $("#nk").val(null);
            $("span.headImg").empty();
            $("span.nkError").empty();
            clientSocket.send(data);
            $(this).parent().attr({
                href:"chatroom.html",
                target:"_blank"
            });
        };
    });

    //登陆验证
    function validLogin(data){
        if(!data.inputNk){
            $("span.nkError").html("请输入昵称");
            return false;
        }else if(!data.headImg){
            $("span.headImg").html("请选择一个头像");
            return false;
        };
        return true;
    };

    //元素绝对居中
    function showCenter(obj){
        function center(){
            obj.css({
                position:"absolute",
                left:($(window).width()-obj.outerWidth())/2,
                top:($(window).height()-obj.outerHeight())/2
            });
        };

        center();
        //浏览器窗口尺寸调整时，依然绝对居中
        window.onresize=function(){
            center();
        };
    };
});

