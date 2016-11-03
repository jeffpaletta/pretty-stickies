(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .provider('notesStorage', function NotesStorageProvider() {
            var config = {
                cookieKey: null
            };

            this.setConfig = function (newConfig) {
                config = newConfig;
            };

            this.$get = function (localStorageService, $cookies) {
                var DELIMETER = '|@:';
                var api = {};

                function getCookieValue() {
                    if (config.cookieKey) {
                        return $cookies.get(config.cookieKey);
                    }
                    return null;
                }

                function decorateKey(key) {
                    var cookieValue = getCookieValue();
                    if (cookieValue) {
                        return [key, cookieValue].join(DELIMETER);
                    }
                    return key;
                }

                function undecorate(key, opt_cookieValue) {
                    var cookieValue = opt_cookieValue || getCookieValue();
                    if (cookieValue) {
                        var postfix = DELIMETER + cookieValue;
                        var index = key.lastIndexOf(postfix);
                        if (index === -1 || (index + postfix.length) !== key.length) {
                            return null
                        }
                        return key.substr(0, index);
                    } else if (key.lastIndexOf(DELIMETER) !== -1) {
                        return null;
                    }
                    return key;
                }

                api.set = function (key, value) {
                    return localStorageService.set(decorateKey(key), value);
                };

                api.remove = function (key) {
                    return localStorageService.remove(decorateKey(key));
                };

                api.clearAll = function (opt_force) {
                    if (opt_force) {
                        localStorageService.clearAll();
                    } else {
                        _.forEach(api.keys(), api.remove);
                    }
                };

                api.keys = function () {
                    var keys = [];
                    var localStorageKeys = localStorageService.keys();
                    var cookieValue = getCookieValue();
                    for (var i = 0, len = localStorageKeys.length; i < len; i++) {
                        var undecoratedKey = undecorate(localStorageKeys[i], cookieValue);
                        if (undecoratedKey) {
                            keys.push(undecoratedKey);
                        }
                    }
                    return keys;
                };

                api.get = function (key) {
                    return localStorageService.get(decorateKey(key));
                };

                api.getConfig = function () {
                    return config;
                };

                return api;
            };

        });

})();