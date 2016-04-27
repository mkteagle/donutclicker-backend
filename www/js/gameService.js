(function () {
    'use strict';
    angular.module('gameService', [])
        .service('gameService', gameService);

    gameService.$inject = ['ngToast', '$timeout', '$state', '$ionicHistory', '$ionicSideMenuDelegate', '$filter', '$http'];


    function gameService(ngToast, $timeout, $state, $ionicHistory, $ionicSideMenuDelegate, $filter, $http) {
        var self = this;
        self.$http = $http;
        self.incrementCounter = incrementCounter;
        self.updated = 100;
        self.showToast = showToast;
        self.incrementCountdown = incrementCountdown;
        self.updatePlayer = updatePlayer;
        self.upgrades = [];
        self.goal = 1000;
        self.user = {};
        self.newUser = {};
        self.childData = {};
        self.incrementClicker = incrementClicker;
        self.clickGrandpa = clickGrandpa;
        self.retrievePlayer = retrievePlayer;

        self.showError = showError;
        self.shuffleArray = shuffleArray;
        self.addPlayer = addPlayer;
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
        function retrievePlayer () {
            return self.user;
        }
        function shuffleArray () {
            self.shuffledArray = $filter('shuffle')(self.imgArray);
        }

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
        self.init = init;
        init();
        function addPlayer() {
            self.user = {
                name: '',
                img: '',
                gameplay: self.recorded
            };
            self.$http.post('/api/addPlayer', self.user).then(function(response) {
                self.user = response.data;
            });
            console.log(self.user);
        }
        function updatePlayer() {
            self.recorded.counter = self.recorded.counter - self.upgrades[self.recorded.index].goal;
            self.recorded.index++;
            self.recorded.upgrade = false;
            self.recorded.countdown = self.upgrades[self.recorded.index].goal;
            self.recorded.goal = self.upgrades[self.recorded.index].goal;
            self.recorded.level = self.upgrades[self.recorded.index].id + 'x';
            self.user.gameplay = self.recorded;
            self.$http.put('/api/updatePlayer', self.user).then(function(response){
                self.user = response.data;
            })

        }
        function showError(error) {
            ngToast.create({
                className: 'failure',
                content: error
            });
        }
        function init() {
            self.shuffleArray();
        }


        function showToast() {
            ngToast.create({
                className: 'ngtoast-default ngtoast-fly',
                content: self.recorded.level
            });
        }

        function incrementClicker() {
            self.recorded.clicker++;
            self.recorded.counter = self.recorded.counter - self.recorded.cost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.cost = self.recorded.cost * 2;
            return self.recorded.clicker;

        }

        function clickGrandpa() {
            self.recorded.grandpa = self.recorded.grandpa + 10;
            self.recorded.counter = self.recorded.counter - self.recorded.gcost;
            self.recorded.countdown = self.recorded.goal - self.recorded.counter;
            self.recorded.gcost = self.recorded.gcost * 2;
            return self.recorded.grandpa;
        }

        function incrementCountdown() {
            if (self.recorded.countdown <= 0) {
                self.recorded.upgrade = true;
                return self.recorded.countdown = 0;
            }
            else if (self.recorded.counter < self.upgrades[self.recorded.index].goal) {
                self.recorded.countdown = self.recorded.countdown - Number(self.upgrades[self.recorded.index].id);
                return self.recorded.countdown;
            }
            else {
                self.recorded.upgrade = true;
                self.recorded.countdown = self.recorded.countdown - Number(self.upgrades[self.recorded.index].id);
                return self.recorded.countdown;
            }
        }
        function incrementCounter() {
            if (self.recorded.counter < self.upgrades[self.recorded.index].goal) {
                self.recorded.counter = self.recorded.counter + self.upgrades[self.recorded.index].id;
                self.showToast();
                return self.recorded.counter;
            }
            else {
                self.recorded.counter = self.recorded.counter + self.upgrades[self.recorded.index].id;
                self.showToast();
                return self.recorded.counter;
            }

        }

    }

})();
// self.$http.put('/api/updatePlayer', self.user).then(function(response) {
//     self.user = response.data;
// })
// self.firebaseAuthLogin = firebaseAuthLogin;
// self.logout = logout;
// self.createUser = createUser;
// self.authWithPassword = authWithPassword;
// self.leaderboard = leaderboard;
// function logout() {
//     $timeout(function() {
//         ref.unauth();
//     });
//     ref.onAuth(function(authData) {
//         if (authData) {
//             console.log("Logged in");
//         } else {
//             console.log("Logged out");
//             self.user.img = 'http://www.junkiemonkeys.com/wp-content/uploads/2014/07/212119-Avatar.jpg';
//         }
//     });
//
//     console.log('User is logged out');
//     self.user.img = null;
//     console.log(self.user.img);
//     $ionicSideMenuDelegate.toggleRight();
//     $ionicHistory.nextViewOptions({historyRoot: true});
//     $state.go('app.login');
//
// }
// function init() {
//     self.authObj.$onAuth(function (authData) {
//         if (self.authObj.$getAuth()) {
//             self.id = authData.uid;
//             self.isLoggedIn = true;
//
//             self.user = $firebaseObject(ref.child('users').child(self.id));
//             self.user.$loaded().then(function () {
//                 if (self.user.name == undefined) {
//                     if (authData.google) {
//                         self.newUser.name = authData.google.displayName;
//                         self.newUser.img = authData.google.profileImageURL;
//                         self.user.$ref().set(self.newUser);
//                         self.user.gameplay = self.recorded;
//                         self.gameState();
//                     }
//                     if (authData.facebook) {
//                         console.log(authData);
//                         self.newUser.name = authData.facebook.displayName;
//                         self.newUser.img = authData.facebook.profileImageURL;
//                         self.user.$ref().set(self.newUser);
//                         self.user.gameplay = self.recorded;
//                         self.gameState();
//                     }
//                 }
//                 self.recorded.counter = self.user.gameplay.counter;
//                 self.recorded.clicker = self.user.gameplay.clicker;
//                 self.recorded.countdown = self.user.gameplay.countdown;
//                 self.recorded.grandpa = self.user.gameplay.grandpa;
//                 self.recorded.goal = self.user.gameplay.goal;
//                 self.recorded.level = self.user.gameplay.level;
//                 self.recorded.index = self.user.gameplay.index;
//                 self.recorded.cost = self.user.gameplay.cost;
//                 self.recorded.gcost = self.user.gameplay.gcost;
//                 self.gameState();
//
//             });
//         }
//
//     });
// }

// self.gameState = function () {
//     self.user.$ref().child('gameplay').update(self.recorded);
// };
// function leaderboard() {
//     ref.once("value", function(snapshot) {
//         snapshot.forEach(function(childSnapshot) {
//             self.childData = childSnapshot.val();
//         });
//
//     });
//     $state.go('app.leaderboard');
// }

// function firebaseAuthLogin(provider) {
//     self.authObj.$authWithOAuthPopup(provider).then(function (authData) {
//         console.log("Authenticated successfully with provider " + provider + " with payload:", authData);
//         $timeout(function() {
//             init();
//             $ionicHistory.nextViewOptions({historyRoot: true});
//             $state.go('app.game');
//         })
//     }).catch(function (error) {
//         console.error("Authentication failed:", error);
//     });
//
// }

// self.googleLogin = function () {
//     self.firebaseAuthLogin('google');
// };
// self.facebookLogin = function () {
//     self.firebaseAuthLogin('facebook');
// };
// function createUser(email, password) {
//     ref.createUser({
//         email: email,
//         password: password
//     }, function (error, userData) {
//         if (error) {
//             console.log("Error creating user:", error);
//             self.showError(error);
//         } else {
//             console.log("Successfully created user account with uid:", userData.uid);
//             self.user = $firebaseObject(ref.child('users').child(self.id));
//             self.message = 'Logged into Game';
//             self.newUser.name = authData.password.email;
//             self.newUser.img = "https://donut-click.firebaseapp.com/img/simpsons-donut.png";
//             self.user.$ref().set(self.newUser);
//             self.isLoggedIn = true;
//             self.gameState();
//             $state.go('app.splash');
//         }
//     });
// }
// function authWithPassword(email, password) {
//     ref.authWithPassword({
//         email: email,
//         password: password
//     }, function (error, authData) {
//         if (error) {
//             console.log("Login Failed!", error);
//             self.showError(error);
//         } else {
//             console.log("Authenticated successfully with payload:", authData);
//             self.id = authData.uid;
//             self.user = $firebaseObject(ref.child('users').child(self.id));
//             self.message = 'Logged into Game';
//             self.isLoggedIn = true;
//             self.newUser.name = authData.password.email;
//             self.newUser.img = "https://donut-click.firebaseapp.com/img/simpsons-donut.png";
//             self.user.$ref().set(self.newUser);
//             self.gameState();
//             $timeout(function () {
//                 $state.go('app.splash');
//             })
//         }
//     });
//
// }
