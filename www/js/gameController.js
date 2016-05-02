(function() {
    'use strict';

    angular.module('gameController', [])
        .controller('gameController', gameController);
    gameController.$inject = ['gameService', '$timeout', '$http'];

    function gameController(gameService, $timeout, $http) {
        var self = this;
        //I got this code here: http://ionden.com/a/plugins/ion.sound/en.html to make the sound for the button
        ion.sound({
           sounds: [
               {
                   alias: "snap",
                   name: "snap",
                   path: "../www/lib/ion-sound/sounds/",
                   volume: 0.9,
                   preload: false
               }
           ],
           path: "../www/lib/ion-sound/sounds/",
           preload: true,
           multiplay: true
        });
        self.incrementCounter = incrementCounter;
        self.level = gameService.level;
        self.$http = $http;
        self.selected = gameService.recorded;
        self.user = {};
        self.selectPlayer = selectPlayer;
        self.countdown = gameService.recorded.countdown;
        self.counter = gameService.recorded.counter;
        self.clicker = gameService.recorded.clicker;
        self.goal = gameService.recorded.goal;
        self.updatePlayer = updatePlayer;
        self.playSound = playSound;
        self.incrementCountdown = incrementCountdown;
        self.logout = logout;
        self.addPlayer = addPlayer;
        self.gameService = gameService;
        self.initPlayer = initPlayer;
        
        function initPlayer () {
            self.$http.get('/api/initPlayer').then(function(response){
                self.user = response.data;
                console.log(self.user);
            });
        }

        function playSound () {
            ion.sound.play("snap");
        }
        function addPlayer() {
            self.gameService.addPlayer();
        }
        function selectPlayer () {
            gameService.selectPlayer();
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
