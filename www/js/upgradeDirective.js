(function () {
    angular.module('upgradeDirective', [])
        .directive('upgradeDirective', upgradeDirective);
    upgradeDirective.$inject = ['gameService', '$timeout', '$interval'];
    function upgradeDirective (gameService, $timeout, $interval) {
        var upgradeController = function () {
            var uc = this;
            uc.recorded = gameService.recorded;
            //uc.upgrades = [];
            uc.gindex = gameService.recorded.gindex;
            uc.cost = gameService.recorded.cost;
            uc.gcost = gameService.recorded.gcost;
            uc.clickedAutoClicker = clickedAutoClicker;
            uc.upgradePlayer = upgradePlayer;
            uc.clickGrandpa = clickGrandpa;
            function upgradePlayer() {
                gameService.updatePlayer();
            }

            function clickedAutoClicker() {
                uc.recorded.clicker = gameService.incrementClicker();
                gameService.gameState();
            }

            function clickGrandpa() {
                uc.recorded.grandpa = gameService.clickGrandpa();
                gameService.gameState();
            }

            $interval(function () {
                uc.recorded.counter += uc.recorded.clicker;
                uc.recorded.counter += uc.recorded.grandpa;
                if (uc.recorded.countdown <= 0) {
                    uc.recorded.countdown = 0
                }
                else {
                    uc.recorded.countdown = uc.recorded.countdown - uc.recorded.clicker - uc.recorded.grandpa;
                }
                gameService.gameState();
            }, 1000)
        };
        return {
            restrict: 'EA',
            controller: upgradeController,
            controllerAs: 'uc',
            bindToController: true,
            templateUrl: '..//www/templates/upgrades.html'
        };
    }
})();
