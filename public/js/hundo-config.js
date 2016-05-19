/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

var starter = {
    numRows: 15,
    numCols: 21,
    blocks: [
        {
            row: 3,
            col: 9
        },
        {
            row: 3,
            col: 10
        },
        {
            row: 3,
            col: 11
        },
        {
            row: 11,
            col: 9
        },
        {
            row: 11,
            col: 10
        },
        {
            row: 11,
            col: 11
        },
        {
            row: 6,
            col: 6
        },
        {
            row: 7,
            col: 6
        },
        {
            row: 8,
            col: 6
        },
        {
            row: 6,
            col: 14
        },
        {
            row: 7,
            col: 14
        },
        {
            row: 8,
            col: 14
        },


    ],
    goals: [
        {
            row: 2,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },

    ],
    ice: [
        {
            row: 6,
            col: 10
        }
    ],
    ball: {
        row: 7,
        col: 10
    }
}

var boardConfig1 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 2,
            col: 0
        },
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
            col: 3
        },
        {
            row: 2,
            col: 8
        },
        {
            row: 2,
            col: 4
        },
        {
            row: 2,
            col: 9
        },
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },
        {
            row: 3,
            col: 7,
            dir: hundo.DirectionEnum.UP
        },
        {
            row: 5,
            col: 8,
            dir: hundo.DirectionEnum.LEFT
        },
        {
            row: 10,
            col: 5,
            dir: hundo.DirectionEnum.RIGHT
        }

    ],
    ball: {
        row: 2,
        col: 7,
    }
}

var boardConfig2 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 2,
            col: 1
        },
        {
            row: 2,
            col: 2
        },
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },
        {
            row: 3,
            col: 7,
            dir: hundo.DirectionEnum.UP
        }

    ],
    ball: {
        row: 2,
        col: 7,
    }
}

var boardConfig3 = {
    numRows: 15,
    numCols: 20,
    blocks : [
        {
            row: 5,
            col: 1
        },
        {
            row: 2,
            col: 2
        },
    ],
    goals: [
        {
            row: 1,
            col: 7,
            dir: hundo.DirectionEnum.DOWN
        },
        {
            row: 3,
            col: 7,
            dir: hundo.DirectionEnum.UP
        }

    ],
    ball: {
        row: 2,
        col: 7,
    }
}



var foo = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":1},{"row":1,"col":2},{"row":1,"col":3},{"row":1,"col":14},{"row":2,"col":18},{"row":3,"col":1},{"row":3,"col":10},{"row":3,"col":11},{"row":3,"col":12},{"row":3,"col":13},{"row":3,"col":14},{"row":3,"col":18},{"row":4,"col":1},{"row":4,"col":18},{"row":5,"col":1},{"row":5,"col":18},{"row":6,"col":1},{"row":6,"col":18},{"row":7,"col":1},{"row":7,"col":18},{"row":8,"col":1},{"row":8,"col":12},{"row":9,"col":1},{"row":9,"col":12},{"row":10,"col":1},{"row":10,"col":12},{"row":10,"col":16},{"row":10,"col":17},{"row":10,"col":18},{"row":11,"col":12},{"row":12,"col":1},{"row":12,"col":2},{"row":12,"col":3},{"row":12,"col":12},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14}],"goals":[{"row":13,"col":6,"dir":"RIGHT"}],"ball":{"row":6,"col":9}}
var diagonal = {"numRows":15,"numCols":21,"blocks":[{"row":2,"col":5},{"row":2,"col":6},{"row":2,"col":7},{"row":4,"col":3},{"row":4,"col":7},{"row":4,"col":8},{"row":4,"col":9},{"row":4,"col":10},{"row":4,"col":11},{"row":5,"col":3},{"row":6,"col":3},{"row":6,"col":5},{"row":6,"col":13},{"row":7,"col":5},{"row":7,"col":13},{"row":8,"col":5},{"row":8,"col":13},{"row":9,"col":5},{"row":9,"col":13},{"row":9,"col":15},{"row":10,"col":15},{"row":11,"col":7},{"row":11,"col":8},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11},{"row":11,"col":15},{"row":13,"col":11},{"row":13,"col":12},{"row":13,"col":13}],"goals":[{"row":3,"col":1,"dir":"RIGHT"},{"row":12,"col":17,"dir":"LEFT"}],"ball":{"row":7,"col":9}}
levels = [starter, diagonal, foo];

new Hundo({
    levels: levels,
    id: 1,
    viz: {
        playButton: false,
        levelSelect: true
    },
    maker: false
});