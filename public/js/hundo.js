
var viz;
var board;

var vizConfig = {
    cellSize : 32
}

board = {
    num_rows: 5,
    num_cols: 10,
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

viz = d3.select("#boardSvg")
    .attr("width", board.num_cols * vizConfig.cellSize)
    .attr("height", board.num_rows * vizConfig.cellSize);

viz.select("#background")
    .attr("width", board.num_cols * vizConfig.cellSize)
    .attr("height", board.num_rows * vizConfig.cellSize)
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


