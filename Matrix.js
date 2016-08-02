(function() {
    'use strict'

    function Matrix(row, col) {
        this.row = row;
        this.col = col;
        this.size = row * col;
        this.data = new Array(this.size);
    }
    Matrix.prototype = {};
    Matrix.prototype.create = function(arr) {
        if (arr.length != this.size) {
            throw new Error("Array size is not matching with matrix");
        } else {
            var str = JSON.stringify(arr);
            this.data = JSON.parse(str);
        }
    };
    Matrix.prototype.getIndex = function(i, j) {
        var index = i * this.col + j;
        if (index > this.size - 1)
            throw new Error("Index out of bound");
        return index;
    };
    Matrix.prototype.set = function(i, j, value) {
        this.data[this.getIndex(i, j)] = value;
    };
    Matrix.prototype.get = function(i, j) {

       return this.data[this.getIndex(i, j)];
    };
    Matrix.prototype.isEqual = function(matrix) {
        if (matrix.size != this.size)
            return false;
        for (var i = 0; i < this.size; i++) {
            if (matrix.data[i].v !== this.data[i].v) {
                return false;
            }
        }
        return true;
    };


    module.exports = Matrix;

})();


/*
var ma = new Matrix(3, 3);

var v = 0;
for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        ma.set(i, j, v++);
    }
}

var mb = new Matrix(3, 3);
v = 0;
for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        mb.set(i, j, v++);
    }
}

var va = ma.isEqual(mb);

console.log(va);
*/
