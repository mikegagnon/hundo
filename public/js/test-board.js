
var TEST_CASE;

function assertEquals(x, a, b) {
    if (a != b) {
        console.error(TEST_CASE + ", " + x + ": " + a + " != " + b);
    }
}

/**
 * Test Board constructor
 **************************************************/
TEST_CASE = "Board constructor 1"

var config = {
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

var board = new hundo.Board(config);

assertEquals(1, board.numRows, 5);
assertEquals(2, board.numCols, 10);

assertEquals(3, board.matrix[2][1][0].type, hundo.PieceTypeEnum.BLOCK);
assertEquals(4, board.matrix[2][1][0].row, 2);
assertEquals(5, board.matrix[2][1][0].col, 1);

assertEquals(6, board.matrix[2][2][0].type, hundo.PieceTypeEnum.BLOCK);
assertEquals(7, board.matrix[2][2][0].row, 2);
assertEquals(8, board.matrix[2][2][0].col, 2);

assertEquals(9, board.matrix[2][3][0].type, hundo.PieceTypeEnum.BALL);
assertEquals(10, board.matrix[2][3][0].row, 2);
assertEquals(11, board.matrix[2][3][0].col, 3);



