(function () {
    angular.module('upgradeDirective', [])
        .directive('upgradeDirective', upgradeDirective);
    upgradeDirective.$inject = ['gameService', '$timeout', '$interval'];
    function upgradeDirective (gameService, $timeout, $interval) {
        var upgradeController = function () {
            var uc = this;
            uc.clickedAutoClicker = clickedAutoClicker;
            uc.upgradePlayer = upgradePlayer;
            uc.clickGrandpa = clickGrandpa;
            function upgradePlayer() {
                gameService.updatePlayer();
            }

            
        return {
            restrict: 'EA',
            controller: upgradeController,
            controllerAs: 'uc',
            bindToController: true,
            templateUrl: '../templates/upgrades.html'
        };
    }
})();
