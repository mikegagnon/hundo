

/**
 * Equals methods for piece objects
 **************************************************/

function equalsTypeRowCol(a, b) {
    return a.type == b.type &&
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
TEST_CASE = "Board constructor"

var board = new hundo.Board(config1);

assertEquals(1, board.numRows, 5);
assertEquals(2, board.numCols, 10);
assert(3, board.matrix[2][1][0].equals(new hundo.Block(2,1)));
assert(4, board.matrix[2][2][0].equals(new hundo.Block(2,2)));
assert(5, board.matrix[2][3][0].equals(new hundo.Ball(2,3)));

/**
 * Test Board.getBlocks
 **************************************************/
TEST_CASE = "Board.getBlocks"

var board = new hundo.Board(config1);

var blocks = board.getBlocks();
assertEquals(1, blocks.length, 2);
assert(2, blocks[0].equals(new hundo.Block(2,1)));

/**
 * Test Board.getBalls
 **************************************************/
TEST_CASE = "Board.getBalls"

var board = new hundo.Board(config1);

var blocks = board.getBalls();
assertEquals(1, blocks.length, 1);
