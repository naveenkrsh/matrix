(function(Lava) {

    var Game = function(container_ids, input, size) {

        this.elem = container_ids

        this.boardElem = $('#' + this.elem.board_id);
        this.board = new Lava(input, size);
        this.minimum_swap = this.board.minimum_swap;
        this.current_swap = 0;
        //console.log(this.board);
        this.init();

        //console.log(this.board.current_empty);
        this.autoPlay();
    }


    Game.keycodes = {
        LEFT: {
            '37': 1
        },
        UP: {
            '38': 1
        },
        RIGHT: {
            '39': 1
        },
        DOWN: {
            '40': 1
        }
    }

    Game.events = {
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        RESIZE: 'resize',
        LOAD: 'load'
    };
    Game.prototype.init = function() {
        this.drawBoard();
        this.startListening();
        this.setBestSwap();
    };
    Game.prototype.setBestSwap = function() {
        $('#' + this.elem.best_swaps).text(this.minimum_swap);
    }
    Game.prototype.drawBoard = function() {
        var size = this.board.size;
        var box_size = this.getBoxSize();

        //var grid_size = box_size * size;
        //this.boardElem.css('width',grid_size);
        //console.log(box_size);
        this.boardElem.empty();
        for (var i = 0; i < size; i++) {
            var str = '<div class="row remove-bottom-margin">'

            for (var j = 0; j < size; j++) {
                var data = this.board.out.get(i, j);
                str += '<div class="col s1 center-align cell " id="cell-' + i.toString() + '-' + j.toString() + '" style="background:' + data.c + ';width:' + box_size + 'px;height:' + box_size + 'px;line-height: ' + box_size + 'px;">';
                // str += '<span class="center-align">' + this.board.out.get(i, j).d + '</span>'
                str += data.d;
                str += '</div>'
            }
            str += '</div>';

            this.boardElem.append(str);
        }
    };

    Game.prototype.handleEvent = function(e) {
        return (function(evtType, events) {
            switch (evtType) {
                case events.KEYDOWN:
                    this.onKeyDown(e);
                    break;
                case events.RESIZE:
                    this.drawBoard();
                    break;
            }
        }.bind(this))(e.type, Game.events);
    };
    Game.prototype.startListening = function() {
        // Keys.
        document.addEventListener(Game.events.KEYDOWN, this);
        //document.addEventListener(Game.events.KEYUP, this);
        window.addEventListener(Game.events.RESIZE, this);
    };

    Game.prototype.onKeyDown = function(e) {
        e.preventDefault();
        var pos = this.board.current_empty;
        var x = pos.x;
        var y = pos.y;
        if (Game.keycodes.LEFT[e.keyCode]) {

            if (this.board.move["Right"]()) {
                this.current_swap++;
                //this.board.display(this.board.out);
                this.updateUI(x, y);
            }
        }

        if (Game.keycodes.UP[e.keyCode]) {
            if (this.board.move["Down"]()) {
                this.current_swap++;
                //this.board.display(this.board.out);
                this.updateUI(x, y);
            }
        }

        if (Game.keycodes.RIGHT[e.keyCode]) {
            if (this.board.move["Left"]()) {
                this.current_swap++;
                //this.board.display(this.board.out);
                this.updateUI(x, y);
            }
        }

        if (Game.keycodes.DOWN[e.keyCode]) {
            if (this.board.move["Up"]()) {
                this.current_swap++;
                //this.board.display(this.board.out);
                this.updateUI(x, y);
            }
        }

    };
    Game.prototype.updateUI = function(x, y) {
        var data_cell_id = '#cell-' + x.toString() + '-' + y.toString();
        var data_elem = $(data_cell_id);

        var data = this.board.out.get(x, y);
        data_elem.text(data.d);
        data_elem.css('background', data.c);

        var current_empty = this.board.current_empty;

        var empty_id = '#cell-' + current_empty.x.toString() + '-' + current_empty.y.toString();
        var empty_elem = $(empty_id);
        var empty_data = this.board.out.get(current_empty.x, current_empty.y);
        empty_elem.text(empty_data.d);
        empty_elem.css('background', '#FFFFFF');

        $('#' + this.elem.current_swaps).text(this.current_swap);

    };
    Game.prototype.getBoxSize = function() {
        var window_height = window.innerHeight;
        var gameWidth = document.getElementById(this.elem.board_id).offsetWidth;
        // console.log(gameWidth);
        // console.log(window_height);
        if (gameWidth < window_height) {
            return Math.ceil((Math.ceil(gameWidth)) / this.board.size);
        } else {
            return Math.ceil((Math.ceil(window_height) - 20) / this.board.size);
        }
    }

    Game.prototype.autoPlay = function() {

        var that = this;
        //
        function move() {
            var pos = that.board.current_empty;
            var x = pos.x;
            var y = pos.y;
            var move = that.board.moveHistory.pop();
            that.board.display(that.board.out);
            that.board.move[move.opp]();
            that.board.display(that.board.out);
            that.current_swap++;
            that.updateUI(x, y);
            play();
        }

        //move();
        function play()
        {
            if(that.board.moveHistory.length >0)
                setTimeout(move, 1000);
        }

        play();
    }

    

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Game;
    else
        window.Game = Game;

    function OnDOMContentLoaded() {

    }

    function onResize() {

    }

})(Lava);
