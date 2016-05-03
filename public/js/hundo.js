
var viz;
var board;

var vizConfig = {
    cellSize : 32
}

var state = {
    waiting: true,
}

var PieceTypeEnum = {
    BALL: 2,
    BLOCK: 1
}

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
    balls: [
        {
            row: 2,
            col: 3,
        }
    ]
}

// TODO: Assume boardConfig is untrusted
function Board (boardConfig) {
    this.numRows = boardConfig.numRows;
    this.numCols = boardConfig.numCols;
    this.ball = boardConfig.balls[0];
    
    this.matrix = new Array(this.numRows);
    for (var i = 0; i < this.numRows; i++) {
      this.matrix[i] = new Array(this.numCols);
      for (var j = 0; j < this.numCols; j++) {
        this.matrix[i][j] = new Array();
      }
    }

    for (var block in boardConfig.blocks) {
        this.matrix[block.row][block.col].append({"type": PieceTypeEnum.BLOCK})
    }
    
    for (var ball in boardConfig.balls) {
        this.matrix[ball.row][ball.col].append({"type": PieceTypeEnum.BALL})
    }

}
 
Board.prototype.getBlocks = function() {
    return null;
};

Board.prototype.getBalls = function() {
    return null;
};






viz = d3.select("#boardSvg")
    .attr("width", board.numCols * vizConfig.cellSize)
    .attr("height", board.numRows * vizConfig.cellSize);

viz.select("#background")
    .attr("width", board.numCols * vizConfig.cellSize)
    .attr("height", board.numRows * vizConfig.cellSize)
    .attr("style", "fill:black");

viz.selectAll(".block")
    .data(board.blocks)
    .enter()
    .append("svg:use")
    .attr("class", "block")
    .attr("xlink:href", "#blockTemplate")
    .attr("transform", function(block) {
      var x = block.col * vizConfig.cellSize;
      var y = block.row * vizConfig.cellSize;
      return "translate(" + x + ", " + y + ") "
    })

viz.selectAll(".ball")
    .data(board.balls)
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

    if (!state.waiting) {
        return;
    }

    var e = e || window.event;

    if (e.keyCode == '38') {
        console.log("up")
    }
    else if (e.keyCode == '40') {
        console.log("down")
    }
    else if (e.keyCode == '37') {
        console.log("left")
    }
    else if (e.keyCode == '39') {
        console.log("right")
        
    }

}

function Apple (type) {
    this.type = type;
    this.color = "red";
}
 
Apple.prototype.getInfo = function() {
    return this.color + ' ' + this.type + ' apple';
};

var x = new Apple("gala");

var y = new Apple("fuji");

console.log(x.getInfo())
console.log(y.getInfo())
