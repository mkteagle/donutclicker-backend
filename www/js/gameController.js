(function() {
    'use strict';

    angular.module('gameController', [])
        .controller('gameController', gameController);
    gameController.$inject = ['$timeout', '$http', 'ngToast', '$interval', '$filter'];

    function gameController($timeout, $http, ngToast, $interval, $filter) {
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
        self.upgradePlayer = upgradePlayer;
        self.playSound = playSound;
        self.incrementCountdown = incrementCountdown;
        self.logout = logout;
        self.initPlayer = initPlayer;
        self.incrementClicker = incrementClicker;
        self.clickGrandpa = clickGrandpa;
        self.upgrades = [];
        self.showToast = showToast;
        self.shuffleArray = shuffleArray;
        self.init = init;
        self.savePlayer = savePlayer;
        self.loadAll = loadAll;
        self.allUsers = [];
        for (var i = 1; i < 1000; i++) {
            self.upgrades.push({id: i, goal: self.goal});
            self.goal = self.goal * 2;
        }

        self.imgArray = [
            {'img': '../img/hotpinkdonut.png', 'enabled': true},
            {'img': '../img/bluedonut.png', 'enabled': false},
            {'img': '../img/greendonut.png', 'enabled': false},
            {'img': '../img/lightbluedonut.png', 'enabled': false},
            {'img': '../img/orangedonut.png', 'enabled': false},
            {'img': '../img/whitedonut.png', 'enabled': false},
            {'img': '../img/yellowdonut.png', 'enabled': false},
            {'img': '../img/chocolatedonut.png', 'enabled': false},
            {'img': '../img/blackdonut.png', 'enabled': false},
            {'img': '../img/lightpinkdonut.png', 'enabled': false}
        ];
        function shuffleArray () {
            self.shuffledArray = $filter('shuffle')(self.imgArray);
        }
        self.recorded = {};
        init();
        function init() {
            self.shuffleArray();
            self.loadAll();
        }
        function loadAll() {
            self.$http.get('/api/allPlayers').then(function(response) {
                self.allPlayers = response.data;
                console.log(self.allPlayers);
            })
        }
        function showToast() {
            ngToast.create({
                className: 'ngtoast-default ngtoast-fly',
                content: self.recorded.level
            });
        }
        function initPlayer () {
            self.$http.get('/api/initPlayer').then(function(response){
                self.user = response.data;
                self.recorded = self.user.gameplay;
                self.savePlayer();
                console.log(self.user);
            });
            self.user.gameplay = self.recorded;
            self.savePlayer();
        }

        function playSound () {
            ion.sound.play("snap");
        }
        function incrementClicker() {
            console.log(self.recorded.clicker);
            self.recorded.clicker++;
            self.recorded.counter = self.recorded.counter - self.recorded.cost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.cost = self.recorded.cost * 2;
            self.user.gameplay = self.recorded;
            self.savePlayer();
        }
        function clickGrandpa() {
            self.recorded.grandpa = self.recorded.grandpa + 10;
            self.recorded.counter = self.recorded.counter - self.recorded.gcost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.gcost = self.recorded.gcost * 2;
            self.user.gameplay = self.recorded;
            self.savePlayer();
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
            self.user.gameplay = self.recorded;
            self.savePlayer();
        }
        function incrementCounter () {
                self.recorded.counter = self.recorded.counter + self.upgrades[self.recorded.index].id;
                self.showToast();
                self.user.gameplay = self.recorded;
                self.savePlayer();
        }
        function upgradePlayer () {
            self.recorded.counter = self.recorded.counter - self.upgrades[self.recorded.index].goal;
            self.recorded.index++;
            self.recorded.upgrade = false;
            self.recorded.countdown = self.upgrades[self.recorded.index].goal;
            self.recorded.goal = self.upgrades[self.recorded.index].goal;
            self.recorded.level = self.upgrades[self.recorded.index].id + 'x';
            self.user.gameplay = self.recorded;
            self.savePlayer();
        }
        function savePlayer() {
            self.$http.put('/api/savePlayer', self.user).then(function(response) {
                self.user = response.data;
            })
        }
        function logout() {

        }
        $interval(function () {
            self.recorded.counter += self.recorded.clicker;
            self.recorded.counter += self.recorded.grandpa;
            if (self.recorded.countdown <= 0) {
                self.recorded.countdown = 0
            }
            else {
                self.recorded.countdown = self.recorded.countdown - self.recorded.clicker - self.recorded.grandpa;
            }
            self.savePlayer();
        }, 1000)
    }

})();
