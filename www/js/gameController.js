(function() {
    'use strict';

    angular.module('gameController', [])
        .controller('gameController', gameController);
    gameController.$inject = ['gameService', '$timeout'];

    function gameController(gameService, $timeout) {
        var self = this;
        //I got this code here: http://ionden.com/a/plugins/ion.sound/en.html to make the sound for the button
        //ion.sound({
        //    sounds: [
        //        {
        //            alias: "snap",
        //            name: "snap",
        //            path: "../www/lib/ion-sound/sounds/",
        //            volume: 0.9,
        //            preload: false
        //        }
        //    ],
        //    path: "../www/lib/ion-sound/sounds/",
        //    preload: true,
        //    multiplay: true
        //});
        self.incrementCounter = incrementCounter;
        self.level = gameService.level;
        self.getChange = getChange;
        self.selected = gameService.recorded;
        self.user = gameService.user;
        self.selectPlayer = selectPlayer;
        self.countdown = gameService.recorded.countdown;
        self.counter = gameService.recorded.counter;
        self.clicker = gameService.recorded.clicker;
        self.goal = gameService.recorded.goal;
        self.updatePlayer = updatePlayer;
        self.playSound = playSound;
        self.incrementCountdown = incrementCountdown;
        self.loginData = {};
        self.logout = logout;
        self.gameService = gameService;

        function playSound () {
            ion.sound.play("snap");
        }
        function selectPlayer () {
            gameService.selectPlayer();
        }
        function getChange () {
            gameService.gameState();
        }
        function incrementCountdown() {
            self.selected.countdown = gameService.incrementCountdown();
        }
        function incrementCounter () {
            self.selected.counter = gameService.incrementCounter();
        }
        function updatePlayer () {
            gameService.updatePlayer();
        }

        //var navIcons = document.getElementsByClassName('ion-navicon');
        //for (var i = 0; i < navIcons.length; i++) {
        //    navIcons.addEventListener('click', function () {
        //        this.classList.toggle('active');
        //    });
        //}
        function logout() {
            gameService.logout();
            self.gameService.isUserLoggedIn = false;
        }
    }

})();
