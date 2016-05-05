(function() {
    'use strict';

    angular.module('leaderboardController', [])
        .controller('leaderboardController', leaderboardController);
    leaderboardController.$inject = ['$timeout', '$http', 'ngToast', '$interval', '$filter'];

    function leaderboardController($timeout, $http, ngToast, $interval, $filter) {
        var self = this;
        self.$http = $http;
        self.loadAll = loadAll;
        self.init = init;
        self.init();
        function init() {
            self.loadAll();
        }
        function loadAll() {
            self.$http.get('/api/allPlayers').then(function(response) {
                self.allPlayers = response.data;
                console.log(self.allPlayers);
            })
        }
    }
})();