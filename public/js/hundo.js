/**
 * Unless otherwise noted, the contents of this file are free and unencumbered
 * software released into the public domain.
 * See UNLICENSE.txt
 */

var hundo = {}

/**
 * Enums
 ******************************************************************************/

hundo.PieceTypeEnum = {
    BALL: "BALL",
    BLOCK: "BLOCK",
    GOAL: "GOAL",
    ICE: "ICE",
    ARROW: "ARROW",
    GBLOCK: "GBLOCK",
    SAND: "SAND",
}

hundo.DirectionEnum = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    NODIR: "NODIR"
}
/**
 * Function common to all pieces
 ******************************************************************************/
hundo.equalsTypeRowCol = function(a, b) {
    return a.type == b.type &&
        a.row == b.row &&
        a.col == b.col;
}

/**
 * Generates uuids for board pieces
 ******************************************************************************/

hundo.IdGenerator = function() {
    this.nextId = 0;
}

// I'll be impressed if this ever overflows
hundo.IdGenerator.prototype.next = function() {
    return this.nextId++;
}

hundo.idGenerator = new hundo.IdGenerator();

/**
 * Block board pieces
 ******************************************************************************/

// id is a uuid relative to board pieces
hundo.Block = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.BLOCK;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

// returns true iff the piece were pushed in direction dir
hundo.Block.prototype.nudge = function(dir, board) {
    return [false, []];
}

hundo.Block.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

/**
 * Ball board piece
 ******************************************************************************/

hundo.Ball = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.BALL;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Ball.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Ball.prototype.nudge = function(dir, board, commit) {

    var [dr, dc] = hundo.Board.drdc(dir);

    var row = this.row + dr;
    var col = this.col + dc;

    var [nudged, animations] = board.nudge(row, col, dir, commit)

    if (nudged) {
        if (commit) {
            board.movePiece(this, row, col);
        }
        animations.push(
            {
                "move": {
                    "ball": this,
                    "dir": dir,
                }
            });
        return [true, animations];
    } else {
        return [false, animations];
    }
}

/**
 * Goal board pieces
 ******************************************************************************/

hundo.Goal = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.GOAL;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Goal.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Goal.getPusher = function(row, col, dir) {

    var [dr, dc] = hundo.Board.drdc(dir);

    dr *= -1;
    dc *= -1;

    return [row + dr, col + dc];
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
hundo.Goal.prototype.nudge = function(dir, board) {

    var [pusherRow, pusherCol] = hundo.Goal.getPusher(this.row, this.col, dir);

    // gblocks not allowed in goals
    if (board.getPiece(pusherRow, pusherCol, hundo.PieceTypeEnum.GBLOCK)) {
        return [false, []];
    }

    return [this.dir == hundo.oppositeDir(dir), []];

}

/**
 * Ice cube board pieces
 ******************************************************************************/

hundo.Ice = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.ICE;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

hundo.Ice.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

hundo.Ice.prototype.nudge = function(dir, board, commit) {

    // If ice is in the goal, then it can't move
    var occupyGoal = false;

    _.each(board.matrix[this.row][this.col], function(piece) {
        if (piece.type == hundo.PieceTypeEnum.GOAL) {
            occupyGoal = true;
        }
    })

    if (occupyGoal) {
        return [false, []];
    }

    var [dr, dc] = hundo.Board.drdc(dir);

    var row = this.row + dr;
    var col = this.col + dc;

    var [nudged, animations] = board.nudge(row, col, dir, commit)

    if (nudged) {
        if (commit) {
            board.movePiece(this, row, col);
        }
        animations.push(
            {
                "move": {
                    "ice": this,
                    "dir": dir
                }
            });
        return [true, animations];
    } else {
        return [false, animations];
    }
}

/**
 * Arrow board pieces
 ******************************************************************************/

hundo.Arrow = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.ARROW;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Arrow.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Arrow.getPusher = hundo.Goal.getPusher;

// TODO: implement
hundo.Arrow.prototype.nudge = function(dir, board) {

    var [pusherRow, pusherCol] = hundo.Arrow.getPusher(this.row, this.col, dir);

    // gblocks not allowed in arrows
    if (board.getPiece(pusherRow, pusherCol, hundo.PieceTypeEnum.GBLOCK)) {
        return [false, []];
    }

    var result = this.dir == dir || (
        board.matrix[this.row][this.col].length == 2 &&
        board.getPiece(this.row, this.col, hundo.PieceTypeEnum.BALL) &&
        this.dir == hundo.oppositeDir(dir))
    return [result, []];
}

/**
 * Gblock board pieces
 ******************************************************************************/

hundo.Gblock = function(row, col, groupNum) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.GBLOCK;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.groupNum = groupNum;
}

hundo.Gblock.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.groupNum == piece.groupNum;
}


// BUG: every gblock piece must nudge
hundo.Gblock.prototype.nudge = function(dir, board, commit, fromGblock) {
 

    // nudge this block's neighbors, but only if this nudge isn't already
    // part of a neighbor check
    if (!fromGblock) {

        var neighbors = board.gblocks[this.groupNum];

        var THIS = this;

        // nudgeResults == the list of nudge results for each neighbor
        var nudgeResults = _.map(neighbors, function(neighbor) {
                return neighbor.nudge(dir, board, commit, true);
            });

        // If there are any false values in nudgeResults, then this nudge
        // fails
        var i = _.findIndex(nudgeResults, function(result) {
            return !result[0];
        });

        // Get the animations of the neighbors
        var animations = _.flatMap(nudgeResults, function(result) {
            return result[1];
        });

        if (i >= 0) {
            return [false, animations];
        } else {
            return [true, animations];
        }
    } else {
        var [dr, dc] = hundo.Board.drdc(dir);

        var row = this.row + dr;
        var col = this.col + dc;

        var nudged, animations;

        var pushingIntoGblock;

        // TODO: factor out this if expression into a function
        if (row >= 0 && row < board.numRows &&
            col >= 0 && col < board.numCols) {
            pushingIntoGblock =
                board.getPiece(row, col, hundo.PieceTypeEnum.GBLOCK);
        }

        if (row < 0 || row >= board.numRows ||
            col < 0 || col >= board.numCols) {
            nudged = false;
            animations = [];

        // HACK
        } else if (board.getPiece(row, col, hundo.PieceTypeEnum.SAND)) {
            if (commit) {
                board.stopBall();
            }
            nudged = true;
            animations = [];

        } else if (pushingIntoGblock &&
                pushingIntoGblock.groupNum == this.groupNum) {
            nudged = true;
            animations = [];
        } else {
            var [nudged, animations] = board.nudge(row, col, dir, commit)
        }

        if (nudged) {
            if (commit) {
                board.movePiece(this, row, col);
            }
            animations.push(
                {
                    "move": {
                        "gblock": this,
                        "dir": dir
                    }
                });
            return [true, animations];
        } else {
            return [false, animations];
        }
    }

}

/**
 * Sand board pieces
 ******************************************************************************/

hundo.Sand = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.SAND;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

// returns true iff the piece were pushed in direction dir
hundo.Sand.prototype.nudge = function(dir, board, commit) {

    var ballOnTop = board.getPiece(this.row, this.col, hundo.PieceTypeEnum.BALL);

    if (commit && !ballOnTop) {
        board.stopBall();
    }
    return [true, []];
}

hundo.Sand.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

/**
 * Board encapsulates the model of the game (MVC style)
 ******************************************************************************/

// TODO: Assume boardConfig is untrusted
hundo.Board = function(boardConfig) {

    // is the ball at rest?
    this.atRest = true;

    // is the board finished? namely, if the ball has gone out
    // of bounds or reached a goal
    this.done = false;

    this.solved = false;

    this.numRows = boardConfig.numRows;
    this.numCols = boardConfig.numCols;
    
    // The set of pieces that have moved out of bounds
    this.oob = [];

    // this.gblocks[gblock.groupNum] == the set of gblocks in that group
    this.gblocks = {}

    // this.matrix[row][call] == array of piece objects
    this.matrix = new Array();
    for (var i = 0; i < this.numRows; i++) {
      this.matrix[i] = new Array();
      for (var j = 0; j < this.numCols; j++) {
        this.matrix[i][j] = new Array();
      }
    }

    var THIS = this;

    // TODO: check return values for addPiece

    // Add blocks to the matrix
    _.each(boardConfig.blocks, function(block){
        var piece = new hundo.Block(block.row, block.col)
        THIS.addPiece(piece);
    });

    // Add the ball to the matrix
    if ("ball" in boardConfig) {
        var row = boardConfig.ball.row;
        var col = boardConfig.ball.col;
        var ball = new hundo.Ball(row, col, hundo.DirectionEnum.NODIR);
        this.addPiece(ball);
    }

    // Add goals to the matrix
    _.each(boardConfig.goals, function(goal) {
        var row = goal.row;
        var col = goal.col;
        var dir = goal.dir;
        var piece = new hundo.Goal(row, col, dir);
        THIS.addPiece(piece);
    });

    // Add ice to the matrix
    _.each(boardConfig.ice, function(ice) {

        if (THIS.inBounds(ice.row, ice.col)) {
            var row = ice.row;
            var col = ice.col;
            var piece = new hundo.Ice(row, col);
            THIS.addPiece(piece);
        } else {
            THIS.oob.push(ice);
        }
    });

    // Add arrows to the matrix
    _.each(boardConfig.arrows, function(arrow) {
        var row = arrow.row;
        var col = arrow.col;
        var dir = arrow.dir;
        var piece = new hundo.Arrow(row, col, dir);
        THIS.addPiece(piece);
    });

    // Add gblocks to the matrix
    _.each(boardConfig.gblocks, function(gblock) {
        var row = gblock.row;
        var col = gblock.col;
        var groupNum = gblock.groupNum;
        var piece = new hundo.Gblock(row, col, groupNum);
        THIS.addPiece(piece);
    });

    // Add sand to the matrix
    _.each(boardConfig.sand, function(sand) {
        var row = sand.row;
        var col = sand.col;
        var piece = new hundo.Sand(row, col);
        THIS.addPiece(piece);
    });
}

hundo.Board.prototype.inBounds = function(row, col) {
    if (row >= 0 && row < this.numRows &&
        col >= 0 && col < this.numCols) {
        return true;
    }
}


// TODO: is there a better way to do this?
hundo.setEq = function(set1, set2) {
    if (set1.length != set2.length) {
        return false;
    }

    var matches = true;
    _.each(set1, function(x) {
        var singleMatch = false;
        _.each(set2, function(y) {
            if (x.eq(y)) {
                singleMatch = true;
            }
        })

        if (!singleMatch) {
            matches = false;
        }
    });

    return matches;

}

hundo.Board.prototype.eq = function(board) {

    if (this.numRows != board.numRows || this.numCols != board.numCols) {
        return false;
    }

    if (this.ball && !board.ball || !this.ball && board.ball) {
        return false;
    }

    if (this.ball && board.ball) {
        if (this.ball.row != board.ball.row ||
            this.ball.col != board.ball.col) {
            return false;
        }
    }

    for (var r = 0; r < this.numRows; r++) {
        for (var c = 0; c < this.numCols; c++) {
            if (!hundo.setEq(this.matrix[r][c], board.matrix[r][c])) {
                return false;
            }
        }
    }

    return true;
}

hundo.Board.prototype.isEmptyCell = function(row, col) {
    return this.matrix[row][col].length == 0;
}

hundo.Board.prototype.hasBall = function() {

    var balls = this.getPieces(function(piece) {
        return piece.type == hundo.PieceTypeEnum.BALL;
    });

    return balls.length >= 1;
}

hundo.Board.prototype.clearCell = function(row, col) {
    if (typeof this.ball != "undefined" &&
        this.ball.row == row && this.ball.col == col) {
        this.ball = undefined;
    }
    this.matrix[row][col] = [];
}

hundo.Board.prototype.getPiece = function(row, col, type) {

    return _.find(this.matrix[row][col], function(piece){
        return piece.type == type;
    });
}

// TODO: refactor with a function piece.compatible()
hundo.Board.prototype.canAddPiece = function(piece) {

    if (piece.type == hundo.PieceTypeEnum.BALL) {
        return !this.hasBall() &&
            (this.matrix[piece.row][piece.col].length == 0  ||
            (this.matrix[piece.row][piece.col].length == 1 &&
            (this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.ARROW) ||
            this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.SAND) ||
            this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.GOAL))));
    }

    else if (piece.type == hundo.PieceTypeEnum.BLOCK ||
        piece.type == hundo.PieceTypeEnum.BALL) {
        return this.matrix[piece.row][piece.col].length == 0;
    }

    else if (piece.type == hundo.PieceTypeEnum.ICE) {
        return this.matrix[piece.row][piece.col].length == 0 ||
            (this.matrix[piece.row][piece.col].length == 1 &&
            (this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.GOAL) ||
             this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.ARROW)));
    }

    else if (piece.type == hundo.PieceTypeEnum.GOAL) {
        return this.matrix[piece.row][piece.col].length == 0 ||
            (this.matrix[piece.row][piece.col].length == 1 &&
            (this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.ICE) ||
            this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.BALL)));
    }

    else if (piece.type == hundo.PieceTypeEnum.ARROW) {
        return this.matrix[piece.row][piece.col].length == 0 ||
            (this.matrix[piece.row][piece.col].length == 1 &&
            (this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.ICE) ||
             this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.BALL)));
    }

    else if (piece.type == hundo.PieceTypeEnum.GBLOCK) {
        return this.matrix[piece.row][piece.col].length == 0;
    }

    else if (piece.type == hundo.PieceTypeEnum.SAND) {
        return this.matrix[piece.row][piece.col].length == 0 ||
            (this.matrix[piece.row][piece.col].length == 1 &&
            (this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.ICE) ||
             this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.BALL) ||
             this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.GBLOCK) ||
             this.getPiece(piece.row, piece.col, hundo.PieceTypeEnum.BALL)));
    }

    else {
        console.error("Unimplemented addPiece");
        console.error(piece);
        return false;
    }

}

hundo.Board.prototype.addPiece = function(piece) {

    if (this.canAddPiece(piece)) {
        this.matrix[piece.row][piece.col].push(piece)

        if (piece.type == hundo.PieceTypeEnum.BALL) {
            this.ball = piece;
        } else if (piece.type == hundo.PieceTypeEnum.GBLOCK) {

            if (!(piece.groupNum in this.gblocks)){
                this.gblocks[piece.groupNum] = [];
            }   

            this.gblocks[piece.groupNum].push(piece);
        }

        return true;
    } else {
        return false;
    }
}

hundo.Board.prototype.reset = function() {

    var THIS = this;

    // moved is the set of all pieces that have moved
    var moved = this.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    });

    _.each(moved, function(piece){
        THIS.movePiece(piece, piece.origRow, piece.origCol); 
    });

    this.done = false;
    this.solved = false;

    return moved;
}

hundo.Board.prototype.setDir = function(direction) {
    this.ball.dir = direction;
    this.atRest = false;
}

hundo.Board.prototype.stopBall = function() {
    this.ball.dir = hundo.DirectionEnum.NODIR;
    this.atRest = true;
}

// func(piece) should return true iff the piece is of the type being gotten
hundo.Board.prototype.getPieces = function(func) {

    var pieces = [];

    _.each(this.matrix, function(row) {
        _.each(row, function(col) {
            _.each(col, function(piece) {
                if (func(piece)) {
                    pieces.push(piece);
                }
            })
        })
    });

    _.each(this.oob, function(piece){
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

hundo.Board.prototype.getIce = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.ICE;
    });
};

hundo.Board.prototype.getArrows = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.ARROW;
    });
};

hundo.Board.prototype.getGblocks = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.GBLOCK;
    });
};

hundo.Board.prototype.getSand = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.SAND;
    });
};

hundo.Board.prototype.getJson = function() {

    var j = {
        numRows: this.numRows,
        numCols: this.numCols,
        blocks: _.map(this.getBlocks(), function(block) {
                return {
                    row: block.row,
                    col: block.col
                }
            }),
        goals: _.map(this.getGoals(), function(goal) {
                return {
                    row: goal.row,
                    col: goal.col,
                    dir: goal.dir
                }
            }),
        ice: _.map(this.getIce(), function(ice) {
                return {
                    row: ice.row,
                    col: ice.col
                }
            }),
        arrows: _.map(this.getArrows(), function(arrow) {
                return {
                    row: arrow.row,
                    col: arrow.col,
                    dir: arrow.dir
                }
            }),
        gblocks: _.map(this.getGblocks(), function(gblock) {
                return {
                    row: gblock.row,
                    col: gblock.col,
                    groupNum: gblock.groupNum
                }
            }),
        sand: _.map(this.getSand(), function(sand) {
                return {
                    row: sand.row,
                    col: sand.col,
                }
            }),
    }

    if (typeof this.ball != "undefined") {
        j.ball = {
            row: this.ball.row,
            col: this.ball.col
        }
    }

    return j;

}

// removes the first element in array for which func(element) is true
// if an element is removed, returns the index of the element removed
// otherwise, returns -1
hundo.arrayRemove = function(array, func) {
    var i = _.findIndex(array, func);

    if (i < 0) {
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
            return p.id == piece.id;
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
hundo.Board.prototype.nudge = function(row, col, dir, commit) {

    if (row < 0 || row >= this.numRows || col < 0 || col >= this.numCols) {
        return [true, []];
    }

    var pieces = this.matrix[row][col];

    var result = true;
    var animations = []

    var THIS = this;

    for (var i = 0; i < pieces.length; i++) {

        var piece = pieces[i];

        var [nudged, newAnimations] = piece.nudge(dir, THIS, commit);

        animations = _.concat(animations, newAnimations);
        if (!nudged) {
            result = false;
        }
    }

    return [result, animations];

}

hundo.Board.prototype.checkSolved = function() {

    var pieces = this.matrix[this.ball.row][this.ball.col]

    var result = _.filter(pieces, function(piece){
        return piece.type == hundo.PieceTypeEnum.GOAL;
    })

    return result.length == 1;
}

hundo.Board.drdc = function(direction) {

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
        console.error("Bad direction: " + direction);
        return null;
    }

    return [dr, dc];
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
    
    var [dr, dc] = hundo.Board.drdc(direction);

    var newRow = this.ball.row + dr;
    var newCol = this.ball.col + dc;

    // Check for out of bounds
    if (newRow < 0 || newRow >= this.numRows ||
        newCol < 0 || newCol >= this.numCols) {

        this.atRest = true;
        this.done = true;
        this.ball.dir = hundo.DirectionEnum.NODIR;

        this.movePiece(this.ball, newRow, newCol);

        return [{
            "move": {
                "ball": this.ball,
                "dir": direction,
                "solved": false
            },
        }];
    }

    var [nudged, animations] =
        this.nudge(this.ball.row, this.ball.col, this.ball.dir, false);

    if (nudged) {

        // now commit the nudge
        [nudged, animations] =
            this.nudge(this.ball.row, this.ball.col, this.ball.dir, true);

        if (this.checkSolved()) {
            this.solved = true;
            this.atRest = true;
            this.ball.dir = hundo.DirectionEnum.NODIR;
        }
        return animations;
    } else {
        this.ball.dir = hundo.DirectionEnum.NODIR;
        this.atRest = true;
        
        var recipients = [];

        var gblock = this.getPiece(newRow, newCol, hundo.PieceTypeEnum.GBLOCK);
        if (gblock) {
            recipients = _.concat(recipients, this.gblocks[gblock.groupNum]);
        }
        
        recipients = _.concat(recipients,
            this.matrix[newRow][newCol].slice(0));
        recipients = _.concat(recipients,
            this.matrix[this.ball.row][this.ball.col]);

        return [{
            "collide": {
                "dir": direction,
                "recipients": recipients
            }
        }];
    } 
}

hundo.Board.prototype.move = function(dir) {
    this.setDir(dir);

    this.step();

    while (!this.done && !this.solved && !this.atRest) {
        this.step();
    }
}

// Deep copy the board
// TODO: rm getJson
hundo.Board.prototype.clone = function() {
    var config = this.getJson();
    return new hundo.Board(config);

}

/**
 * Code not released into the public domain
 ******************************************************************************/

// Thank you nicbell! https://gist.github.com/nicbell/6081098
Object.compare = function (obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
                break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
            //Compare values
            default:
                if (obj1[p] != obj2[p]) return false;
        }
    }
 
    //Check object 2 for any extra properties
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
};

/**
 * Solver solves puzzles
 ******************************************************************************/

// BUG: Solver fails here: file:///Users/xyz/workspace/hundo/public/level-editor.html?level=fld1-0g0h0i0j0k111k202k303i3k4041424k5k6k7g7k8k9kakb0bkc0cfckd0dke0e1e2e3e4e5e6e7e8e9eaebecedeeefegeheiejek-aa1-22-1i2-b10b20b30b41b51b61b72b82b92ba3bb3bc3c20c51c82cb3

// Thank you Wikipedia!
// https://en.wikipedia.org/wiki/Graph_traversal#Pseudocode

hundo.Solver = function(board) {

    this.edges = [];

    this.winningEdges = [];

    // vertices
    this.boards = [];

    if (typeof board.ball == "undefined" ||
        typeof board.ball.row == "undefined" ||
        typeof board.ball.col == "undefined") {
        return;
    }

    this.winningEdges = this.explore(board);
}

hundo.Solver.prototype.hasExploredVertex = function(board1) {

    var matches = _.flatMap(this.boards, function(board2) {
        if (board1.eq(board2)) {
            return [true];
        } else {
            return [];
        }
    })

    if (matches.length == 0) {
        return false;
    } else if (matches.length == 1) {
        return true;
    } else {
        console.error("multiple matches for has explored: " + matches);
    }
}

hundo.Solver.prototype.hasExploredEdge = function(edge1) {

    var matches = _.flatMap(this.edges, function(edge2) {
        if (Object.compare(edge1[0].getJson(), edge2[0].getJson()) &&
            Object.compare(edge1[1].getJson(), edge2[1].getJson())) {
            return [true];
        } else {
            return [];
        }
    })

    if (matches.length == 0) {
        return false;
    } else if (matches.length == 1) {
        return true;
    } else {
        console.error("multiple matches for has explored: " + matches);
    }
}

// push the ball in direction dir
// TODO: use board.move(...)
hundo.Solver.move = function(board, dir) {
    board.setDir(dir);

    board.step();

    while (!board.done && !board.solved && !board.atRest) {
        board.step();
    }

    return board;
}

hundo.Solver.prototype.getCellEdges = function() {
    return _.map(this.edges, function(edge) {
        var [b1, b2] = edge;
        return {
            row1: b1.ball.row,
            col1: b1.ball.col,
            row2: b2.ball.row,
            col2: b2.ball.col
        }
    });
}

hundo.Solver.prototype.getCellWinningEdges = function() {
    return _.map(this.winningEdges, function(edge) {
        var [b1, b2] = edge;
        return {
            row1: b1.ball.row,
            col1: b1.ball.col,
            row2: b2.ball.row,
            col2: b2.ball.col
        }
    });

}

hundo.Solver.prototype.explore = function(board) {
    if (this.edges.length >= 100) {
        return [];
    }

    this.boards.push(board);

    // if out of bounds or solved
    if (board.ball.row < 0 || board.ball.row >= board.numRows ||
        board.ball.col < 0 || board.ball.col >= board.numCols ||
        board.solved) {
        return [];
    }

    var boards = [];

    boards[0] = hundo.Solver.move(board.clone(), hundo.DirectionEnum.UP);
    boards[1] = hundo.Solver.move(board.clone(), hundo.DirectionEnum.DOWN);
    boards[2] = hundo.Solver.move(board.clone(), hundo.DirectionEnum.LEFT);
    boards[3] = hundo.Solver.move(board.clone(), hundo.DirectionEnum.RIGHT);

    var THIS = this;

    var winningEdges = [];

    _.each(boards, function(newBoard, i) {

        var edge = [board, newBoard]

        if (!THIS.hasExploredEdge(edge)) { 

            if (!THIS.hasExploredVertex(newBoard)) {

                THIS.edges.push(edge);

                var w = THIS.explore(newBoard) 

                winningEdges = _.concat(winningEdges, w)

                if (w.length > 0 || newBoard.solved) {
                    winningEdges.push(edge);
                }
            }            
        }
    });

    return winningEdges;
}


/**
 * The Hundo class is what clients use to create a Hundo game
 ******************************************************************************/

Hundo = function(config) {

    // clone hundo.defaultVizConfig so it doesn't get clobbered by extend
    var defaultVizConfig = jQuery.extend(true, {}, hundo.defaultVizConfig);

    if (!"vizConfig" in config) {
        config.viz = {};
    }

    config.viz = $.extend(defaultVizConfig, config.viz);

    viz = new hundo.Viz(config);

    hundo.instances[config.id] = viz;

    if (_.size(hundo.instances) == 1) {
        hundo.vizz = viz;
    }

}

/**
 * Viz encapsulates the view and the controller
 ******************************************************************************/

hundo.Viz = function(config) {

    // TODO: validate vizConfig and levels
    this.vizConfig = config.viz;

    this.maker = {
        on: config.maker,
        play: false,
        mouseRow: undefined,
        mouseCol: undefined,
        showSolution: false,
        showGraph: false,
    }

    var levelFromUrl = hundo.Viz.levelFromUrl();

    if (levelFromUrl) {
        this.maker.on = true;
    }

    if (this.maker.on) {

        if (levelFromUrl) {
            this.levels = [levelFromUrl];
        } else {
            this.levels = [
                {
                    numRows: config.viz.numRows,
                    numCols: config.viz.numCols
                }
            ]
        }

        config.viz.levelSelect = false;

        this.paletteSelection = {
            type: hundo.PieceTypeEnum.BLOCK
        };

    } else {
        this.levels = config.levels;
    }

    this.id = config.id;
    this.level = 0;

    if (config.viz.allLevels) {
        this.levelMax = this.levels.length;
    } else {
        this.levelMax = config.viz.levelMax;
    }

    this.drawSvgGrid();

    if (config.viz.playButton) {
        this.addPlayButton();
    }

    if (config.viz.levelSelect) {
        this.addLevelSelect();
    }

    if (this.maker.on) {
        this.addSave();
        this.addShowSolution();
        this.addPalette();
        this.addLevelUrlField();
    }

    this.boardSvg = d3.select("#" + this.boardSvgId())
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)
        .on("click", hundo.Viz.clickBoard);

    this.boardSvg.select("#background")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)
        .attr("style", "fill:black");

    this.boardSvg.select("#perim")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)

    this.drawGrid();

    var boardConfig = this.levels[0];

    this.board = new hundo.Board(boardConfig);

    this.drawBoard();

    this.updateLevelSelect();

    this.boardSvg
        .on("mousemove", hundo.Viz.mousemove)
        .on("mouseleave", hundo.Viz.mouseleave);

}

// TODO: assume untrusted input and write tests
hundo.Viz.getParams = function() {
    var url = window.location.href;

    var params = _.split(url, "?")[1]

    if (typeof params == "undefined") {
        return {}
    }

    var paramList = params.split("&");

    var paramObj = {}

    _.each(paramList, function(param) {
        var [key, value] = param.split("=");
        paramObj[key] = value;
    });

    return paramObj

}

hundo.Viz.levelFromUrl = function() {

    var params = hundo.Viz.getParams()

    if (!("level" in params)) {
        return false;
    }

    var compressedLevel = decodeURIComponent(params.level);

    var level = hundo.Compress.decompressLevel(compressedLevel);

    return level;
}

hundo.Viz.prototype.removeHighlight = function() {
    this.boardSvg.select("#" + this.highlightId())
        .remove();
}

// BUG TODO: it seems that mousemove and mouseleave are interferring
// with each other because mousemove updates the highlighter
// on every pixel change (as opposed to only updating the
// highlighter on cell changes). mouseleave only works when
// the mouse exits the board at high speed.
hundo.Viz.prototype.mousemove = function(x, y) {

    if (!this.maker.on || this.maker.play) {
        return;
    }

    var [row, col] = this.cellFromXY(x, y)

    this.removeHighlight();

    if (this.paletteSelection.delete) {
        if (this.board.isEmptyCell(row, col)) {
            return;
        }
    } else {
        var piece = this.getPieceFromPalette(row, col);

        if (!this.board.canAddPiece(piece)) {
            return;
        }
    }

    this.maker.mouseRow = row;
    this.maker.mouseCol = col;

    this.boardSvg.selectAll()
        .data([0])
        .enter()
        .append("rect")
        .attr("x", col * this.vizConfig.cellSize)
        .attr("y", row * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.cellSize)
        .attr("width", this.vizConfig.cellSize)
        .attr("style", "fill:#3D8E37; fill-opacity: 0.5; cursor: pointer;")
        .attr("id", this.highlightId())

}

hundo.Viz.mousemove = function() {
    var [x, y] = d3.mouse(this);
    var id = hundo.Viz.getIdFromBoardSvg(this);
    var viz = hundo.instances[id]
    viz.mousemove(x, y);
}

hundo.Viz.prototype.mouseleave = function() {
    this.removeHighlight();
}

hundo.Viz.mouseleave = function() {
    var id = hundo.Viz.getIdFromBoardSvg(this);
    var viz = hundo.instances[id]
    viz.mouseleave();
}

hundo.Viz.prototype.drawSvgGrid = function(name) {

    var blockTemplate = `
        <rect x="0" y="0" width="20" height="20" fill="#888" />
        <path d="M0 0 L26 0 L20 6 L6 6 Z"
            stroke="none" fill="#aaa"/>
        <path d="M0 0 L6 6 L6 20 L0 26 Z"
            stroke="none" fill="#aaa"/>
        <path d="M26 0 L20 6 L20 20 L26 26 Z"
            stroke="none" fill="#666"/>
        <path d="M26 26 L20 20 L6 20 L0 26 Z"
            stroke="none" fill="#666"/>`

    var svgContents = `
        <div>
            <svg id="${this.boardSvgId(name)}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    
                    <g id="blockTemplate" height="20" width="20" >
                        ${blockTemplate}
                    </g>

                    <g id="goalTemplate" height="20" width="20">
                        <polygon points="0,26 0,13 13,26" style="fill:red" />
                        <polygon points="13,26 26,13 26,26" style="fill:red" />
                        <rect x="0" y="23" width="26" height="3" fill="red" />
                    </g>

                    <g id="arrowTemplate" height="20" width="20">
                        <polygon points="0,13 13,0 26,13 20,13 20,26 6,26 6,13" style="fill:yellow; stroke-width: 1; stroke: black;" />
                    </g>

                    <g id="gblockTemplate-0" height="26" width="26">
                        ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:red" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-1" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:yellow" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-2" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:blue" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-3" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:green" fill-opacity="0.3" />
                    </g>
                </defs>

                <rect id="background" x="0" y="0" style="fill:black" />

                <rect id="perim" x="0" y="0" style="stroke-width:3;stroke:#999" fill-opacity="0.0"/>

                <!-- hard coded to standard numCols numRows -->
                <text x="85" y="150"
                    font-family="Impact"
                    font-size="55">
                    TOTAL VICTORY!
                </text>
            </svg>
        </div>
        <div id="${this.consoleId()}">
        </div>`

    var svg = $('<div/>').html(svgContents).contents();

    $("#" + this.hundoId()).append(svg);
}

hundo.Viz.prototype.cellFromXY = function(x, y) {

    var row = Math.floor(y / this.vizConfig.cellSize);
    var col = Math.floor(x / this.vizConfig.cellSize);

    return [row, col];
}

hundo.Viz.prototype.getPieceFromPalette = function(row, col) {

    if (this.paletteSelection.type == hundo.PieceTypeEnum.BALL) {
        return new hundo.Ball(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.BLOCK) {
        return new hundo.Block(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.GOAL) {
        return new hundo.Goal(row, col, this.paletteSelection.dir);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.ICE) {
        return new hundo.Ice(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.ARROW) {
        return new hundo.Arrow(row, col, this.paletteSelection.dir);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.GBLOCK) {
        return new hundo.Gblock(row, col, this.paletteSelection.groupNum);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.SAND) {
        return new hundo.Sand(row, col);
        
    } else {
        console.error("Unrecognized piece type")
    }

}

hundo.Viz.prototype.clickBoard = function(x, y) {

    if (!this.maker.on || this.maker.play) {
        return false;
    }

    var [row, col] = this.cellFromXY(x, y);

    if (this.paletteSelection.delete) {
        this.animateSolvedQuick();
        this.board.clearCell(row, col);
        this.drawBoardQuick();
        return;
    }

    var piece = this.getPieceFromPalette(row, col);

    if (this.board.addPiece(piece)) {
        this.animateSolvedQuick();
        this.drawBoardQuick();
        this.removeHighlight();

    } else {
        console.log("Could not add: " + piece);
    }

}

hundo.Viz.getIdFromBoardSvg = function(boardSvg) {
    var boardSvgId = boardSvg.getAttribute("id")
    var id = _.split(boardSvgId, "boardSvg")[1]

    return id;
}

hundo.Viz.clickBoard = function(){

    var id = hundo.Viz.getIdFromBoardSvg(this);

    var [x, y] = d3.mouse(this);

    var viz = hundo.instances[id]
    viz.clickBoard(x, y);
}

hundo.Viz.prototype.addPlayButton = function() {
    var contents = `<button id="${this.playButtonId()}" onclick="hundo.clickPlay(${this.id})" type="button"
     class="button">Play</button>`

    var playButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(playButton);
}

hundo.Viz.prototype.addLevelSelect = function() {
    var contents = `
        <button id="${this.levelBackButtonId()}" onclick="hundo.clickLevelBack(${this.id})" type="button" class="button" onmouseover="" style="cursor: pointer;">◀</button>
        <span id="${this.levelTextId()}""></span>
        <button id="${this.levelForwardButtonId()}" onclick="hundo.clickLevelForward(${this.id})" type="button" class="button" onmouseover="" style="color:#bbb">▶</button>
        `

    var levelSelect = $("<div/>").html(contents).contents();

    $("#" + this.consoleId()).append(levelSelect);
}

hundo.Viz.prototype.paletteButtonHtml = function(image, config) {
    return `
        <img src="img/${image}.png"
            onclick='hundo.clickPalette(${this.id}, ${JSON.stringify(config)})'
            onmouseover=""
            style="cursor: pointer; width: ${this.vizConfig.cellSize}px;
                height: ${this.vizConfig.cellSize}px" />`
}

hundo.Viz.prototype.addPalette = function() {

    var buttons = [
        {
            image: "delete",
            config: {
                delete: true
            }
        },
        {
            image: "ball",
            config: {
                type: hundo.PieceTypeEnum.BALL
            }
        },
        {
            image: "block",
            config: {
                type: hundo.PieceTypeEnum.BLOCK
            }
        },
        {
            image: "goal-up",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.UP
            }
        },
        {
            image: "goal-down",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.DOWN
            }
        },
        {
            image: "goal-left",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.LEFT
            }
        },
        {
            image: "goal-right",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.RIGHT
            }
        },
        {
            image: "ice",
            config: {
                type: hundo.PieceTypeEnum.ICE
            }
        },
        {
            image: "arrow-up",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.UP
            }
        },
        {
            image: "arrow-down",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.DOWN
            }
        },
        {
            image: "arrow-left",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.LEFT
            }
        },
        {
            image: "arrow-right",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.RIGHT
            }
        },
        {
            image: "gblock-0",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupNum: 0
            }
        },
        {
            image: "gblock-1",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupNum: 1
            }
        },
        {
            image: "gblock-2",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupNum: 2
            }
        },
        {
            image: "gblock-3",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupNum: 3
            }
        },
        {
            image: "sand",
            config: {
                type: hundo.PieceTypeEnum.SAND
            }
        },

    ]

    var THIS = this;

    var contents = _.map(buttons, function(pieceDescription) {
            return THIS.paletteButtonHtml(
                    pieceDescription.image,
                    pieceDescription.config
                )
        })
        .join("")

    var palette = $("<div/>").html(contents).contents();

    $("#" + this.consoleId()).append(palette);
}

hundo.Viz.prototype.addSave = function() {
    var contents = `<button id="${this.saveButtonId()}" onclick="hundo.clickSave(${this.id})" type="button"
     class="button">Save</button>`

    var saveButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(saveButton);
}

hundo.Viz.prototype.addShowSolution = function() {
    var contents = `<button id="${this.solutionButtonId()}" onclick="hundo.clickShowSolution(${this.id})" type="button"
     class="button">Show solution</button>`

    var solutionButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(solutionButton);
}

hundo.Viz.prototype.addLevelUrlField = function() {
    var contents = `<div>URL for this level: <input type="text" id="${this.levelUrlFieldId()}"
    value=""></input></div>`

    var saveButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(saveButton);
}

hundo.Viz.prototype.hundoId = function() {
    return "hundo" + this.id;
}

hundo.Viz.prototype.boardSvgId = function() {
    return "boardSvg" + this.id;
}

hundo.Viz.prototype.highlightId = function() {
    return "highlight" + this.id;
}

hundo.Viz.prototype.playButtonId = function() {
    return "playButton" + this.id;
}

hundo.Viz.prototype.saveButtonId = function() {
    return "saveButton" + this.id;
}

hundo.Viz.prototype.solutionButtonId = function() {
    return "solutionButton" + this.id;
}

hundo.Viz.prototype.levelUrlFieldId = function() {
    return "levelUrlField" + this.id
}

hundo.Viz.prototype.consoleId = function() {
    return "console" + this.id;
}

hundo.Viz.prototype.levelTextId = function() {
    return "levelText" + this.id;
}

hundo.Viz.prototype.levelBackButtonId = function() {
    return "levelBackButton" + this.id;
}

hundo.Viz.prototype.levelForwardButtonId = function() {
    return "levelForwardButton" + this.id;
}

hundo.Viz.prototype.drawGrid = function() {

    var vizConfig = this.vizConfig;

    var rows = _.range(1, vizConfig.numRows);

    this.boardSvg.selectAll()
        .data(rows)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("x1", vizConfig.perimStrokeWidth)
        .attr("y1", function(row) { return row * vizConfig.cellSize; })
        .attr("x2", vizConfig.numCols * vizConfig.cellSize -
                vizConfig.perimStrokeWidth)
        .attr("y2", function(row) { return row * vizConfig.cellSize; })
        .attr("style", "stroke:rgb(0,0,255);stroke-width:1;opacity:0.3");

    var cols = _.range(1, vizConfig.numCols);

    this.boardSvg.selectAll()
        .data(cols)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("y1", vizConfig.perimStrokeWidth)
        .attr("x1", function(col) { return col * vizConfig.cellSize; })
        .attr("y2", vizConfig.numRows * vizConfig.cellSize - 
            vizConfig.perimStrokeWidth)
        .attr("x2", function(col) { return col * vizConfig.cellSize; })
        .attr("style", "stroke:rgb(0,0,255);stroke-width:1;opacity:0.3");
}


hundo.Viz.pieceId = function(piece) {
    return "piece" + piece.id;
}

hundo.Viz.dirToDegrees = function(dir) {
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

hundo.Viz.prototype.transform = function(piece, transformation) {

    if (typeof transformation == "undefined") {
        transformation = {};
    }

    var x = piece.col * this.vizConfig.cellSize;
    var y = piece.row * this.vizConfig.cellSize;

    if ("dx" in transformation) {
        x += transformation.dx;
    }

    if ("dy" in transformation) {
        y += transformation.dy;
    }

    var t = [];

    t.push("translate(" + x + ", " + y + ")");

    if ("scale" in transformation) {
        t.push("scale(" + transformation.scale + ")");
    }

    if (piece.type == hundo.PieceTypeEnum.BALL ||
        piece.type == hundo.PieceTypeEnum.BLOCK ||
        piece.type == hundo.PieceTypeEnum.ICE ||
        piece.type == hundo.PieceTypeEnum.GBLOCK ||
        piece.type == hundo.PieceTypeEnum.SAND) {
        return _.join(t, ",");
    } else if (piece.type == hundo.PieceTypeEnum.GOAL ||
        piece.type == hundo.PieceTypeEnum.ARROW) {

        var z = this.vizConfig.cellSize / 2;
        var degrees = hundo.Viz.dirToDegrees(piece.dir);
        t.push("rotate(" + degrees + ", " + z + ", " + z + ")");
        return _.join(t, ",");
    } else {
        console.error("Bad piece type: " + piece.type);
    }
}

hundo.getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

hundo.Viz.prototype.removeSolution = function() {

    this.boardSvg.selectAll(".solution").remove();

}

hundo.Viz.prototype.drawEdges = function(edges, style) {

    var THIS = this;
    
    this.boardSvg.selectAll()
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "solution")
        .attr("x1", function(edge) {
            return edge.col1 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("y1", function(edge) {
            return edge.row1 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("x2", function(edge) {
            return edge.col2 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("y2", function(edge) {
            return edge.row2 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("style", style);
}

hundo.Viz.prototype.drawSolution = function() {
    var solver = new hundo.Solver(this.board);

    if (this.maker.showGraph) {
        this.drawEdges(solver.getCellEdges(),
            "stroke:#FFF;stroke-width:1;opacity:0.4");
    }

    this.drawEdges(solver.getCellWinningEdges(),
        "stroke:#B00000;stroke-width:4;opacity:1.0");

}


hundo.Viz.prototype.drawPieces = function(transformation) {

    var THIS = this;

    this.boardSvg.selectAll()
        .data(this.board.getBlocks())
        .enter()
        .append("svg:use")
        .attr("class", "block")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#blockTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    var sandRadius = this.vizConfig.cellSize / 3;
    this.boardSvg.selectAll()
        .data(this.board.getSand())
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.vizConfig.cellSize)
        .attr("height", this.vizConfig.cellSize)
        .attr("style", "fill:green; fill-opacity: 0.5; stroke: #bbb; stroke-width: 2")
        .attr("class", "sand")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);

        });

    // <ellipse cx="10" cy="10" rx="10" ry="10" style="fill:#eee" />
    this.boardSvg.selectAll()
        .data(this.board.getBalls())
        .enter()
        .append("ellipse")
        .attr("cx", this.vizConfig.cellSize / 2)
        .attr("cy", this.vizConfig.cellSize / 2)
        .attr("rx", this.vizConfig.cellSize / 2)
        .attr("ry", this.vizConfig.cellSize / 2)
        .attr("style", "fill:#eee")
        .attr("class", "ball")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);

        });

    this.boardSvg.selectAll()
        .data(this.board.getGoals())
        .enter()
        .append("svg:use")
        .attr("class", "goal")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#goalTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    var iceMargin = Math.floor(this.vizConfig.cellSize / 6);

    this.boardSvg.selectAll()
        .data(this.board.getIce())
        .enter()
        .append("rect")
        .attr("x", iceMargin)
        .attr("y", iceMargin)
        .attr("width", this.vizConfig.cellSize - iceMargin * 2)
        .attr("height", this.vizConfig.cellSize - iceMargin * 2)
        .attr("rx", iceMargin)
        .attr("ry", iceMargin)
        .attr("style", "fill:#63ADD2")
        .attr("class", "ice")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);

        });

    this.boardSvg.selectAll()
        .data(this.board.getGblocks())
        .enter()
        .append("svg:use")
        .attr("class", "gblock")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", function (piece) {
            return "#gblockTemplate-" + piece.groupNum;
        })
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    this.boardSvg.selectAll()
        .data(this.board.getArrows())
        .enter()
        .append("svg:use")
        .attr("class", "arrow")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#arrowTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    if (this.maker.showSolution) {
        this.drawSolution();
    }
}

hundo.Viz.prototype.drawBoardQuick = function() {
    this.drawPieces({})
}

hundo.Viz.prototype.drawBoard = function() {

    var dxdy = this.vizConfig.cellSize / 2;

    var THIS = this;

    this.drawPieces({
        dx: dxdy,
        dy: dxdy,
        scale: 0
    })

    var dxdy = -(this.vizConfig.cellSize / 2) * this.vizConfig.blowupScale;

    // TODO
    var pieces = this.board.getPieces(function(){ return true; });

    var delays = _.range(0, pieces.length)
        .map(function(){
            return hundo.getRandom(0, THIS.vizConfig.flyInDuration / 2);
        });

    _.each(pieces, function(piece, i){
        var id = "#" + hundo.Viz.pieceId(piece);
        var delay = delays[i];

        THIS.boardSvg.select(id)
            .transition()
            .ease("linear")
            .delay(delay)
            .attr("transform", function() {
                return THIS.transform(piece, {
                    dx: dxdy,
                    dy: dxdy,
                    scale: THIS.vizConfig.blowupScale
                });
            })
            .duration(THIS.vizConfig.flyInDuration / 2);
    });

    setTimeout(function(){
        _.each(pieces, function(piece, i){
            var piece = pieces[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            var delay = delays[i];
            THIS.boardSvg.select(id)
                .transition()
                .ease("linear")
                .delay(delay)
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(THIS.vizConfig.flyInDuration / 2);
        });            
    }, this.vizConfig.flyInDuration / 2);

}

// TODO
hundo.Viz.prototype.reset = function() {

    var pieces = this.board.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    })

    this.board.reset();

    var THIS = this;

    _.each(pieces, function(piece, i){
        var piece = pieces[i];

        if (piece.type == hundo.PieceTypeEnum.BALL) {
            THIS.boardSvg.select("#" + hundo.Viz.pieceId(piece))
                .transition()
                .ease("linear")

                // undo the ball squish
                .attr("rx", THIS.vizConfig.cellSize / 2)
                .attr("ry", THIS.vizConfig.cellSize / 2)

                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(0);
        } else {
            THIS.boardSvg.select("#" + hundo.Viz.pieceId(piece))
                .transition()
                .ease("linear")
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(0);
        }
    });

}

hundo.Viz.dxdy = function(dir) {
    if (dir == hundo.DirectionEnum.UP) {
        return [0, -1];
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return [0, 1];
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return [-1, 0];
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return [1, 0];
    } else {
        console.error("Bad direction: " + dir);
    }
}

hundo.Viz.prototype.undoAnimateVictory = function() {

    this.boardSvg.select("#background")
        .style("fill", "#000")

    this.drawGrid();
}

// TODO: Cleanup
hundo.Viz.prototype.animateVictory = function() {

    var THIS = this;

    this.boardSvg.select("#background")
        .transition()
        .style("fill", "#EEE")
        .duration(0);

    this.boardSvg.selectAll(".grid")
        .remove();
}

hundo.Viz.prototype.animateSolvedQuick = function() {

    var pieces = this.board.getPieces(function(){ return true; });

    _.each(pieces, function(piece,i){
        var id = "#" + hundo.Viz.pieceId(piece);
        $(id).remove();
    })

    this.removeSolution();
}

hundo.Viz.prototype.animateSolved = function() {

    var pieces = this.board.getPieces(function(){ return true; });

    var dxdy = this.vizConfig.cellSize / 2;

    var THIS = this;

    var delays = _.range(0, pieces.length)
        .map(function(){
            return hundo.getRandom(0, THIS.vizConfig.flyInDuration / 2);
        })

    _.each(pieces, function(piece, i){
        var id = "#" + hundo.Viz.pieceId(piece);

        var delay = delays[i];

        THIS.boardSvg.select(id)
            .transition()
            .ease("linear")
            .delay(delay)
            .attr("transform", function() {
                return THIS.transform(piece, {
                    dx: dxdy,
                    dy: dxdy,
                    scale: 0
                });
            })
            .duration(THIS.vizConfig.flyInDuration)
            .remove();
    });

    this.removeSolution();
}

hundo.Viz.prototype.prevLevel = function() {

    if (this.level <= 0) {
        return;
    }

    if (this.level == "victory") {
        this.level = this.levels.length;
    }

    this.animateSolvedQuick();

    this.level--;
    this.board = new hundo.Board(this.levels[this.level]);
    this.drawBoardQuick();
    this.updateLevelSelect();

    if (this.level == this.levels.length - 1) {
        this.undoAnimateVictory();
    }

}

hundo.Viz.prototype.loadNextLevel = function(quick) {

    if (this.level < this.levels.length - 1) {
        this.level++;

        if (this.level > this.levelMax) {
            this.levelMax = this.level;
        }

        this.board = new hundo.Board(this.levels[this.level]);

        if (quick) {
            this.drawBoardQuick();
        } else {
            this.drawBoard();
        }

    } else {
        // all levels solved
        this.level = "victory";
        this.animateVictory();

        this.levelMax = this.levels.length;
    }

    this.updateLevelSelect();
}

hundo.Viz.prototype.nextLevel = function(quick) {

    var THIS = this;

    if (quick) {
        this.animateSolvedQuick();
        this.loadNextLevel(quick);
    } else {
        setTimeout(function(){
            THIS.loadNextLevel();
        }, this.vizConfig.flyInDuration / 2);

        this.animateSolved(); 
    }



}

hundo.Viz.prototype.updateLevelSelect = function() {

    var levelText;

    if (this.level == "victory" ) {
        levelText = "VICTORY"
    } else {
        levelText = "Level " + (this.level + 1) + "/" + this.levels.length;
    }

    $("#" + this.levelTextId()).text(levelText);

    if (this.level == "victory" || this.level > 0) {
        $("#" + this.levelBackButtonId())
            .css({
                color: "#000",
                "cursor": "pointer"
            });
    } else {
        $("#" + this.levelBackButtonId())
            .css({
                color: "#bbb",
                cursor: ""
            })
    }

    if (this.level != "victory" && this.level < this.levelMax) {
        $("#" + this.levelForwardButtonId())
            .css({
                color: "#000",
                "cursor": "pointer"
            });
    } else {
        $("#" + this.levelForwardButtonId())
            .css({
                color: "#bbb",
                cursor: ""
            })
    }
}

hundo.Viz.prototype.animateBall = function(animation) {

    ball = animation.move.ball;
    ballId = "#" + hundo.Viz.pieceId(ball);

    var dx;
    var dy;
    if (ball.dir != hundo.DirectionEnum.NODIR) {
        [dx, dy] = hundo.Viz.dxdy(ball.dir);
    } else {
        dx = 0;
        dy = 0;
    }

    var THIS = this;


    this.boardSvg.select(ballId)
        .transition()
        .ease("linear")
        .attr("rx", function() {
            if (dy != 0) {
                return THIS.vizConfig.cellSize / 4;
            } else {
                return THIS.vizConfig.cellSize / 2;
            }
        })
        .attr("ry", function() {
            if (dx != 0) {
                return THIS.vizConfig.cellSize / 4;
            } else {
                return THIS.vizConfig.cellSize / 2;
            }
        })
        .attr("transform", function() {
            return THIS.transform(ball);
        })
        .duration(this.vizConfig.stepDuration);

    // leave a trail behind the ball
    this.boardSvg.selectAll()
        .data([{row: ball.row, col: ball.col}])
        .enter()
        .append("circle")
        .attr("cx", ball.col * this.vizConfig.cellSize +
                this.vizConfig.cellSize / 2
        )
        .attr("cy", ball.row * this.vizConfig.cellSize +
                this.vizConfig.cellSize / 2
        )
        .attr("r", this.vizConfig.cellSize / 2 -
                this.vizConfig.cellSize / 8)
        .attr("style", "fill:#bbb")
        .transition()
        .duration(this.vizConfig.stepDuration * 4)
        .attr("r", "0")
        .remove();

}

// TODO: move common code (in animateBall) into seperate function
hundo.Viz.prototype.animateIce = function(animation) {

    ice = animation.move.ice;
    iceId = "#" + hundo.Viz.pieceId(ice);
    
    var THIS = this;

    this.boardSvg.select(iceId)
        .transition()
        .ease("linear")
        .attr("transform", function() {
            return THIS.transform(ice);
        })
        .duration(this.vizConfig.stepDuration);

}

hundo.Viz.prototype.animateGblock = function(animation) {

    gblock = animation.move.gblock;
    gblockId = "#" + hundo.Viz.pieceId(gblock);
    
    var THIS = this;

    this.boardSvg.select(gblockId)
        .transition()
        .ease("linear")
        .attr("transform", function() {
            return THIS.transform(gblock);
        })
        .duration(this.vizConfig.stepDuration);

}

hundo.Viz.prototype.animateCollide = function(animation) {

    var THIS = this;

    var recipients = animation.collide.recipients;
    var dir = animation.collide.dir;
    for (var i = 0; i < recipients.length; i++) {
        var piece = recipients[i];
        var id = "#" + hundo.Viz.pieceId(piece);

        if (piece.type == hundo.PieceTypeEnum.BALL) {
            this.boardSvg.select(id)
                .transition()
                .ease("linear")
                // undo the ball squish
                .attr("rx", this.vizConfig.cellSize / 2)
                .attr("ry", this.vizConfig.cellSize / 2)

                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= THIS.vizConfig.cellSize / 3;
                    dy *= THIS.vizConfig.cellSize / 3;

                    return THIS.transform(piece, {dx: dx, dy: dy});
                })
                .duration(this.vizConfig.stepDuration / 2);
        } else {

            this.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= THIS.vizConfig.cellSize / 3;
                    dy *= THIS.vizConfig.cellSize / 3;

                    return THIS.transform(piece, {dx: dx, dy: dy});
                })
                .duration(this.vizConfig.stepDuration / 2);

        }
    }

    setTimeout(function(){
        for (var i = 0; i < recipients.length; i++) {
            var piece = recipients[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            THIS.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(THIS.vizConfig.stepDuration / 2);
            }
    }, this.vizConfig.stepDuration / 2);

}

hundo.Viz.prototype.stepAnimate = function() {

    var THIS = this;

    var animations = this.board.step();

    if (this.board.atRest) {
        clearInterval(this.animateInterval);
    }

    if (this.board.done) {
        setTimeout(
            function(){THIS.reset(this.board);},
            THIS.animateInterval);
    }

    var THIS = this;

    _.each(animations, function(animation) {
        if ("move" in animation && "ball" in animation.move) {
            THIS.animateBall(animation);
        } else if ("move" in animation && "ice" in animation.move) {
            THIS.animateIce(animation);
        } else if ("move" in animation && "gblock" in animation.move) {
            THIS.animateGblock(animation);
        } else if ("collide" in animation) {
            THIS.animateCollide(animation);
        }
    })

    if (this.board.solved) {
        if (this.maker.on) {
            this.reset(this.board);
        } else {
            this.nextLevel(false);
        }
    }
}


hundo.Viz.prototype.checkKey = function(e) {
    if (!this.board.atRest) {
        return;
    }

    if (this.board.solved) {
        return;
    }

    if (this.maker.on && !this.maker.play) {
        return;
    }

    var e = e || window.event;

    var direction;

    // diable browser scrolling on arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

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

    this.board.setDir(direction);

    this.stepAnimate();

    var THIS = this;

    if (!this.board.atRest) {
        this.animateInterval =
            setInterval(
                function(){THIS.stepAnimate();},
                this.vizConfig.stepDuration);
    }
}

// TODO: hoist code into Viz.prototype.checkKey
hundo.Viz.checkKey = function(e) {
    hundo.vizz.checkKey(e);
}

hundo.Viz.prototype.clickPlay = function() {

    if (!this.maker.on) {
        return;
    }

    this.maker.play = !this.maker.play;

    if (this.maker.play) {
        $("#" + this.playButtonId()).text("Edit");
    } else {
        $("#" + this.playButtonId()).text("Play");
    }

}

hundo.clickPlay = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickPlay();
}

hundo.Viz.prototype.clickSave = function() {
    console.log("save");

    var url = this.getBoardUrl()

    $("#" + this.levelUrlFieldId()).attr("value", url);

    $("#" + this.levelUrlFieldId()).select();

    console.log(JSON.stringify(this.board.getJson()));
}

hundo.clickSave = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickSave();
}

hundo.Viz.prototype.clickShowSolution = function() {
    this.maker.showSolution = !this.maker.showSolution;
    this.maker.showGraph = this.maker.showSolution;

    if (this.maker.showSolution) {
        $("#" + this.solutionButtonId()).text("Hide solution");
    } else {
        $("#" + this.solutionButtonId()).text("Show solution");
    }

    this.animateSolvedQuick();
    this.drawBoardQuick();

}

hundo.clickShowSolution = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickShowSolution();
}

// TODO: bug, hundo.vizz is unsafe here because
// you might click level left on one Hundo and do nextLevel
// on another level
hundo.clickLevelForward = function(id) {

    if (hundo.vizz.level != "victory" && hundo.vizz.level < hundo.vizz.levelMax) {
        hundo.vizz.nextLevel(true);
    }
}

hundo.clickLevelBack = function(id) {
    hundo.vizz.prevLevel();
}

hundo.Viz.prototype.clickPalette = function(config) {
    this.paletteSelection = config;
}

hundo.clickPalette = function(id, config) {
    var viz = hundo.instances[id]
    viz.clickPalette(config);
}

hundo.Viz.prototype.getBoardUrl = function() {
    var levelParam = hundo.Compress.compressLevel(this.board.getJson());
    var url = window.location.href;

    url = _.split(url, "?")[0];

    url += "?level=" + encodeURIComponent(levelParam)
    return url;
}

hundo.cheat = function() {
    hundo.vizz.maker.showSolution = !hundo.vizz.maker.showSolution;
    hundo.vizz.maker.showGraph = false;

    if (hundo.vizz.maker.showSolution) {
        hundo.vizz.drawSolution();
    } else {
        hundo.vizz.removeSolution();
    }

}

/**
 * Compress functions enable levels to be encoded in URLs
 ******************************************************************************/

hundo.Compress = {}

hundo.Compress.toBase64Digit = function (number) {
    if (number < 0 || number >= 62) {
        console.error("Cannot convert to base64: " + number);
        return null;
    }

    if (number < 10) {
        return "" + number
    } else if (number < 36) {
        return String.fromCharCode("a".charCodeAt(0) + number - 10)
    } else {
        return String.fromCharCode("A".charCodeAt(0) + number - 36)
    }
}

hundo.Compress.fromBase64Digit = function(digit) {

    var charCode = digit.charCodeAt(0);

    if (charCode >= "0".charCodeAt(0) &&
        charCode <= "9".charCodeAt(0)) {
        return charCode - "0".charCodeAt(0);
    } else if (charCode >= "a".charCodeAt(0) &&
        charCode <= "z".charCodeAt(0)) {
        return charCode - "a".charCodeAt(0) + 10;
    } else if (charCode >= "A".charCodeAt(0) &&
        charCode <= "Z".charCodeAt(0)) {
        return charCode - "A".charCodeAt(0) + 36;
    } else {
        console.error("Cannot convert from base64: " + digit);
        return null;
    }
}

hundo.Compress.dirToNum = function(dir) {

    if (dir == hundo.DirectionEnum.UP) {
        return "0";
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return "1";
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return "2";
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return "3";
    } else {
        console.error("Bad direction: " + dir);
        return null;
    }
}

hundo.Compress.numToDir = function(num) {

    if (num == "0") {
        return hundo.DirectionEnum.UP;
    } else if (num == "1") {
        return hundo.DirectionEnum.DOWN;
    } else if (num == "2") {
        return hundo.DirectionEnum.LEFT;
    } else if (num == "3") {
        return hundo.DirectionEnum.RIGHT;
    } else {
        console.error("Bad num: " + num);
        return null;
    }
}

hundo.Compress.sep = "-";

// assumes numRows, numCols < 32
hundo.Compress.compressLevel = function(level) {
    var levelArray = [];

    // The first two bytes encode numRows, numCols
    levelArray.push(hundo.Compress.toBase64Digit(level.numRows));
    levelArray.push(hundo.Compress.toBase64Digit(level.numCols));

    // The next two bytes encode ball.row, ball.col
    if (typeof level.ball != "undefined") {
        levelArray.push(hundo.Compress.toBase64Digit(level.ball.row));
        levelArray.push(hundo.Compress.toBase64Digit(level.ball.col));
    }

    // signifies beginning of blocks
    levelArray.push(hundo.Compress.sep);

    // Encode each block as (block.row, block.col) pair
    _.each(level.blocks, function(block){
        levelArray.push(hundo.Compress.toBase64Digit(block.row));
        levelArray.push(hundo.Compress.toBase64Digit(block.col));
    });

    // separates blocks and goals
    levelArray.push(hundo.Compress.sep);

    // Encode the goals, like blocks
    _.each(level.goals, function(goal){
        levelArray.push(hundo.Compress.toBase64Digit(goal.row));
        levelArray.push(hundo.Compress.toBase64Digit(goal.col));
        levelArray.push(hundo.Compress.dirToNum(goal.dir))
    });

    // separator
    levelArray.push(hundo.Compress.sep);

    // Encode the ice
    _.each(level.ice, function(ice){
        levelArray.push(hundo.Compress.toBase64Digit(ice.row));
        levelArray.push(hundo.Compress.toBase64Digit(ice.col));
    });

    // separator
    levelArray.push(hundo.Compress.sep);

    // Encode the arrows
    _.each(level.arrows, function(arrow){
        levelArray.push(hundo.Compress.toBase64Digit(arrow.row));
        levelArray.push(hundo.Compress.toBase64Digit(arrow.col));
        levelArray.push(hundo.Compress.dirToNum(arrow.dir))
    });

    // separator
    levelArray.push(hundo.Compress.sep);

    // Encode the gblocks
    _.each(level.gblocks, function(gblock){
        levelArray.push(hundo.Compress.toBase64Digit(gblock.row));
        levelArray.push(hundo.Compress.toBase64Digit(gblock.col));
        levelArray.push(hundo.Compress.toBase64Digit(gblock.groupNum));
    });

    // separator
    levelArray.push(hundo.Compress.sep);

    // Encode the sand
    _.each(level.sand, function(sand){
        levelArray.push(hundo.Compress.toBase64Digit(sand.row));
        levelArray.push(hundo.Compress.toBase64Digit(sand.col));
    });

    return _.join(levelArray, "");
}

hundo.Compress.getRowCol = function(bytes) {

    var row = hundo.Compress.fromBase64Digit(bytes[0]);
    var col = hundo.Compress.fromBase64Digit(bytes[1]);

    bytes.shift();
    bytes.shift();

    return [row, col];

}

// 64-bit bytes
// TODO: factor out common code
hundo.Compress.decompressLevel = function(byteString) {

    var level = {
        blocks: [],
        goals: [],
        ice: [],
        arrows: [],
        gblocks: [],
        sand: []
    };

    var bytes = _.split(byteString, "")

    var [r, c] = hundo.Compress.getRowCol(bytes);
    level.numRows = r;
    level.numCols = c;

    // Get the ball, if it's there
    if (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        level.ball = {
            row: r,
            col: c
        }
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }


    // Get the blocks
    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        block = {
            row: r,
            col: c
        }
        level.blocks.push(block);
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }

    // Get the goals
    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        var dir = hundo.Compress.numToDir(bytes[0]);
        bytes.shift();
        goal = {
            row: r,
            col: c,
            dir: dir
        }
        level.goals.push(goal);
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }

    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        ice = {
            row: r,
            col: c
        }
        level.ice.push(ice);
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }

    // Get the arrows
    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        var dir = hundo.Compress.numToDir(bytes[0]);
        bytes.shift();
        arrow = {
            row: r,
            col: c,
            dir: dir
        }
        level.arrows.push(arrow);
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }

    // Get the gblocks
    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        var groupNum = hundo.Compress.fromBase64Digit(bytes[0]);
        bytes.shift();
        gblock = {
            row: r,
            col: c,
            groupNum: groupNum
        }
        level.gblocks.push(gblock);
    }

    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }

    // Get the gblocks
    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        [r, c] = hundo.Compress.getRowCol(bytes);
        sand = {
            row: r,
            col: c,
        }
        level.sand.push(sand);
    }

    return level;
}

hundo.instances = {}

hundo.vizz = null;

hundo.defaultVizConfig = {
    cellSize: 26,
    stepDuration: 50,
    flyInDuration: 250,
    blowupScale: 3,
    perimStrokeWidth: 3,
    numRows: 15,
    numCols: 21,
    playButton: false,
    levelSelect: true,
    levelMax: 0,
    allLevels: true
}

document.onkeydown = hundo.Viz.checkKey;


