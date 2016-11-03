(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .service('sharedNotes', function SharedNotes(notesStorage, colorsPaletteProvider, $q, $timeout, dataCloud, notesStatus) {

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }

            var self = this;

            function setId(note) {
                var uuid = guid();
                note.id = uuid;
            }

            function setOrder(note) {
                maxOrder++;
                note.order = maxOrder;
            }

            function setColor(note) {
                note.color = colorsPaletteProvider.nextColor();
            }

            function beforeUpdate() {
                if (isSyncEnabled && _.size(notesStorage.keys()) === 0) {
                    return fromCloudToLocal();
                }
                return $q.when({});
            }

            function fromCloudToLocal() {
                return dataCloud.load().then(function (notes) {
                    _.forEach(notes, function (note) {
                        notesStorage.set(note.id, {
                            title: note.title,
                            text: note.text,
                            date: note.date || new Date(),
                            color: note.color,
                            order: note.order,
                            style: note.style
                        });
                    });
                    return $q.when({});
                });
            }

            /*
             * Save data from the local storage
             */
            function sync() {
                // get data from the localStorage
                if (_.size(notesStorage.keys()) > 0) {
                    // save in the data cloud
                    postData(getUnsavedData())
                        .then(function () {
                            notesStorage.clearAll();
                        }, function () {
                            // an error while syncing has been occurred
                        });
                }
            }

            function getUnsavedData() {
                // returns data from the localStorage
                return loadLocalNotes();
            }

            function postData(data) {
                //check that the data is different
                return dataCloud.load()
                    .then(function (oldData) {
                        var o = oldData ? JSON.stringify(oldData) : '';
                        var n = data ? JSON.stringify(data) : '';
                        if (o !== n) {
                            return dataCloud.save(data);
                        }
                        return $q.when(data);
                    });
            }

            function tryToClearData() {
                if (isSyncEnabled && _.size(notesStorage.keys()) === 0) {
                    return dataCloud.save(null);
                }
                return $q.when();
            }

            var config = notesStorage.getConfig();
            var SYNC_INTERVAL = config.SYNC_INTERVAL;
            var isSyncEnabled = !!SYNC_INTERVAL;
            if (isSyncEnabled) {
                startSync(sync, SYNC_INTERVAL);
            }

            function startSync(syncFn, SYNC_INTERVAL) {
                var isInEditMode = notesStatus.getIsInEditMode();
                if (!isInEditMode) {
                    syncFn();
                }
                return $timeout(function () {
                    startSync(syncFn, SYNC_INTERVAL)
                }, SYNC_INTERVAL);
            }

            this.add = function (note) {
                setId(note);
                setOrder(note);
                if (!note.color) {
                    setColor(note);
                }
                return self.update(note);
            };

            this.update = function (note) {
                return beforeUpdate().then(function () {
                    notesStorage.set(note.id, {
                        title: note.title,
                        text: note.text,
                        date: note.date || new Date(),
                        color: note.color,
                        order: note.order,
                        style: note.style
                    });
                    return $q.when(note);
                });
            };

            this.remove = function (note) {
                return fromCloudToLocal().then(function(){
                    notesStorage.remove(note.id);
                    if(_.size(notesStorage.keys) === 0){
                        return tryToClearData();
                    }
                    return $q.when({});
                });
            };

            this.removeAll = function () {
                notesStorage.clearAll();
                return tryToClearData();

            };

            function loadLocalNotes() {
                var notes = [];
                _.forEach(notesStorage.keys(), function (key) {
                    var note = notesStorage.get(key);
                    note = _.extend({}, note, {id: key})
                    if (note.order > maxOrder) {
                        maxOrder = note.order;
                    }
                    notes.push(note);
                });
                return _.sortBy(notes, function (note) {
                    return note.order;
                });
            }

            var maxOrder = 0;
            this.load = function () {
                if (!isSyncEnabled || _.size(notesStorage.keys()) > 0) {
                    return $q.when(loadLocalNotes());
                }
                return dataCloud.load();
            };
        });

})();