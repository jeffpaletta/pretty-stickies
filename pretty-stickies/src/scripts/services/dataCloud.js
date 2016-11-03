(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .service('dataCloud', function DataCloud(notesStorage, $cookies, $q, $rootScope) {
            var config = notesStorage.getConfig();
            var uid = $cookies.get(config.cookieKey || '') || 'NONE';
            var fireURL = config.fireURL;
            if(!fireURL) {
                this.load = function () {
                    return $q.when([]);
                };
                this.save = function () {
                    return $q.when({});
                };
                return;
            }
            var db = new Firebase(fireURL);
            db.child(uid).on('value', function () {
                $rootScope.$broadcast('ngStickyNotes.Refresh');
            });
            this.load = function() {
                var deferred = $q.defer();
                db.child(uid).once('value', function (snapshot) {
                    deferred.resolve(snapshot.val());
                });
                return deferred.promise;
            };
            this.save = function(data) {
                var deferred = $q.defer();
                db.child(uid).once('value', function (snapshot) {
                    var payload = {};
                    payload[uid] = data;
                    snapshot.ref().parent().update(payload);
                    deferred.resolve(data);
                });
                return deferred.promise;
            };
        });

})();