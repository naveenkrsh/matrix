'use strict';

var Matrix = require('./Matrix');

function Lava() {
    this.size = 3;
    this.move = this.getMove();
    this.input = this.setInput();
    this.empty = { v: -1, d: null };
    this.current_empty = {
        x: this.size - 1,
        y: this.size - 1
    };

    this.out = [];
    this.suffle();

}

Lava.prototype.getMove = function() {
    var that = this;
    return {
        Up: function() {
            var x = that.current_empty.x;
            var y = that.current_empty.y;
            that.out.set(x, y, that.out.get(--x, y));
            that.current_empty.x--;
            that.setEmpty();
            console.log('up')
        },
        Down: function() {
            var x = that.current_empty.x;
            var y = that.current_empty.y;
            that.out.set(x, y, that.out.get(++x, y));
            that.current_empty.x++;
            that.setEmpty();
            console.log('down')
        },
        Left: function() {
            var x = that.current_empty.x;
            var y = that.current_empty.y;
            that.out.set(x, y, that.out.get(x, --y));
            that.current_empty.y--;
            that.setEmpty();
            console.log('left')
        },
        Right: function() {
        	var x = that.current_empty.x;
            var y = that.current_empty.y;
            that.out.set(x, y, that.out.get(x, ++y));
            that.current_empty.y++;
            that.setEmpty();
            console.log('Right')
        }
    };
}

Lava.prototype.setEmpty = function() {
    this.out.set(this.current_empty.x, this.current_empty.y, this.empty);
}
Lava.prototype.setInput = function() {
    var ma = new Matrix(this.size, this.size);
    var v = 1;
    for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            ma.set(i, j, { v: v, d: v });
            v++;
        }
    }
    ma.set(this.size - 1, this.size - 1, this.empty);
    return ma;
}

Lava.prototype.suffle = function() {
    var matrix = new Matrix(3, 3);
    matrix.create(this.input.data);
    this.out = matrix;

    var last_move = null;

    var suffle_no = Math.round(this.size * this.size * 0.9);
    for (var i = 0; i < suffle_no; i++) {
        //console.log('new Move');
        var valid_move = this.getValidMove(this.current_empty);
        //console.log(valid_move)
        if (last_move) {
            valid_move = valid_move.filter(function(x) {
                if (x.move != last_move.opp) {
                    return true;
                } else {
                    return false;
                }

            });
        }

        var move_index = Math.floor(Math.random() * (valid_move.length - 1));
        last_move = valid_move[move_index];
        var move = last_move.method;
        move();
    }
};

Lava.prototype.getValidMove = function(current_empty) {
    var move = [];
    if (current_empty.x != 0) {
        move.push({ 'move': 'up', 'method': this.move.Up, 'opp': 'down' });
    }
    if (current_empty.x != this.size - 1) {
        move.push({ 'move': 'down', 'method': this.move.Down, 'opp': 'up' });
    }

    if (current_empty.y != 0) {
        move.push({ 'move': 'left', 'method': this.move.Left, 'opp': 'right' });
    }
    if (current_empty.y != this.size - 1) {
        move.push({ 'move': 'right', 'method': this.move.Right, 'opp': 'left' });
    }

    return move;
};


Lava.prototype.display = function(matix){

}

var l = new Lava();

//console.log(l.input.data);
//console.log(l.out.data);
