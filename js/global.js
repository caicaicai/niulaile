
function resize(){
    //视频比例
//	if($(window).height()>=600){
//		player_height = player_height + 90;
//	}
    player_height=$('#wrap').width()*9/16;
    $('#wrap,#player').height(player_height);
    if($("#wrap iframe").length>0){
        $('#wrap iframe').height(player_height);
    }
    if($("#playVideo").length>0){
        $('#playVideo').height(player_height);
    }
    var coment_box = WinH - $("#header").outerHeight() - $("#wrap").height() - $("#tabs-h").outerHeight() - $(".live-info").outerHeight()- $("#advs_box").height();
    var talk_box = coment_box -30;
    $("#comment_box").height(coment_box);
    $("#danmu").css({"top":$("#header").outerHeight()+$("#advs_box").height()+$(".live-info").outerHeight()});
    $("#talk").height(talk_box);
    $("#pay_pop").height(player_height);
    $('#code_pop').height(player_height);
    // $('#v_img').height(player_height);
    // $("#pay_pop").height(player_height+$("#header").outerHeight() + $(".live-info").outerHeight());
    // $('#code_pop').height(player_height+$("#header").outerHeight() + $(".live-info").outerHeight());
}
function contains(str, obj) {
    var arr=new Array(); //定义一数组
    arr=str.split(','); //字符分割
    var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;
}

function praise(){
    //------------加速点赞-------
    var old_zan = parseInt($("#praise-num").html());
    var new_zan = old_zan + 1;
    var zan_style = '{$list["zan_style"]}';
    var can_zan = $('#praise-num').attr('data-canZan');
    //-----------end-------------
    var lid=$("#live_id").val();
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');

    // console.log(can_zan);
    if (can_zan != 1) {
        _loading_toast._show('亲，你已经赞过了！');
        return false;
    };

    $("#praise-num").html(new_zan);
    $.ajax({
        type:'POST',
        url:'/app/index.php?i='+i+'&j='+j+'&c=entry&do=praise&m=nv_live',
        data:{'listid':lid,'uc_openid':$("#wx_openid").val()},
        dataType:"json",
        success:function(json){
            // var json = eval('('+json+')');
            // console.log(json);_loading_toast._show(json.num);
            if(json.errno=='1'){
                // $("#praise-num").html(new_zan);
                //点赞特效
                // $.tipsBox({
                // 	obj: $(".head-user img"),
                // 	toobj: $("#praise-num"),
                // 	str: '<img src="'+$('.head-user img').attr('src')+'" style="width:28px;height:28px;border-radius:100%">',
                // 	callback: function() {
                // 	  // $("#praise-num").html(json.num);
                // 	}
                // });
            }else if(json.errno=='-1'){
                _loading_toast._show('直播ID有误');
            }else if(json.errno=='-2'){
                _loading_toast._show('你已被禁言');
            }else if(json.errno=='-3'){
                _loading_toast._show('您的资料不存在、亲重新进入！');
            }else if(json.errno=='-4'){
                _loading_toast._show('主播已开启全员禁言');
            }else if(json.errno=='-5'){
                $('#praise-num').attr('data-canZan', '0');
                _loading_toast._show('亲，你已经赞过了！');
            }else{
                _loading_toast._show(json.message);
            }
        }
    })
}
//发送新消息
function send_message(){
    var content = $("#dt_review_form_content").val(),category_id=$("#category_id").val(),lid=$("#live_id").val();
    if(content==''){
        _loading_toast._show('评论内容不能为空！');
        return false;
    }else if(content.length > 100){
        _loading_toast._show('评论内容超出限制！');
        return false;
    }
    //_loading_toast._show('测试阻断');
    $("#dt_review_form_post").text('正在发送');
    $("#dt_review_form_post").attr('disabled',true);
    $("#dt_review_form_post").css('background-color','#6E6036');
    //return false;
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=comment_reply&m=nv_live';
    var pagenum=$('#PageNum'),pageval=pagenum.val();
    $.ajax({
        type:'post',
        url:post_url,
        data:{'type':'comment','content':content,'category_id':category_id,'listid':lid,'uc_openid':$("#wx_openid").val()},
        dataType:"json",
        success:function(json){
            if(json.errno=='1'){
                _loading_toast._show2('提交成功');
            }else if(json.errno=='-2'){
                _loading_toast._show('直播id有误');
            }else if(json.errno=='-3'){
                _loading_toast._show('请先输入评论内容！')
            }else if(json.errno=='-4'){
                _loading_toast._show('粉丝资料不存在')
            }else if(json.errno=='-5'){
                _loading_toast._show('回复失败、您回复的评论已经被删除了')
            }else if(json.errno=='-6'){
                _loading_toast._show('你已经被禁言');
            }else if(json.errno=='-7'){
                _loading_toast._show('主播已开启禁言');
            }else{
                _loading_toast._show(json.message);
            }
            $("#talk").animate({scrollTop:0},600);
            $("#dt_review_box_emo").hide();
            $("#dt_review_form_content").val('');

            $("#dt_review_form_post").text('发送');
            $("#dt_review_form_post").attr('disabled',false);
            $("#dt_review_form_post").css('background-color','#ff6a00');

            AutoLoad();
        }
    })

}
//get more new message
function AutoLoad(){
    var pageReset=$('#PageNum').attr('date-reset'),html='',comtNum=0;
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=get_comment_newjoin&m=nv_live';
    $.ajax({
        type:'post',
        url:post_url,
        data:{'type':'new_join','listid':$("#live_id").val(),'max':pageReset},
        dataType:"json",
        success:function(json){
            switch(json.errno){
                case '1':{
                    comtNum=Number($('#comment-num').text());
                    $('#PageNum').attr('date-reset',json.num);
                    $('#comment-num,#banner_pingluns').html(json.num);
                    var people = Number(json.online_user);//Number(live_persons)+
                    // $('#banner_persons').html(people);
                    $('#praise-num').html(json.zan);
                    $("#comment").prepend(json.html);
                    $("#joinuser_tit").html(json.join_html);
                }
            }
        }
    })
}
//get more news
function loadMore(){
    var page=Number($('#PageNum').val())+1;
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=get_comment_reply&m=nv_live';
    $.ajax({
        type:'get',
        url:post_url,
        data:{'type':'comment','listid':$("#live_id").val(),'page':page,'update_time':$('#page_time').val()},
        dataType:"json",
        success:function(json){
            switch(json.errno){
                case '1':{
                    $('#PageNum').val(page).attr('date-reset',json.num);
                    $('#comment-num').html(Number(json.num));//floor num
                    if(json.length==0){

                        $(".tt-msg-load-desc a").text('没有更多了');
                        $('.tt-msg-loading').hide();
                        $('.tt-msg-load-desc').show();

                    }else{

                        $("#comment").append(json.html);
                        load_status = 1;
                        $('.tt-msg-loading').hide();
                        $('.tt-msg-load-desc').show();
                    }
                    break;
                }
                case '-1':{
                    _loading_toast._show('ID有误');
                    break;
                }
                case '-2':{
                    if(json.num==0){
                        $(".tt-msg-load-desc a").text('没有更多了');
                        $('.tt-msg-loading').hide();
                        $('.tt-msg-load-desc').show();
                    }else{
                        $(".tt-msg-load-desc a").text('没有更多了');
                        $('.tt-msg-loading').hide();
                        $('.tt-msg-load-desc').show();
                    }
                    break;
                }
            }
        }
    })
}



function gave(type){
//SOCKET.emit('dashang',{'type':'redpack','gift_number':1,'money':'111','openid':$('#wx_openid').val()});
    var dashang_limit_new=dashang_limit;
    var gift_num=1;
    if(type=='redpackad')
    {
        dashang_limit_new=5;
        gift_num=Number($('#gave-num').val());
    }
    var liveID=$("#live_id"),
        nowTime = new Date().getTime(),
        clickTime=liveID.attr("ctime")?liveID.attr("ctime"):0,
        alsoTime=nowTime-clickTime,
        money=$('#gave-money'),
        say=$('#gave-say'),
        num=$('#gave-num'),
        isJson=false;
    if(type=='redpackad')
    {
        money=$('#gave-money-redpack');
        say=$('#gave-say-redpack');
        var mona=money.val();
        var monb=mona-mona*0.05;
        var monc=Math.floor(monb);
        if(gift_num-monc>0){
            _loading_toast._show('最多发放'+monc+'个红包');
            return false;
        }
    }
    if(isNaN(Number(money.val()))){
        _loading_toast._show('请输入正常的金额');
        return false;
    }
    if(type=='redpackad')
    {
        if(Number(money.val())/Number(num.val())<1)
        {
            _loading_toast._show('微信即时到帐红包，每个金额须大于1元');
            return false;
        }
    }
    if(Number(money.val())=='' || Number(money.val())<=0){
        _loading_toast._show('请输入正常的金额');
        return false;
    }/*else if(Number(money.val())<dashang_limit_new){
        _loading_toast._show('打赏不能小于'+dashang_limit_new+'元');
        return false;
    }*/
    if(type=='redpackad'){
        if(Number(money.val())<dashang_limit_new){
            _loading_toast._show('红包不能小于'+dashang_limit_new+'元');
            return false;
        }
    }else{
        if(Number(money.val())<dashang_limit_new){
            _loading_toast._show('打赏不能小于'+dashang_limit_new+'元');
            return false;
        }
    }
//        else if(Number(money.val())>200){
//		_loading_toast._show('金额不能大于200元');
//		return false;
//	}
    if(say.val()==''){
        _loading_toast._show('广告语没有填写！');
        return false;
    }
    if(clickTime && alsoTime < 60000){
        _loading_toast._show('操作过于频繁，稍后再试');
        return false;
    }else{
        liveID.attr("ctime",nowTime);
        if(liveID.attr("ctime")){
            var i = _meepoajax._querystring('i');
            var j = _meepoajax._querystring('j');
            var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=wechatpay&m=nv_live';
            $.ajax({
                type:'post',
                data:{'gift_number':gift_num,'money':money.val(),'type':type,'content':say.val(),'listid':$("#live_id").val(),'category_id':$("#category_id").val()},
                url:post_url,
                dataType:"json",
                //async:false,
                success: function(json){
                    if(json.errno=='1'){
                        var e = json.data;
                        var pinglunid=json.pinglunid;
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId":e.appId,
                                "timeStamp": ""+e.timeStamp ,
                                "nonceStr": e.nonceStr,
                                "package":e.package,
                                "signType":e.signType,
                                "paySign":e.paySign
                            },
                            function(res){
                                if(res.err_msg == "get_brand_wcpay_request:ok") {
                                    //AutoLoad();                                
                                    close_give();
                                    close_redpacket();
                                    liveID.attr("ctime",0);
                                    var contents="<span style='color: red'>送出 <img class='gift_img' style='width: 20px;height: 20px;vertical-align: middle;' src='../addons/nv_live/template/mobile/images/redpack.png'>" +money.val()+ "元红包[赞助："+say.val()+" ]</span>";
                                    if(type=='redpackad')
                                    {
                                        contents="<span style='color: red'><img onClick='getredpack("+pinglunid+")' class='gift_img' style='width: 100px;height: 50px;vertical-align: middle;' src='/addons/nv_live/template/mobile/images/redpackad.png'><p>"+money.val()+"元红包,立刻抢红包[赞助："+say.val()+"]</span>";
                                    }
                                    ws.send('{"type":"say","to_client_id":"all","content":"'+htmlspecialchars(contents)+'"}');
                                    //SOCKET.emit('dashang',{'type':type,'gift_number':1,'money':$('#gave-money').val(),'openid':$('#wx_openid').val()});
                               }else{
                                    if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                        var tips = '你取消了支付';
                                    }else{
                                        var tips = '支付失败';
                                    }
                                    liveID.attr("ctime",0);
                                    close_give();
                                    close_redpacket();
                                    _loading_toast._show(tips);
                                }
                            }
                        );
                    }else{
                        _loading_toast._show(json.message);
                    }
                }
            })
        }
    }
}
function htmlspecialchars(str)
{
    var s = "";
    if (str.length == 0) return "";
    for   (var i=0; i<str.length; i++)
    {
        switch (str.substr(i,1))
        {
            case "<": s += "&lt;"; break;
            case ">": s += "&gt;"; break;
            case "&": s += "&amp;"; break;
            case " ":
                if(str.substr(i + 1, 1) == " "){
                    s += " &nbsp;";
                    i++;
                } else s += " ";
                break;
            case "\"": s += "&quot;"; break;
            case "\n": s += "<br>"; break;
            default: s += str.substr(i,1); break;
        }
    }
    return s;
}

//摇一摇
function shakeEventDidOccur(){
    // alert('shakeEvent');
    // alert(mobile_type);
    if(mobile_type==0){
        $("#guanzhu_pop").show();
        return;
    }
    var shake=$('#shake'),limit=$('#shake-limit font');
    // alert('shake is hide:'+shake.is(':hidden'));
    // alert('shake turn on or not:'+shake.attr('data-shake'));
    if (shake.is(':hidden')==false && shake.attr('data-shake')=='on' && $("#zjlBox").is(':hidden') && $("#mzjBox").is(':hidden')) {
        //是否需要填写信息
        // if($("#shake_status").val()=='0'){

        // 	if($('#meepo_pop').css('display')=='none'){
        // 		$("#meepo_pop").show();
        // 	}
        // 	return;
        // }
        //摇了只能等结束再摇
        shake.attr('data-shake','off');
        //获取MP3播放对象并播放
        var shakeYao=$('#shake-yao')[0],shakeKai=$('#shake-kai')[0],liveID=$("#live_id");
        shakeYao.pause();
        shakeYao.play();
        //播完音乐再执行
        setTimeout(function(){
            var i = _meepoajax._querystring('i');
            var j = _meepoajax._querystring('j');
            var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=shake&m=nv_live';
            $.ajax({
                type:'post',
                data:{'listid':liveID.val(), 'title' : '{$list["title"]}'},
                url:post_url,
                dataType:"json",
                async:false,
                success: function(json){
                    //shakeKai.pause();
                    //shakeKai.play();
                     // alert(JSON.stringify(json));
                    if(json.errno=='1'){
                        limit.text(json.have_chance);
                        $("#jpimg").attr("src",json.img);
                        $("#jpname").text(json.name);
                        if(json.get_url!=''){
                            $("#zjlbtn .button_yes").html("<a class=\"get_btn\" style=\"color: #fff;padding: 4% 0%;\" href="+json.get_url+">立即领奖</a>");
                        }else{
                            $("#zjlbtn .button_yes").html("<a class=\"get_btn\" style=\"color: #fff;padding: 4% 0%;\" href=\"javascript:;\" onclick=\"get_luck_award()\">立即领奖</a>");
                        }
                        $("#zjlBox").show();
                        shake.attr('data-shake','on');
                        // if($("#shake_status").val()=='0'){
                        // if($('#meepo_pop').css('display')=='none'){
                        // $("#meepo_pop").show();
                        // }
                        // return;
                        // }

                    }else{
                        // $('#shake-img').text(JSON.stringify(json));

                        if(json.errno=='-5'){
                                limit.text(json.have_chance);
                                $("#mzjBox").show();

                                shake.attr('data-shake','on');
                                // return;
                        }
                        if(json.errno=='-3'){
                            $('#shake-limit').html('<font color=red>你摇一摇机会已经用完啦！</font>');
                            
                        } else if(json.errno == -2) {

                            _loading_toast._show(json.message);

                            shake.attr('data-shake','on');
                        } else {
                            $("#mzjBox").show();
                            // _loading_toast._show(json.message);
                            shake.attr('data-shake','on');
                        } 



                    }
                }
            })
        },1100);
    }
}
function close_zj(){
    $("#zjlBox").hide();
    $('#shake').attr('data-shake','on');
}
function no_zj(){
    $("#mzjBox").hide();
    $('#shake').attr('data-shake','on');
}
function get_luck_award(){

    $("#zjlBox").hide();
    $("#meepo_pop").toggle();
    
    if ($("#meepo_pop").length <= 0) {
        _loading_toast._show('奖品将于10个工作日内寄送哦！。');
    };
    $('#shake').attr('data-shake','on');
}
var send_btn = false;
function send_rm(){
    var realname = $("#realname").val();
    var mobile = $("#mobile").val();
    var address = $("#address").val();
    if(realname == '') {
        _loading_toast._show('请填入真实的姓名');
        return;
    }
    if(mobile == '') {
        _loading_toast._show('请输入手机号码，以便领取奖品');
        return;
    }
    if(address == '') {
        _loading_toast._show('请输入收货地址，以便领取奖品');
        return;
    }
    var submitData = {
        "realname" : realname,
        "mobile" : mobile,
        "address":address,
        'uc_openid':$('#wx_openid').val(),
        'listid':$("#live_id").val()
    };
    if(send_btn) return;
    send_btn = true;
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=update_fans&m=nv_live';

    $("#meepo_pop").remove();
    _loading_toast._show('奖品将于10个工作日内寄送哦！');
    $.ajax({
        type : "POST",
        url : post_url,
        data : submitData,
        dataType : "json",
        success : function(data){
            send_btn = false;
            if(data.errno == '1') {
                $("#error_tip").text('');
                // $("#meepo_pop").hide();
                // $("#meepo_pop").remove();
                $("#shake_status").val('1');
                _loading_toast._show('奖品将于10个工作日内寄送哦！');
            } else {
                _loading_toast._show(data.message);
            }
        }
    })
}
function change_gift(gift_id,listid){
    if(gift_id != '' && listid!=''){
        $(".reward-img-wrap").removeClass('selected');
        if($("#gift_"+gift_id).length>0){
            $("#gift_"+gift_id).addClass('selected');
            var gift_number = parseInt($("#gift_number").val());
            if(gift_number > 0){
                $("#total_price").text(parseFloat($("#gift_"+gift_id).attr("data-one")*gift_number).toFixed(2));
            }

        }
    }
}
function number_change(){
    var gift_number = parseInt($("#gift_number").val());
    if(gift_number > 0){
        var gift_id = $(".selected").attr("data-type");
        $('#total_price').text(parseFloat($("#gift_"+gift_id).attr("data-one")*gift_number).toFixed(2));
    }
}
function gift_pay(){
    var money  = $('#total_price').text();
    if(Number(money)=='' || Number(money)<=0){
        _loading_toast._show('请输入正常的礼物数量');
        return false;
    }else if(Number(money)<0.01){
        _loading_toast._show('礼物金额不能小于0.01元');
        return false;
    }
    if(isNaN(Number($("#gift_number").val()))){
        _loading_toast._show('礼物数量必须是大于0的数字');
        return false;
    }
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=wechatpay&m=nv_live';
    $.ajax({
        type:'post',
        data:{'gift_number':$("#gift_number").val(),'money':money,'type':$(".selected").attr("data-type"),'content':$(".selected").next().text(),'listid':$("#live_id").val(),'category_id':$("#category_id").val()},
        url:post_url,
        dataType:"json",
        //async:false,
        success: function(json){
            if(json.errno=='1'){
                var e = json.data;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId":e.appId,
                        "timeStamp": ""+e.timeStamp ,
                        "nonceStr": e.nonceStr,
                        "package":e.package,
                        "signType":e.signType,
                        "paySign":e.paySign
                    },
                    function(res){
                        $(".gift_list").hide();
                        if(res.err_msg == "get_brand_wcpay_request:ok") {
                            //AutoLoad();
                            var select_type = $(".selected").attr("data-type");
                            if($("#send_"+select_type).length>0){
                                var now_num = Number($("#send_"+select_type).text())+Number($("#gift_number").val());
                                $("#send_"+select_type).text(now_num);
                            }
                            close_gift_list();
                            var select_img = $(".selected img").attr("src");
                            // console.log('src-'+select_img);
                            // var moneynew=money*$("#gift_number").val();
                            var contents="<span style='color: red'>打赏<img class='gift_img' style='width: 30px;height: 30px;vertical-align: middle;' src='"+select_img+"'>"+$(".selected").next().text()+" 金额 "+money+"元</span>";
                            ws.send('{"type":"say","to_client_id":"all","content":"'+htmlspecialchars(contents)+'"}');
                            //SOCKET.emit('gift',{'type':select_type,'gift_number':$("#gift_number").val(),'money':$('#total_price').text(),'openid':$('#wx_openid').val(),'content':$(".selected").next().text()});
                        }else{
                            // console.log(res.err_msg);
                            if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                var tips = '你取消了支付';
                            }else{
                                var tips = '支付失败';
                            }

                            _loading_toast._show(tips);
                        }
                    }
                );
            }else{
                _loading_toast._show(json.message);
            }
        }
    })

}
function close_give(){
    talk_can_scroll();
    $("body").animate({scrollTop:0},600);
    $("#talk").animate({scrollTop:0},600);
    $("#dashang_box").hide();
    $("#review_box").show();
}
function close_redpacket(){
    talk_can_scroll();
    $("body").animate({scrollTop:0},600);
    $("#talk").animate({scrollTop:0},600);
    $("#redpacket_box").hide();
    $("#review_box").show();
}
function close_redpacket_got(){

    $("#redpacket_got_box").hide();
    $("#review_box").show();
}
function close_gift_list(){
    talk_can_scroll();
    $("body").animate({scrollTop:0},600);
    $("#talk").animate({scrollTop:0},600);
    $("#reward-layer-box").hide();
    $("#review_box").show();
}

var _emo= {
    _text: ["[笑脸]", "[感冒]", "[流泪]", "[发怒]", "[爱慕]", "[吐舌]", "[发呆]", "[可爱]", "[调皮]", "[寒冷]", "[呲牙]", "[闭嘴]", "[害羞]", "[苦闷]", "[难过]", "[流汗]", "[犯困]", "[惊恐]", "[咖啡]", "[炸弹]", "[西瓜]", "[爱心]", "[心碎]"],
    _indexOf: function(text) {
        if (_emo._text.indexOf) {
            return _emo._text.indexOf(text);
        }
        for (var i = 0, _len = _emo._text.length; i < _len; i++) {
            if (_emo._text[i] == text) {
                return i;
            }
        }
        return -1;
    },
    _insertFun: null,
    _show: function(id, fun) {
        _emo._insertFun = fun;
        if ($("#" + id).children().length == 0) {
            var _html = "<ul>";
            for (var i = 0; i < 23; i++) {
                _html += "<li class='emo' ontouchstart='' onclick='_emo._insert(" + i + ")'><img src='" + './emo/' + (i + 1) + ".png'></li>";
            }
            _html += "</ul>";
            $("#" + id).html(_html);
        }

        $("#" + id).slideToggle();

    },
    _hide: function(id) {
        $("#" + id).hide();
    },
    _insert: function(index) {
        (_emo._insertFun)(index);
    },
    _toCode: function(content) {
        return content.replace(/\[[\u4e00-\u9fa5]{1,2}\]/g, function(a) {
            var _code = _emo._indexOf(a) + 1;
            return _code == 0 ? a : "[/" + _code + "]";
        });
    },
    _toemo: function(content) {
        for (var i = 0, _len = _emo._text.length; i < _len; i++) {
            if(content.indexOf(_emo._text[i])>-1){
                var imgurl = '/addons/nv_live/template/mobile/emo/' + (i+ 1) + '.png';
                var replace = '<img src="'+ imgurl+ '" border="0"  width=16px height=16px />';
                content = content.replace(_emo._text[i], replace);
            }
        }
        return content;
    }
};
var _meepoajax = {
    _querystring : function(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
        if (result == null || result.length < 1){
            return "";
        }
        return result[1];
    }
};

var _loading_toast= {
    _center: function() {
        var _left = ($(window).width() - $("#toast").outerWidth()) / 2 + "px";
        $("#toast").css({
            "top": "50%",
            "left": _left
        });
    },
    _show: function(text, fun) {
        $("#toast").html(text);
        _loading_toast._center();
        $("#toast").show();
        $("#toast").bind("resize", _loading_toast._center);
        setTimeout(function() {
            _loading_toast._hide(fun);
        }, 3 * 1000);
    },
    _show2: function(text, fun) {
        $("#toast").html(text);
        _loading_toast._center();
        $("#toast").show();
        $("#toast").bind("resize", _loading_toast._center);
        setTimeout(function() {
            _loading_toast._hide(fun);
        }, 1000);
    },
    _hide: function(fun) {
        $("#toast").hide();
        $("#toast").unbind("resize");
        if (fun) {
            (fun)();
        }
    }
};

function talk_not_scroll(){
    $('#talk').bind('touchmove',function(e){
        e.preventDefault();
        e.stopPropagation();
    })
}
function talk_can_scroll(){
    $('#talk').unbind('touchmove');
}
function number_focus(){
    $("body").animate({scrollTop: document.body.clientHeight},600);
}
function code_look(){
    var look_code = $("#look_code").val();
    if('undefined'==look_code || ''==look_code){
        _loading_toast._show('请先输入观看密码');
        return;
    }
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=look_code&m=nv_live';
    $.ajax({
        type : "POST",
        url : post_url,
        data : {'listid':$("#live_id").val(),'look_code':look_code,'uc_openid':$("#wx_openid").val()},
        dataType : "json",
        success : function(data){

            console.log(data);

            _loading_toast._show(data.message);
            if(data.errno == '0' || data.errno == '-10') {
                $("#code_pop").hide();
                $(".mubu").hide();
            }
        }
    })
}
function pay_look(){
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=look_pay&m=nv_live';
    console.log('in-pay_look');

    $.ajax({
        type : "POST",
        url : post_url,
        data : {'listid':$("#live_id").val()},
        dataType : "json",
        success : function(json){
            console.log('ajax sucesss');
            console.log(json);
            if(json.errno=='1'){
                var e = json.data;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId":e.appId,
                        "timeStamp": ""+e.timeStamp ,
                        "nonceStr": e.nonceStr,
                        "package":e.package,
                        "signType":e.signType,
                        "paySign":e.paySign
                    },
                    function(res){

                        if(res.err_msg == "get_brand_wcpay_request:ok") {
                            _loading_toast._show('支付成功');
                            $("#pay_pop").hide();
                        }else{
                            if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                var tips = '你取消了支付';
                            }else{
                                var tips = '支付失败';
                            }

                            _loading_toast._show(tips);
                        }
                    }
                );
            }else{
                if(json.errno!='-10'){
                    _loading_toast._show(json.message);
                }else{
                    _loading_toast._show('支付成功');
                    $("#pay_pop").hide();
                }
            }
        },
        error: function (e){
            console.log('ajax fail');
        }
    })
}

function check_bianhao(){
    var bianhao = $("#bian_hao").val();
    if('undefined'==bianhao || ''==bianhao){
        _loading_toast._show('请先输入编号');
        return;
    }
    var i = _meepoajax._querystring('i');
    var j = _meepoajax._querystring('j');
    var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=check_bian_hao&m=nv_live';
    $.ajax({
        type : "POST",
        url : post_url,
        data : {'listid':$("#live_id").val(),'bian_hao':bianhao,'uc_openid':$("#wx_openid").val()},
        dataType : "json",
        success : function(data){

            // data = eval('('+msg+')');

            // console.log(data);
            if(data.code == 0) {
                _loading_toast._show(data.msg);
                $("#bian_hao_pop").hide();
                $(".mubu").hide();

            } else {

                _loading_toast._show(data.msg);

            }
        }
    })
}

/*加密-解密*/

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1A 1B(11){10 18=[".","/","-","\\\\","{","}",":",\'"\',",","1C","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];10 14=["1z","1y","1u","1v","1w","1x","1D","1E","1K","1L","1M","1J","1t","1F","1O","1G","1H","1N","1r","1e","1f","1d","1i","1c","19","1a","1b","1h","1s","1j","1q","1o","1k","1l","1m","1p","1n","1g","1I","21","2e","2g","2i","2d","2c","29","2a","2b","2h","2k","2q","2p","2o","2m","2n","2l","2j","2f","27","1U","1V","1W","1T","1S","1P","1Q","1R","1X","1Y","24","25","26"];10 13="";10 16=11.15;28(10 i=0;i<11.15;i++){j=2*i;17(j>=16){22}10 12=$.1Z(11.20(j,2),14);17(12>=0){13+=18[12]}}23 13}',62,151,'||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||var|str|index|deStr|find|length|len|if|replace|b5|b4|b3|b6|b8|Z0|b9|D2|b2|b7|b0|D7|D6|D5|D3|D8|D4|D9|Z1|b1|Z7|K1|K0|Se|Es|K2|Kt|function|_fnUrlDeode|_|f5|f7|Z6|Z4|Z3|D1|Z8|f9|f0|Z9|Z2|Z5|N1|N2|N3|N0|M9|M6|M7|M8|N4|N5|inArray|substr|D0|break|return|N6|N7|N8|M5|for|h5|K3|K4|h4|h3|h0|M4|h1|K5|h2|M3|K6|M2|M0|M1|K9|K8|K7'.split('|'),0,{}))


