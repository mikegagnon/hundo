/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

var TOP = hundo.LayerEnum.TOP;
var BOTTOM = hundo.LayerEnum.BOTTOM;

// TODO: Use TEST for every test case;

/**
 * Board configs
 ******************************************************************************/

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

/******************************************************************************/
TEST = "Board constructor"

var idGen = new hundo.IdGenerator();
var board = new hundo.Board(config1, idGen);
var NODIR = hundo.DirectionEnum.NODIR;
assertEquals(board.numRows, 5);
assertEquals(board.numCols, 10);
assert(board.matrix[2][1][BOTTOM].eq(
    new hundo.Block(2, 1, NODIR)));
assert(board.matrix[2][2][BOTTOM].eq(
    new hundo.Block(2, 2, NODIR)));
assert(board.matrix[2][3][TOP].eq(
    new hundo.Ball(2, 3, NODIR)));
assert(board.matrix[1][7][BOTTOM].eq(
    new hundo.Goal(1, 7, hundo.DirectionEnum.UP)));

/******************************************************************************/
TEST = "Board.getBlocks"

var board = new hundo.Board(config1, idGen);

var blocks = board.getBlocks();
assertEquals(blocks.length, 2);
assert(blocks[0].eq(new hundo.Block(2,1)));

/******************************************************************************/
TEST = "Board.getBalls"

var board = new hundo.Board(config1, idGen);

var blocks = board.getBalls();
assertEquals(blocks.length, 1);

/******************************************************************************/

TEST = "Board.movePiece in bound to inbound"

var board = new hundo.Board(config1, idGen);

var ball = board.ball;

board.movePiece(ball, 2, 4);

assert(ball.eq(new hundo.Ball(2, 4, NODIR)));
assert(!board.matrix[2][3][TOP]);
assert(board.matrix[2][4][TOP]);
assert(board.matrix[2][4][TOP].eq(
    new hundo.Ball(2, 4, NODIR)));

TEST = "Board.movePiece out of bounds"

var board = new hundo.Board(config1, idGen);

var ball = board.ball;

board.movePiece(ball, -1, 4);

assert(ball.eq(new hundo.Ball(-1, 4, NODIR)));
assert(!board.matrix[2][3][TOP]);
assert(board.oob.length, 1);
assert(board.oob[0].eq(new hundo.Ball(-1, 4, NODIR)));

TEST = "Board.movePiece out of bounds to in bounds"

board.movePiece(ball, 4, 4);

assert(ball.eq(new hundo.Ball(4, 4, NODIR)));
assertEquals(board.oob.length, 0);
assert(board.matrix[4][4][TOP]);
assert(board.matrix[4][4][TOP].eq(
    new hundo.Ball(4, 4, NODIR)));


/**
 * Board.reset
 **************************************************/


TEST = "Board.reset ball"
var board = new hundo.Board(config1, idGen);

board.setDir(hundo.DirectionEnum.RIGHT);

board.step();
assertEquals(board.ball.col, 4);
board.reset();
assertEquals(board.ball.col, 3);

TEST = "Board.reset oob"
var board = new hundo.Board(config1, idGen);
board.setDir(hundo.DirectionEnum.UP);
board.movePiece(board.ball, -1, 3);
board.ball.dir = hundo.DirectionEnum.NODIR;
assert(board.oob[0].eq(
    new hundo.Ball(-1, 3, hundo.DirectionEnum.NODIR)));

board.reset();
assertEquals(board.oob.length, 0);
assert(board.matrix[2][3][TOP],
    new hundo.Ball(2, 3, hundo.DirectionEnum.NODIR));

TEST = "Board.reset multiple oob"
var board = new hundo.Board(config1, idGen);
board.setDir(hundo.DirectionEnum.UP);
board.movePiece(board.ball, -1, 3);
board.ball.dir = hundo.DirectionEnum.NODIR;
assert(board.oob[0].eq(
    new hundo.Ball(-1, 3, hundo.DirectionEnum.NODIR)));

board.movePiece(board.matrix[2][2][BOTTOM], -1, -1);
assert(board.oob[1].eq(
    new hundo.Block(-1, -1)));
board.reset();


assertEquals(board.oob.length, 0);
assert(board.matrix[2][3][TOP],
    new hundo.Ball(2, 3, hundo.DirectionEnum.NODIR));
assert(board.matrix[2][2][BOTTOM],
    new hundo.Block(2, 2));

TEST = "Board.reset in bounds and out of bounds"
var board = new hundo.Board(config1, idGen);

board.movePiece(board.matrix[2][2][BOTTOM], -1, -1);
assert(board.oob[0].eq(
    new hundo.Block(-1, -1)));

board.movePiece(board.ball, 0, 0);
assert(board.matrix[0][0][TOP].eq(
    new hundo.Ball(0, 0, hundo.DirectionEnum.NODIR)));

board.reset();
assert(board.matrix[2][2][BOTTOM].eq(
    new hundo.Block(2, 2)));
assert(board.matrix[2][3][TOP].eq(
    new hundo.Ball(2, 3, hundo.DirectionEnum.NODIR)));


/**
 * Board.step once
 **************************************************/


TEST = "Board.step once"


// UP
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.UP;

var result = board.step();
var expectedBall = new hundo.Ball(1, 3, hundo.DirectionEnum.UP);
assert(board.matrix[1][3][TOP].eq(expectedBall));
assert(board.ball.eq(expectedBall));
assertEquals(result[0].move.dir, hundo.DirectionEnum.UP);

// DOWN
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.DOWN;

var result = board.step();
var expectedBall = new hundo.Ball(3, 3, hundo.DirectionEnum.DOWN);
assert(board.matrix[3][3][TOP].eq(expectedBall));
assert(board.ball.eq(expectedBall));
assertEquals(result[0].move.dir, hundo.DirectionEnum.DOWN);

// LEFT collide
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.LEFT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 3, hundo.DirectionEnum.NODIR);
assert(board.matrix[2][3][TOP].eq(expectedBall));
assert(board.ball.eq(expectedBall));
assertEquals(result[0].collide.dir, hundo.DirectionEnum.LEFT);
assert(result[0].collide.recipients[0].eq(
    new hundo.Block(2, 2)));

// RIGHT
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.RIGHT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 4, hundo.DirectionEnum.RIGHT);
assert(board.matrix[2][4][TOP].eq(expectedBall));
assert(board.ball.eq(expectedBall));
assertEquals(result[0].move.dir, hundo.DirectionEnum.RIGHT);

/**
 * Board.step 
 **************************************************/


TEST = "Board.step three times"

var board = new hundo.Board(config2, idGen);

board.ball.dir = hundo.DirectionEnum.RIGHT;

assertEquals(board.ball.col, 3);

board.step();

assertEquals(board.ball.col, 3);



/**
 * Board.checkSolved
 **************************************************/
TEST = "Board.checkSolved"

var board = new hundo.Board(config1, idGen);

assert(!board.checkSolved());

board.movePiece(board.ball, 1, 7);

assert(board.checkSolved());

/**
 * Board.clone
 **************************************************/


TEST = "Board.clone"

var board1 = new hundo.Board(config1, idGen);
var board2 = board1.clone();

assert(Object.compare(board1.getJson(), board2.getJson()));

/**
 * Test piece.equality
 **************************************************/

 TEST = "Block equality"

 assert((new hundo.Block(2, 3)).eq(new hundo.Block(2, 3)));
 assert(!(new hundo.Block(2, 3)).eq(new hundo.Block(2, 4)));

 TEST = "Ball equality"

 assert((new hundo.Ball(2, 3, hundo.DirectionEnum.UP)).eq(
    new hundo.Ball(2, 3, hundo.DirectionEnum.UP)));
 assert(!(new hundo.Ball(2, 3, hundo.DirectionEnum.UP)).eq(
    new hundo.Ball(2, 3, hundo.DirectionEnum.DOWN)));

/**
 * Test board.eq
 **************************************************/

TEST = "board.eq"


var boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
// boardConfig1 except no ball
var boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}]};
var board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
var board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig2 except no ball
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}]};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig 2, except ball in different location
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":0,"col":0}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig 2, except block in different location
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":0},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig 2, except numRows is different
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":16,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig 2, except numCols is different
boardConfig1 = {"numRows":15,"numCols":22,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(!board1.eq(board2));

// boardConfig1 == boardConfig2
boardConfig1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
boardConfig2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
board1 = new hundo.Board(boardConfig1, hundo.idGenerator)
board2 = new hundo.Board(boardConfig2, hundo.idGenerator)
assert(board1.eq(board2));


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
assert(board.eq(boardUp));

var configDown = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":3}};
board = new hundo.Board(config, idGen);
var boardDown = new hundo.Board(configDown, idGen);
board.move(hundo.DirectionEnum.DOWN);
assert(board.eq(boardDown));

var configLeft = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":1}};
board = new hundo.Board(config, idGen);
var boardLeft = new hundo.Board(configLeft, idGen);
board.move(hundo.DirectionEnum.LEFT);
assert(board.eq(boardLeft));

var configRight = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":5}};
board = new hundo.Board(config, idGen);
var boardRight = new hundo.Board(configRight, idGen);
board.move(hundo.DirectionEnum.RIGHT);
assert(board.eq(boardRight));

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
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":6,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":0}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":3,"col":6,"dir":"LEFT"},{"row":6,"col":3,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":6}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

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
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":3,"dir":"UP"},{"row":3,"col":0,"dir":"UP"},{"row":3,"col":6,"dir":"UP"},{"row":6,"col":3,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":3,"col":5}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

/**
 * Ice bumping into block and going into goal and going out of bounds
 **************************************************/

TEST = "Ice bumping into block and going into goal and going out of bounds";

// one ice
// level-editor.html?level=fl79-39757db9--59777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":5,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// two ice
// level-editor.html?level=fl79-39757db9--5969777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// three ice, no movement
// level-editor.html?level=fl79-39757db9--495969777b99---
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":7},{"row":7,"col":11},{"row":9,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// ice going into goal
// level-editor.html?level=fla9--291-596979---
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":2,"col":9,"dir":"DOWN"}],"ice":[{"row":5,"col":9},{"row":6,"col":9},{"row":7,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":10,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":2,"col":9,"dir":"DOWN"}],"ice":[{"row":2,"col":9},{"row":3,"col":9},{"row":4,"col":9}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":5,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Ice going out of bounds
// level-editor.html?level=fl9a---3a5a7a-----
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":3,"col":10},{"row":5,"col":10},{"row":7,"col":10}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":9,"col":10},portals:[]};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":-1,"col":10},{"row":-1,"col":10},{"row":-1,"col":10}],"arrows":[],"gblocks":[],"sand":[],"ball":{"row":-1,"col":10},portals:[]};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

/**
 * Passing through arrows, and exiting clogged arrow
 **************************************************/

TEST = "Passing through arrows, and exiting clogged arrow";

// level-editor.html?level=fl79-39757db9---5907727b3991--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":4,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":10,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":6}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"UP"},{"row":7,"col":7,"dir":"LEFT"},{"row":7,"col":11,"dir":"RIGHT"},{"row":9,"col":9,"dir":"DOWN"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":12}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Exiting clogged arrow
// level-editor.html?level=fl6a-5aba---6a0--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":5,"col":10},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[{"row":6,"col":10,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":5,"col":10},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[{"row":6,"col":10,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":10,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":5,"col":10},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[{"row":6,"col":10,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":10}};
var config2 = config1;
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":5,"col":10},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[{"row":6,"col":10,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":10}};
var config2 = config1;
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":5,"col":10},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[{"row":6,"col":10,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":10}};
var config2 = config1;
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

/**
 * Bumping into arrows
 **************************************************/

TEST = "Bumping into arrows";

// level-editor.html?level=fl79-39757db9---5917707b0990--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":8,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":8}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9},{"row":7,"col":5},{"row":7,"col":13},{"row":11,"col":9}],"goals":[],"ice":[],"arrows":[{"row":5,"col":9,"dir":"DOWN"},{"row":7,"col":7,"dir":"UP"},{"row":7,"col":11,"dir":"UP"},{"row":9,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));


/**
 * Ice and arrows
 **************************************************/

TEST = "Ice and arrows";

// one ice
// level-editor.html?level=flb9-39--99-690--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":9,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":11,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":4,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":5,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// two ice, with ball clogged in arrow
// level-editor.html?level=flb9-39--7999-690--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":7,"col":9},{"row":9,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":11,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// three ice, with ice clogged in arrow
// level-editor.html?level=flb9-39--798999-690--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":7,"col":9},{"row":8,"col":9},{"row":9,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":11,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":4,"col":9},{"row":5,"col":9},{"row":6,"col":9}],"arrows":[{"row":6,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":7,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// three ice bumping into side of arrow
// level-editor.html?level=flb9-39--798999-693--
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":7,"col":9},{"row":8,"col":9},{"row":9,"col":9}],"arrows":[{"row":6,"col":9,"dir":"RIGHT"}],"gblocks":[],"sand":[],"ball":{"row":11,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[{"row":7,"col":9},{"row":8,"col":9},{"row":9,"col":9}],"arrows":[{"row":6,"col":9,"dir":"RIGHT"}],"gblocks":[],"sand":[],"ball":{"row":10,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

/**
 * Gblocks
 **************************************************/
// TODO: test case where ice is nested in a gblock-cluster and a ball is
// nested in a gblock-cluster
// TODO: test case where a large cluster is centered on sand

TEST = "Gblocks";

// Four single-cell gblocks (each a different groupId) bumping into blocks
// level-editor.html?level=fl7a-3a767eba----5a07817c39a2-
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":10},{"row":7,"col":6},{"row":7,"col":14},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":10,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":12,"groupId":3},{"row":9,"col":10,"groupId":2}],"sand":[],"ball":{"row":7,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":10},{"row":7,"col":6},{"row":7,"col":14},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":4,"col":10,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":12,"groupId":3},{"row":9,"col":10,"groupId":2}],"sand":[],"ball":{"row":5,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":10},{"row":7,"col":6},{"row":7,"col":14},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":10,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":12,"groupId":3},{"row":9,"col":10,"groupId":2}],"sand":[],"ball":{"row":7,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":10},{"row":7,"col":6},{"row":7,"col":14},{"row":11,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":10,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":13,"groupId":3},{"row":9,"col":10,"groupId":2}],"sand":[],"ball":{"row":7,"col":12}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// One gblock-quad-square bumping into block
// level-editor.html?level=fla9-39----680690780790-
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":8,"groupId":0},{"row":6,"col":9,"groupId":0},{"row":7,"col":8,"groupId":0},{"row":7,"col":9,"groupId":0}],"sand":[],"ball":{"row":10,"col":9}};;
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":9}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":4,"col":8,"groupId":0},{"row":4,"col":9,"groupId":0},{"row":5,"col":8,"groupId":0},{"row":5,"col":9,"groupId":0}],"sand":[],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Heading OOB
// level-editor.html?level=fl8a-----3a24a25a2-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":3,"col":10,"groupId":2},{"row":4,"col":10,"groupId":2},{"row":5,"col":10,"groupId":2}],"sand":[],"ball":{"row":8,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":0,"col":10,"groupId":2},{"row":1,"col":10,"groupId":2},{"row":2,"col":10,"groupId":2}],"sand":[],"ball":{"row":3,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Four oddly shaped glbock-groups bumping into each other
// level-editor.html?level=fle8-----382560570580670871971981a81c73c83c93-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":3,"col":8,"groupId":2},{"row":5,"col":6,"groupId":0},{"row":5,"col":7,"groupId":0},{"row":5,"col":8,"groupId":0},{"row":6,"col":7,"groupId":0},{"row":8,"col":7,"groupId":1},{"row":9,"col":7,"groupId":1},{"row":9,"col":8,"groupId":1},{"row":10,"col":8,"groupId":1},{"row":12,"col":7,"groupId":3},{"row":12,"col":8,"groupId":3},{"row":12,"col":9,"groupId":3}],"sand":[],"ball":{"row":14,"col":8}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":0,"col":8,"groupId":2},{"row":1,"col":6,"groupId":0},{"row":1,"col":7,"groupId":0},{"row":1,"col":8,"groupId":0},{"row":2,"col":7,"groupId":0},{"row":3,"col":7,"groupId":1},{"row":4,"col":7,"groupId":1},{"row":4,"col":8,"groupId":1},{"row":5,"col":8,"groupId":1},{"row":6,"col":7,"groupId":3},{"row":6,"col":8,"groupId":3},{"row":6,"col":9,"groupId":3}],"sand":[],"ball":{"row":7,"col":8}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// One gblock-cell rejected by goal
// level-editor.html?level=fl59--091---290-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":9,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[{"row":2,"col":9,"groupId":0}],"sand":[],"ball":{"row":5,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":0,"col":9,"dir":"DOWN"}],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":9,"groupId":0}],"sand":[],"ball":{"row":2,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Ice and gblocks pushing into goal
// level-editor.html?level=fl52--5k2-5455565b5e5h5j--4804g35805c15d15g35i36806g36h36i3-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":5,"col":20,"dir":"LEFT"}],"ice":[{"row":5,"col":4},{"row":5,"col":5},{"row":5,"col":6},{"row":5,"col":11},{"row":5,"col":14},{"row":5,"col":17},{"row":5,"col":19}],"arrows":[],"gblocks":[{"row":4,"col":8,"groupId":0},{"row":4,"col":16,"groupId":3},{"row":5,"col":8,"groupId":0},{"row":5,"col":12,"groupId":1},{"row":5,"col":13,"groupId":1},{"row":5,"col":16,"groupId":3},{"row":5,"col":18,"groupId":3},{"row":6,"col":8,"groupId":0},{"row":6,"col":16,"groupId":3},{"row":6,"col":17,"groupId":3},{"row":6,"col":18,"groupId":3}],"sand":[],"ball":{"row":5,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":5,"col":20,"dir":"LEFT"}],"ice":[{"row":5,"col":9},{"row":5,"col":10},{"row":5,"col":11},{"row":5,"col":13},{"row":5,"col":16},{"row":5,"col":18},{"row":5,"col":20}],"arrows":[],"gblocks":[{"row":4,"col":12,"groupId":0},{"row":4,"col":17,"groupId":3},{"row":5,"col":12,"groupId":0},{"row":5,"col":14,"groupId":1},{"row":5,"col":15,"groupId":1},{"row":5,"col":17,"groupId":3},{"row":5,"col":19,"groupId":3},{"row":6,"col":12,"groupId":0},{"row":6,"col":17,"groupId":3},{"row":6,"col":18,"groupId":3},{"row":6,"col":19,"groupId":3}],"sand":[],"ball":{"row":5,"col":8}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Mutually dependent gblocks, case 1: two mutually dependent groups
// level-editor.html?level=fl6f-----681770781790870880890-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":8,"groupId":1},{"row":7,"col":7,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":9,"groupId":0},{"row":8,"col":7,"groupId":0},{"row":8,"col":8,"groupId":0},{"row":8,"col":9,"groupId":0}],"sand":[],"ball":{"row":6,"col":15}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":1,"groupId":1},{"row":7,"col":0,"groupId":0},{"row":7,"col":1,"groupId":1},{"row":7,"col":2,"groupId":0},{"row":8,"col":0,"groupId":0},{"row":8,"col":1,"groupId":0},{"row":8,"col":2,"groupId":0}],"sand":[],"ball":{"row":6,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Mutually dependent gblocks, case 2: pushing into an independent group
// level-editor.html?level=fl6f-----662672681762770781790862870880890-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":6,"groupId":2},{"row":6,"col":7,"groupId":2},{"row":6,"col":8,"groupId":1},{"row":7,"col":6,"groupId":2},{"row":7,"col":7,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":9,"groupId":0},{"row":8,"col":6,"groupId":2},{"row":8,"col":7,"groupId":0},{"row":8,"col":8,"groupId":0},{"row":8,"col":9,"groupId":0}],"sand":[],"ball":{"row":6,"col":15}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":0,"groupId":2},{"row":6,"col":1,"groupId":2},{"row":6,"col":2,"groupId":1},{"row":7,"col":0,"groupId":2},{"row":7,"col":1,"groupId":0},{"row":7,"col":2,"groupId":1},{"row":7,"col":3,"groupId":0},{"row":8,"col":0,"groupId":2},{"row":8,"col":1,"groupId":0},{"row":8,"col":2,"groupId":0},{"row":8,"col":3,"groupId":0}],"sand":[],"ball":{"row":6,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Mutually dependent gblocks, case 3: three mutually dependent groups
// level-editor.html?level=fl7d-----6626726817627707817908628708808908a29629729829929a2-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":6,"groupId":2},{"row":6,"col":7,"groupId":2},{"row":6,"col":8,"groupId":1},{"row":7,"col":6,"groupId":2},{"row":7,"col":7,"groupId":0},{"row":7,"col":8,"groupId":1},{"row":7,"col":9,"groupId":0},{"row":8,"col":6,"groupId":2},{"row":8,"col":7,"groupId":0},{"row":8,"col":8,"groupId":0},{"row":8,"col":9,"groupId":0},{"row":8,"col":10,"groupId":2},{"row":9,"col":6,"groupId":2},{"row":9,"col":7,"groupId":2},{"row":9,"col":8,"groupId":2},{"row":9,"col":9,"groupId":2},{"row":9,"col":10,"groupId":2}],"sand":[],"ball":{"row":7,"col":13}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":6,"col":0,"groupId":2},{"row":6,"col":1,"groupId":2},{"row":6,"col":2,"groupId":1},{"row":7,"col":0,"groupId":2},{"row":7,"col":1,"groupId":0},{"row":7,"col":2,"groupId":1},{"row":7,"col":3,"groupId":0},{"row":8,"col":0,"groupId":2},{"row":8,"col":1,"groupId":0},{"row":8,"col":2,"groupId":0},{"row":8,"col":3,"groupId":0},{"row":8,"col":4,"groupId":2},{"row":9,"col":0,"groupId":2},{"row":9,"col":1,"groupId":2},{"row":9,"col":2,"groupId":2},{"row":9,"col":3,"groupId":2},{"row":9,"col":4,"groupId":2}],"sand":[],"ball":{"row":7,"col":4}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Gblocks and ice
// level-editor.html?level=fl52--5k2-5455565b5e5h5j--4804g35805a05c15d15g36806906a06g3-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":5,"col":20,"dir":"LEFT"}],"ice":[{"row":5,"col":4},{"row":5,"col":5},{"row":5,"col":6},{"row":5,"col":11},{"row":5,"col":14},{"row":5,"col":17},{"row":5,"col":19}],"arrows":[],"gblocks":[{"row":4,"col":8,"groupId":0},{"row":4,"col":16,"groupId":3},{"row":5,"col":8,"groupId":0},{"row":5,"col":10,"groupId":0},{"row":5,"col":12,"groupId":1},{"row":5,"col":13,"groupId":1},{"row":5,"col":16,"groupId":3},{"row":6,"col":8,"groupId":0},{"row":6,"col":9,"groupId":0},{"row":6,"col":10,"groupId":0},{"row":6,"col":16,"groupId":3}],"sand":[],"ball":{"row":5,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":5,"col":20,"dir":"LEFT"}],"ice":[{"row":5,"col":8},{"row":5,"col":9},{"row":5,"col":10},{"row":5,"col":14},{"row":5,"col":17},{"row":5,"col":19},{"row":5,"col":20}],"arrows":[],"gblocks":[{"row":4,"col":11,"groupId":0},{"row":4,"col":18,"groupId":3},{"row":5,"col":11,"groupId":0},{"row":5,"col":13,"groupId":0},{"row":5,"col":15,"groupId":1},{"row":5,"col":16,"groupId":1},{"row":5,"col":18,"groupId":3},{"row":6,"col":11,"groupId":0},{"row":6,"col":12,"groupId":0},{"row":6,"col":13,"groupId":0},{"row":6,"col":18,"groupId":3}],"sand":[],"ball":{"row":5,"col":7}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Gblock rejected by arrow
// level-editor.html?level=flaa----5a0-8a0-
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[{"row":5,"col":10,"dir":"UP"}],"gblocks":[{"row":8,"col":10,"groupId":0}],"sand":[],"ball":{"row":10,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[{"row":5,"col":10,"dir":"UP"}],"gblocks":[{"row":6,"col":10,"groupId":0}],"sand":[],"ball":{"row":7,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));


/**
 * Sand
 **************************************************/

TEST = "Sand";

// Ball bumping into one ice, bumping into sand
// level-editor.html?level=fl00---01---02

var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":1}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":2}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// block to the right of sand; ball on sand, pushing right
// level-editor.html?level=fl02-03-----02
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// ice on sand; ball to the left of ice-sand; ball pushing right
// level-editor.html?level=fl01---02---02
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":2}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":3}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// ball on sand; ice to right of ball-sand; ball pushing right
// level-editor.html?level=fl02---03---02
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":3}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":0,"col":21}],"arrows":[],"gblocks":[],"sand":[{"row":0,"col":2}],"ball":{"row":0,"col":21}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// gblocks to right of ball; sand to right of gblocks
// level-editor.html?level=fl11-----120130220320-15
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":2,"groupId":0},{"row":1,"col":3,"groupId":0},{"row":2,"col":2,"groupId":0},{"row":3,"col":2,"groupId":0}],"sand":[{"row":1,"col":5}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":4,"groupId":0},{"row":1,"col":5,"groupId":0},{"row":2,"col":4,"groupId":0},{"row":3,"col":4,"groupId":0}],"sand":[{"row":1,"col":5}],"ball":{"row":1,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// glbocks on sand; ball to left of gblocks
// level-editor.html?level=fl13-----140150240340-15
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":4,"groupId":0},{"row":1,"col":5,"groupId":0},{"row":2,"col":4,"groupId":0},{"row":3,"col":4,"groupId":0}],"sand":[{"row":1,"col":5}],"ball":{"row":1,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":5,"groupId":0},{"row":1,"col":6,"groupId":0},{"row":2,"col":5,"groupId":0},{"row":3,"col":5,"groupId":0}],"sand":[{"row":1,"col":5}],"ball":{"row":1,"col":4}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Ball going into sandpit
// level-editor.html?level=fl9a------4a
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":4,"col":10}],"ball":{"row":9,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":4,"col":10}],"ball":{"row":4,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Ball exiting sand
// level-editor.html?level=fl4a-9a-----4a
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":9,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":4,"col":10}],"ball":{"row":4,"col":10}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":9,"col":10}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":4,"col":10}],"ball":{"row":8,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

// Ice going on sand
// level-editor.html?level=fl6e---6d---6a
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":6,"col":13}],"arrows":[],"gblocks":[],"sand":[{"row":6,"col":10}],"ball":{"row":6,"col":14}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":6,"col":10}],"arrows":[],"gblocks":[],"sand":[{"row":6,"col":10}],"ball":{"row":6,"col":11}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Ice exiting sand
// level-editor.html?level=fl6b---6a---6a
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":6,"col":10}],"arrows":[],"gblocks":[],"sand":[{"row":6,"col":10}],"ball":{"row":6,"col":11}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":6,"col":9}],"arrows":[],"gblocks":[],"sand":[{"row":6,"col":10}],"ball":{"row":6,"col":10}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Gblock entering sand
// level-editor.html?level=flb9-----870880890-59
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":8,"col":7,"groupId":0},{"row":8,"col":8,"groupId":0},{"row":8,"col":9,"groupId":0}],"sand":[{"row":5,"col":9}],"ball":{"row":11,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":7,"groupId":0},{"row":5,"col":8,"groupId":0},{"row":5,"col":9,"groupId":0}],"sand":[{"row":5,"col":9}],"ball":{"row":6,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Gblock exiting sand
// level-editor.html?level=fl69-----570580590-59
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":7,"groupId":0},{"row":5,"col":8,"groupId":0},{"row":5,"col":9,"groupId":0}],"sand":[{"row":5,"col":9}],"ball":{"row":6,"col":9}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":4,"col":7,"groupId":0},{"row":4,"col":8,"groupId":0},{"row":4,"col":9,"groupId":0}],"sand":[{"row":5,"col":9}],"ball":{"row":5,"col":9}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Gblock exiting sand
// level-editor.html?level=fl10-----200210-21
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":1,"col":0,"groupId":0},{"row":1,"col":1,"groupId":0}],"sand":[{"row":1,"col":1}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":14,"col":0,"groupId":0},{"row":14,"col":1,"groupId":0}],"sand":[{"row":1,"col":1}],"ball":{"row":13,"col":0}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));


/**
 * Portals
 ******************************************************************************/

TEST = "Portals"

// Ball going through portal
// level-editor.html?level=fl00-12------010100
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":1,"groupId":0},{"row":1,"col":0,"groupId":0}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":1,"groupId":0},{"row":1,"col":0,"groupId":0}],"ball":{"row":1,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Ball and ice going through portal
// level-editor.html?level=fl00-14--01----020110
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[{"row":0,"col":1}],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":2,"groupId":0},{"row":1,"col":1,"groupId":0}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[{"row":1,"col":3}],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":2,"groupId":0},{"row":1,"col":1,"groupId":0}],"ball":{"row":1,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Ball and three ice cubes going through portal; ball gets rejected
// level-editor.html?level=fl00-14--010203----040110
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[{"row":0,"col":1},{"row":0,"col":2},{"row":0,"col":3}],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":4,"groupId":0},{"row":1,"col":1,"groupId":0}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[{"row":1,"col":1},{"row":1,"col":2},{"row":1,"col":3}],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":0,"col":4,"groupId":0},{"row":1,"col":1,"groupId":0}],"ball":{"row":0,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// gblock pushing into portal
// level-editor.html?level=fl00-14----012--020120
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":0,"col":1,"groupId":2}],"sand":[],"portals":[{"row":0,"col":2,"groupId":0},{"row":1,"col":2,"groupId":0}],"ball":{"row":0,"col":0}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4}],"goals":[],"ice":[],"arrows":[],"gblocks":[{"row":0,"col":1,"groupId":2}],"sand":[],"portals":[{"row":0,"col":2,"groupId":0},{"row":1,"col":2,"groupId":0}],"ball":{"row":0,"col":0}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// sand-ball adjacent to portal
// level-editor.html?level=fl22-626364-----22-323343
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":6,"col":2},{"row":6,"col":3},{"row":6,"col":4}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":2,"col":2}],"portals":[{"row":3,"col":2,"groupId":3},{"row":3,"col":4,"groupId":3}],"ball":{"row":2,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":6,"col":2},{"row":6,"col":3},{"row":6,"col":4}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[{"row":2,"col":2}],"portals":[{"row":3,"col":2,"groupId":3},{"row":3,"col":4,"groupId":3}],"ball":{"row":5,"col":4}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

// adjacent portals of different colors
// level-editor.html?level=fl45-0010203040------120133420433
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":0},{"row":1,"col":0},{"row":2,"col":0},{"row":3,"col":0},{"row":4,"col":0}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":1,"col":2,"groupId":0},{"row":1,"col":3,"groupId":3},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":3}],"ball":{"row":4,"col":5}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":0},{"row":1,"col":0},{"row":2,"col":0},{"row":3,"col":0},{"row":4,"col":0}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":1,"col":2,"groupId":0},{"row":1,"col":3,"groupId":3},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":3}],"ball":{"row":4,"col":1}};;
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

/**
 * Pips
 ******************************************************************************/

TEST = "Pips"

/**
 * Ball going straight through pips
 ******************************************************************************/

// Ball going left through LR-pip
// level-editor.html?level=fl14-1016-------120011
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":0},{"row":1,"col":6}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":2,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":1,"col":4}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":0},{"row":1,"col":6}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":2,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":1,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Ball going right through LR-pip
// level-editor.html?level=fl11-1016-------120011
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":0},{"row":1,"col":6}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":2,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":0},{"row":1,"col":6}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":2,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":1,"col":5}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Ball going up through UD-pip
// level-editor.html?level=fl52-1272-------321100
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":7,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":2,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":5,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":7,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":2,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":2,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Ball going down through UD-pip
// level-editor.html?level=fl22-1272-------321100
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":7,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":2,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":2,"col":2}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":7,"col":2}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":2,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":6,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));


/**
 * Ball bumping into straight-through pips
 ******************************************************************************/

// Ball bumping into left side of UD-pip
// level-editor.html?level=fl11--------131100
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":3,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":3,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":1,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Ball bumping into right side of UD-pip
// level-editor.html?level=fl13--------111100
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":1,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":true,"down":true,"left":false,"right":false}],"ball":{"row":1,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Ball bumping into top side of LR-pip
// level-editor.html?level=fl11--------310011
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":1,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":1,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":2,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

// Ball bumping into bottom side of LR-pip
// level-editor.html?level=fl31--------110011
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":3,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":2,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));


/**
 * Going through and bumping into DR elbow
 ******************************************************************************/

// Up through DR elbow
// level-editor.html?level=fl31-1441-------110101
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":4,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":3,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":4,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Left through DR elbow
// level-editor.html?level=fl13-1441-------110101
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":4,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":4,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":3,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// Bumping into left side of DR elbow
// level-editor.html?level=fl21--------230101
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":2,"col":3,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":2,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":2,"col":3,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":2,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.RIGHT);
assert(board1.eq(board2));

// Bumping into top side of DR elbow
// level-editor.html?level=fl11--------310101
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":3,"col":1,"up":false,"down":true,"left":false,"right":true}],"ball":{"row":2,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

/**
 * Going through and bumping into UDR-tri-pip
 ******************************************************************************/

// Ball going down through UDR-tri-pip
// level-editor.html?level=fl11-71-------411101
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":7,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":1,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":7,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":1,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":6,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

// Ball going up through UDR-tri-pip
// level-editor.html?level=fl11-71-------411101
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":1},{"row":7,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":1,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":6,"col":1}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":1},{"row":7,"col":1}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":1,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":2,"col":1}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Ball going inside UDR-tri-pip, then bumping into side
// level-editor.html?level=fl15--------131101
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":3,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":5}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":1,"col":3,"up":true,"down":true,"left":false,"right":true}],"ball":{"row":1,"col":3}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

/**
 *  Multi-pip tests
 ******************************************************************************/

// Going through quad, UR, UL, DL, DR, tri,
// level-editor.html?level=fl58--------450101460110540101551111561010641001651011660011670011681111690110781001791010
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":5,"col":8}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":6,"col":5}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));

// Same as above, but in reverse
// level-editor.html?level=fl65-38-------450101460110540101551111561010641001651011660011670011681111690110781001791010
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":8}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":6,"col":5}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":8}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":4,"col":8}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.UP);
assert(board1.eq(board2));

// Same as above, but clogging the pipes with ice
// /level-editor.html?level=fl08---1828384858-----450101460110540101551111561010641001651011660011670011681111690110781001791010
var config1 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":1,"col":8},{"row":2,"col":8},{"row":3,"col":8},{"row":4,"col":8},{"row":5,"col":8}],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":0,"col":8}};
var config2 = {"numRows":15,"numCols":21,"blocks":[],"goals":[],"ice":[{"row":5,"col":8},{"row":6,"col":8},{"row":6,"col":9},{"row":7,"col":8},{"row":7,"col":9}],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":4,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":5,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":6,"up":true,"down":false,"left":true,"right":false},{"row":6,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":6,"col":5,"up":true,"down":false,"left":true,"right":true},{"row":6,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":9,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":4,"col":8}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.DOWN);
assert(board1.eq(board2));



/**
 * Misc pip tests
 ******************************************************************************/


// Ball goes through DR elbow, then UR elbow
// level-editor.html?level=fl23-33-------200101301001
var config1 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":2,"col":0,"up":false,"down":true,"left":false,"right":true},{"row":3,"col":0,"up":true,"down":false,"left":false,"right":true}],"ball":{"row":2,"col":3}};
var config2 = {"numRows":15,"numCols":21,"blocks":[{"row":3,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[{"row":2,"col":0,"up":false,"down":true,"left":false,"right":true},{"row":3,"col":0,"up":true,"down":false,"left":false,"right":true}],"ball":{"row":3,"col":2}};
var board1 = new hundo.Board(config1, idGen);
var board2 = new hundo.Board(config2, idGen);
board1.move(hundo.DirectionEnum.LEFT);
assert(board1.eq(board2));

// TODO: Ice and pips
// TODO: Gblocks and pips


