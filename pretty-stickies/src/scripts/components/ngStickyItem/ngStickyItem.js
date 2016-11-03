(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .directive('ngStickyItem', function (notesStatus) {
            return {
                scope: {
                    headerMaxLength: '=',
                    contentMaxLength: '=',
                    context: '=',
                    readonlyEnabled: '=?',
                    onChange: '&',
                    onRemove: '&'
                },
                templateUrl: 'scripts/components/ngStickyItem/ngStickyItem.html',
                controller: function ($scope, $element, $timeout) {
                    function onChange() {
                        $scope.onChange({stickyItem: $scope.context});
                    }

                    $scope.isEditHeaderMode = false;
                    $scope.isEditContentMode = false;

                    function updateStatus() {
                        notesStatus.setIsInEditMode($scope.isEditHeaderMode || $scope.isEditContentMode);
                    }

                    updateStatus();

                    $scope.editHeader = function () {
                        if($scope.readonlyEnabled){
                            return;
                        }
                        $scope.isEditHeaderMode = true;
                        updateStatus();
                        $timeout(function () {
                            $element.find('h2').find('input')[0].focus();
                        });
                    };
                    $scope.saveHeader = function (shouldNotUpdateStatus) {
                        $scope.isEditHeaderMode = false;
                        if(!shouldNotUpdateStatus){
                            updateStatus();
                        }
                        onChange();
                    };

                    function isEnterOrTab(keyCode){
                        return (keyCode === 13 || keyCode === 9);
                    }
                    $scope.onHeaderEnter = function($event){
                        if(isEnterOrTab($event.keyCode)) {
                            $scope.saveHeader(false);
                            $scope.editContent($event);
                        }
                    };
                    $scope.onContentEnter = function($event) {
                        if (isEnterOrTab($event.keyCode) && !$event.ctrlKey && !$event.altKey && !$event.shiftKey) {
                            $scope.saveContent();
                        }
                    };
                    $scope.editContent = function ($event) {
                        if($($event.target).is('.clickable')){
                            return;
                        }
                        if($scope.readonlyEnabled){
                            return;
                        }
                        $scope.isEditContentMode = true;
                        updateStatus();
                        $timeout(function () {
                            $element.find('p').find('textarea')[0].focus();
                        });
                    };
                    $scope.saveContent = function (shouldNotUpdateStatus) {
                        $scope.isEditContentMode = false;
                        if (!shouldNotUpdateStatus) {
                            updateStatus();
                        }
                        onChange();
                    };
                    $scope.remove = function () {
                        $scope.onRemove({stickyItem: $scope.context});
                    };
                    $scope.getStyle = function() {
                        if ($scope.context && $scope.context.color) {
                            return {
                                background: $scope.context.color
                            };
                        }
                        return {};
                    };

                    function sanitizeText(text) {
                        return $('<div>').html(text).text().replace(/\n/gi, '<br/>');
                    }

                    var preProcessors = [
                    function (text) {
                        return sanitizeText(text);
                    }, function (text) {
                        return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, function (link, text, ref) {
                            if (_.isNull(text) || _.isUndefined(text) || _.isEmpty(text)) {
                                return link;
                            }
                            if (_.isNull(ref) || _.isUndefined(ref) || _.isEmpty(ref)) {
                                return link;
                            }
                            var anchor = $('<a>').attr('href', ref).attr('target', 'blank').text(text).addClass('clickable');
                            return $('<div>').append(anchor).html();
                        });
                    }];

                    function preprocessText(text) {
                        _.forEach(preProcessors, function (pre) {
                            if (text) {
                                text = pre(text);
                            }
                        });
                        return text;
                    }

                    $scope.$watch('context.text', function (text) {
                        $element[0].getElementsByClassName('text-renderer')[0].innerHTML = preprocessText(text);
                    });
                }
            }
        });

})();