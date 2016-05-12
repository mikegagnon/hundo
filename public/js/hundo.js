
var hundo = {}
hundo.viz = {}

hundo.PieceTypeEnum = {
    BALL: "BALL",
    BLOCK: "BLOCK",
    GOAL: "GOAL"
}

hundo.DirectionEnum = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    NODIR: "NODIR"
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

hundo.Block.prototype.nudge = function(dir) {
    return false;
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

hundo.Ball.prototype.nudge = function(dir) {
    return false;
}

hundo.Goal = function(id, row, col, dir) {
    this.id = id;
    this.type = hundo.PieceTypeEnum.GOAL;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.oppositeDir = function(dir) {

    if (dir == hundo.DirectionEnum.UP) {
        return hundo.DirectionEnum.DOWN;
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return hundo.DirectionEnum.UP;
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return hundo.DirectionEnum.RIGHT;
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return hundo.DirectionEnum.LEFT;
    } else {
        console.error("Bad direction: " + dir)
    }
}

// dir is the direction of the momentum of piece doing the nudging
// returns true if this piece can accept the nudging piece
hundo.Goal.prototype.nudge = function(dir) {
    return this.dir == hundo.oppositeDir(dir);
}

// TODO: Assume boardConfig is untrusted
hundo.Board = function(boardConfig) {

    // is the ball at rest?
    this.atRest = true;

    // is the board finished? namely, the ball has gone out
    // of bounds or reached a goal
    this.done = false;

    this.solved = false;

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

    // Add goals to the matrix
    $.each(boardConfig.goals, function(index, goal) {
        var row = goal.row;
        var col = goal.col;
        var dir = goal.dir;
        THIS.matrix[row][col].push(new hundo.Goal(nextId++, row, col, dir));
    })
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

hundo.Board.prototype.getGoals = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.GOAL;
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

// see hundo.nudge
hundo.Board.prototype.nudge = function(row, col, dir) {

    var pieces = this.matrix[row][col];

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (!piece.nudge(dir)) {
            return false;
        }
    }

    return true;

}

hundo.Board.prototype.checkSolved = function() {

    var pieces = this.matrix[this.ball.row][this.ball.col]

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (piece.type == hundo.PieceTypeEnum.GOAL) {
            return true;
        }
    }

    return false;
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

    if (this.nudge(newRow, newCol, this.ball.dir)) {
        this.movePiece(this.ball, newRow, newCol);
        if (this.checkSolved()) {
            this.solved = true;
            this.atRest = true;
            this.ball.dir = hundo.DirectionEnum.NODIR;
        }
        return {
            "move": {
                "ball": this.ball,
                "dir": direction
            }
        }
    } else {
        this.ball.dir = hundo.DirectionEnum.NODIR;
        this.atRest = true;
        return {
            "collide": {
                "dir": direction,
                "recipients": this.matrix[newRow][newCol]
            }
        };
    } 
}

hundo.viz.init = function(boardConfig, vizConfig) {

    hundo.viz.boardSvg = d3.select("#boardSvg")
        .attr("width", boardConfig.numCols * vizConfig.cellSize)
        .attr("height", boardConfig.numRows * vizConfig.cellSize);

    hundo.viz.boardSvg.select("#background")
        .attr("width", boardConfig.numCols * vizConfig.cellSize)
        .attr("height", boardConfig.numRows * vizConfig.cellSize)
        .attr("style", "fill:black");
}

hundo.viz.pieceId = function(piece) {
    return "piece" + piece.id;
}

hundo.viz.dirToDegrees = function(dir) {
    if (dir == hundo.DirectionEnum.UP) {
        return 0;
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return 180;
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return 270;
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return 90;
    } else {
        console.error("Invalid direction:" + dir);
    }
}

hundo.viz.drawBoard = function(board) {

    hundo.viz.boardSvg.selectAll(".block")
        .data(board.getBlocks())
        .enter()
        .append("svg:use")
        .attr("class", "block")
        .attr("id", hundo.viz.pieceId)
        .attr("xlink:href", "#blockTemplate")
        .attr("transform", function(block) {
          var x = block.col * vizConfig.cellSize;
          var y = block.row * vizConfig.cellSize;
          return "translate(" + x + ", " + y + ") "
        });

    hundo.viz.boardSvg.selectAll(".ball")
        .data(board.getBalls())
        .enter()
        .append("svg:use")
        .attr("class", "ball")
        .attr("id", hundo.viz.pieceId)
        .attr("xlink:href", "#ballTemplate")
        .attr("transform", function(ball) {
          var x = ball.col * vizConfig.cellSize;
          var y = ball.row * vizConfig.cellSize;
          return "translate(" + x + ", " + y + ") "
        });

    hundo.viz.boardSvg.selectAll(".goal")
        .data(board.getGoals())
        .enter()
        .append("svg:use")
        .attr("class", "goal")
        .attr("id", hundo.viz.pieceId)
        .attr("xlink:href", "#goalTemplate")
        .attr("transform", function(goal) {
          var x = goal.col * vizConfig.cellSize;
          var y = goal.row * vizConfig.cellSize;
          var z = vizConfig.cellSize / 2;
          var degrees = hundo.viz.dirToDegrees(goal.dir);
          return "translate(" + x + ", " + y + ") " +
            "rotate(" + degrees + ", " + z + ", " + z + ")"
        });
}


hundo.viz.reset = function(board) {

    var pieces = board.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    })

    board.reset();

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        hundo.viz.boardSvg.select("#" + hundo.viz.pieceId(piece))
            .transition()
            .ease("linear")
            .attr("transform", function(piece) {
                var x = piece.col * vizConfig.cellSize;
                var y = piece.row * vizConfig.cellSize;
                return "translate(" + x + ", " + y + ") "
            })
            .duration(0);
    }

}

hundo.viz.stepAnimate = function(board) {
    var animate = board.step();

    if (board.atRest) {
        clearInterval(hundo.viz.animateInterval);
    }

    if (board.done) {
        setTimeout(
            function(){hundo.viz.reset(hundo.board);},
            hundo.viz.animateInterval);
    }

    if ("move" in animate) {
        if ("oob" in animate) {

        }
        ball = animate.move.ball;
        ballId = "#" + hundo.viz.pieceId(ball);
        hundo.viz.boardSvg.select(ballId)
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

    if (hundo.board.solved) {
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

    hundo.viz.stepAnimate(hundo.board);

    if (!hundo.board.atRest) {
        hundo.viz.animateInterval =
            setInterval(
                function(){hundo.viz.stepAnimate(hundo.board);},
                vizConfig.stepDuration);
    }

    if (hundo.board.done) {
        hundo.viz.reset(hundo.board);
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
        },
        {
            row: 2,
            col: 4
        }
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        }
    ],
    ball: {
        row: 2,
        col: 7,
    }
}

var vizConfig = {
    cellSize: 32,
    stepDuration: 50
}

document.onkeydown = hundo.viz.checkKey;
hundo.board = new hundo.Board(boardConfig);
hundo.viz.init(boardConfig, vizConfig);
hundo.viz.drawBoard(hundo.board);
