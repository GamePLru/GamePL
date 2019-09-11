var gamepl = angular.module('gamepl', []);
gamepl.controller('body', function ($scope,$http,$timeout) {
    var data = {
        'tickets': [],
        'load':{},
        'active':"",
        'active_id':"",
        "timer":false
    };
    $scope.play = function () {
        document.getElementById("sound").play();
    };
    $scope.auto = function(){
        if(data.active=="ticket"){
            $.support('load',{
                act:"auto",
                act2:"ticket",
                id:data.active_id
            });
        }
    };
    $scope.login_form = function(){
        d = '<div class="form-login">' +
        '<img src="http://aviras.ru/img/logotype_gamepl.png">' +
        '<input class="form-control" name="data[email]" placeholder="E-mail" type="text">' +
        '<input class="form-control" name="data[password]" type="password" placeholder="Пароль">' +
        '<input class="form-control" name="data[domain]" placeholder="Домен" type="text">' +
        '<button class="btn-success">Войти</button>' +
        '</div>';
        angular.element(document.getElementsByClassName('body')).append(d);
    };
    angular.element(document).find('body').append('<audio id="sound" src="/js/1.mp3"></audio>');
    var d = '<div class="body">' +
        '</div>';
    angular.element(document).find('body').append(d);
    if(user_info['id']=='0'){
        $timeout(function() {
            //app.resized(400,320,0);
            $scope.login_form();
            angular.element(document).find('body').removeClass('page-on-load');
        }, 3000);

    }else{

    }
});