(function ($) {

    var methods = {
        init: function (options) {
            $('head').append('<link href="/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
            $('head').append('<link rel="stylesheet" type="text/css" href="/assets/global/plugins/bootstrap-toastr/toastr.min.css"/>');
            $('head').append('<link href="/css/jquery-ui-1.10.4.min.css" rel="stylesheet" type="text/css">');
            $('head').append('<script type="text/javascript" src="/js/base64.js"></script>');
            $('head').append('<script type="text/javascript" src="/js/jquery-ui-1.10.4.custom.min.js"></script>');
            $('head').append(' <script src="/assets/global/plugins/bootstrap-toastr/toastr.min.js"></script>');
            var con = '';
            con += '<div class="gamepl"></div>';
            $('body').empty().append(con);
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
