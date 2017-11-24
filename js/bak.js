$(function(){
    resize();
    var mySwiper = new Swiper ('#advs_box',{
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 6000,
        autoplayDisableOnInteraction: false,
    });
    var mySwiper2 = new Swiper('#gifts_swiper',{
        pagination: '.gift_page',
        paginationClickable: true,
        longSwipesRatio: 0.3,
        touchRatio:1,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
    });
    var t_length=$('#tabs-c .tabs-div').length;
    if(t_length>1){
        $('#tabs-h li').removeClass('cur').eq(0).addClass('cur');
        $('#tabs-c .tabs-div').hide().eq(0).show();
        var tabCur=$('#tabs-h .cur');

        var tabM=tabCur.attr('data-m');

        var tabN=tabCur.attr('data-num');

        var tabC=$('#tabs-c .tabs-c-'+tabN);

        if(tabM=='html'){
            var src = $('#tabs-h .cur').attr('data-h');
            if(src.indexOf("91kanjian")>0 || src.indexOf("niulaile")>0){
                src = $('#tabs-h .cur').attr('data-h')+'&color=%23ff6a00';
            }

            tabC.html('<iframe width="100%" height="'+WinH+'" src="'+src+'" frameborder="no" marginheight="0" marginwidth="0" allowTransparency="true"></iframe>');

        }else if(tabM=='comment'){

            clear_Timer();

            $('#PageNum').val('1');


        }else if(tabM=='shake'){

            $('#shake-yao')[0].play();

            var shake=$('#shake');

            $('html,body').animate({'scrollTop':shake.offset().top},500);

            shake.css({'width':WinW,'height':'500px'});

        }

    }else if(t_length==1){

        var tabDiv=$('#tabs-c .tabs-div');

        $("#tabs-h li").addClass('cur');

        var tabM=tabDiv.attr('data-m');

        $('#tabs-c .tabs-div').show();

        if(tabM=='comment'){

            clear_Timer();

            $('#PageNum').val('1');


        }else if(tabM=='html'){
            var src = $('#tabs-h .cur').attr('data-h');
            if(src.indexOf("91kanjian")>0 || src.indexOf("niulaile")>0){
                src = $('#tabs-h .cur').attr('data-h')+'&color=%23ff6a00';
            }
            $('#tabs-c .tabs-div').html('<iframe width="100%" height="'+WinH+'" src="'+src+'" frameborder="no" marginheight="0" marginwidth="0" allowTransparency="true"></iframe>');

        }else if(tabM=='shake'){

            $('#shake-yao')[0].play();

            var shake=$('#shake');

            $('html,body').animate({'scrollTop':shake.offset().top},500);

            shake.css({'width':WinW,'height':'500px'});

        }

    }

    
            $('#playBtn').click(function(){

                $(this).hide();

                var videoPlay = document.getElementById("playVideo");

                videoPlay.play();

            });

            $('#talk').on('scroll',function(){

                var $this =$(this),

                        viewH =$(this).height(),//可见高度

                        contentH =$(this).get(0).scrollHeight,//内容高度

                        scrollTop =$(this).scrollTop();//滚动高度

                if(contentH - viewH - scrollTop <= 30 && load_status==1) {

                    load_status=0;

                    $('.tt-msg-load-desc').hide();

                    $('.tt-msg-loading').show();
                    setTimeout("loadMoreHP()",1600);

                }

            });

            //切换

            



            $('#uc_gave,#uc_gift,#pc_yuyue').click(function(){

                $("#guanzhu_pop").show();

            });

            $('#wechat_yuyue').click(function(){

                var i = _meepoajax._querystring('i');

                var j = _meepoajax._querystring('j');

                var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=yuyue&m=nv_live';

                $.ajax({

                    type:'post',

                    url:post_url,

                    data:{'listid':$("#live_id").val()},

                    dataType:"json",

                    success:function(json){

                        _loading_toast._show(json.message);

                    }

                })

            });

            $("#need_moible_yuyue").click(function(){

                $('#sms_mobile_box').show();

            });

            $('#oauth_gave').click(function(){

                window.location.href="./index.php?i=3&c=entry&listid=3287&topenid=180.102.172.249&do=oauth_give&m=nv_live";

            });

            $('#oauth_gift').click(function(){

                window.location.href="./index.php?i=3&c=entry&listid=3287&topenid=180.102.172.249&do=oauth_gift&m=nv_live";

            });

            //打赏

            $('#gave').click(function(){

                $("#gave-box").css("top",$("#header").outerHeight() + $("#wrap").height()+$(".live-info").outerHeight()+$("#advs_box").height()+10);

                $("body").animate({scrollTop: document.body.clientHeight},600);

                $("#talk").animate({scrollTop:0},600);

                //$("#review_box").hide();

                talk_not_scroll();

                $('#reward-layer-box').hide()
                $("#redpacket_box").hide();
                $("#dashang_box").show();

            })

            $('#redpacket').click(function(){

                $("#gave-box-redpack").css("top",$("#header").outerHeight() + $("#wrap").height()+$(".live-info").outerHeight()+$("#advs_box").height()+10);

                $("body").animate({scrollTop: document.body.clientHeight},600);

                $("#talk").animate({scrollTop:0},600);

                //$("#review_box").hide();

                talk_not_scroll();

                $('#reward-layer-box').hide()
                $("#dashang_box").hide();
                $("#redpacket_box").show();

            })

            //gift

            //打赏

            $('#gift').click(function(){

                var gifts_num = Number('0');

                if (!gifts_num) {
                    _loading_toast._show('抱歉亲, 还没有礼物.');return;
                };

                $("#reward-pay-box").css("top",$("#header").outerHeight() + $("#wrap").height()+$(".live-info").outerHeight()+$("#advs_box").height());

                $("body").animate({scrollTop: document.body.clientHeight},600);

                $("#talk").animate({scrollTop:0},600);

                $("#review_box").hide();

                talk_not_scroll();

                $("#dashang_box").hide();

                $('#reward-layer-box').show();

            })

         
            

            $(".add").click(function(){

                var n=$(this).prev().val();

                if(n=='' || isNaN(Number(n))){

                    n = 0;

                }

                var num=parseInt(n)+1;

                $(this).prev().val(num);

                $('#total_price').text(parseFloat($(".selected").attr("data-one")*num).toFixed(2));

            });

            //减的效果

            $(".jian").click(function(){

                var n=$(this).next().val();

                if(n=='' || isNaN(Number(n))){

                    n = 0;

                }

                var num=parseInt(n)-1;

                $(this).next().val(num);

                $('#total_price').text(parseFloat($(".selected").attr("data-one")*num).toFixed(2));

            });

        })
//关注弹框
        function open_gz_img(){
            $('.gz_img_s').show();
        }
        function down_gz_img(){
            $('.gz_img_s').hide();
        }
        function clear_Timer(){

            clearInterval(Timer);

        }

        function close_gz(){

            $("#guanzhu_pop").hide();

        }

        function close_gz_float(){
            $("#guanzhu_float").hide();
        }

        function pay_oauth_look(){

            window.location.href="./index.php?i=3&c=entry&listid=3287&topenid=180.102.172.249&do=look_oauth_pay&m=nv_live";

        }

        function close_sms_box(){

            $("#sms_mobile_box").hide();

        }

        function input_need(){

            var post_array = {};

            post_array.listid = $("#live_id").val();

            
        var i = _meepoajax._querystring('i');

        var j = _meepoajax._querystring('j');

        var post_url = '/app/index.php?i='+i+'&j='+j+'&c=entry&do=post_input_need&m=nv_live';

        $.ajax({

            type:'post',

            url:post_url,

            data:post_array,

            dataType:"json",

            success:function(json){

                if(json.errno!='1'){

                    _loading_toast._show(json.message);

                }else{

                    $("#need_input_pop").hide();

                    _loading_toast._show('提交成功');

                }

            }

        })

    }