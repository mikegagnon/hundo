
var hundo = {}

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
    this.matrix = new Array();
    for (var i = 0; i < this.numRows; i++) {
      this.matrix[i] = new Array();
      for (var j = 0; j < this.numCols; j++) {
        this.matrix[i][j] = new Array();
      }
    }

    var THIS = this;

    // Add blocks to the matrix
    _.each(boardConfig.blocks, function(block){
        var row = block.row;
        var col = block.col;
        THIS.matrix[row][col].push(new hundo.Block(idGen.next(), row, col)); 
    });
    
    // Add the ball to the matrix
    var row = boardConfig.ball.row;
    var col = boardConfig.ball.col;
    this.ball = new hundo.Ball(idGen.next(), row, col, hundo.DirectionEnum.NODIR);
    this.matrix[row][col].push(this.ball);

    // Add goals to the matrix
    _.each(boardConfig.goals, function(goal) {
        var row = goal.row;
        var col = goal.col;
        var dir = goal.dir;
        THIS.matrix[row][col].push(new hundo.Goal(idGen.next(), row, col, dir));
    });
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

    return moved;
}

hundo.Board.prototype.setDir = function(direction) {
    this.ball.dir = direction;
    this.atRest = false;
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

    var result = true;

    _.each(pieces, function(piece) {
        result &= piece.nudge(dir);
    });

    return result;

}

hundo.Board.prototype.checkSolved = function() {

    var pieces = this.matrix[this.ball.row][this.ball.col]

    var result = _.filter(pieces, function(piece){
        return piece.type == hundo.PieceTypeEnum.GOAL;
    })

    return result.length == 1;
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

hundo.instances = {}

hundo.vizz = null;

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

    return viz;
}

hundo.Viz = function(config) {

    // TODO: validate vizConfig and levels
    this.vizConfig = config.viz;
    this.levels = config.levels;
    boardConfig = this.levels[0];
    this.id = config.id;
    this.level = 0;

    var svgContents = `
    <div>
        <div id="${this.boardDivId()}">
            <svg id="${this.boardSvgId()}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <g id="blockTemplate" height="20" width="20" >
                      <rect x="0" y="0" width="20" height="20" fill="#888" />
                      <path d="M0 0 L26 0 L20 6 L6 6 Z"
                        stroke="none" fill="#aaa"/>
                      <path d="M0 0 L6 6 L6 20 L0 26 Z"
                        stroke="none" fill="#aaa"/>
                      <path d="M26 0 L20 6 L20 20 L26 26 Z"
                        stroke="none" fill="#666"/>
                      <path d="M26 26 L20 20 L6 20 L0 26 Z"
                        stroke="none" fill="#666"/>
                    </g>
                    <g id="goalTemplate" height="20" width="20">
                        <polygon points="0,26 0,13 13,26" style="fill:red" />
                        <polygon points="13,26 26, 13 26,26" style="fill:red" />
                        <rect x="0" y="23" width="26" height="3" fill="red" />
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
        </div>
    </div>
`
    var svg = $('<div/>').html(svgContents).contents();

    $("#" + this.hundoId()).append(svg);

    if (config.viz.playButton) {
        this.addPlayButton();
    }

    if (config.viz.levelSelect) {
        this.addLevelSelect();
    }

    this.boardSvg = d3.select("#" + this.boardSvgId())
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize);

    this.boardSvg.select("#background")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)
        .attr("style", "fill:black");

    this.boardSvg.select("#perim")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)

    this.drawGrid();

    this.idGen = new hundo.IdGenerator();

    this.board = new hundo.Board(boardConfig, this.idGen);

    this.drawBoard();

}

hundo.Viz.prototype.addPlayButton = function() {
    var contents = `<button onclick="hundo.clickPlay(${this.id})" type="button"
     class="button">Play</button>`

    var playButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(playButton);
}

hundo.Viz.prototype.addLevelSelect = function() {
    var contents = `
        <button type="button" class="button" onmouseover="" style="cursor: pointer;">◀</button>
        <span id="${this.levelTextId()}""></span>
        <button onClick="hundo.clickLevelForward(${this.id})"type="button" class="button" onmouseover="" style="color:#bbb">▶</button>
        `

    var levelSelect = $("<div/>").html(contents).contents();

    $("#" + this.consoleId()).append(levelSelect);
}

hundo.Viz.prototype.hundoId = function() {
    return "hundo" + this.id;
}

hundo.Viz.prototype.boardDivId = function() {
    return "boardDiv" + this.id;
}

hundo.Viz.prototype.boardSvgId = function() {
    return "boardSvg" + this.id;
}

hundo.Viz.prototype.playButtonId = function() {
    return "playButton" + this.id;
}

hundo.Viz.prototype.consoleId = function() {
    return "console" + this.id;
}

hundo.Viz.prototype.levelTextId = function() {
    return "levelText" + this.id;
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

// TODO: rm board argument
hundo.Viz.prototype.drawBoard = function() {

    var levelText = "Level " + (this.level + 1) + "/" + this.levels.length;

    $("#" + this.levelTextId()).text(levelText);


    var dxdy = this.vizConfig.cellSize / 2;

    var THIS = this;

    this.boardSvg.selectAll()
        .data(this.board.getBlocks())
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
            return THIS.transform(piece, {
                dx: dxdy,
                dy: dxdy,
                scale: 0
            });
        });

    this.boardSvg.selectAll()
        .data(this.board.getGoals())
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
        THIS.boardSvg.select("#" + hundo.Viz.pieceId(piece))
            .transition()
            .ease("linear")
            .attr("rx", THIS.vizConfig.cellSize / 2)
            .attr("ry", THIS.vizConfig.cellSize / 2)
            .attr("transform", function() {
                return THIS.transform(piece);
            })
            .duration(0);
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

// TODO: Cleanup
hundo.Viz.prototype.animateVictory = function() {

    var THIS = this;

    this.boardSvg.select("#background")
        .transition()
        .style("fill", "#EEE")
        .duration(THIS.vizConfig.flyInDuration * 10);

    this.boardSvg.selectAll(".grid")
        .remove();

    var circles = [];
    var numCircles = 100;
    var duration = 2000;
    _.range(0, numCircles)
        .map(function(i){
            var color = d3.hsl(hundo.getRandom(0, 360),
                1.0, 0.5);
            var x = hundo.getRandom(0, this.board.numCols * 2 * THIS.vizConfig.cellSize);
            var y = hundo.getRandom(0, this.board.numRows * 2 * THIS.vizConfig.cellSize);
            var r = hundo.getRandom(50, 200);
            var delay = hundo.getRandom(0, duration);
            circles.push({
                color: color,
                x: x,
                y: y,
                r: r,
                delay: delay
            });
        });

    this.boardSvg.selectAll()
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
}


hundo.Viz.prototype.nextLevel = function() {

    var THIS = this;

    setTimeout(function(){
        if (THIS.level < THIS.levels.length - 1) {
            THIS.level++;
            THIS.board = new hundo.Board(THIS.levels[THIS.level],
                THIS.idGen);
            THIS.drawBoard(this.board);
        } else {
            // all levels solved
            THIS.animateVictory();
        }
    }, this.vizConfig.flyInDuration / 2);

    this.animateSolved();
}

// TODO: idGen member of Viz
hundo.Viz.prototype.stepAnimate = function() {

    var THIS = this;

    var animate = this.board.step();

    if (this.board.atRest) {
        clearInterval(this.animateInterval);
    }

    if (this.board.done) {
        setTimeout(
            function(){THIS.reset(this.board);},
            THIS.animateInterval);
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

    } else if ("collide" in animate) {
        var recipients = animate.collide.recipients;
        var dir = animate.collide.dir;
        for (var i = 0; i < recipients.length; i++) {
            var piece = recipients[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            this.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("rx", this.vizConfig.cellSize / 2)
                .attr("ry", this.vizConfig.cellSize / 2)
                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= THIS.vizConfig.cellSize / 3;
                    dy *= THIS.vizConfig.cellSize / 3;

                    return THIS.transform(piece, {dx: dx, dy: dy});
                })
                .duration(this.vizConfig.stepDuration / 2);
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

    if (this.board.solved) {
        this.nextLevel();
    }
}

hundo.Viz.checkKey = function(e) {

    if (!hundo.vizz.board.atRest) {
        return;
    }

    if (hundo.vizz.board.solved) {
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

    hundo.vizz.board.setDir(direction);



    hundo.vizz.stepAnimate(hundo.vizz.board);

    if (!hundo.vizz.board.atRest) {
        hundo.vizz.animateInterval =
            setInterval(
                function(){hundo.vizz.stepAnimate(hundo.vizz.board);},
                hundo.vizz.vizConfig.stepDuration);
    }
}

hundo.clickPlay = function(id) {
    hundo.vizz = hundo.instances[id];
}

hundo.clickLevelForward = function(id) {
    hundo.vizz.nextLevel();
}

hundo.defaultVizConfig = {
    cellSize: 26,
    stepDuration: 50,
    flyInDuration: 250,
    blowupScale: 3,
    perimStrokeWidth: 3,
    numRows: 15,
    numCols: 21,
    playButton: false,
    levelSelect: true
}

var starter = {
    numRows: 15,
    numCols: 21,
    blocks: [
        {
            row: 3,
            col: 9
        },
        {
            row: 3,
            col: 10
        },
        {
            row: 3,
            col: 11
        },
        {
            row: 11,
            col: 9
        },
        {
            row: 11,
            col: 10
        },
        {
            row: 11,
            col: 11
        },
        {
            row: 6,
            col: 6
        },
        {
            row: 7,
            col: 6
        },
        {
            row: 8,
            col: 6
        },
        {
            row: 6,
            col: 14
        },
        {
            row: 7,
            col: 14
        },
        {
            row: 8,
            col: 14
        },


    ],
    goals: [
        {
            row: 2,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },

    ],
    ball: {
        row: 7,
        col: 10
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

var boardConfig3 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 5,
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



levels = [starter, boardConfig1, boardConfig2, boardConfig3];

document.onkeydown = hundo.Viz.checkKey;

new Hundo({
    levels: levels,
    id: 1,
    viz: {
        playButton: false,
        levelSelect: true
    }
});

