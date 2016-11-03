(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .service('notesStatus', function NotesStatus() {

            var _isInEditMode = false;

            this.getIsInEditMode = function () {
                return _isInEditMode;
            };

            this.setIsInEditMode = function (isInEditMode) {
                _isInEditMode = !!isInEditMode;
            };
        });

})();