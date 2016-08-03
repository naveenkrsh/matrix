if (typeof require !== 'undefined')
    var Matrix = require('./Matrix');

(function(Matrix) {
    'use strict';

    function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function Lava(input, size) {
        this.size = size;
        this.empty = { v: -1, d: " ", c: '#FFFFFF' };
        this.current_empty = {
            x: this.size - 1,
            y: this.size - 1
        };
        this.sufflefreq = [0.8, 1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.5, 2.9];
        this.minimum_swap = 0;
        this.swap_count = 0;
        this.gameStateHistory = [];
        this.moveHistory = [];
        this.move = this.getMove();
        this.input = input; //this.setInput();
        this.setEmpty(this.input);
        this.out = [];
        this.gameBackUp = {};
        this.suffle();

        this.display(this.input);
        this.display(this.out);
        //this.autoPlay();
    }

    Lava.prototype.getMove = function() {
        var that = this;
        return {
            Up: function() {
                var x = that.current_empty.x;
                var y = that.current_empty.y;

                if (x == 0) {
                    console.log('Invalid move');
                    return false;
                }
                that.out.set(x, y, that.out.get(--x, y));
                that.current_empty.x--;
                that.swap_count++;
                that.setEmpty(that.out);
                //console.log('up')
                return true;
            },
            Down: function() {
                var x = that.current_empty.x;
                var y = that.current_empty.y;
                if (x == that.size - 1) {
                    console.log('Invalid move');
                    return false;
                }
                that.out.set(x, y, that.out.get(++x, y));
                that.current_empty.x++;
                that.swap_count++;
                that.setEmpty(that.out);
                //console.log('down')
                return true;
            },
            Left: function() {
                var x = that.current_empty.x;
                var y = that.current_empty.y;
                if (y == 0) {
                    console.log('Invalid move');
                    return false;
                }
                that.out.set(x, y, that.out.get(x, --y));
                that.current_empty.y--;
                that.swap_count++;
                that.setEmpty(that.out);
                //console.log('left');
                return true;
            },
            Right: function() {
                var x = that.current_empty.x;
                var y = that.current_empty.y;
                if (y == that.size - 1) {
                    console.log('Invalid move');
                    return false;
                }
                that.out.set(x, y, that.out.get(x, ++y));
                that.current_empty.y++;
                that.swap_count++;
                that.setEmpty(that.out);
                //console.log('Right')

                return true;
            }
        };
    }

    Lava.prototype.setEmpty = function(matrix) {
        matrix.set(this.current_empty.x, this.current_empty.y, this.empty);
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
        //console.log(this.empty);
        ma.set(this.size - 1, this.size - 1, this.empty);

        //console.log(ma.data);
        return ma;
    }

    Lava.prototype.reSuffle = function() {
        this.current_empty = {
            x: this.size - 1,
            y: this.size - 1
        };
        this.setEmpty(this.input);
        this.minimum_swap = 0;
        this.swap_count = 0;
        this.moveHistory = [];
        this.suffle();
    }

    Lava.prototype.suffle = function() {
        var matrix = new Matrix(this.size, this.size);
        matrix.create(this.input.data);
        this.out = matrix;

        var last_move = null;
        var total_swap = 0;

        var freq = Math.floor(Math.random() * (this.sufflefreq.length - 1));

        var suffle_no = Math.round(this.size * this.size * this.sufflefreq[freq]);

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
            if (this.isConfigExists()) {
                this.move[last_move.opp]();
            } else {
                this.moveHistory.push(last_move);
                var game_state = JSON.stringify(this.out);
                //console.log(" game_state instanceof Matrix ", game_state instanceof Matrix);
                this.gameStateHistory.push(JSON.parse(game_state));
                total_swap++;
            }
            //this.display(this.out);
        }
        console.log("No of suffle_no :" + suffle_no);
        console.log("No of swap :" + total_swap);
        this.minimum_swap = total_swap;
        this.gameStateHistory = [];
        this.gameBackUp.data = $.extend(true, {}, this.out);
        //clone(this.out); //this.out.clone(); //JSON.parse(JSON.stringify(this.out));
        this.gameBackUp.empty = $.extend({},this.current_empty);
        this.gameBackUp.moveHistory = JSON.parse(JSON.stringify(this.moveHistory));
    };

    Lava.prototype.getValidMove = function(current_empty) {
        var move = [];
        if (current_empty.x != 0) {
            move.push({ 'move': 'Up', 'method': this.move.Up, 'opp': 'Down' });
        }
        if (current_empty.x != this.size - 1) {
            move.push({ 'move': 'Down', 'method': this.move.Down, 'opp': 'Up' });
        }

        if (current_empty.y != 0) {
            move.push({ 'move': 'Left', 'method': this.move.Left, 'opp': 'Right' });
        }
        if (current_empty.y != this.size - 1) {
            move.push({ 'move': 'Right', 'method': this.move.Right, 'opp': 'Left' });
        }

        return move;
    };

    Lava.prototype.isConfigExists = function() {

        //console.log(this.gameStateHistory);

        var isFound = false;
        for (var i = 0; i < this.gameStateHistory.length; i++) {
            isFound = true;
            //for (var j = 0; j < this.out.data.length; j++) {
            /*if (this.gameStateHistory[i][j].v != this.out.data[j].v) {
                isFound = false;
            }*/

            isFound = this.out.isEqual(this.gameStateHistory[i]);
            //}

            if (isFound)
                return true;
        }

        return isFound;
    };

    Lava.prototype.autoPlay = function() {
        //return;
        while (this.moveHistory.length > 0) {
            var move = this.moveHistory.pop();

            this.move[move.opp]();
        }

        this.display(this.out);
    }

    Lava.prototype.display = function(matrix) {
        console.log("*******Start********");
        var str = "";
        //console.log(matrix);
        for (var i = 0; i < matrix.size; i++) {
            str += " ";
            var data = matrix.getSeq(i);
            //console.log(data);
            if (data.d)
                str += data.d;

            if ((i + 1) % matrix.col == 0) {
                console.log(str);
                str = "";
            }


        }
        console.log("********End*********");
    }

    Lava.prototype.isGameOver = function() {
        return this.out.isEqual(this.input);
    }

    Lava.prototype.setInput = function(input) {
        this.input = input;
    }

    Lava.prototype.reset = function() {
        this.current_empty = jQuery.extend(true, {}, this.gameBackUp.empty);
        this.out = jQuery.extend(true, {}, this.gameBackUp.data)
        this.moveHistory = JSON.parse(JSON.stringify(this.gameBackUp.moveHistory));
        //this.moveHistory.prototype = this.moveHistoryBackUp.prototype;
    }

    //var l = new Lava();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Lava;
    else
        window.Lava = Lava;
})(Matrix);
