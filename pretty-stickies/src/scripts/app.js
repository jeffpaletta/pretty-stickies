(function() {
    'use strict';

    angular
        .module('ngStickyNotes', ['ngCookies', 'LocalStorageModule', 'ui.sortable', 'pascalprecht.translate', 'firebase'])
        .config(function ($translateProvider, EN_US, localStorageServiceProvider) {
            $translateProvider.translations('en-US', EN_US);
            $translateProvider.preferredLanguage('en-US');
            $translateProvider.useSanitizeValueStrategy(null);
            localStorageServiceProvider.setPrefix('ngStickyNotes');
        });

})();