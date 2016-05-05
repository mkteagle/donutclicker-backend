(function () {
    angular.module('app.login', [])
.controller('loginController', loginController);
    loginController.$inject = ['gameService', '$http'];
function loginController(gameService, $http) {
    // controller data and functions
    var self = this;
    self.$http = $http;
    self.authData = gameService.user;
    self.recorded = gameService.recorded;
    self.facebookLogin = facebookLogin;
    self.googleLogin = googleLogin;
    self.addPlayer = addPlayer;
    self.login = login;
    self.email = '';
    self.password = '';
    self.name = '';
    function addPlayer() {
        gameService.addPlayer();
    }
    
    function facebookLogin() {
        location.href = "/auth/facebook";
    }
    function googleLogin() {
        location.href = "/auth/google";
    }
    function login() {
        self.$http.post('/api/login', {
            username: self.username,
            password: self.password
        }).then( function() {
            console.log('done login');
        }).catch(function() {
            console.log('login error');
        });
    }
    function register() {
        console.log('register clicked');
        self.$http.post('/api/register', {
            _id: self.username,
            username: self.username,
            password: self.password,
            name: self.name
        }).then(function(){
            console.log('done creation');
        }).catch(function() {
            console.log('creation error');
        })
    }
}
})();