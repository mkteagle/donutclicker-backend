(function () {
    angular.module('app.login', [])
.controller('loginController', loginController);
    loginController.$inject = ['gameService', '$http'];
function loginController(gameService, $http) {
    var self = this;
    self.$http = $http;
    self.facebookLogin = facebookLogin;
    self.googleLogin = googleLogin;
    
    function facebookLogin() {
        location.href = "/auth/facebook";
    }
    function googleLogin() {
        location.href = "/auth/google";
    }
}
})();