/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

var idGen = new hundo.IdGenerator();

/**
 * Solver.move
 **************************************************/

 TEST = "Solver.move"

 var config = {
    numRows: 10,
    numCols: 10,
    blocks : [
        {
            row: 2,
            col: 0
        },
        {
            row: 2,
            col: 6
        }
    ],
    ball: {
        row: 2,
        col: 3,
    },
    goals: [
        {
            row: 5,
            col: 3,
            dir: hundo.DirectionEnum.UP
        }
    ]
}

var board = new hundo.Board(config, idGen);
hundo.Solver.move(board, hundo.DirectionEnum.UP);
assertEquals(1, board.ball.row, -1);
assertEquals(2, board.ball.col, 3);

board = new hundo.Board(config, idGen);
hundo.Solver.move(board, hundo.DirectionEnum.DOWN);
assertEquals(3, board.ball.row, 5);
assertEquals(4, board.ball.col, 3);

board = new hundo.Board(config, idGen);
hundo.Solver.move(board, hundo.DirectionEnum.LEFT);
assertEquals(5, board.ball.row, 2);
assertEquals(6, board.ball.col, 1);

board = new hundo.Board(config, idGen);
hundo.Solver.move(board, hundo.DirectionEnum.RIGHT);
assertEquals(7, board.ball.row, 2);
assertEquals(8, board.ball.col, 5);

solver = new hundo.Solver(board);
