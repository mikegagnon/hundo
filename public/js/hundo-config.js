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
    ball: {
        row: 7,
        col: 10
    },
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
    },
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
var iceIntro ={"numRows":15,"numCols":21,"blocks":[{"row":7,"col":17}],"goals":[{"row":3,"col":11,"dir":"DOWN"},{"row":11,"col":11,"dir":"UP"}],"ice":[{"row":7,"col":8},{"row":7,"col":9},{"row":7,"col":10},{"row":7,"col":11},{"row":7,"col":12}],"ball":{"row":7,"col":5}};
var pairTheIce = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":1,"col":3},{"row":1,"col":4},{"row":2,"col":9},{"row":2,"col":10},{"row":2,"col":11},{"row":2,"col":18},{"row":3,"col":18},{"row":4,"col":18},{"row":5,"col":3},{"row":6,"col":3},{"row":7,"col":3},{"row":7,"col":16},{"row":7,"col":17},{"row":9,"col":2},{"row":9,"col":19},{"row":10,"col":2},{"row":10,"col":19},{"row":11,"col":2},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11},{"row":11,"col":19},{"row":13,"col":7},{"row":13,"col":8},{"row":13,"col":9}],"goals":[{"row":11,"col":6,"dir":"UP"}],"ice":[{"row":6,"col":7},{"row":6,"col":13}],"ball":{"row":6,"col":10}};
var iceDistraction = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":15},{"row":0,"col":16},{"row":1,"col":5},{"row":1,"col":11},{"row":2,"col":5},{"row":2,"col":6},{"row":2,"col":11},{"row":3,"col":1},{"row":3,"col":2},{"row":3,"col":3},{"row":4,"col":16},{"row":5,"col":2},{"row":5,"col":16},{"row":6,"col":2},{"row":6,"col":16},{"row":7,"col":2},{"row":8,"col":15},{"row":8,"col":16},{"row":9,"col":9},{"row":9,"col":10},{"row":9,"col":11},{"row":9,"col":15},{"row":9,"col":16},{"row":10,"col":2},{"row":10,"col":4},{"row":11,"col":2},{"row":11,"col":14},{"row":11,"col":15},{"row":11,"col":16},{"row":11,"col":17},{"row":12,"col":2},{"row":12,"col":11},{"row":12,"col":12},{"row":13,"col":11},{"row":13,"col":12}],"goals":[{"row":1,"col":8,"dir":"DOWN"}],"ice":[{"row":1,"col":17},{"row":4,"col":6},{"row":7,"col":17},{"row":10,"col":18},{"row":11,"col":9},{"row":12,"col":3}],"ball":{"row":4,"col":9}}
var arrowIntro = {"numRows":15,"numCols":21,"blocks":[{"row":4,"col":15},{"row":5,"col":15},{"row":6,"col":15},{"row":7,"col":15},{"row":8,"col":15},{"row":9,"col":15},{"row":10,"col":15}],"goals":[{"row":4,"col":11,"dir":"DOWN"},{"row":10,"col":11,"dir":"UP"}],"ice":[],"arrows":[{"row":7,"col":10,"dir":"RIGHT"}],"ball":{"row":7,"col":5}};
var arrowDistraction = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":15},{"row":1,"col":4},{"row":1,"col":5},{"row":1,"col":6},{"row":1,"col":15},{"row":2,"col":15},{"row":3,"col":17},{"row":3,"col":18},{"row":3,"col":19},{"row":3,"col":20},{"row":4,"col":10},{"row":6,"col":1},{"row":6,"col":9},{"row":7,"col":1},{"row":7,"col":17},{"row":8,"col":17},{"row":9,"col":8},{"row":10,"col":8},{"row":10,"col":19},{"row":11,"col":8},{"row":11,"col":19},{"row":12,"col":1},{"row":12,"col":2},{"row":12,"col":3},{"row":12,"col":16},{"row":12,"col":19}],"goals":[{"row":3,"col":12,"dir":"DOWN"}],"ice":[],"arrows":[{"row":7,"col":11,"dir":"RIGHT"},{"row":10,"col":13,"dir":"LEFT"}],"ball":{"row":6,"col":5}};
var arrowIceMachine = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":12},{"row":1,"col":19},{"row":2,"col":4},{"row":3,"col":8},{"row":4,"col":2},{"row":4,"col":11},{"row":5,"col":9},{"row":6,"col":7},{"row":6,"col":9},{"row":7,"col":6},{"row":7,"col":7},{"row":7,"col":9},{"row":9,"col":1},{"row":9,"col":8},{"row":9,"col":18},{"row":10,"col":8},{"row":12,"col":8},{"row":12,"col":20},{"row":13,"col":2},{"row":13,"col":3},{"row":13,"col":4},{"row":13,"col":5},{"row":13,"col":9},{"row":13,"col":10}],"goals":[{"row":5,"col":15,"dir":"DOWN"},{"row":11,"col":15,"dir":"UP"}],"ice":[{"row":7,"col":8},{"row":8,"col":5},{"row":9,"col":7},{"row":9,"col":9}],"arrows":[{"row":7,"col":5,"dir":"DOWN"},{"row":8,"col":11,"dir":"RIGHT"},{"row":8,"col":16,"dir":"LEFT"}],"ball":{"row":8,"col":3}};
var gblockIntro = {"numRows":15,"numCols":21,"blocks":[{"row":13,"col":7},{"row":13,"col":8},{"row":13,"col":9},{"row":13,"col":10},{"row":13,"col":11}],"goals":[{"row":1,"col":17,"dir":"DOWN"},{"row":11,"col":18,"dir":"LEFT"},{"row":12,"col":2,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[{"row":4,"col":15,"groupNum":1},{"row":5,"col":3,"groupNum":2},{"row":5,"col":15,"groupNum":1},{"row":6,"col":3,"groupNum":2},{"row":6,"col":13,"groupNum":1},{"row":6,"col":14,"groupNum":1},{"row":6,"col":15,"groupNum":1},{"row":7,"col":3,"groupNum":2},{"row":7,"col":15,"groupNum":1},{"row":8,"col":3,"groupNum":2},{"row":8,"col":15,"groupNum":1},{"row":9,"col":8,"groupNum":0},{"row":9,"col":9,"groupNum":0},{"row":9,"col":10,"groupNum":0},{"row":10,"col":8,"groupNum":0},{"row":10,"col":9,"groupNum":0},{"row":10,"col":10,"groupNum":0}],"ball":{"row":6,"col":9}}

levels = [starter, diagonal, iceIntro, pairTheIce, arrowIntro, arrowIceMachine, gblockIntro];

new Hundo({
    levels: levels,
    id: 1,
    viz: {
        playButton: false,
        levelSelect: true
    },
    maker: false
});