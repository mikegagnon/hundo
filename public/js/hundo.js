
var PieceTypeEnum = {
    BALL: "BALL",
    BLOCK: "BLOCK"
}

var DirectionEnum = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

var MoveEnum = {
    // out of bounds
    OOB: 0,
    NO_MOVE: 1
}

function Block(row, col) {
    this.type = PieceTypeEnum.BLOCK;
    this.row = row;
    this.col = col;
}

function Ball(row, col) {
    this.type = PieceTypeEnum.BALL;
    this.row = row;
    this.col = col;
}

// TODO: Assume boardConfig is untrusted
function Board (boardConfig) {

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
        THIS.matrix[row][col].push(new Block(row, col));
    })
    
    // Add the ball to the matrix
    var row = boardConfig.ball.row;
    var col = boardConfig.ball.col;
    this.matrix[row][col].push(new Ball(row, col));

}

// func(piece) should return true if the piece is of the type being gotten
Board.prototype.getPieces = function(func) {

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
 
Board.prototype.getBlocks = function() {
    return this.getPieces(function(piece){
        return piece.type == PieceTypeEnum.BLOCK;
    });
};

Board.prototype.getBalls = function() {
    return this.getPieces(function(piece){
        return piece.type == PieceTypeEnum.BALL;
    });
};


/*Board.prototype.move = function(direction) {
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
}*/

var boardConfig = board = {
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

board = new Board(boardConfig);

var vizConfig = {
    cellSize : 32
}

viz = d3.select("#boardSvg")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize);

viz.select("#background")
    .attr("width", boardConfig.numCols * vizConfig.cellSize)
    .attr("height", boardConfig.numRows * vizConfig.cellSize)
    .attr("style", "fill:black");


viz.selectAll(".block")
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

viz.selectAll(".ball")
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
