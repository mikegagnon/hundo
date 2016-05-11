



/**
 * Equals methods for piece objects
 **************************************************/

function equalsTypeRowCol(a, b) {
    return a.id == b.id &&
        a.type == b.type &&
        a.row == b.row &&
        a.col == b.col;
}

hundo.Block.prototype.equals = function(block) {
    return equalsTypeRowCol(this, block);
}

hundo.Ball.prototype.equals = function(ball) {
    return equalsTypeRowCol(this, ball) &&
        this.dir == ball.dir;
}

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
    }
}

/**
 * Test Board constructor
 **************************************************/
TEST = "Board constructor"

var board = new hundo.Board(config1);
var NODIR = hundo.DirectionEnum.NODIR;
assertEquals(1, board.numRows, 5);
assertEquals(2, board.numCols, 10);
assert(3, board.matrix[2][1][0].equals(new hundo.Block(0, 2, 1, NODIR)));
assert(4, board.matrix[2][2][0].equals(new hundo.Block(1, 2, 2, NODIR)));
assert(5, board.matrix[2][3][0].equals(new hundo.Ball(2, 2, 3, NODIR)));

/**
 * Test Board.getBlocks
 **************************************************/
TEST = "Board.getBlocks"

var board = new hundo.Board(config1);

var blocks = board.getBlocks();
assertEquals(1, blocks.length, 2);
assert(2, blocks[0].equals(new hundo.Block(0, 2,1)));

/**
 * Test Board.getBalls
 **************************************************/
TEST = "Board.getBalls"

var board = new hundo.Board(config1);

var blocks = board.getBalls();
assertEquals(1, blocks.length, 1);

/**
 * Board.movePiece
 **************************************************/

TEST = "Board.movePiece in bound to inbound"

var board = new hundo.Board(config1);

var ball = new hundo.Ball(2, 2, 3, NODIR);

board.movePiece(ball, 2, 4);

assert(1, ball.equals(new hundo.Ball(2, 2, 4, NODIR)));
assertEquals(2, board.matrix[2][3].length, 0);
assert(3, board.matrix[2][4].length, 1);
assert(4, board.matrix[2][4][0].equals(new hundo.Ball(2, 2, 4, NODIR)));

TEST = "Board.movePiece out of bounds"

var board = new hundo.Board(config1);

var ball = new hundo.Ball(2, 2, 3, NODIR);

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
var board = new hundo.Board(config1);

board.setDir(hundo.DirectionEnum.RIGHT);

board.step();
assertEquals(1, board.ball.col, 4);
board.reset();
assertEquals(2, board.ball.col, 3);

TEST = "Board.reset oob"
var board = new hundo.Board(config1);
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
var board = new hundo.Board(config1);
board.setDir(hundo.DirectionEnum.UP);
board.movePiece(board.ball, -1, 3);
board.ball.dir = hundo.DirectionEnum.NODIR;
assert(1, board.oob[0].equals(
    new hundo.Ball(2, -1, 3, hundo.DirectionEnum.NODIR)));

board.movePiece(board.matrix[2][2][0], -1, -1);
assert(2, board.oob[1].equals(
    new hundo.Block(1, -1, -1)));
board.reset();

/*
assertEquals(3, board.oob.length, 0);
assert(4, board.matrix[2][3][0],
    new hundo.Ball(3, 2, 3, hundo.DirectionEnum.NODIR));
assert(5, board.matrix[2][2][0],
    new hundo.Block(2, 2, 2));
*/



/**
 * Board.step once
 **************************************************/

TEST = "Board.step once"


// UP
var board = new hundo.Board(config1);

board.ball.dir = hundo.DirectionEnum.UP;

var result = board.step();
var expectedBall = new hundo.Ball(2, 1, 3, hundo.DirectionEnum.UP);
assert(1, board.matrix[1][3][0].equals(expectedBall));
assert(2, board.ball.equals(expectedBall));
assertEquals(3, result.move.dir, hundo.DirectionEnum.UP);

// DOWN
var board = new hundo.Board(config1);

board.ball.dir = hundo.DirectionEnum.DOWN;

var result = board.step();
var expectedBall = new hundo.Ball(2, 3, 3, hundo.DirectionEnum.DOWN);
assert(4, board.matrix[3][3][0].equals(expectedBall));
assert(5, board.ball.equals(expectedBall));
assertEquals(6, result.move.dir, hundo.DirectionEnum.DOWN);

// LEFT collide
var board = new hundo.Board(config1);

board.ball.dir = hundo.DirectionEnum.LEFT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 3, hundo.DirectionEnum.NODIR);
assert(7, board.matrix[2][3][0].equals(expectedBall));
assert(8, board.ball.equals(expectedBall));
assertEquals(9, result.collide.dir, hundo.DirectionEnum.LEFT);
assert(10, result.collide.recipients[0].equals(
    new hundo.Block(1, 2, 2)));

// RIGHT
var board = new hundo.Board(config1);

board.ball.dir = hundo.DirectionEnum.RIGHT;

var result = board.step();
var expectedBall = new hundo.Ball(2, 2, 4, hundo.DirectionEnum.RIGHT);
assert(11, board.matrix[2][4][0].equals(expectedBall));
assert(12, board.ball.equals(expectedBall));
assertEquals(13, result.move.dir, hundo.DirectionEnum.RIGHT);

/**
 * Board.step once
 **************************************************/

TEST = "Board.step three times"

var board = new hundo.Board(config1);

board.ball.dir = hundo.DirectionEnum.UP;

board.step();
board.step();
var result = board.step();


