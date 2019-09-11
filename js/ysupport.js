
function fly_p(name, text) {
    if (name == "1") {
        toastr.success(text);
    }
    if (name == "2") {
        toastr.error(text);
    }
    if (name == "3") {
        toastr.info(text);
    }
}
function fly_p(name, text) {
    if (name == "1") {
        toastr.success(text);
    }
    if (name == "2") {
        toastr.error(text);
    }
    if (name == "3") {
        toastr.info(text);
    }
}
(function ($) {
    var data = {
        'tickets': [],
        'load':{},
        'active':"",
        'active_id':"",
        "timer":false
    };
    var methods = {
        init: function (options) {
            $('head').append('<link href="/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
            $('head').append('<link rel="stylesheet" type="text/css" href="/assets/global/plugins/bootstrap-toastr/toastr.min.css"/>');
            $('head').append('<link href="/css/jquery-ui-1.10.4.min.css" rel="stylesheet" type="text/css">');
            $('head').append('<script type="text/javascript" src="/js/base64.js"></script>');
            $('head').append('<script type="text/javascript" src="/js/jquery-ui-1.10.4.custom.min.js"></script>');
            $('head').append(' <script src="/assets/global/plugins/bootstrap-toastr/toastr.min.js"></script>');
            var con = '';
            con += '<div class="body"><table style="width: 100%;height: 100%;" cellspacing="0" cellpadding="0" ><tr><td height="30"><div class="header"></div></td></tr><tr><td style="vertical-align: top;"><table><tr><td class="td_1"><ul class="menu"><li class="active idbt"><div class="load-tickets"><i class="fa fa-home" style="margin-right: 5px;"></i>Тикеты</div></li></ul><ul class="menu mtickets"></ul></td><td class="content"></td></tr></table></td></tr><tr><td height="22"><div class="footer"></div></td></tr></table></div>';
            $('body').empty().append(con);
            $('body').append('<audio id="nchat_sound" src="/js/1.mp3"></audio>');
            $.support('load',{act:"tickets"});
            $(document).on('click', '.tickets>tbody>tr>td>div', function (e) {
                e.preventDefault();
                id = $(this).closest("tr").attr('tid');
                $.support('open_ticket',{"id":id});
            });
            $(document).on('click', '.ticket-open', function (e) {
                e.preventDefault();
                id = $(this).attr('tid');
                $.support('open_ticket',{"id":id});
            });
            $(document).on('click', '.load-tickets', function (e) {
                e.preventDefault();
                $.support('load',{act:"tickets"});
                $.support('action_menu','bt');
            });
            $(document).on('click', '.ticket-yes', function (e) {
                e.preventDefault();
                id = $(this).attr('tid');
                $.support('load',{act:"cur",id:id});
            });
            $(document).on('keypress', '.input-text', function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    txt = $(this).val();
                    $(this).val('');
                    id = $(this).attr('tid');
                    if(txt){
                        $.support('load',{act:"send",id:id,txt:txt});
                    }
                }
            });
        },
        play:function(){
            document.getElementById("nchat_sound").play();
        },
        auto:function(){
            if(data.active=="ticket"){
                $.support('load',{
                    act:"auto",
                    act2:"ticket",
                    id:data.active_id
                });
            }
        },
        add_tickets: function (options) {
            get = $.extend(options);
            d = '<tr tid="'+get['id']+'">' +
            '<td><div>' +get['id'] + '</div></td>' +
            '<td><div title="' +get['user_name'] + ' ' +get['user_lname'] + '">' +get['user_name'] + '</div></td>' +
            '<td class="ecl"><div title="' +base64_decode(get['name2']) + '">' +base64_decode(get['name2']) + '</div></td>' +
            '<td><div>';
            if(get['status']=="1"){
                d +='<i class="fa fa-envelope-o blue"/>';
            }else{
                d +=' ';
            }
            d +='</div></td>' +
            '<td><div>' +get['time'] + '</div></td>' +
            '<td><div>' +get['cur'] + '</div></td>' +
            '</tr>';

            $('.content>table>tbody').append(d);
        },
        open_ticket: function(options){
            get = $.extend(options);
            data.active = "ticket";
            data.active_id = get.id;
            if(!data['tickets'][get.id]){
                data['tickets'][get.id] = {};
                d = '<li class="idt'+get.id+'"><div class="ticket-open" tid="'+get.id+'">Тикет №'+get.id+'</div></li>';
                $('.mtickets').append(d);
            }
            $.support('load',{act:"ticket","id":id});
            $.support('action_menu','t'+id);
        },
        action_menu:function(id){
            $('.menu li').removeClass('active');
            $('.menu li.id'+id).addClass('active');
        },
        ticket_scroll:function(){
            var block = $('.mes-box');
            if(block.length){
                block.scrollTop(block[0].scrollHeight - block.height());
            }
        },
        anim:function(options){
            d='<div id="followingBallsG"></div>';
            $('.content').empty().append(d);
        },
        load:function(options){
            get = $.extend(options);
            clearTimeout(data.timer);
            data.load.act = get.act;
            if(get.act=="tickets"){
                $.support('anim');
                data.active = "tickets";
            }
            if(get.act=="ticket"){
                $.support('anim');
                data.active = "ticket";
                data.active_id = get.id;
                data.load.id = get.id;
            }
            if(get.act=="cur"){
                data.load.id = get.id;
            }
            if(get.act=="send"){
                data.load.id = get.id;
                data.load.txt = get.txt;
                data.load.last =  data['tickets'][get.id]['last'];
            }
            if(get.act=="auto"){
                data.load.act2 = get.act2;
                if(get.act2=="ticket"){
                    data.load.id = get.id;
                    data.load.last =  data['tickets'][get.id]['last'];
                }
            }
            $.ajax({
                type: "POST",
                url: "/newsupport/load/",
                data: data.load,
                dataType: "json",
                async:true,
                success: function (res) {
                    $.support('res',res);
                }
            });
        },
        res:function(res){
            if(get.act=="tickets"){
                $('.content').empty();
                d = '<table class="tickets" border="0" cellspacing="0" cellpadding="0">' +
                '<thead>' +
                '<tr>' +
                '<th width="50">ID</th>' +
                '<th>Клиент</th>' +
                '<th>Тема</th>' +
                '<th width="20"><i class="fa fa-envelope-o"/></th>' +
                '<th width="170">Последнее</th>' +
                '<th width="100">Оператор</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>'+
                '</tbody>' +
                '</table>';
                $('.content').append(d);
                $.when(
                    $.each(res.tickets, function(i, item) {
                        $.support('add_tickets',item);
                    })
                );

                $.support('action_menu','bt');
            }
            if(get.act=="ticket"){
                res.ticket.id = get.id;
                $.support('load_ticket',res.ticket);
            }
            if(get.act=="cur"){
                if(res.cur.id){
                    $.support('ticket_cur',res.cur);
                }
            }
            if(get.act=="send"){
                data['tickets'][get.id]['last'] = res.last;
                $.each(res.mes, function(i, item) {
                    $.support('mes_add',item);
                });
            }
            if(get.act=="auto"){
                if(get.act2=="ticket"){
                    data['tickets'][get.id]['last'] = res.ticket.last;
                    $.each(res.ticket.mes, function(i, item) {
                        if(item.user=="1"){
                            app.new_mess(item.id);
                        }
                        $.support('mes_add',item);
                    });
                }
            }
            data.timer = setTimeout(function () {
                $.support('auto');
            }, 5000);
        },
        load_ticket:function(options){
            get = $.extend(options);
            data['tickets'][get.id]['last'] = get.last;
            $('.content').empty();
            d = '<table style="width: 100%;height: 100%;" cellpadding="0" cellspacing="0">' +
            '<tbody><tr><td>' +
            '<table style="width: 100%;height: 100%;" cellpadding="0" cellspacing="0">' +
            '<tbody><tr>' +
            '<td style="position: relative;"><div class="mes-box scroll"></div></td>' +
            '</tr><tr>' +
            '<td class="input-td">' +
            '<div class="box-cur">' +
            '<div class="btn-success ticket-yes" tid="'+get.id+'">ПРИНЯТЬ ДИАЛОГ</div>' +
            '<div class="btn-dark ticket-no">ОТКЛОНИТЬ</div>' +
            '</div>' +
            '<div class="box-tx"><div class="inpt-tx">' +
            '<input class="input-text" tid="'+get.id+'"><span>Отпр.</span>' +
            '</div></div></td>' +
            '</tr></tbody>' +
            '</table></td><td style="width:1px; position: relative">' +
            '<div class="right-menu">' +
            '<table width="100%"><tr><td><div class="infot">Информация о клиенте</div></td></tr>' +
            '<tr><td><i class="fa fa-info"/>'+get.user_name+' '+get.user_lname+'</td></tr>' +
            '<tr><td><i class="fa fa-envelope-o"/>'+get.user_mail+'</td></tr>' +
            '<tr><td><i class="fa fa-phone"/>'+get.user_phone+'</td></tr>' +
            '<tr><td><i class="fa fa-rub"/>'+get.user_balance+'</td></tr>' +
            '</table>' +
            '</div></td>' +
            '</tr></tbody></table>';
            $('.content').append(d);
            $.support('ticket_cur',get.cur);
            $.when( $.each(get.mes, function(i, item) {
                $.support('mes_add',item);
            }));
        },
        ticket_cur:function(options){
            get = $.extend(options);
            if(get.id){
                $('.box-cur').fadeOut("slow");
                $('.box-tx').fadeIn("slow");
                d ='<table style="margin-top: 10px;">' +
                '<tr><td colspan="2"><div class="infot">Оператор</div></td></tr>' +
                '<tr><td rowspan="2" width="50"><img src="'+get.photo+'" class="cur-photo"/></td>' +
                '<td>'+get.uname+'</td></tr><tr>' +
                '<td>'+get.lname+'</td></tr></table>';
                $('.right-menu').append(d);
            }else{
                $('.box-cur').fadeIn("slow");
            }
        },
        mes_add: function (options) {
            get = $.extend(options);
            if(get.user=="1"){
                d = '<div class="clearfix show"><table cellpadding="0" cellspacing="0" class="chat-msg client-msg">' +
                '<tbody><tr><td class="pip-td"><div class="pip-left"></div></td>' +
                '<td><div class="chat-msg-text"><div class="msg-content">' +
                '<div class="text">'+get.mes+'</div></div></div></td>' +
                '<td style="vertical-align: middle"><div class="time">'+get.time+'</div></td></tr>' +
                '</tbody></table></div>';
            }else{
                d = '<div class="clearfix show"><table cellpadding="0" cellspacing="0" class="chat-msg agent-msg">' +
                '<tbody><tr><td style="vertical-align: middle"><div class="time">'+get.time+'</div>' +
                '</td><td><div class="chat-msg-text"><div class="msg-content">'+get.mes+'</div>' +
                '</div></td><td class="pip-td"><div class="pip-right"></div></td>' +
                '</tr></tbody></table></div>';
            }
            $('.mes-box').append(d);
            $.support('ticket_scroll');
        }
    };

    $.support = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует');
        }
    };
})(jQuery);
