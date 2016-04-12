(function () {
    angular.module('app.login', [])
.controller('loginController', loginController);
    loginController.$inject = ['gameService'];
function loginController(gameService) {
    // controller data and functions
    var vm = this;
    vm.authData = gameService.user;
    vm.recorded = gameService.recorded;
    vm.facebookLogin = facebookLogin;
    vm.googleLogin = googleLogin;
    vm.authWithPassword = authWithPassword;
    vm.createUser = createUser;
    vm.email = '';
    vm.password = '';

    function facebookLogin() {
        gameService.facebookLogin();
        vm.email = '';
        vm.password = '';
    }
    function googleLogin() {
        gameService.googleLogin();
        vm.email = '';
        vm.password = '';
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