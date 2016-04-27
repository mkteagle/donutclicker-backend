(function () {
    angular.module('app.login', [])
.controller('loginController', loginController);
    loginController.$inject = ['gameService', '$http'];
function loginController(gameService, $http) {
    // controller data and functions
    var vm = this;
    vm.authData = gameService.user;
    vm.recorded = gameService.recorded;
    vm.facebookLogin = facebookLogin;
    vm.googleLogin = googleLogin;
    vm.authWithPassword = authWithPassword;
    vm.createUser = createUser;
    vm.addPlayer = addPlayer;
    vm.email = '';
    vm.password = '';
    function addPlayer() {
        gameService.addPlayer();
    }
    function facebookLogin() {
        $http.get('/auth/facebook');
    }
    function googleLogin() {
        $http.get('/auth/google');
    }
    function createUser() {
        gameService.createUser(vm.email, vm.password);
        vm.password = '';
    }
    function authWithPassword() {
        gameService.authWithPassword(vm.email, vm.password);
        vm.password = '';
    }
}
})();