/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

TEST = "Solver"


// level-editor.html?level=fl7a-393a3b666e767e868eb9babb-271----
var config = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":3,"col":10},{"row":3,"col":11},{"row":6,"col":6},{"row":6,"col":14},{"row":7,"col":6},{"row":7,"col":14},{"row":8,"col":6},{"row":8,"col":14},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11}],"goals":[{"row":2,"col":7,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":10}};
var edges = [{"row1":7,"col1":10,"row2":4,"col2":10},{"row1":4,"col1":10,"row2":10,"col2":10},{"row1":10,"col1":10,"row2":10,"col2":-1},{"row1":10,"col1":10,"row2":10,"col2":21},{"row1":4,"col1":10,"row2":4,"col2":-1},{"row1":4,"col1":10,"row2":4,"col2":21},{"row1":7,"col1":10,"row2":7,"col2":7},{"row1":7,"col1":7,"row2":2,"col2":7},{"row1":7,"col1":7,"row2":15,"col2":7},{"row1":7,"col1":7,"row2":7,"col2":13},{"row1":7,"col1":13,"row2":-1,"col2":13},{"row1":7,"col1":13,"row2":15,"col2":13}];
var winningEdges = [{"row1":7,"col1":7,"row2":2,"col2":7},{"row1":7,"col1":10,"row2":7,"col2":7}];
var board = new hundo.Board(config);
var solver = new hundo.Solver(board);
assert(1, Object.compare(edges, solver.getCellEdges()))
assert(2, Object.compare(winningEdges, solver.getCellWinningEdges()))

var config = {"numRows":15,"numCols":21,"blocks":[{"row":2,"col":5},{"row":2,"col":6},{"row":2,"col":7},{"row":4,"col":3},{"row":4,"col":7},{"row":4,"col":8},{"row":4,"col":9},{"row":4,"col":10},{"row":4,"col":11},{"row":5,"col":3},{"row":6,"col":3},{"row":6,"col":5},{"row":6,"col":13},{"row":7,"col":5},{"row":7,"col":13},{"row":8,"col":5},{"row":8,"col":13},{"row":9,"col":5},{"row":9,"col":13},{"row":9,"col":15},{"row":10,"col":15},{"row":11,"col":7},{"row":11,"col":8},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11},{"row":11,"col":15},{"row":13,"col":11},{"row":13,"col":12},{"row":13,"col":13}],"goals":[{"row":3,"col":1,"dir":"RIGHT"},{"row":12,"col":17,"dir":"LEFT"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var edges = [{"row1":7,"col1":9,"row2":5,"col2":9},{"row1":5,"col1":9,"row2":10,"col2":9},{"row1":10,"col1":9,"row2":10,"col2":-1},{"row1":10,"col1":9,"row2":10,"col2":14},{"row1":10,"col1":14,"row2":-1,"col2":14},{"row1":10,"col1":14,"row2":15,"col2":14},{"row1":5,"col1":9,"row2":5,"col2":4},{"row1":5,"col1":4,"row2":-1,"col2":4},{"row1":5,"col1":4,"row2":15,"col2":4},{"row1":5,"col1":4,"row2":5,"col2":21},{"row1":7,"col1":9,"row2":7,"col2":6},{"row1":7,"col1":6,"row2":3,"col2":6},{"row1":3,"col1":6,"row2":15,"col2":6},{"row1":3,"col1":6,"row2":3,"col2":1},{"row1":3,"col1":6,"row2":3,"col2":21},{"row1":7,"col1":6,"row2":7,"col2":12},{"row1":7,"col1":12,"row2":-1,"col2":12},{"row1":7,"col1":12,"row2":12,"col2":12},{"row1":12,"col1":12,"row2":12,"col2":-1},{"row1":12,"col1":12,"row2":12,"col2":17}];
var winningEdges = [{"row1":3,"col1":6,"row2":3,"col2":1},{"row1":7,"col1":6,"row2":3,"col2":6},{"row1":12,"col1":12,"row2":12,"col2":17},{"row1":7,"col1":12,"row2":12,"col2":12},{"row1":7,"col1":6,"row2":7,"col2":12},{"row1":7,"col1":9,"row2":7,"col2":6}];
var board = new hundo.Board(config);
var solver = new hundo.Solver(board);
assert(3, Object.compare(edges, solver.getCellEdges()))
assert(4, Object.compare(winningEdges, solver.getCellWinningEdges()))

// level-editor.html?level=fl75-7h-3b1bb0-78797a7b7c---
var config = {"numRows":15,"numCols":21,"blocks":[{"row":7,"col":17}],"goals":[{"row":3,"col":11,"dir":"DOWN"},{"row":11,"col":11,"dir":"UP"}],"ice":[{"row":7,"col":8},{"row":7,"col":9},{"row":7,"col":10},{"row":7,"col":11},{"row":7,"col":12}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":5}};
var edges = [{"row1":7,"col1":5,"row2":-1,"col2":5},{"row1":7,"col1":5,"row2":15,"col2":5},{"row1":7,"col1":5,"row2":7,"col2":-1},{"row1":7,"col1":5,"row2":7,"col2":11},{"row1":7,"col1":11,"row2":3,"col2":11},{"row1":7,"col1":11,"row2":11,"col2":11},{"row1":7,"col1":11,"row2":7,"col2":-1}];
var winningEdges = [{"row1":7,"col1":11,"row2":3,"col2":11},{"row1":7,"col1":11,"row2":11,"col2":11},{"row1":7,"col1":5,"row2":7,"col2":11}];
var board = new hundo.Board(config);
var solver = new hundo.Solver(board);
assert(5, Object.compare(edges, solver.getCellEdges()))
assert(6, Object.compare(winningEdges, solver.getCellWinningEdges()))

// level-editor.html?level=fl6a-121314292a2b2i3i4i5363737g7h929ja2ajb2b9babbbjd7d8d9-b60-676d---
var config = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":1,"col":3},{"row":1,"col":4},{"row":2,"col":9},{"row":2,"col":10},{"row":2,"col":11},{"row":2,"col":18},{"row":3,"col":18},{"row":4,"col":18},{"row":5,"col":3},{"row":6,"col":3},{"row":7,"col":3},{"row":7,"col":16},{"row":7,"col":17},{"row":9,"col":2},{"row":9,"col":19},{"row":10,"col":2},{"row":10,"col":19},{"row":11,"col":2},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11},{"row":11,"col":19},{"row":13,"col":7},{"row":13,"col":8},{"row":13,"col":9}],"goals":[{"row":11,"col":6,"dir":"UP"}],"ice":[{"row":6,"col":7},{"row":6,"col":13}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":6,"col":10}};
var edges = [{"row1":6,"col1":10,"row2":3,"col2":10},{"row1":3,"col1":10,"row2":10,"col2":10},{"row1":10,"col1":10,"row2":10,"col2":3},{"row1":10,"col1":3,"row2":8,"col2":3},{"row1":8,"col1":3,"row2":15,"col2":3},{"row1":8,"col1":3,"row2":8,"col2":-1},{"row1":8,"col1":3,"row2":8,"col2":21},{"row1":10,"col1":3,"row2":10,"col2":18},{"row1":10,"col1":18,"row2":5,"col2":18},{"row1":5,"col1":18,"row2":15,"col2":18},{"row1":5,"col1":18,"row2":5,"col2":4},{"row1":5,"col1":4,"row2":2,"col2":4},{"row1":2,"col1":4,"row2":15,"col2":4},{"row1":2,"col1":4,"row2":2,"col2":-1},{"row1":2,"col1":4,"row2":2,"col2":8},{"row1":2,"col1":8,"row2":-1,"col2":8},{"row1":2,"col1":8,"row2":12,"col2":8},{"row1":12,"col1":8,"row2":12,"col2":-1},{"row1":12,"col1":8,"row2":12,"col2":21},{"row1":5,"col1":4,"row2":5,"col2":21},{"row1":3,"col1":10,"row2":3,"col2":-1},{"row1":3,"col1":10,"row2":3,"col2":17},{"row1":3,"col1":17,"row2":-1,"col2":17},{"row1":3,"col1":17,"row2":6,"col2":17},{"row1":6,"col1":17,"row2":6,"col2":6},{"row1":6,"col1":6,"row2":-1,"col2":6},{"row1":6,"col1":6,"row2":11,"col2":6},{"row1":6,"col1":6,"row2":6,"col2":21},{"row1":6,"col1":17,"row2":6,"col2":21},{"row1":6,"col1":10,"row2":6,"col2":5},{"row1":6,"col1":5,"row2":-1,"col2":5},{"row1":6,"col1":5,"row2":15,"col2":5},{"row1":6,"col1":5,"row2":6,"col2":21},{"row1":6,"col1":10,"row2":6,"col2":21}];
var winningEdges = [{"row1":6,"col1":6,"row2":11,"col2":6},{"row1":6,"col1":17,"row2":6,"col2":6},{"row1":3,"col1":17,"row2":6,"col2":17},{"row1":3,"col1":10,"row2":3,"col2":17},{"row1":6,"col1":10,"row2":3,"col2":10}];
var board = new hundo.Board(config);
var solver = new hundo.Solver(board);
assert(7, Object.compare(edges, solver.getCellEdges()))
assert(8, Object.compare(winningEdges, solver.getCellWinningEdges()))
