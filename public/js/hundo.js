
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

hundo.MoveEnum = {
    // out of bounds
    OOB: 0,
    NO_MOVE: 1
}

hundo.Block = function(row, col) {
    this.type = hundo.PieceTypeEnum.BLOCK;
    this.row = row;
    this.col = col;
}

hundo.Ball = function(row, col) {
    this.type = hundo.PieceTypeEnum.BALL;
    this.row = row;
    this.col = col;
    this.dir = hundo.PieceTypeEnum.NODIR;
}

// TODO: Assume boardConfig is untrusted
hundo.Board = function(boardConfig) {

    // waiting for input. The ball cannot move when waiting == false
    // this.waiting = true,

    this.numRows = boardConfig.numRows;
    this.numCols = boardConfig.numCols;
    
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
        THIS.matrix[row][col].push(new hundo.Block(row, col));
    })
    
    // Add the ball to the matrix
    var row = boardConfig.ball.row;
    var col = boardConfig.ball.col;
    this.matrix[row][col].push(new hundo.Ball(row, col));

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

hundo.Board.prototype.step = function() {

    if (this.ball.dir == DirectionEnum.NODIR) {
        alert("Cannot step when ball has no momentum");
        return;
    }

    if (this.ball.row < 0 || this.ball.row > this.numRows ||
        this.ball.col < 0 || this.ball.col > this.numCols) {
        return MoveEnum.OOB;
    }
    
    var dr = 0, dc = 0;
    if (direction == DirectionEnum.UP) {
        dr = -1;
    } else if (direction == DirectionEnum.DOWN) {
        dr = 1;
    } else if (direction == DirectionEnum.LEFT) {
        dc = -1;
    } else if (direction == DirectionEnum.UP) {
        dc = 1;
    } else {
        alert("error");
    }

    var newRow = this.ball.row + dr;
    var newCol = this.ball.col + dc;

    if (this.matrix[newRow][newCol].length > 0) {
        return MoveEnum.NO_MOVE;
    } else {
        
    }
}

boardConfig = {
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
        }
    ],
    ball: {
        row: 2,
        col: 3,
    }
}

var board = new hundo.Board(boardConfig);

var vizConfig = {
    cellSize : 32
}

hundo.viz = d3.select("#boardSvg")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize);

hundo.viz.select("#background")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize)
    .attr("style", "fill:black");


hundo.viz.selectAll(".block")
    .data(board.getBlocks())
    .enter()
    .append("svg:use")
    .attr("class", "block")
    .attr("xlink:href", "#blockTemplate")
    .attr("transform", function(ball) {
      var x = ball.col * vizConfig.cellSize;
      var y = ball.row * vizConfig.cellSize;
      return "translate(" + x + ", " + y + ") "
    })

hundo.viz.selectAll(".ball")
    .data(board.getBalls())
    .enter()
    .append("svg:use")
    .attr("class", "ball")
    .attr("xlink:href", "#ballTemplate")
    .attr("transform", function(block) {
      var x = block.col * vizConfig.cellSize;
      var y = block.row * vizConfig.cellSize;
      return "translate(" + x + ", " + y + ") "
    })


document.onkeydown = checkKey;

function checkKey(e) {

    if (!boardConfig.waiting) {
        return;
    }

    var e = e || window.event;

    if (e.keyCode == '38') {
        console.log("up")
    } else if (e.keyCode == '40') {
        console.log("down")
    } else if (e.keyCode == '37') {
        console.log("left")
    } else if (e.keyCode == '39') {
        console.log("right")

    }

}
