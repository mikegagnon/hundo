/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */



/**
 * Equals methods for piece objects
 **************************************************/

function equalsTypeRowCol(a, b) {
    return a.type == b.type &&
        a.row == b.row &&
        a.col == b.col;
}

/*hundo.Block.prototype.equals = function(piece) {
    return equalsTypeRowCol(this, piece);
}

hundo.Ball.prototype.equals = function(piece) {
    return equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Goal.prototype.equals = function(piece) {
    return equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}*/

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
assert(3, board.matrix[2][1][0].equals(new hundo.Block(0, 2, 1, NODIR)));
assert(4, board.matrix[2][2][0].equals(new hundo.Block(1, 2, 2, NODIR)));
assert(5, board.matrix[2][3][0].equals(new hundo.Ball(2, 2, 3, NODIR)));
assert(6, board.matrix[1][7][0].equals(
    new hundo.Goal(3, 1, 7, hundo.DirectionEnum.UP)));

/**
 * Test Board.getBlocks
 **************************************************/
TEST = "Board.getBlocks"

var board = new hundo.Board(config1, idGen);

var blocks = board.getBlocks();
assertEquals(1, blocks.length, 2);
assert(2, blocks[0].equals(new hundo.Block(0, 2,1)));

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

assert(1, ball.equals(new hundo.Ball(2, 2, 4, NODIR)));
assertEquals(2, board.matrix[2][3].length, 0);
assert(3, board.matrix[2][4].length, 1);
assert(4, board.matrix[2][4][0].equals(new hundo.Ball(2, 2, 4, NODIR)));

TEST = "Board.movePiece out of bounds"

var board = new hundo.Board(config1, idGen);

var ball = board.ball;

board.movePiece(ball, -1, 4);

assert(1, ball.equals(new hundo.Ball(2, -1, 4, NODIR)));
assertEquals(2, board.matrix[2][3].length, 0);
assert(3, board.oob.length, 1);
assert(4, board.oob[0].equals(new hundo.Ball(2, -1, 4, NODIR)));

TEST = "Board.movePiece out of bounds to in bounds"

board.movePiece(ball, 4, 4);

assert(1, ball.equals(new hundo.Ball(2, 4, 4, NODIR)));
assertEquals(2, board.oob.length, 0);
assert(3, board.matrix[4][4].length, 1);
assert(4, board.matrix[4][4][0].equals(new hundo.Ball(2, 4, 4, NODIR)));


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
assert(1, board.oob[0].equals(
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
assert(1, board.oob[0].equals(
    new hundo.Ball(2, -1, 3, hundo.DirectionEnum.NODIR)));

board.movePiece(board.matrix[2][2][0], -1, -1);
assert(2, board.oob[1].equals(
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
assert(1, board.oob[0].equals(
    new hundo.Block(1, -1, -1)));

board.movePiece(board.ball, 0, 0);
assert(2, board.matrix[0][0][0].equals(
    new hundo.Ball(2, 0, 0, hundo.DirectionEnum.NODIR)));

board.reset();
assert(3, board.matrix[2][2][0].equals(
    new hundo.Block(1, 2, 2)));
assert(4, board.matrix[2][3][0].equals(
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
assert(1, board.matrix[1][3][0].equals(expectedBall));
assert(2, board.ball.equals(expectedBall));
assertEquals(3, result[0].move.dir, hundo.DirectionEnum.UP);

// DOWN
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.DOWN;

var result = board.step();
var expectedBall = new hundo.Ball(2, 3, 3, hundo.DirectionEnum.DOWN);
assert(4, board.matrix[3][3][0].equals(expectedBall));
assert(5, board.ball.equals(expectedBall));
assertEquals(6, result[0].move.dir, hundo.DirectionEnum.DOWN);

// LEFT collide
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.LEFT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 3, hundo.DirectionEnum.NODIR);
assert(7, board.matrix[2][3][0].equals(expectedBall));
assert(8, board.ball.equals(expectedBall));
assertEquals(9, result[0].collide.dir, hundo.DirectionEnum.LEFT);
assert(10, result[0].collide.recipients[0].equals(
    new hundo.Block(1, 2, 2)));

// RIGHT
var board = new hundo.Board(config1, idGen);

board.ball.dir = hundo.DirectionEnum.RIGHT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 4, hundo.DirectionEnum.RIGHT);
assert(11, board.matrix[2][4][0].equals(expectedBall));
assert(12, board.ball.equals(expectedBall));
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

assert(1, board1.getJson().equals(board2.getJson()));
