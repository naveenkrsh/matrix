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
    }
    Player.KeyPrefix = "pattern-game-";
    Player.Key = {
        SIZE: Player.KeyPrefix + 'size',
        RATING: Player.KeyPrefix + 'rating',
        PlAYED: Player.KeyPrefix + 'played'
    };
    Player.prototype = {};
    Player.prototype.setGridsize = function(size) {
        store.set(Player.Key.SIZE+'-'+this.type, size);
    };
    Player.prototype.getGridsize = function() {
        var result = store.get(Player.Key.SIZE+'-'+this.type);
        if (result) {
            return result;
        } else {
            return 4;
        }
    };


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Player;
    else
        window.Player = Player;

})(store);
