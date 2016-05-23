/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

/**
 * Board configs
 **************************************************/

var config1 = {
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
    },
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.UP
        }
    ]
}

var config2 = {
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
            col: 4
        }
    ],
    ball: {
        row: 2,
        col: 3,
    },
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.UP
        }
    ]
}

/**
 * Test Board constructor
 **************************************************/
TEST = "Board constructor"

var idGen = new hundo.IdGenerator();
var board = new hundo.Board(config1, idGen);
var NODIR = hundo.DirectionEnum.NODIR;
assertEquals(1, board.numRows, 5);
assertEquals(2, board.numCols, 10);
assert(3, board.matrix[2][1][0].eq(new hundo.Block(0, 2, 1, NODIR)));
assert(4, board.matrix[2][2][0].eq(new hundo.Block(1, 2, 2, NODIR)));
assert(5, board.matrix[2][3][0].eq(new hundo.Ball(2, 2, 3, NODIR)));
assert(6, board.matrix[1][7][0].eq(
    new hundo.Goal(3, 1, 7, hundo.DirectionEnum.UP)));

/**
 * Test Board.getBlocks
 **************************************************/
TEST = "Board.getBlocks"

var board = new hundo.Board(config1, idGen);

var blocks = board.getBlocks();
assertEquals(1, blocks.length, 2);
assert(2, blocks[0].eq(new hundo.Block(0, 2,1)));

/**
 * Test Board.getBalls
 **************************************************/
TEST = "Board.getBalls"

var board = new hundo.Board(config1, idGen);

var blocks = board.getBalls();
assertEquals(1, blocks.length, 1);

/**
 * Board.movePiece
 **************************************************/

TEST = "Board.movePiece in bound to inbound"

var board = new hundo.Board(config1, idGen);

var ball = board.ball;

board.movePiece(ball, 2, 4);

assert(1, ball.eq(new hundo.Ball(2, 2, 4, NODIR)));
assertEquals(2, board.matrix[2][3].length, 0);
assert(3, board.matrix[2][4].length, 1);
assert(4, board.matrix[2][4][0].eq(new hundo.Ball(2, 2, 4, NODIR)));

TEST = "Board.movePiece out of bounds"

var board = new hundo.Board(config1, idGen);

var ball = board.ball;

board.movePiece(ball, -1, 4);

assert(1, ball.eq(new hundo.Ball(2, -1, 4, NODIR)));
assertEquals(2, board.matrix[2][3].length, 0);
assert(3, board.oob.length, 1);
assert(4, board.oob[0].eq(new hundo.Ball(2, -1, 4, NODIR)));

TEST = "Board.movePiece out of bounds to in bounds"

board.movePiece(ball, 4, 4);

assert(1, ball.eq(new hundo.Ball(2, 4, 4, NODIR)));
assertEquals(2, board.oob.length, 0);
assert(3, board.matrix[4][4].length, 1);
assert(4, board.matrix[4][4][0].eq(new hundo.Ball(2, 4, 4, NODIR)));


/**
 * Board.reset
 **************************************************/
TEST = "Board.reset ball"
var board = new hundo.Board(config1, idGen);

board.setDir(hundo.DirectionEnum.RIGHT);

board.step();
assertEquals(1, board.ball.col, 4);
board.reset();
assertEquals(2, board.ball.col, 3);

TEST = "Board.reset oob"
var board = new hundo.Board(config1, idGen);
board.setDir(hundo.DirectionEnum.UP);
board.movePiece(board.ball, -1, 3);
board.ball.dir = hundo.DirectionEnum.NODIR;
assert(1, board.oob[0].eq(
    new hundo.Ball(2, -1, 3, hundo.DirectionEnum.NODIR)));

board.reset();
assertEquals(2, board.oob.length, 0);
assert(3, board.matrix[2][3][0],
    new hundo.Ball(3, 2, 3, hundo.DirectionEnum.NODIR));

TEST = "Board.reset multiple oob"
var board = new hundo.Board(config1, idGen);
board.setDir(hundo.DirectionEnum.UP);
board.movePiece(board.ball, -1, 3);
board.ball.dir = hundo.DirectionEnum.NODIR;
assert(1, board.oob[0].eq(
    new hundo.Ball(2, -1, 3, hundo.DirectionEnum.NODIR)));

board.movePiece(board.matrix[2][2][0], -1, -1);
assert(2, board.oob[1].eq(
    new hundo.Block(1, -1, -1)));
board.reset();


assertEquals(3, board.oob.length, 0);
assert(4, board.matrix[2][3][0],
    new hundo.Ball(3, 2, 3, hundo.DirectionEnum.NODIR));
assert(5, board.matrix[2][2][0],
    new hundo.Block(2, 2, 2));

TEST = "Board.reset in bounds and out of bounds"
var board = new hundo.Board(config1, idGen);

board.movePiece(board.matrix[2][2][0], -1, -1);
assert(1, board.oob[0].eq(
    new hundo.Block(1, -1, -1)));

board.movePiece(board.ball, 0, 0);
assert(2, board.matrix[0][0][0].eq(
    new hundo.Ball(2, 0, 0, hundo.DirectionEnum.NODIR)));

board.reset();
assert(3, board.matrix[2][2][0].eq(
    new hundo.Block(1, 2, 2)));
assert(4, board.matrix[2][3][0].eq(
    new hundo.Ball(2, 2, 3, hundo.DirectionEnum.NODIR)));


/**
 * Board.step once
 **************************************************/

TEST = "Board.step once"


// UP
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.UP;

var result = board.step();
var expectedBall = new hundo.Ball(2, 1, 3, hundo.DirectionEnum.UP);
assert(1, board.matrix[1][3][0].eq(expectedBall));
assert(2, board.ball.eq(expectedBall));
assertEquals(3, result[0].move.dir, hundo.DirectionEnum.UP);

// DOWN
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.DOWN;

var result = board.step();
var expectedBall = new hundo.Ball(2, 3, 3, hundo.DirectionEnum.DOWN);
assert(4, board.matrix[3][3][0].eq(expectedBall));
assert(5, board.ball.eq(expectedBall));
assertEquals(6, result[0].move.dir, hundo.DirectionEnum.DOWN);

// LEFT collide
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.LEFT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 3, hundo.DirectionEnum.NODIR);
assert(7, board.matrix[2][3][0].eq(expectedBall));
assert(8, board.ball.eq(expectedBall));
assertEquals(9, result[0].collide.dir, hundo.DirectionEnum.LEFT);
assert(10, result[0].collide.recipients[0].eq(
    new hundo.Block(1, 2, 2)));

// RIGHT
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.RIGHT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 4, hundo.DirectionEnum.RIGHT);
assert(11, board.matrix[2][4][0].eq(expectedBall));
assert(12, board.ball.eq(expectedBall));
assertEquals(13, result[0].move.dir, hundo.DirectionEnum.RIGHT);

/**
 * Board.step 
 **************************************************/

TEST = "Board.step three times"

var board = new hundo.Board(config2, idGen);

board.ball.dir = hundo.DirectionEnum.RIGHT;

assertEquals(1, board.ball.col, 3);

board.step();

assertEquals(1, board.ball.col, 3);

// TODO: assert

/**
 * Board.nudge
 **************************************************/
TEST = "Board.nudge"

var board = new hundo.Board(config1, idGen);

// nudging empty space
assertEquals(1, true, board.nudge(0,0, hundo.DirectionEnum.UP)[0]);
assertEquals(2, true, board.nudge(0,0, hundo.DirectionEnum.DOWN)[0]);
assertEquals(3, true, board.nudge(0,0, hundo.DirectionEnum.LEFT)[0]);
assertEquals(4, true, board.nudge(0,0, hundo.DirectionEnum.RIGHT)[0]);

// nudging a block
assertEquals(5, false, board.nudge(2,1, hundo.DirectionEnum.UP)[0]);
assertEquals(6, false, board.nudge(2,1, hundo.DirectionEnum.DOWN)[0]);
assertEquals(7, false, board.nudge(2,1, hundo.DirectionEnum.LEFT)[0]);
assertEquals(8, false, board.nudge(2,1, hundo.DirectionEnum.RIGHT)[0]);

// nudging a goal
assertEquals(9, false, board.nudge(1,7, hundo.DirectionEnum.UP)[0]);
assertEquals(10, true, board.nudge(1,7, hundo.DirectionEnum.DOWN)[0]);
assertEquals(11, false, board.nudge(1,7, hundo.DirectionEnum.LEFT)[0]);
assertEquals(12, false, board.nudge(1,7, hundo.DirectionEnum.RIGHT)[0]);

/**
 * Board.checkSolved
 **************************************************/
TEST = "Board.checkSolved"

var board = new hundo.Board(config1, idGen);

assert(1, !board.checkSolved());

board.movePiece(board.ball, 1, 7);

assert(2, board.checkSolved());

/**
 * Board.clone
 **************************************************/

TEST = "Board.clone"

var board1 = new hundo.Board(config1, idGen);
var board2 = board1.clone();

assert(1, Object.compare(board1.getJson(), board2.getJson()));

/**
 * Test piece.equality
 **************************************************/

 TEST = "Block equality"

 assert(1, (new hundo.Block(1, 2, 3)).eq(new hundo.Block(0, 2, 3)));
 assert(1, !(new hundo.Block(1, 2, 3)).eq(new hundo.Block(1, 2, 4)));

 TEST = "Ball equality"

 assert(1, (new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)).eq(
    new hundo.Ball(0, 2, 3, hundo.DirectionEnum.UP)));
 assert(1, !(new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)).eq(
    new hundo.Ball(1, 2, 3, hundo.DirectionEnum.DOWN)));


/**
 * Test hundo.setEq
 **************************************************/

TEST = "Set equality"

var set1 = [new hundo.Block(1, 2, 3),
            new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)];
var set2 = [new hundo.Block(1, 2, 3),
            new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)];
assert(1, hundo.setEq(set1, set2));

set1 = [new hundo.Block(1, 2, 3),
        new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)];
set2 = [new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP),
        new hundo.Block(1, 2, 3)];
assert(2, hundo.setEq(set1, set2));

set1 = [new hundo.Block(1, 2, 3),
        new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)];
set2 = [new hundo.Block(1, 2, 3),
        new hundo.Ball(1, 2, 4, hundo.DirectionEnum.UP)];
assert(3, !hundo.setEq(set1, set2));

set1 = [new hundo.Block(1, 2, 3),
        new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP)];
set2 = [new hundo.Ball(1, 2, 3, hundo.DirectionEnum.UP),
        new hundo.Block(1, 2, 4)];
assert(4, !hundo.setEq(set1, set2));


set1 = [];
set2 = [];
assert(5, hundo.setEq(set1, set2));

/**
 * Test board.eq
 **************************************************/

TEST = "board.eq"


var boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
// boardConfig1 except no ball
var boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}]};
var board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
var board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(1, !board1.eq(board2));

// boardConfig2 except no ball
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}]};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(2, !board1.eq(board2));

// boardConfig 2, except ball in different location
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":0,"col":0}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(3, !board1.eq(board2));

// boardConfig 2, except block in different location
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":0},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(4, !board1.eq(board2));

// boardConfig 2, except numRows is different
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":16,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(5, !board1.eq(board2));

// boardConfig 2, except numCols is different
boardConfig1 = {"numRows":15,"numCols":22,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(6, !board1.eq(board2));

// boardConfig1 == boardConfig2
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupNum":0},{"row":4,"col":1,"groupNum":0},{"row":4,"col":2,"groupNum":0},{"row":4,"col":3,"groupNum":0},{"row":5,"col":2,"groupNum":0},{"row":5,"col":10,"groupNum":1},{"row":6,"col":9,"groupNum":1},{"row":6,"col":10,"groupNum":1},{"row":6,"col":11,"groupNum":1},{"row":7,"col":10,"groupNum":1},{"row":10,"col":8,"groupNum":2},{"row":11,"col":7,"groupNum":2},{"row":11,"col":8,"groupNum":2},{"row":11,"col":9,"groupNum":2},{"row":12,"col":8,"groupNum":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(7, board1.eq(board2));


/**
 * Ball moving into block
 **************************************************/

TEST = "Ball moving into block";

// level-editor.html?level=fl33-03303663-----
var config = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var configUp = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":1,"col":3}};
var board = new hundo.Board(config, idGen);
var boardUp = new hundo.Board(configUp, idGen);
board.move(hundo.DirectionEnum.UP);
assert(1, board.eq(boardUp));

var configDown = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":3}};
board = new hundo.Board(config, idGen);
var boardDown = new hundo.Board(configDown, idGen);
board.move(hundo.DirectionEnum.DOWN);
assert(2, board.eq(boardDown));

var configLeft = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":1}};
board = new hundo.Board(config, idGen);
var boardLeft = new hundo.Board(configLeft, idGen);
board.move(hundo.DirectionEnum.LEFT);
assert(3, board.eq(boardLeft));

var configRight = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":5}};
board = new hundo.Board(config, idGen);
var boardRight = new hundo.Board(configRight, idGen);
board.move(hundo.DirectionEnum.RIGHT);
assert(4, board.eq(boardRight));

/**
 * Ball moving into goal slot
 **************************************************/

TEST = "Ball moving into goal slot";

// level-editor.html?level=fl33--031303362630----
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":0,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(1, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":6,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(2, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":0}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(3, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":6}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(4, board1.eq(board2));

/**
 * Ball bumping into goal side
 **************************************************/

TEST = "Ball bumping into goal side";

// level-editor.html?level=fl33--030300360631----
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":1,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(1, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(2, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(3, board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":5}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(4, board1.eq(board2));

/**
 * Ice bumping into block
 **************************************************/

TEST = "Ice bumping into block";

// one ice
// level-editor.html?level=fl79-39757db9--59777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":5,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(1, board1.eq(board2));

// two ice
// level-editor.html?level=fl79-39757db9--5969777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(1, board1.eq(board2));

// three ice, no movement
// level-editor.html?level=fl79-39757db9--495969777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(1, board1.eq(board2));
