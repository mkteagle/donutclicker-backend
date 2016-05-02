(function() {
    'use strict';

    angular.module('gameController', [])
        .controller('gameController', gameController);
    gameController.$inject = ['gameService', '$timeout', '$http', 'ngToast', '$interval'];

    function gameController(gameService, $timeout, $http, ngToast, $interval) {
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
        self.$http = $http;
        self.user = {};
        self.goal = 1000;
        self.updated = 100;
        self.updatePlayer = updatePlayer;
        self.playSound = playSound;
        self.incrementCountdown = incrementCountdown;
        self.logout = logout;
        self.addPlayer = addPlayer;
        self.gameService = gameService;
        self.initPlayer = initPlayer;
        self.incrementClicker = incrementClicker;
        self.clickGrandpa = clickGrandpa;
        self.upgrades = [];
        self.showToast = showToast;
        for (var i = 1; i < 1000; i++) {
            self.upgrades.push({id: i, goal: self.goal});
            self.goal = self.goal * 2;
        }
        self.recorded = {
            counter: 0,
            index: 0,
            countdown: 1000,
            level: '1x',
            goal: 1000,
            clicker: 0,
            grandpa: 0,
            cost: 100,
            gcost: 1000
        };
        function showToast() {
            ngToast.create({
                className: 'ngtoast-default ngtoast-fly',
                content: self.recorded.level
            });
        }
        function initPlayer () {
            self.$http.get('/api/initPlayer').then(function(response){
                self.user = response.data;
                console.log(self.user);
            });
            // self.user = gameService.retrievePlayer();
        }

        function playSound () {
            ion.sound.play("snap");
        }
        function addPlayer() {
            self.gameService.addPlayer();
        }
        function incrementClicker() {
            self.recorded.clicker++;
            self.recorded.counter = self.recorded.counter - self.recorded.cost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.cost = self.recorded.cost * 2;
        }
        function clickGrandpa() {
            self.recorded.grandpa = self.recorded.grandpa + 10;
            self.recorded.counter = self.recorded.counter - self.recorded.gcost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.gcost = self.recorded.gcost * 2;
        }
        function incrementCountdown() {
            if (self.recorded.countdown <= 0) {
                self.recorded.upgrade = true;
                self.recorded.countdown = 0;
            }
            else if (self.recorded.counter < self.upgrades[self.recorded.index].goal) {
                self.recorded.countdown = self.recorded.countdown - Number(self.upgrades[self.recorded.index].id);
            }
            else {
                self.recorded.upgrade = true;
                self.recorded.countdown = self.recorded.countdown - Number(self.upgrades[self.recorded.index].id);
            }
            console.log(self.recorded.countdown);
        }
        function incrementCounter () {
            if (self.recorded.counter < self.upgrades[self.recorded.index].goal) {
                self.recorded.counter = self.recorded.counter + self.upgrades[self.recorded.index].id;
                self.showToast();
            }
            else {
                self.recorded.counter = self.recorded.counter + self.upgrades[self.recorded.index].id;
                self.showToast();
            }
            console.log(self.recorded.counter);
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
        $interval(function () {
            uc.recorded.counter += uc.recorded.clicker;
            uc.recorded.counter += uc.recorded.grandpa;
            if (uc.recorded.countdown <= 0) {
                uc.recorded.countdown = 0
            }
            else {
                uc.recorded.countdown = uc.recorded.countdown - uc.recorded.clicker - uc.recorded.grandpa;
            }
        }, 1000)
    }

})();
