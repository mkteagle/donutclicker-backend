(function() {
    'use strict';

    angular.module('leaderboardController', [])
        .controller('leaderboardController', leaderboardController);
    leaderboardController.$inject = ['$timeout', '$http', 'ngToast', '$interval', '$filter'];

    function leaderboardController($timeout, $http, ngToast, $interval, $filter) {
        
    }
})();