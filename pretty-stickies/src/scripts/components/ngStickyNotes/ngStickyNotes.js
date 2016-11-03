(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .directive('ngStickyNotes', function () {
            return {
                scope:{
                    headerMaxLength: '=',
                    contentMaxLength: '=',
                    readonlyEnabled: '=?',
                    dragAndDropEnabled: '=?',
                    outDropEnabled: '=?',
                    magneticEffectEnabled: '=?'
                },
                templateUrl: 'scripts/components/ngStickyNotes/ngStickyNotes.html',
                controller: function ($scope, sharedNotes, $timeout, notesStatus) {

                    function reloadNotes() {
                        sharedNotes.load().then(function (stickyNotes) {
                            $scope.styckyNotes = stickyNotes || [];
                        });
                    }

                    function removeStickyItem(stickyItem){
                        if ($scope.readonlyEnabled) {
                            return;
                        }
                        sharedNotes.remove(stickyItem).then(function(){
                            reloadNotes();
                        });
                    }

                    function update(stickyItem){
                        if ($scope.readonlyEnabled) {
                            return;
                        }
                        sharedNotes.update(stickyItem);
                    }

                    reloadNotes();

                    $scope.save = function (stickyItem) {
                        update(stickyItem);
                    };

                    $scope.remove = removeStickyItem;

                    function updateOrder() {
                        angular.forEach($scope.styckyNotes, function (styckyItem, order) {
                            if (styckyItem.order !== order) {
                                styckyItem.order = order;
                                update(styckyItem);
                            }
                        });
                    }

                    function setSortability(){
                        $scope.sortableOptions.disabled = $scope.readonlyEnabled || !$scope.dragAndDropEnabled;
                    }

                    $scope.toFront = function(stickyItem){
                        if ($scope.dragAndDropEnabled && $scope.outDropEnabled) {
                            var index = _.indexOf($scope.styckyNotes, stickyItem);
                            if(index!==-1) {
                                $scope.styckyNotes.splice(index, 1);
                                $scope.styckyNotes.push(stickyItem);
                                updateOrder();
                            }
                        }
                    };

                    $scope.sortableOptions = {
                        disabled: !$scope.dragAndDropEnabled,
                        opacity: 0.8,
                        cursor: 'move',
                        start: function(){
                            notesStatus.setIsInEditMode(true);
                        },
                        beforeStop: function (event, ui) {
                            if ($scope.outDropEnabled) {
                                var style = {
                                    position: 'absolute',
                                    top: ui.position.top,
                                    left: ui.position.left
                                }
                                var $item = $(ui.item);
                                $item.css(style);
                                var itemId = $item.data('id');
                                var stickyItem = _.findWhere($scope.styckyNotes, {id: itemId});
                                if (stickyItem) {
                                    stickyItem.style = style;
                                    update(stickyItem);
                                }
                            }
                        },
                        stop: function(event, ui){
                            $(ui.item).css('z-index', '');
                            notesStatus.setIsInEditMode(false);
                        },
                        update: function (event, ui) {
                            if ($scope.outDropEnabled && $scope.magneticEffectEnabled) {
                                var style = {
                                    position: 'inherit'
                                }
                                var $item = $(ui.item);
                                $item.css(style);
                                var itemId = $item.data('id');
                                var stickyItem = _.findWhere($scope.styckyNotes, {id: itemId});
                                if (stickyItem) {
                                    stickyItem.style = style;
                                    update(stickyItem);
                                }
                            }
                            $timeout(updateOrder);
                        }
                    };

                    setSortability();
                    $scope.$watch('readonlyEnabled', function(dragAndDropEnabled){
                        setSortability();
                    });

                    $scope.$watch('dragAndDropEnabled', function(dragAndDropEnabled){
                        setSortability();
                    });

                    var onNewEventHandler = $scope.$on('ngStickyNotes.New', function (e, stickyItem) {
                        if ($scope.readonlyEnabled) {
                            return;
                        }
                        sharedNotes.add(stickyItem).then(function(){
                            reloadNotes();
                        });
                    });

                    var onRemoveEventHandler = $scope.$on('ngStickyNotes.Remove', function (e, stickyItem) {
                        removeStickyItem(stickyItem);
                    });

                    var onRemoveAllEventHandler = $scope.$on('ngStickyNotes.RemoveAll', function () {
                        if ($scope.readonlyEnabled) {
                            return;
                        }
                        sharedNotes.removeAll().then(function(){
                            reloadNotes();
                        });
                    });

                    var onRefreshEventHandler = $scope.$on('ngStickyNotes.Refresh', function () {
                        reloadNotes();
                    });

                    $scope.$on('$destroy', function() {
                        onNewEventHandler();
                        onRemoveEventHandler();
                        onRemoveAllEventHandler();
                        onRefreshEventHandler();
                    });
                }
            }
        });

})();