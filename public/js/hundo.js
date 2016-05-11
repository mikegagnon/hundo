
var hundo = {}

hundo.PieceTypeEnum = {
    BALL: "BALL",
    BLOCK: "BLOCK"
}

hundo.DirectionEnum = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    NODIR: 4
}

// every piece has unique id
hundo.Block = function(id, row, col) {
    this.id = id;
    this.type = hundo.PieceTypeEnum.BLOCK;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

hundo.Ball = function(id, row, col, dir) {
    this.id = id;
    this.type = hundo.PieceTypeEnum.BALL;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;

}

// TODO: Assume boardConfig is untrusted
hundo.Board = function(boardConfig) {

    // is the ball at rest?
    this.atRest = true;

    // is the board finished? namely, the ball has gone out
    // of bounds or reached a goal
    this.done = false;

    this.numRows = boardConfig.numRows;
    this.numCols = boardConfig.numCols;
    
    // The set of pieces that have moved out of bounds
    this.oob = [];

    // this.matrix[row][call] == array of piece objects
    this.matrix = new Array(this.numRows);
    for (var i = 0; i < this.numRows; i++) {
      this.matrix[i] = new Array(this.numCols);
      for (var j = 0; j < this.numCols; j++) {
        this.matrix[i][j] = new Array();
      }
    }

    var nextId = 0;

    var THIS = this;

    // Add blocks to the matrix
    $.each(boardConfig.blocks, function(index, block) { 
        var row = block.row;
        var col = block.col;
        THIS.matrix[row][col].push(new hundo.Block(nextId++, row, col));
    })
    
    // Add the ball to the matrix
    var row = boardConfig.ball.row;
    var col = boardConfig.ball.col;
    this.ball = new hundo.Ball(nextId++, row, col, hundo.DirectionEnum.NODIR);
    this.matrix[row][col].push(this.ball);
}

hundo.Board.prototype.reset = function() {

    // moved is the set of all pieces that have moved
    var moved = this.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    })

    for (var i = 0; i < moved.length; i++) {
        var piece = moved[i];
        this.movePiece(piece, piece.origRow, piece.origCol);
    }

    this.done = false;

    return moved;
}

hundo.Board.prototype.setDir = function(direction) {
    this.ball.dir = direction;
    this.atRest = false;
}

// func(piece) should return true iff the piece is of the type being gotten
hundo.Board.prototype.getPieces = function(func) {

    var pieces = [];

    $.each(this.matrix, function(i, row) {
        $.each(row, function(j, col) {
            $.each(col, function(k, piece) {
                if (func(piece)) {
                    pieces.push(piece);
                }
            })
        })
    });

    $.each(this.oob, function(i, piece){
        if (func(piece)) {
            pieces.push(piece);
        }
    })

    return pieces;
}
 
hundo.Board.prototype.getBlocks = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.BLOCK;
    });
};

hundo.Board.prototype.getBalls = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.BALL;
    });
};

// removes the first element in array for which func(element) is true
// if an element is removed, returns the index of the element removed
// otherwise, returns -1
hundo.arrayRemove = function(array, func) {

    var i;
    for (i = 0; i < array.length; i++) {
        if (func(array[i])) {
            break;
        }
    }

    if (i == array.length) {
        return -1;
    }

    array.splice(i, 1);

    return i;
}

hundo.Board.prototype.movePiece = function(piece, row, col) {

    var i;

    if (piece.row < 0 || piece.row >= this.numRows ||
        piece.col < 0 || piece.col >= this.numCols) {

        i = hundo.arrayRemove(this.oob, function(p) {
            return p.id = piece.id;
        })
    } else {
        var pieces = this.matrix[piece.row][piece.col];

        i = hundo.arrayRemove(pieces, function(p) {
            return p.id == piece.id;
        })
    }

    if (i == -1) {
        console.error("Could not remove piece");
        return;
    }

    if (row < 0 || row >= this.numRows ||
        col < 0 || col >= this.numCols) {
        this.oob.push(piece);
    } else {
        // add the piece to its new location
        this.matrix[row][col].push(piece);
    }
    piece.row = row;
    piece.col = col;

}

// returns null on fatal error
// else, returns an animation object, which describes how the
// the step should be animated
hundo.Board.prototype.step = function() {

    var direction = this.ball.dir;

    if (direction == hundo.DirectionEnum.NODIR) {
        console.error("Ball must have a direction to step");
        return null;
    }
    
    var dr = 0, dc = 0;
    if (direction == hundo.DirectionEnum.UP) {
        dr = -1;
    } else if (direction == hundo.DirectionEnum.DOWN) {
        dr = 1;
    } else if (direction == hundo.DirectionEnum.LEFT) {
        dc = -1;
    } else if (direction == hundo.DirectionEnum.RIGHT) {
        dc = 1;
    } else {
        console.error("Ball must have a direction to step");
        return null;
    }

    var newRow = this.ball.row + dr;
    var newCol = this.ball.col + dc;

    // Check for out of bounds
    if (newRow < 0 || newRow >= this.numRows ||
        newCol < 0 || newCol >= this.numCols) {

        this.atRest = true;
        this.done = true;
        this.ball.dir = hundo.DirectionEnum.NODIR;

        this.movePiece(this.ball, newRow, newCol);

        return {
            "move": {
                "ball": this.ball,
                "dir": direction
            },
            "oob": true
        };
    }

    if (this.matrix[newRow][newCol].length > 0) {
        this.ball.dir = hundo.DirectionEnum.NODIR;
        this.atRest = true;
        return {
            "collide": {
                "dir": direction,
                "recipients": this.matrix[newRow][newCol]
            }
        };
    } else {
        this.movePiece(this.ball, newRow, newCol);
        return {
            "move": {
                "ball": this.ball,
                "dir": direction
            }
        }
    }
}



var boardConfig = {
    numRows: 5,
    numCols: 10,
    blocks : [
        {
            row: 2,
            col: 1
        },
        {
            row: 2,
            col: 2
        },
        {
            row: 2,
            col: 8
        }
    ],
    ball: {
        row: 2,
        col: 3,
    }
}

var vizConfig = {
    cellSize: 32,
    stepDuration: 50
}

hundo.board = new hundo.Board(boardConfig);

hundo.boardSvg = d3.select("#boardSvg")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize);

hundo.boardSvg.select("#background")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize)
    .attr("style", "fill:black");

hundo.viz = {}

hundo.viz.pieceId = function(piece) {
    return "piece" + piece.id;
}

hundo.boardSvg.selectAll(".block")
    .data(hundo.board.getBlocks())
    .enter()
    .append("svg:use")
    .attr("class", "block")
    .attr("id", hundo.viz.pieceId)
    .attr("xlink:href", "#blockTemplate")
    .attr("transform", function(block) {
      var x = block.col * vizConfig.cellSize;
      var y = block.row * vizConfig.cellSize;
      return "translate(" + x + ", " + y + ") "
    })

hundo.boardSvg.selectAll(".ball")
    .data(hundo.board.getBalls())
    .enter()
    .append("svg:use")
    .attr("class", "ball")
    .attr("id", hundo.viz.pieceId)
    .attr("xlink:href", "#ballTemplate")
    .attr("transform", function(ball) {
      var x = ball.col * vizConfig.cellSize;
      var y = ball.row * vizConfig.cellSize;
      return "translate(" + x + ", " + y + ") "
    })

hundo.viz.reset = function() {

    var pieces = hundo.board.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    })

    hundo.board.reset();

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        hundo.boardSvg.select("#" + hundo.viz.pieceId(piece))
            .transition()
            .ease("linear")
            .attr("transform", function(ball) {
                var x = piece.col * vizConfig.cellSize;
                var y = piece.row * vizConfig.cellSize;
                return "translate(" + x + ", " + y + ") "
            })
            .duration(vizConfig.stepDuration);
    }

}

hundo.viz.stepAnimate = function() {
    var animate = hundo.board.step();

    if (hundo.board.atRest) {
        clearInterval(hundo.viz.animateInterval);
    }

    if (hundo.board.done) {
        setTimeout(hundo.viz.reset, hundo.viz.animateInterval);
    }

    if ("move" in animate) {
        if ("oob" in animate) {

        }
        ball = animate.move.ball;
        ballId = "#" + hundo.viz.pieceId(ball);
        hundo.boardSvg.select(ballId)
            .transition()
            .ease("linear")
            .attr("transform", function(ball) {
                var x = ball.col * vizConfig.cellSize;
                var y = ball.row * vizConfig.cellSize;
                return "translate(" + x + ", " + y + ") "
            })
            .duration(vizConfig.stepDuration);

    } else if ("collide" in animate) {

    }
}

hundo.viz.checkKey = function(e) {

    if (!hundo.board.atRest) {
        return;
    }

    var e = e || window.event;

    var direction;

    if (e.keyCode == '38') {
        direction = hundo.DirectionEnum.UP;
    } else if (e.keyCode == '40') {
        direction = hundo.DirectionEnum.DOWN;
    } else if (e.keyCode == '37') {
        direction = hundo.DirectionEnum.LEFT;
    } else if (e.keyCode == '39') {
        direction = hundo.DirectionEnum.RIGHT;
    } else {
        return;
    }

    hundo.board.setDir(direction);

    hundo.viz.stepAnimate();

    if (!hundo.board.atRest) {
        hundo.viz.animateInterval =
            setInterval(hundo.viz.stepAnimate, vizConfig.stepDuration);
    }

    if (hundo.board.done) {
        hundo.viz.reset();
    }


}

document.onkeydown = hundo.viz.checkKey;
