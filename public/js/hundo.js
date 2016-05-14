
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

hundo.IdGenerator = function() {
    this.nextId = 0;
}

hundo.IdGenerator.prototype.next = function() {
    return this.nextId++;
}

// TODO: Assume boardConfig is untrusted
hundo.Board = function(boardConfig, idGen) {

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

    var THIS = this;

    // Add blocks to the matrix
    $.each(boardConfig.blocks, function(index, block) { 
        var row = block.row;
        var col = block.col;
        THIS.matrix[row][col].push(new hundo.Block(idGen.next(), row, col));
    })
    
    // Add the ball to the matrix
    var row = boardConfig.ball.row;
    var col = boardConfig.ball.col;
    this.ball = new hundo.Ball(idGen.next(), row, col, hundo.DirectionEnum.NODIR);
    this.matrix[row][col].push(this.ball);

    // Add goals to the matrix
    $.each(boardConfig.goals, function(index, goal) {
        var row = goal.row;
        var col = goal.col;
        var dir = goal.dir;
        THIS.matrix[row][col].push(new hundo.Goal(idGen.next(), row, col, dir));
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
                "dir": direction,
                "solved": false
            },
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
                "dir": direction,
                "solved": this.solved
            }
        }
    } else {
        this.ball.dir = hundo.DirectionEnum.NODIR;
        this.atRest = true;
        var recipients = this.matrix[newRow][newCol].slice(0);
        recipients.push(this.ball);
        return {
            "collide": {
                "dir": direction,
                "recipients": recipients
            }
        };
    } 
}

hundo.Viz = function(vizConfig, boardConfig) {

    // TODO: validate vizConfig
    this.vizConfig = vizConfig;

    this.boardSvg = d3.select("#boardSvg")
        .attr("width", vizConfig.numCols * vizConfig.cellSize)
        .attr("height", vizConfig.numRows * vizConfig.cellSize);

    this.boardSvg.select("#background")
        .attr("width", vizConfig.numCols * vizConfig.cellSize)
        .attr("height", vizConfig.numRows * vizConfig.cellSize)
        .attr("style", "fill:black");

    this.boardSvg.select("#perim")
        .attr("width", vizConfig.numCols * vizConfig.cellSize)
        .attr("height", vizConfig.numRows * vizConfig.cellSize)

    this.drawGrid();

    // TODO: rm hundo.board
    this.board = hundo.board = new hundo.Board(boardConfig, hundo.idGen);

}

hundo.Viz.prototype.drawGrid = function() {

    var vizConfig = this.vizConfig;

    var rows = []

    for (var row = 1; row < vizConfig.numRows; row++) {
        rows.push(row)
    }

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

    var cols = []

    for (var col = 1; col < vizConfig.numCols; col++) {
        cols.push(col)
    }

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

    var t = "translate(" + x + ", " + y + ") ";

    if ("scale" in transformation) {
        t += "scale(" + transformation.scale + ") ";
    }

    if (piece.type == hundo.PieceTypeEnum.BALL ||
        piece.type == hundo.PieceTypeEnum.BLOCK) {
        return t;
    } else if (piece.type == hundo.PieceTypeEnum.GOAL) {
        var z = this.vizConfig.cellSize / 2;
        var degrees = hundo.Viz.dirToDegrees(piece.dir);
        return t + "rotate(" + degrees + ", " + z + ", " + z + ") " ;
    } else {
        console.error("Bad piece type: " + piece.type);
    }
}

hundo.getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

hundo.Viz.prototype.drawBoard = function(board) {

    var dxdy = vizConfig.cellSize / 2;

    var THIS = this;

    hundo.vizz.boardSvg.selectAll()
        .data(board.getBlocks())
        .enter()
        .append("svg:use")
        .attr("class", "block")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#blockTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, {
                dx: dxdy,
                dy: dxdy,
                scale: 0
            });
        });

    // <ellipse cx="10" cy="10" rx="10" ry="10" style="fill:#eee" />
    this.boardSvg.selectAll()
        .data(board.getBalls())
        .enter()
        .append("ellipse")
        .attr("cx", vizConfig.cellSize / 2)
        .attr("cy", vizConfig.cellSize / 2)
        .attr("rx", vizConfig.cellSize / 2)
        .attr("ry", vizConfig.cellSize / 2)
        .attr("style", "fill:#eee")
        .attr("class", "ball")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, {
                dx: dxdy,
                dy: dxdy,
                scale: 0
            });
        });

    this.boardSvg.selectAll()
        .data(board.getGoals())
        .enter()
        .append("svg:use")
        .attr("class", "goal")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#goalTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, {
                dx: dxdy,
                dy: dxdy,
                scale: 0
            });
        });

    var dxdy = -(this.vizConfig.cellSize / 2) * this.vizConfig.blowupScale;

    // TODO
    var pieces = hundo.board.getPieces(function(){ return true; });
    
    var delays = []
    for (var i = 0; i < pieces.length; i++) {
        delays.push(hundo.getRandom(0, this.vizConfig.flyInDuration / 2));
    }

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        var id = "#" + hundo.Viz.pieceId(piece);
        var delay = delays[i];

        this.boardSvg.select(id)
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
            .duration(this.vizConfig.flyInDuration / 2);
    }

    setTimeout(function(){
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            var delay = delays[i];
            hundo.vizz.boardSvg.select(id)
                .transition()
                .ease("linear")
                .delay(delay)
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(vizConfig.flyInDuration / 2);
            }
    }, vizConfig.flyInDuration / 2);

}

// TODO
hundo.Viz.prototype.reset = function(board) {

    var pieces = board.getPieces(function(piece) {
        return (piece.row != piece.origRow) || (piece.col != piece.origCol);
    })

    board.reset();

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        hundo.vizz.boardSvg.select("#" + hundo.Viz.pieceId(piece))
            .transition()
            .ease("linear")
            .attr("rx", vizConfig.cellSize / 2)
            .attr("ry", vizConfig.cellSize / 2)
            .attr("transform", function() {
                return hundo.vizz.transform(piece);
            })
            .duration(0);
    }

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

// TODO: Cleanup
hundo.viz.animateVictory = function() {

    hundo.vizz.boardSvg.select("#background")
        .transition()
        .style("fill", "#EEE")
        .duration(vizConfig.flyInDuration * 10);

    hundo.vizz.boardSvg.selectAll(".grid")
        .remove();

    var circles = [];
    var numCircles = 100;
    var duration = 2000;
    for (var i = 0; i < numCircles; i++) {
        var color = d3.hsl(Math.floor(Math.random() * 360),
            1.0, 0.5);
        var x = Math.floor(Math.random() * hundo.board.numCols * vizConfig.cellSize);
        var y = Math.floor(Math.random() * hundo.board.numRows * vizConfig.cellSize);
        var r = Math.floor(Math.random() * 200) + 50;
        var delay = Math.floor(Math.random() * duration);
        circles.push({
            color: color,
            x: x,
            y: y,
            r: r,
            delay: delay
        });
    }

    hundo.vizz.boardSvg.selectAll()
        .data(circles)
        .enter()
        .append("circle")
        .attr("class", "firework")
        .attr("cx", function(c){ return c.x; })
        .attr("cy", function(c){ return c.y; })
        .attr("r", 0)
        .attr("fill", function(c){ return c.color; })
        .attr("fill-opacity", "1")
        .transition()
        .delay(function(c){ return c.delay; })
        .attr("r", function(c){return c.r; })
        .attr("fill-opacity", "0")
        .remove()


}

hundo.viz.animateSolved = function() {

    var pieces = hundo.board.getPieces(function(){ return true; });

    var dxdy = vizConfig.cellSize / 2;
    var delays = []
    for (var i = 0; i < pieces.length; i++) {
        delays.push(hundo.getRandom(0, vizConfig.flyInDuration / 2));
    }

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        var id = "#" + hundo.Viz.pieceId(piece);
        var delay = delays[i];

        hundo.vizz.boardSvg.select(id)
            .transition()
            .ease("linear")
            .delay(delay)
            .attr("transform", function() {
                return hundo.vizz.transform(piece, {
                    dx: dxdy,
                    dy: dxdy,
                    scale: 0
                });
            })
            .duration(vizConfig.flyInDuration)
            .remove();
    }
}



hundo.viz.stepAnimate = function(board, idGen) {
    var animate = board.step();

    if (board.atRest) {
        clearInterval(hundo.viz.animateInterval);
    }

    if (board.done) {
        setTimeout(
            function(){hundo.vizz.reset(hundo.board);},
            hundo.viz.animateInterval);
    }

    if (board.solved) {
        setTimeout(function(){
            if (hundo.level < hundo.boardConfigs.length - 1) {
                hundo.level++;
                hundo.board = new hundo.Board(hundo.boardConfigs[hundo.level],
                    idGen);
                hundo.vizz.drawBoard(hundo.board);
            } else {
                // all levels solved
                hundo.viz.animateVictory();
            }
        }, vizConfig.flyInDuration / 2);
    }

    if ("move" in animate) {
        ball = animate.move.ball;
        ballId = "#" + hundo.Viz.pieceId(ball);

        var dx;
        var dy;
        if (ball.dir != hundo.DirectionEnum.NODIR) {
            [dx, dy] = hundo.Viz.dxdy(ball.dir);
        } else {
            dx = 0;
            dy = 0;
        }

        hundo.vizz.boardSvg.select(ballId)
            .transition()
            .ease("linear")
            .attr("rx", function() {
                if (dy != 0) {
                    return vizConfig.cellSize / 4;
                } else {
                    return vizConfig.cellSize / 2;
                }
            })
            .attr("ry", function() {
                if (dx != 0) {
                    return vizConfig.cellSize / 4;
                } else {
                    return vizConfig.cellSize / 2;
                }
            })
            .attr("transform", function() {
                return hundo.vizz.transform(ball);
            })
            .duration(vizConfig.stepDuration);

        // leave a trail behind the ball
        hundo.vizz.boardSvg.selectAll()
            .data([{row: ball.row, col: ball.col}])
            .enter()
            .append("circle")
            .attr("cx", ball.col * vizConfig.cellSize +
                    vizConfig.cellSize / 2
            )
            .attr("cy", ball.row * vizConfig.cellSize +
                    vizConfig.cellSize / 2
            )
            .attr("r", vizConfig.cellSize / 2 - vizConfig.cellSize / 8)
            .attr("style", "fill:#bbb")
            .transition()
            .duration(vizConfig.stepDuration * 4)
            .attr("r", "0")
            .remove();



        if (animate.move.solved) {
            hundo.viz.animateSolved();
        }

    } else if ("collide" in animate) {
        var recipients = animate.collide.recipients;
        var dir = animate.collide.dir;
        for (var i = 0; i < recipients.length; i++) {
            var piece = recipients[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            hundo.vizz.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("rx", vizConfig.cellSize / 2)
                .attr("ry", vizConfig.cellSize / 2)
                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= vizConfig.cellSize / 3;
                    dy *= vizConfig.cellSize / 3;

                    return hundo.vizz.transform(piece, {dx: dx, dy: dy});
                })
                .duration(vizConfig.stepDuration / 2);
        }

        setTimeout(function(){
            for (var i = 0; i < recipients.length; i++) {
                var piece = recipients[i];
                var id = "#" + hundo.Viz.pieceId(piece);
                hundo.vizz.boardSvg.select(id)
                    .transition()
                    .ease("linear")
                    .attr("transform", function() {
                        return hundo.vizz.transform(piece);
                    })
                    .duration(vizConfig.stepDuration / 2);
                }
        }, vizConfig.stepDuration / 2);
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



    hundo.viz.stepAnimate(hundo.board, hundo.idGen);

    if (!hundo.board.atRest) {
        hundo.viz.animateInterval =
            setInterval(
                function(){hundo.viz.stepAnimate(hundo.board, hundo.idGen);},
                vizConfig.stepDuration);
    }

    if (hundo.board.done) {
        hundo.viz.reset(hundo.board);
    }


}

var boardConfig1 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 2,
            col: 0
        },
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
            col: 3
        },
        {
            row: 2,
            col: 8
        },
        {
            row: 2,
            col: 4
        },
        {
            row: 2,
            col: 9
        },
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },
        {
            row: 3,
            col: 7,
            dir: hundo.DirectionEnum.UP
        },
        {
            row: 5,
            col: 8,
            dir: hundo.DirectionEnum.LEFT
        },
        {
            row: 10,
            col: 5,
            dir: hundo.DirectionEnum.UP
        }

    ],
    ball: {
        row: 2,
        col: 7,
    }
}

var boardConfig2 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 2,
            col: 1
        },
        {
            row: 2,
            col: 2
        },
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },
        {
            row: 3,
            col: 7,
            dir: hundo.DirectionEnum.UP
        }

    ],
    ball: {
        row: 2,
        col: 7,
    }
}

hundo.boardConfigs = [boardConfig1, boardConfig2];
hundo.level = 0

var vizConfig = {
    cellSize: 26,
    stepDuration: 50,
    flyInDuration: 250,
    blowupScale: 3,
    perimStrokeWidth: 3,
    numRows: 15,
    numCols: 20
}

document.onkeydown = hundo.viz.checkKey;

hundo.idGen = new hundo.IdGenerator();
hundo.vizz = new hundo.Viz(vizConfig, hundo.boardConfigs[0]);
hundo.vizz.drawBoard(hundo.board);
