(function(store) {
    (function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser.\
                    Please disable "Private Mode", or upgrade to a modern browser.')
            return
        } else {
            console.log("store is healthy!!");
        }
    })();

    function Player(type) {
        this.type = type;
        this.gridSize = this.getGridsize();
        this.patternType = this.getPatternType();
    }
    Player.KeyPrefix = "pattern-game-";
    Player.Key = {
        SIZE: Player.KeyPrefix + 'size',
        PATTERN: Player.KeyPrefix + 'pattern',
        MODEL:Player.KeyPrefix + 'model',
        RATING: Player.KeyPrefix + 'rating',
        PlAYED: Player.KeyPrefix + 'played'
    };
    Player.prototype = {};
    Player.prototype.setGridsize = function(size) {
        store.set(Player.Key.SIZE + '-' + this.type, size);
    };
    Player.prototype.getGridsize = function() {
        var result = store.get(Player.Key.SIZE + '-' + this.type);
        if (result) {
            return result;
        } else {
            return 4;
        }
    };
    Player.prototype.setPatternType = function(pattern) {
        store.set(Player.Key.PATTERN + '-' + this.type, pattern);
    };
    Player.prototype.getPatternType = function() {
        var result = store.get(Player.Key.PATTERN + '-' + this.type);
        if (result) {
            return Number(result);
        } else {
            return -1;
        }
    };

    Player.prototype.setPatternModel = function(data) {
        store.set(Player.Key.MODEL + '-' + this.type, data);
    }

    Player.prototype.getPatternModel = function() {
        var result = store.get(Player.Key.MODEL + '-' + this.type);
        if (result != null && result !=undefined) {
            return Boolean(result);
        } else {
            return true;
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Player;
    else
        window.Player = Player;

})(store);
