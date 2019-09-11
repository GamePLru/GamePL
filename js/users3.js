function sendNotification(title, options) {
    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    }
    else if (Notification.permission === "granted") {
        var notification = new Notification(title, options);
        //function clickFunc() { alert('Пользователь кликнул на уведомление'); }
        function clickFunc() { window.location.href = "/support" }
        notification.onclick = clickFunc;
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(title, options);
            }
        });
    } else {}
};

var conf = [];
conf['load_modal'] = '1';
conf['load'] = 0;
conf['console'] = 0;
conf['auto_console'] = false;
var lang = [];
function langs(a){
    if(lang[a]){
        return lang[a];
    }else{
        return a;
    }
}
function href_go(url) {
    $(location).attr('href', url);
}
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
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
function ajax_result(data) {
    if (data.e) {
        fly_p('2', data.e);
        return false;
    }
    if (data.r) {
        fly_p('1', data.r);
        return false;
    }
    if (data.d) {
        fly_p('3', base64_decode(data.d));
        return false;
    }
}
function pre_load_on() {
    $('.preloader-bar').css('top','0px');
    $("#pre-load").fadeIn("slow");
}
function pre_load_off() {
    $('.preloader-bar').css('top','-34px');
    $("#pre-load").fadeOut("slow");
}

function modal(url) {
    if (conf['load_modal'] != '1') {
        fly_p('2', langs('Повторите запрос через пару секунд'));
        return false;
    }
    conf['load_modal'] = 0;
    $('.preloader-bar').css('top','0px');
    $('#loader-ajax').css('display', 'block');
    $.ajax({
        url: url,
        type: "POST",
        data: "modal=1",
        dataType: "html",
        success: function (data) {
            if ($('body').hasClass('modal-open')) {
                $('#base-modal').modal('hide');
                setTimeout(function () {
                    $('#modal').empty();
                    $('.modal-scrollable').remove();
                    $('.modal-backdrop').remove();
                    $('#modal').append(data);
                    $('#base-modal').modal('show');
                    conf['load_modal'] = 1;
                    $('#loader-ajax').css('display', 'none');
                }, 500);
            } else {
                $('#modal').empty();
                $('.modal-scrollable').remove();
                $('.modal-backdrop').remove();
                $('#modal').append(data);
                $('#base-modal').modal('show');
                conf['load_modal'] = 1;
                $('#loader-ajax').css('display', 'none');
            }
            $('.preloader-bar').css('top','-34px');
        }
    });
}
function support12() {
    $.ajax({
        url: '/support/ajax',
        type: "POST",
        data: "ajax_f=1",
        dataType: "json",
        success: function (data) {
            if (data.r == 1) {
                fly_p(3, langs('У вас новое сообщение в центре поддержки'));
            }
        }
    });
    setTimeout(function () {
        support12();
    }, 20000);
}
function console_load() {
    if ($('.form_console').length) {
        if (conf['console'] == 0) {
            conf['console'] = 1;
            $.ajax({
                dataType: 'json',
                url: $('.form_console').attr('action'),
                type: "POST",
                data: 'ajax_f=1&get=1',
                success: function (data) {
                    if (data.d) {
                        $('#console_data').empty();
                        $('#console_data').append(base64_decode(data.d));
                        var psconsole = $("#console_data");
                        psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
                    } else {
                        ajax_result(data);
                    }
                    if (!conf['auto_console']) {
                        conf['auto_console'] = setTimeout(function () {
                            console_load()
                        }, 30000);
                    }
                    conf['console'] = 0;
                },
                beforeSend: function () {
                    pre_load_on();
                    $('#loader-ajax').css('display', 'block');
                },
                complete: function () {
                    pre_load_off();
                    $('#loader-ajax').css('display', 'none');
                },
                error: function (jqXHR, exception) {
                    conf['console'] = 0;
                    fly_p('3', jqXHR.responseText);
                }
            });
        } else {
            if (conf['console'] == 2) {
                if (!conf['auto_console']) {
                    conf['auto_console'] = setTimeout(function () {
                        console_load()
                    }, 30000);
                }
            }
        }
    }
}
$(document).ready(function () {
    $("html").append('<div id="notifier-box"></div>');
    support12();
});

$(document).ready(function () {
    $.ajax({
        url: '/lang/js',
        type: "POST",
        data: "ajax_f=1",
        dataType: "json",
        success: function (data) {
            lang = data;
        }
    });
    $.ajaxSetup({
        error: function (jqXHR, exception) {
            fly_p('3', jqXHR.responseText);
        }
    });
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        $.ajax({
            dataType: 'json',
            type: "POST",
            url: $(this).attr('url'),
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(location.href);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_console', function (e) {
        e.preventDefault();
        if (conf['console'] == 0) {
            conf['console'] = 2;
            $(this).ajaxSubmit({
                dataType: 'json',
                data: {ajax_f: '1', get: '1'},
                success: function (data) {
                    if (data.d) {
                        $('#console_data').empty();
                        $('#console_data').append(base64_decode(data.d));
                        var psconsole = $("#console_data");
                        psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
                        $('#console_comand').val('');
                    } else {
                        ajax_result(data);
                    }
                    conf['console'] = 0;
                },
                beforeSend: function () {
                    pre_load_on();
                    $('#loader-ajax').css('display', 'block');
                },
                complete: function () {
                    pre_load_off();
                    $('#loader-ajax').css('display', 'none');
                },
                error: function (jqXHR, exception) {
                    conf['console'] = 0;
                    fly_p('3', jqXHR.responseText);
                }
            });
        }
    });
    $(document).on('submit', '.form_rcon', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                if (data.e) {
                    ajax_result(data);
                } else {
                    if (data.d) {
                        $("#rcon_data").append("\n" + base64_decode(data.d));
                        var psconsole = $("#rcon_data");
                        psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
                        $('#rcon_data2').val('');
                    }
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.load_tpl', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                $('#tpl_editors').css('display', 'block');
                $('#tpl_id').val(data.i);
                $('#tpl_info').empty();
                $('#tpl_info').append(base64_decode(data.info));
                $('#tpl_text').empty();
                $('#tpl_text').val(base64_decode(data.d));
                $('.CodeMirror').remove();
                var editor = CodeMirror.fromTextArea(document.getElementById("tpl_text"), {
                    lineNumbers: true
                });
            },

            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_deposit', function (e) {
        var go = '0';
        var d = 0;
        var g = $('#subbuy2').attr('rub');
        var a = $('#deposit_val').val();
        var p = parseInt(a / g);
        $(this).ajaxSubmit({
            dataType: 'json',
            async: false,
            data: {ajax_f: '1'},
            success: function (data) {
                if (data.e) {
                    ajax_result(data);
                    go = '0';
                } else {
                    go = '1';
                    d = data;
                }
            }
        });
        if (go == '0') {
            e.preventDefault();
        } else {
            if ($('#deposit_tip').val() == 1) {
                $('#deposit').attr('action', 'https://merchant.webmoney.ru/lmi/payment.asp');
                $('#deposit').append('<input type="hidden" name="LMI_PAYMENT_DESC_BASE64" value="0J/QvtC/0L7Qu9C90LXQvdC40LUg0YHRh9C10YLQsA==">');
                $('#deposit').append('<input type="hidden" name="LMI_PAYEE_PURSE" value="' + d.c + '">');
                $('#deposit').append('<input type="hidden" name="FIELD_id" value="' + user_info['id'] + '">');
                $('#deposit').append('<input type="hidden" name="LMI_PAYMENT_AMOUNT" value="' + p + '">');
            }
            if ($('#deposit_tip').val() == 3) {
                $('#deposit').attr('action', 'https://money.yandex.ru/quickpay/confirm.xml');
                $('#deposit').append('<input name="receiver" type="hidden" value="' + d.c + '">');
                $('#deposit').append('<input name="short-dest" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="targets" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="quickpay-form" type="hidden" value="shop">');
                $('#deposit').append('<input name="sum" type="hidden" value="' + p + '">');
                $('#deposit').append('<input name="label" type="hidden" value="' + user_info['id'] + '">');
                $('#deposit').append('<input name="paymentType" type="hidden" value="PC">');
            }
            if ($('#deposit_tip').val() == 4) {
                $('#deposit').attr('action', 'https://money.yandex.ru/quickpay/confirm.xml');
                $('#deposit').append('<input name="receiver" type="hidden" value="' + d.c + '">');
                $('#deposit').append('<input name="short-dest" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="targets" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="quickpay-form" type="hidden" value="shop">');
                $('#deposit').append('<input name="sum" type="hidden" value="' + p + '">');
                $('#deposit').append('<input name="label" type="hidden" value="' + user_info['id'] + '">');
                $('#deposit').append('<input name="paymentType" type="hidden" value="AC">');
            }
            if ($('#deposit_tip').val() == 5) {
                $('#deposit').attr('action', 'https://unitpay.ru/pay/' + d.c);
                $('#deposit').append('<input name="account" type="hidden" value="' + user_info['id'] + '">');
                $('#deposit').append('<input name="desc" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="sum" type="hidden" value="' + p + '">');
            }
            if ($('#deposit_tip').val() == 6) {
                $('#deposit').attr('action', 'http://sprypay.ru/sppi/');
                $('#deposit').append('<input name="spShopId" type="hidden" value="' + d.c + '">');
                $('#deposit').append('<input name="spCurrency" type="hidden" value="rur">');
                $('#deposit').append('<input name="spPurpose" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="lang" type="hidden" value="ru">');
                $('#deposit').append('<input name="spAmount" type="hidden" value="' + p + '">');
                $('#deposit').append('<input name="spUserDataid" type="hidden" value="' + user_info['id'] + '">');
            }
            if ($('#deposit_tip').val() == 8) {
                $('#deposit').attr('action', 'https://waytopay.org/merchant/index');
                $('#deposit').append('<input name="account" type="hidden" value="' + user_info['id'] + '">');
                $('#deposit').append('<input name="MerchantId" type="hidden" value="' + d.c + '">');
                $('#deposit').append('<input name="InvDesc" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="OutSum" type="hidden" value="' + p + '">');
                $('#deposit').append('<input name="InvId" type="hidden" value="' + Math.round(+new Date()/1000) + '">');
            }

            if ($('#deposit_tip').val() == 9) {
                $('#deposit').attr('action', 'https://sci.interkassa.com/');
                $('#deposit').append('<input name="ik_x_account" type="hidden" value="' + user_info['id'] + '">');
                $('#deposit').append('<input name="ik_co_id" type="hidden" value="' + d.c + '">');
                $('#deposit').append('<input name="ik_desc" type="hidden" value="'+langs('Пополнение счета')+'">');
                $('#deposit').append('<input name="ik_am" type="hidden" value="' + p + '">');
                $('#deposit').append('<input name="ik_pm_no" type="hidden" value="ID_' + Math.round(+new Date()/1000) + '">');
            }
        }
    });
    $(document).on('submit', '.form_signup_recovery', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                if (data.r) {
                    if (data.r == 1) {
                        $('.data-base').remove();
                        $('.data-code').append('<input name="data[cphone]" type="hidden" value="1">');
                        $('.data-code').css('display', 'block');
                        $('input[name="data[code]"]').enable();
                    } else {
                        ajax_result(data);
                        href_go(url);
                    }

                } else {
                    ajax_result(data);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_change_phone', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                if (data.r) {
                    if (data.r == 1) {
                        $('.data-code').empty();
                        $('.data-code').append('<div class="alert alert-success" role="alert">'+langs('На Ваши номера телефонов были отправлены СМС с кодами подтверждения, введите их в поля ниже.')+'</div>');
                        $('.data-code').append('<div class="input-group" style="margin-bottom: 7px;"><span class="input-group-addon">'+langs('Код №1')+'</span><input type="text" class="form-control" name="data[code1]"></div>');
                        $('.data-code').append('<div class="input-group" style="margin-bottom: 7px;"><span class="input-group-addon">'+langs('Код №2')+'</span><input type="text" class="form-control" name="data[code2]"></div>');
                        $('input[name="data[code]"]').enable();
                    } else {
                        ajax_result(data);
                        href_go(url);
                    }
                } else {
                    ajax_result(data);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_change_mail', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                if (data.r) {
                    if (data.r == 1) {
                        $('.data-code').empty();
                        $('.data-code').append('<div class="alert alert-success" role="alert">'+langs('На Ваши электронные адресы были отправлены письма с кодами подтверждения, введите их в поля ниже.')+'</div>');
                        $('.data-code').append('<div class="input-group" style="margin-bottom: 7px;"><span class="input-group-addon">'+langs('Код №1')+'</span><input type="text" class="form-control" name="data[code1]"></div>');
                        $('.data-code').append('<div class="input-group" style="margin-bottom: 7px;"><span class="input-group-addon">'+langs('Код №2')+'</span><input type="text" class="form-control" name="data[code2]"></div>');
                        $('input[name="data[code]"]').enable();
                    } else {
                        ajax_result(data);
                        href_go(url);
                    }
                } else {
                    ajax_result(data);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_0', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');

        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    href_go(url);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_1', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    $('#base-modal').modal('hide');
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_2', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(location.href);
                    $('#base-modal').modal('hide');
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_3', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(location.href);
                }
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_4', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(location.href);
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_44', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(url);
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_5', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(location.href);
                    $('#base-modal').modal('hide');
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_6', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    ajax_url(url);
                    $('#base-modal').modal('hide');
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
    $(document).on('submit', '.form_7', function (e) {
        e.preventDefault();
        var url = $(this).attr('url');
        $(this).ajaxSubmit({
            dataType: 'json',
            data: {ajax_f: '1'},
            success: function (data) {
                ajax_result(data);
            },
            beforeSend: function () {
                $('.preloader-bar').css('top','0px');
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                $('.preloader-bar').css('top','-34px');
                $('#loader-ajax').css('display', 'none');
            }
        });
    });

    $(document).on('click', '.go-off-on', function (e) {
        e.preventDefault();
        var st = this;
        $.ajax({
            type: "POST",
            url: $(this).attr('href'),
            data: {ajax_f: '1'},
            dataType: "json",
            success: function (data) {
                ajax_result(data);
                if (data.r) {
                    if($(st).attr('status')==1){
                        $(st).removeClass('blue');
                        $(st).find("span").addClass('fa-circle-o').removeClass('fa-check-circle-o');
                        $(st).attr('status','0');
                    }else{
                        $(st).attr('status','1');
                        $(st).addClass('blue');
                        $(st).find("span").removeClass('fa-circle-o').addClass('fa-check-circle-o');
                    }
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    });
});
function handlerAnchors(href) {
    var url = $(href).attr('href');
    var state = {
        url: url
    }
    history.pushState(state, '', url);
    ajax_url2(url);
    return false;
}
function ajax_url(url, s) {
    var state = {
        url: url
    }
    history.pushState(state, '', url);
    ajax_url2(url, s);
    return false;
}
function check_url() {
    $('.menu-base li').removeClass('active');
    $('.menu-base li').removeClass('open');
    $( ".menu-base>li>a" ).each(function( index ) {
        if(window.location.pathname==$(this).attr('href')){
            $(this).closest('li').addClass('active');
            $(this).closest('ul').closest('li').addClass('active');
        }
    });
    if($('#menu-left').html()){
        $('.gamepl>.header>.menu>.dop').slideDown();
        $('.gamepl>.header>.in2').css('height','90px');
        $('.gamepl>.header>.menu').css('margin-bottom','60px');
    }else{
        $('.gamepl>.header>.menu>.dop').slideUp();
        $('.gamepl>.header>.in2').css('height','60px');
        $('.gamepl>.header>.menu').css('margin-bottom','30px');
    }
}
function ajax_url2(url, s) {
    $('[rel=tooltip]').tooltip('hide');
    var cache = $('#content-base').html();
    $('.preloader-bar').css('top','0px');
    if (conf['load'] == 1) {
        fly_p('2', langs('Повторите запрос через пару секунд'));
    } else {
        conf['load'] = 1;
        $('#loader-ajax').css('display', 'block');
        if (s != "1") {
            $("html,body").scrollTop(0);
        }
        $.ajax({
            url: url,
            type: "POST",
            data: 'ajax=1',
            dataType: "html",
            success: function (data) {
                /*$('#content-base').fadeOut("slow", function () { скрость загрузки */
				  $('#content-base').fadeIn(0, function () {

                    $('.preloader-bar').css('top','-34px');
                    $('#content-base').empty().append(data).css('display', 'block');
                    $('#speedbar').empty().append($('#nurl_speedbar').html());
                    $('#menu-left').empty().append($('#nurl_menu-left').html());
                    check_url();
                    $('title').html($('#nurl_title').html());
                    conf['load'] = 0;
                    $('#loader-ajax').css('display', 'none');
                    $('[rel=tooltip]').tooltip();
                    $('.tooltips').tooltip();
                    $('.popovers').popover();
                });
            },
            error: function (jqXHR, exception) {
                conf['load'] = 0;
                $('#content-base').empty().append(cache);
                return false;
            }
        });
    }
    return false;
}
function modal_resize() {
    $('.modal-dialog').css({
        position: 'fixed',
        left: ($(window).width() - $('.modal-dialog').outerWidth()) / 2,
        top: ($(window).height() - $('.modal-dialog').outerHeight()) / 2
    });
    setTimeout(function () {
        modal_resize()
    }, 100);
}

$(document).ready(function () {
    check_url();

    $('.in').on('inview', function(event, isInView, visiblePartX, visiblePartY) {
            if($(window).width()>1050) {
                if (isInView) {
                    $('.gamepl>.header>.menu').removeClass('fixed');
                    $('.gamepl>.header>.in2').css('display','none');
                } else {
                    $('.gamepl>.header>.menu').addClass('fixed');
                    $('.gamepl>.header>.in2').css('display','block');
                }
            }else{
                $('.gamepl>.header>.menu').removeClass('fixed');
                $('.gamepl>.header>.in2').css('display','none');
            }
    });

    $(".totop").hide();
    $(".totop a").click(function (e) {
        e.preventDefault();
        $("html, body").animate({scrollTop: 0}, "slow");
        return false;
    });
    window.onpopstate = function (event) {
        if (event.state.url.length > 0) {
            ajax_url2(event.state.url);
        }
    }
    $(document).on("click", ".menu-base a", function (e) {
        $('.menu-base li').removeClass('active');
        $('.menu-base li').removeClass('open');
        $(this).closest('li').addClass('active');
        $(this).closest('ul').closest('li').addClass('active');
    });
    $(document).on("click", ".page-logo a", function (e) {
        $('.menu-base li').removeClass('active');
        $('.menu-base li').removeClass('open');
        $('.menu-base li.home').addClass('active');
    });
    $(document).on("click", "a", function (e) {
        if ($(this).attr('href')) {
            if(location.href.indexOf('/admin') == -1){
                if ($(this).attr('href').indexOf('/admin') != -1) {
                    return true;
                }
            }else{
                if ($(this).attr('href').indexOf('/admin') == -1) {
                    return true;
                }
            }
            if ($(this).attr('href').indexOf('/download/') == -1) {
                if ($(this).attr('data-toggle') != "tab") {
                    if ($(this).attr('href').indexOf('#') == -1) {
                        if (!$(this).attr('target')) {
                            if ($(this).attr('href').indexOf('http') != -1) {
                                if ($(this).attr('href').indexOf(window.location.hostname) != -1) {
                                    e.preventDefault();
                                }
                            } else {
                                e.preventDefault();
                            }
                            if ($(this).attr('class')) {
                                if ($(this).attr('class').indexOf('ymodal') == -1) {
                                    handlerAnchors(this);
                                }
                            } else {
                                handlerAnchors(this);
                            }
                        }
                    }
                }
            }
        }
    });
    $(document).on("click", ".ymodal", function (e) {
        e.preventDefault();
        modal($(this).attr('href'));
    });
    $(document).on("mouseenter", "[data-toggle=tooltip]", function (e) {
        $(this).tooltip('show');
    });
    modal_resize();
    $(document).on("click", ".addons-mc-install", function (e) {
        e.preventDefault();
        server = $(this).attr('server');
        addon = $(this).attr('addon');
        var vara = this;
        $.ajax({
            type: "POST",
            url: "/servers/repository/install/" + server + "/" + addon,
            data: {ajax_f: '1'},
            dataType: "json",
            success: function (data) {
                pre_load_off();
                ajax_result(data);
                if (data.r) {
                    $(vara)
                        .removeClass('green')
                        .removeClass('addons-mc-install')
                        .addClass('red')
                        .addClass('addons-mc-remove')
                        .empty()
                        .append(langs('Удалить'));
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });

    });
    $(document).on("click", ".addons-mc-remove", function (e) {
        e.preventDefault();
        server = $(this).attr('server');
        addon = $(this).attr('addon');
        var vara = this;
        $.ajax({
            type: "POST",
            url: "/servers/repository/remove/" + server + "/" + addon,
            data: {ajax_f: '1'},
            dataType: "json",
            success: function (data) {
                pre_load_off();
                ajax_result(data);
                if (data.r) {
                    $(vara)
                        .removeClass('red')
                        .removeClass('addons-mc-remove')
                        .addClass('green')
                        .addClass('addons-mc-install')
                        .empty()
                        .append(langs('Установить'));
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });

    });

});


$(document).on("click", ".user_ban", function (e) {
    $.ajax({
        type: "POST",
        url: "/servers/rcon-bk/" + $(this).attr('sid'),
        data: {ajax_f: '1', "data[name]": $(this).attr('data'), "data[t]": '1'},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            ajax_url(location.href);
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});
$(document).on("click", ".user_unban", function (e) {
    $.ajax({
        type: "POST",
        url: "/servers/rcon-bk/" + $(this).attr('sid'),
        data: {ajax_f: '1', "data[name]": $(this).attr('data'), "data[t]": '2'},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            ajax_url(location.href);
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});

$(document).on("click", ".user_kick", function (e) {
    $.ajax({
        type: "POST",
        url: "/servers/rcon-bk/" + $(this).attr('sid'),
        data: {ajax_f: '1', "data[name]": $(this).attr('data')},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            ajax_url(location.href);
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});

$(document).on("click", ".post_lock", function (e) {
    e.preventDefault();
    id = $(this).attr('tid');
    $.ajax({
        type: "POST",
        url: "/forum/lock/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            if(data.r){
                ajax_url(location.href);
            }
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});

$(document).on("click", ".post_dell", function (e) {
    e.preventDefault();
    id = $(this).attr('tid');
    $.ajax({
        type: "POST",
        url: "/forum/del/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            if(data.r){
                ajax_url('/forum');
            }
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});

$(document).on("click", ".mes_dell", function (e) {
    e.preventDefault();
    id = $(this).attr('tid');
    $.ajax({
        type: "POST",
        url: "/forum/dell/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            ajax_result(data);
            if(data.r){
                ajax_url(location.href);
            }
        },
        beforeSend: function () {
            pre_load_on();
            $('#loader-ajax').css('display', 'block');
        },
        complete: function () {
            pre_load_off();
            $('#loader-ajax').css('display', 'none');
        }
    });
    return false;
});

function maps_install(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/maps/install/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('.maps_button_' + id).empty().append('<a onclick="maps_remove(\'' + id + '\',\'' + ids + '\')" class="t btn btn-danger btn-block">'+langs('Удалить')+'</a>');
            }
        }
    });
    return false;
}
function maps_remove(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/maps/remove/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('.maps_button_' + id).empty().append('<a onclick="maps_install(\'' + id + '\',\'' + ids + '\')" class="t btn btn-success btn-block">'+langs('Установить')+'</a>');
            }
        }
    });
    return false;
}


function maps2_install(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/maps2/install/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('.maps_button_' + id).empty().append('<a onclick="maps2_remove(\'' + id + '\',\'' + ids + '\')" class="t btn btn-danger btn-block">'+langs('Удалить')+'</a>');
            }
        }
    });
    return false;
}
function maps2_remove(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/maps2/remove/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('.maps_button_' + id).empty().append('<a onclick="maps2_install(\'' + id + '\',\'' + ids + '\')" class="t btn btn-success btn-block">'+langs('Установить')+'</a>');
            }
        }
    });
    return false;
}


function addons_install(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/repository/install/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('#addons_stats_1_' + id).empty();
                $('#addons_stats_1_' + id).append('<img src="/img/s_1.png" style="height:16px;"/>');
                $('#addons_stats_2_' + id).empty();
                $('#addons_stats_2_' + id).append('<a onclick="addons_remove(\'' + id + '\',\'' + ids + '\')" class="t">'+langs('Удалить')+'</a>');
            }
        }
    });
    return false;
}
function addons_remove(id, ids) {
    pre_load_on();
    $.ajax({
        type: "POST",
        url: "/servers/repository/remove/" + ids + "/" + id,
        data: {ajax_f: '1'},
        dataType: "json",
        success: function (data) {
            pre_load_off();
            ajax_result(data);
            if (data.r) {
                $('#addons_stats_1_' + id).empty();
                $('#addons_stats_1_' + id).append('<img src="/img/s_2.png" style="height:16px;"/>');
                $('#addons_stats_2_' + id).empty();
                $('#addons_stats_2_' + id).append('<a onclick="addons_install(\'' + id + '\',\'' + ids + '\')" class="t">'+langs('Установить')+'</a>');
            }
        }
    });
    return false;
}


function translit(str) {
    var ru = ("А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я").split("-")
    var en = ("A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya").split("-")
    var res = '';
    for (var i = 0, l = str.length; i < l; i++) {
        var s = str.charAt(i), n = ru.indexOf(s);
        if (n >= 0) {
            res += en[n];
        }
        else {
            res += s;
        }
    }
    return res;
}

$(document).on("click", ".lang>div", function (e) {
    e.preventDefault();
    if($(this).attr('value')){
        $.ajax({
            type: "POST",
            url: "/lang",
            data: {ajax_f: '1',lang:$(this).attr('value')},
            dataType: "json",
            success: function (data) {
                if(data.r){
                    location.href=location.href;
                }
            },
            beforeSend: function () {
                pre_load_on();
                $('#loader-ajax').css('display', 'block');
            },
            complete: function () {
                pre_load_off();
                $('#loader-ajax').css('display', 'none');
            }
        });
    }
    return false;
});
