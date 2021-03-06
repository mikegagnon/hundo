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
var arrowIceIntro = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":8},{"row":1,"col":9},{"row":1,"col":10},{"row":2,"col":8},{"row":2,"col":10},{"row":3,"col":8},{"row":3,"col":10},{"row":4,"col":8},{"row":4,"col":10},{"row":5,"col":2},{"row":5,"col":3},{"row":5,"col":4},{"row":6,"col":2},{"row":6,"col":16},{"row":6,"col":17},{"row":6,"col":18},{"row":7,"col":18},{"row":9,"col":2},{"row":10,"col":2},{"row":10,"col":18},{"row":11,"col":2},{"row":11,"col":18},{"row":12,"col":8},{"row":13,"col":10},{"row":13,"col":17},{"row":14,"col":2},{"row":14,"col":3},{"row":14,"col":4},{"row":14,"col":16},{"row":14,"col":17},{"row":14,"col":18}],"goals":[{"row":5,"col":8,"dir":"RIGHT"},{"row":5,"col":10,"dir":"LEFT"}],"ice":[{"row":6,"col":6},{"row":7,"col":12},{"row":9,"col":9}],"arrows":[{"row":6,"col":8,"dir":"RIGHT"},{"row":6,"col":10,"dir":"LEFT"},{"row":7,"col":8,"dir":"RIGHT"},{"row":7,"col":10,"dir":"LEFT"},{"row":11,"col":9,"dir":"UP"}],"gblocks":[],"sand":[],"ball":{"row":13,"col":9}};
var arrowIceMachine = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":12},{"row":1,"col":19},{"row":2,"col":4},{"row":3,"col":8},{"row":4,"col":2},{"row":4,"col":11},{"row":5,"col":9},{"row":6,"col":7},{"row":6,"col":9},{"row":7,"col":6},{"row":7,"col":7},{"row":7,"col":9},{"row":9,"col":1},{"row":9,"col":8},{"row":9,"col":18},{"row":10,"col":8},{"row":12,"col":8},{"row":12,"col":20},{"row":13,"col":2},{"row":13,"col":3},{"row":13,"col":4},{"row":13,"col":5},{"row":13,"col":9},{"row":13,"col":10}],"goals":[{"row":5,"col":15,"dir":"DOWN"},{"row":11,"col":15,"dir":"UP"}],"ice":[{"row":7,"col":8},{"row":8,"col":5},{"row":9,"col":7},{"row":9,"col":9}],"arrows":[{"row":7,"col":5,"dir":"DOWN"},{"row":8,"col":11,"dir":"RIGHT"},{"row":8,"col":16,"dir":"LEFT"}],"ball":{"row":8,"col":3}};
var gblockIntro = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":9},{"row":0,"col":10},{"row":0,"col":11},{"row":6,"col":1},{"row":6,"col":20},{"row":7,"col":1},{"row":7,"col":20},{"row":8,"col":1},{"row":8,"col":20},{"row":14,"col":9},{"row":14,"col":10},{"row":14,"col":11}],"goals":[{"row":0,"col":16,"dir":"DOWN"},{"row":3,"col":0,"dir":"RIGHT"},{"row":11,"col":20,"dir":"LEFT"},{"row":14,"col":4,"dir":"UP"}],"ice":[],"arrows":[],"gblocks":[{"row":3,"col":10,"groupId":0},{"row":4,"col":9,"groupId":0},{"row":4,"col":10,"groupId":0},{"row":4,"col":11,"groupId":0},{"row":5,"col":10,"groupId":0},{"row":6,"col":7,"groupId":3},{"row":6,"col":13,"groupId":2},{"row":7,"col":6,"groupId":3},{"row":7,"col":7,"groupId":3},{"row":7,"col":8,"groupId":3},{"row":7,"col":12,"groupId":2},{"row":7,"col":13,"groupId":2},{"row":7,"col":14,"groupId":2},{"row":8,"col":7,"groupId":3},{"row":8,"col":13,"groupId":2},{"row":9,"col":10,"groupId":1},{"row":10,"col":9,"groupId":1},{"row":10,"col":10,"groupId":1},{"row":10,"col":11,"groupId":1},{"row":11,"col":10,"groupId":1}],"ball":{"row":7,"col":10}};
var gblockMachine = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":2,"col":11},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":16},{"row":5,"col":16},{"row":7,"col":6},{"row":9,"col":2},{"row":9,"col":3},{"row":9,"col":10},{"row":12,"col":19},{"row":13,"col":8},{"row":13,"col":15},{"row":14,"col":5}],"goals":[{"row":4,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[{"row":6,"col":8,"dir":"RIGHT"}],"gblocks":[{"row":3,"col":2,"groupId":0},{"row":4,"col":1,"groupId":0},{"row":4,"col":2,"groupId":0},{"row":4,"col":3,"groupId":0},{"row":5,"col":2,"groupId":0},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":10,"groupId":1},{"row":10,"col":8,"groupId":2},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":12,"col":8,"groupId":2}],"ball":{"row":3,"col":10}};
var tbars = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":16},{"row":0,"col":17},{"row":0,"col":18},{"row":0,"col":19},{"row":0,"col":20},{"row":1,"col":1},{"row":1,"col":20},{"row":2,"col":0},{"row":2,"col":20},{"row":3,"col":0},{"row":3,"col":18},{"row":3,"col":20},{"row":4,"col":0},{"row":4,"col":1},{"row":4,"col":2},{"row":4,"col":20},{"row":5,"col":20},{"row":6,"col":20},{"row":7,"col":16},{"row":7,"col":20},{"row":8,"col":20},{"row":9,"col":20},{"row":10,"col":20},{"row":11,"col":0},{"row":11,"col":20},{"row":12,"col":0},{"row":12,"col":15},{"row":12,"col":20},{"row":13,"col":0},{"row":13,"col":20},{"row":14,"col":0},{"row":14,"col":1},{"row":14,"col":2},{"row":14,"col":3},{"row":14,"col":4},{"row":14,"col":5},{"row":14,"col":6},{"row":14,"col":7},{"row":14,"col":8},{"row":14,"col":9},{"row":14,"col":10},{"row":14,"col":11},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14},{"row":14,"col":15},{"row":14,"col":16},{"row":14,"col":17},{"row":14,"col":18},{"row":14,"col":19},{"row":14,"col":20}],"goals":[{"row":10,"col":10,"dir":"DOWN"}],"ice":[{"row":2,"col":2}],"arrows":[{"row":1,"col":18,"dir":"LEFT"}],"gblocks":[{"row":11,"col":1,"groupId":0},{"row":11,"col":2,"groupId":0},{"row":11,"col":3,"groupId":0},{"row":11,"col":4,"groupId":1},{"row":11,"col":5,"groupId":1},{"row":11,"col":6,"groupId":1},{"row":11,"col":7,"groupId":2},{"row":11,"col":8,"groupId":2},{"row":11,"col":9,"groupId":2},{"row":11,"col":10,"groupId":3},{"row":11,"col":11,"groupId":3},{"row":11,"col":12,"groupId":3},{"row":12,"col":2,"groupId":0},{"row":12,"col":5,"groupId":1},{"row":12,"col":8,"groupId":2},{"row":12,"col":11,"groupId":3}],"sand":[],"portals":[],"pipes":[],"ball":{"row":13,"col":1}};
var sandIntro = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":7,"col":11,"dir":"RIGHT"}],"ice":[{"row":2,"col":12}],"arrows":[],"gblocks":[{"row":11,"col":13,"groupId":0},{"row":12,"col":11,"groupId":0},{"row":12,"col":12,"groupId":0},{"row":12,"col":13,"groupId":0},{"row":13,"col":13,"groupId":0}],"sand":[{"row":2,"col":4},{"row":2,"col":5},{"row":2,"col":6},{"row":2,"col":18},{"row":3,"col":18},{"row":4,"col":18},{"row":5,"col":9},{"row":5,"col":10},{"row":5,"col":15},{"row":6,"col":15},{"row":7,"col":15},{"row":10,"col":7},{"row":11,"col":7},{"row":12,"col":7},{"row":12,"col":18}],"ball":{"row":2,"col":2}};
var sandyGblocks = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":11},{"row":11,"col":17},{"row":12,"col":6}],"goals":[{"row":3,"col":16,"dir":"LEFT"}],"ice":[],"arrows":[{"row":9,"col":6,"dir":"DOWN"},{"row":11,"col":14,"dir":"RIGHT"}],"gblocks":[{"row":1,"col":9,"groupId":0},{"row":1,"col":10,"groupId":0},{"row":1,"col":11,"groupId":0},{"row":2,"col":9,"groupId":0},{"row":2,"col":10,"groupId":0},{"row":2,"col":11,"groupId":0},{"row":3,"col":9,"groupId":0},{"row":3,"col":10,"groupId":0},{"row":3,"col":11,"groupId":0},{"row":6,"col":1,"groupId":1},{"row":6,"col":2,"groupId":1},{"row":6,"col":3,"groupId":1},{"row":6,"col":17,"groupId":3},{"row":6,"col":18,"groupId":3},{"row":6,"col":19,"groupId":3},{"row":7,"col":1,"groupId":1},{"row":7,"col":2,"groupId":1},{"row":7,"col":3,"groupId":1},{"row":7,"col":17,"groupId":3},{"row":7,"col":18,"groupId":3},{"row":7,"col":19,"groupId":3},{"row":8,"col":1,"groupId":1},{"row":8,"col":2,"groupId":1},{"row":8,"col":3,"groupId":1},{"row":8,"col":17,"groupId":3},{"row":8,"col":18,"groupId":3},{"row":8,"col":19,"groupId":3},{"row":11,"col":9,"groupId":2},{"row":11,"col":10,"groupId":2},{"row":11,"col":11,"groupId":2},{"row":12,"col":9,"groupId":2},{"row":12,"col":10,"groupId":2},{"row":12,"col":11,"groupId":2},{"row":13,"col":9,"groupId":2},{"row":13,"col":10,"groupId":2},{"row":13,"col":11,"groupId":2}],"sand":[{"row":0,"col":0},{"row":0,"col":10},{"row":0,"col":20},{"row":7,"col":0},{"row":7,"col":10},{"row":7,"col":20},{"row":14,"col":0},{"row":14,"col":10},{"row":14,"col":20}],"portals":[],"pipes":[],"ball":{"row":0,"col":6}};
var sandyGblocksIntro = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":12,"col":12,"dir":"LEFT"}],"ice":[],"arrows":[],"gblocks":[{"row":5,"col":8,"groupId":1},{"row":5,"col":9,"groupId":1},{"row":5,"col":10,"groupId":1},{"row":7,"col":8,"groupId":2},{"row":7,"col":9,"groupId":2},{"row":7,"col":10,"groupId":2},{"row":9,"col":8,"groupId":0},{"row":9,"col":9,"groupId":0},{"row":9,"col":10,"groupId":0},{"row":11,"col":8,"groupId":3},{"row":11,"col":9,"groupId":3},{"row":11,"col":10,"groupId":3}],"sand":[{"row":0,"col":0},{"row":0,"col":9},{"row":0,"col":20},{"row":5,"col":0},{"row":5,"col":20},{"row":7,"col":0},{"row":7,"col":20},{"row":9,"col":0},{"row":9,"col":20},{"row":11,"col":0},{"row":11,"col":20},{"row":14,"col":0},{"row":14,"col":9},{"row":14,"col":20}],"ball":{"row":2,"col":9}};
var fitThePegs = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":9,"col":8,"dir":"RIGHT"},{"row":9,"col":12,"dir":"LEFT"}],"ice":[],"arrows":[],"gblocks":[{"row":3,"col":16,"groupId":2},{"row":3,"col":17,"groupId":2},{"row":3,"col":18,"groupId":2},{"row":4,"col":16,"groupId":2},{"row":4,"col":18,"groupId":2},{"row":5,"col":10,"groupId":1},{"row":6,"col":9,"groupId":1},{"row":6,"col":10,"groupId":1},{"row":6,"col":11,"groupId":1},{"row":7,"col":3,"groupId":0},{"row":7,"col":5,"groupId":0},{"row":7,"col":10,"groupId":1},{"row":8,"col":3,"groupId":0},{"row":8,"col":4,"groupId":0},{"row":8,"col":5,"groupId":0}],"sand":[{"row":2,"col":10},{"row":2,"col":17},{"row":2,"col":19},{"row":3,"col":6},{"row":3,"col":7},{"row":3,"col":8},{"row":3,"col":9},{"row":3,"col":10},{"row":3,"col":11},{"row":3,"col":12},{"row":3,"col":13},{"row":3,"col":14},{"row":3,"col":19},{"row":4,"col":6},{"row":4,"col":7},{"row":4,"col":8},{"row":4,"col":9},{"row":4,"col":10},{"row":4,"col":11},{"row":4,"col":12},{"row":4,"col":13},{"row":4,"col":14},{"row":5,"col":6},{"row":5,"col":7},{"row":5,"col":8},{"row":5,"col":9},{"row":5,"col":10},{"row":5,"col":11},{"row":5,"col":12},{"row":5,"col":13},{"row":5,"col":14},{"row":6,"col":6},{"row":6,"col":7},{"row":6,"col":8},{"row":6,"col":9},{"row":6,"col":10},{"row":6,"col":11},{"row":6,"col":12},{"row":6,"col":13},{"row":6,"col":14},{"row":7,"col":6},{"row":7,"col":7},{"row":7,"col":8},{"row":7,"col":9},{"row":7,"col":10},{"row":7,"col":11},{"row":7,"col":12},{"row":7,"col":13},{"row":7,"col":14},{"row":7,"col":19},{"row":8,"col":6},{"row":8,"col":7},{"row":8,"col":8},{"row":8,"col":9},{"row":8,"col":10},{"row":8,"col":11},{"row":8,"col":12},{"row":8,"col":13},{"row":8,"col":14},{"row":13,"col":19}],"ball":{"row":7,"col":1}};
var untie = {"numRows":15,"numCols":21,"blocks":[{"row":10,"col":8},{"row":10,"col":9},{"row":10,"col":11},{"row":10,"col":12},{"row":11,"col":8},{"row":11,"col":12},{"row":12,"col":8},{"row":12,"col":12},{"row":13,"col":8},{"row":13,"col":12},{"row":14,"col":8},{"row":14,"col":12}],"goals":[{"row":11,"col":9,"dir":"RIGHT"},{"row":11,"col":11,"dir":"LEFT"}],"ice":[],"arrows":[],"gblocks":[{"row":4,"col":9,"groupId":2},{"row":4,"col":10,"groupId":2},{"row":4,"col":11,"groupId":2},{"row":5,"col":9,"groupId":2},{"row":5,"col":10,"groupId":1},{"row":5,"col":11,"groupId":2},{"row":6,"col":10,"groupId":1},{"row":7,"col":9,"groupId":0},{"row":7,"col":10,"groupId":1},{"row":7,"col":11,"groupId":0},{"row":8,"col":9,"groupId":0},{"row":8,"col":10,"groupId":0},{"row":8,"col":11,"groupId":0}],"sand":[{"row":3,"col":9},{"row":3,"col":10},{"row":3,"col":17},{"row":6,"col":10},{"row":7,"col":3},{"row":7,"col":8},{"row":8,"col":17}],"ball":{"row":6,"col":9}};
var introPortals = {"numRows":15,"numCols":21,"blocks":[],"goals":[{"row":4,"col":13,"dir":"LEFT"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":4,"col":6,"groupId":0},{"row":8,"col":13,"groupId":0}],"ball":{"row":8,"col":6}};
var threePortals = {"numRows":15,"numCols":21,"blocks":[{"row":2,"col":14},{"row":2,"col":15},{"row":2,"col":16},{"row":2,"col":17},{"row":8,"col":0},{"row":8,"col":1},{"row":8,"col":2},{"row":9,"col":2},{"row":10,"col":13},{"row":10,"col":14},{"row":10,"col":15}],"goals":[{"row":10,"col":2,"dir":"LEFT"}],"ice":[{"row":6,"col":14}],"arrows":[{"row":3,"col":15,"dir":"LEFT"},{"row":6,"col":15,"dir":"RIGHT"}],"gblocks":[],"sand":[{"row":3,"col":20},{"row":6,"col":19},{"row":6,"col":20},{"row":9,"col":20},{"row":11,"col":0},{"row":12,"col":0},{"row":13,"col":0},{"row":14,"col":0},{"row":14,"col":20}],"portals":[{"row":3,"col":10,"groupId":2},{"row":6,"col":10,"groupId":0},{"row":9,"col":10,"groupId":1},{"row":11,"col":2,"groupId":2},{"row":12,"col":2,"groupId":0},{"row":13,"col":2,"groupId":1}],"ball":{"row":14,"col":10}};
var portalMess = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":7},{"row":1,"col":3},{"row":1,"col":18},{"row":3,"col":10},{"row":3,"col":17},{"row":4,"col":2},{"row":7,"col":6},{"row":7,"col":14},{"row":9,"col":0},{"row":10,"col":18},{"row":11,"col":3},{"row":11,"col":10},{"row":12,"col":13},{"row":13,"col":17},{"row":14,"col":2}],"goals":[{"row":2,"col":0,"dir":"RIGHT"}],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":4,"col":3,"groupId":2},{"row":4,"col":7,"groupId":1},{"row":4,"col":13,"groupId":3},{"row":4,"col":18,"groupId":0},{"row":10,"col":2,"groupId":3},{"row":10,"col":7,"groupId":0},{"row":10,"col":13,"groupId":2},{"row":10,"col":17,"groupId":1}],"pipes":[{"row":10,"col":0,"up":false,"down":true,"left":false,"right":true},{"row":11,"col":0,"up":true,"down":false,"left":false,"right":true}],"ball":{"row":7,"col":10}};
var pipeIntro = {"numRows":15,"numCols":21,"blocks":[{"row":6,"col":2},{"row":6,"col":3},{"row":7,"col":2},{"row":8,"col":2},{"row":12,"col":18},{"row":13,"col":18},{"row":14,"col":18}],"goals":[{"row":8,"col":10,"dir":"RIGHT"}],"ice":[{"row":9,"col":3},{"row":10,"col":3}],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pipes":[{"row":3,"col":9,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":10,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":11,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":12,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":13,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":14,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":15,"up":false,"down":true,"left":true,"right":false},{"row":4,"col":15,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":15,"up":true,"down":true,"left":false,"right":false},{"row":6,"col":15,"up":true,"down":true,"left":false,"right":false},{"row":7,"col":9,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":10,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":11,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":12,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":13,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":14,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":15,"up":true,"down":false,"left":true,"right":false},{"row":12,"col":3,"up":true,"down":true,"left":false,"right":false},{"row":13,"col":3,"up":true,"down":false,"left":false,"right":true},{"row":13,"col":4,"up":false,"down":false,"left":true,"right":true},{"row":13,"col":5,"up":false,"down":false,"left":true,"right":true}],"ball":{"row":3,"col":3}};
var spaceShips = {"numRows":15,"numCols":21,"blocks":[{"row":2,"col":1},{"row":2,"col":2},{"row":2,"col":3},{"row":3,"col":16},{"row":3,"col":17},{"row":3,"col":18}],"goals":[{"row":9,"col":0,"dir":"RIGHT"}],"ice":[],"arrows":[],"gblocks":[{"row":11,"col":2,"groupId":0},{"row":11,"col":7,"groupId":3},{"row":11,"col":12,"groupId":1},{"row":11,"col":17,"groupId":2},{"row":12,"col":1,"groupId":0},{"row":12,"col":2,"groupId":0},{"row":12,"col":3,"groupId":0},{"row":12,"col":6,"groupId":3},{"row":12,"col":7,"groupId":3},{"row":12,"col":8,"groupId":3},{"row":12,"col":11,"groupId":1},{"row":12,"col":12,"groupId":1},{"row":12,"col":13,"groupId":1},{"row":12,"col":16,"groupId":2},{"row":12,"col":17,"groupId":2},{"row":12,"col":18,"groupId":2},{"row":13,"col":1,"groupId":0},{"row":13,"col":3,"groupId":0},{"row":13,"col":6,"groupId":3},{"row":13,"col":8,"groupId":3},{"row":13,"col":11,"groupId":1},{"row":13,"col":13,"groupId":1},{"row":13,"col":16,"groupId":2},{"row":13,"col":18,"groupId":2}],"sand":[{"row":4,"col":20},{"row":5,"col":12},{"row":13,"col":0},{"row":13,"col":4},{"row":13,"col":9},{"row":13,"col":14},{"row":14,"col":0},{"row":14,"col":1},{"row":14,"col":2},{"row":14,"col":3},{"row":14,"col":4},{"row":14,"col":5},{"row":14,"col":6},{"row":14,"col":7},{"row":14,"col":8},{"row":14,"col":9},{"row":14,"col":10},{"row":14,"col":11},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14},{"row":14,"col":15},{"row":14,"col":16},{"row":14,"col":17},{"row":14,"col":18},{"row":14,"col":19},{"row":14,"col":20}],"portals":[],"pipes":[],"ball":{"row":14,"col":17}};
var iceAndPipes = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":2},{"row":4,"col":12},{"row":5,"col":20},{"row":7,"col":8},{"row":7,"col":17}],"goals":[{"row":0,"col":1,"dir":"DOWN"}],"ice":[{"row":13,"col":0},{"row":13,"col":1},{"row":13,"col":2},{"row":13,"col":3},{"row":13,"col":4},{"row":13,"col":5},{"row":13,"col":6},{"row":13,"col":7},{"row":13,"col":8},{"row":13,"col":9},{"row":13,"col":10},{"row":13,"col":11},{"row":13,"col":12},{"row":13,"col":13},{"row":13,"col":14},{"row":13,"col":15},{"row":13,"col":16},{"row":13,"col":17},{"row":13,"col":18},{"row":13,"col":19},{"row":13,"col":20}],"arrows":[],"gblocks":[],"sand":[{"row":3,"col":14},{"row":8,"col":0},{"row":14,"col":0},{"row":14,"col":1},{"row":14,"col":2},{"row":14,"col":3},{"row":14,"col":4},{"row":14,"col":5},{"row":14,"col":6},{"row":14,"col":7},{"row":14,"col":8},{"row":14,"col":9},{"row":14,"col":10},{"row":14,"col":11},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14},{"row":14,"col":15},{"row":14,"col":16},{"row":14,"col":17},{"row":14,"col":18},{"row":14,"col":19},{"row":14,"col":20}],"portals":[],"pipes":[{"row":2,"col":14,"up":false,"down":true,"left":false,"right":true},{"row":2,"col":15,"up":false,"down":true,"left":true,"right":false},{"row":4,"col":7,"up":false,"down":true,"left":false,"right":true},{"row":4,"col":8,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":2,"up":true,"down":true,"left":false,"right":true},{"row":6,"col":3,"up":false,"down":true,"left":true,"right":true},{"row":6,"col":4,"up":false,"down":true,"left":true,"right":false},{"row":6,"col":16,"up":false,"down":true,"left":false,"right":true},{"row":6,"col":17,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":18,"up":true,"down":true,"left":true,"right":false},{"row":7,"col":18,"up":true,"down":true,"left":false,"right":false},{"row":8,"col":18,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":14,"col":4}};
var cloggedIntro = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":12},{"row":1,"col":13},{"row":1,"col":14},{"row":13,"col":2},{"row":13,"col":3},{"row":13,"col":4}],"goals":[{"row":9,"col":11,"dir":"DOWN"}],"ice":[{"row":3,"col":8},{"row":3,"col":9},{"row":6,"col":11},{"row":10,"col":4},{"row":10,"col":5},{"row":10,"col":6},{"row":13,"col":11},{"row":13,"col":12},{"row":13,"col":13},{"row":13,"col":14}],"arrows":[{"row":13,"col":10,"dir":"RIGHT"}],"gblocks":[],"sand":[],"portals":[],"pipes":[{"row":2,"col":2,"up":false,"down":true,"left":false,"right":true},{"row":2,"col":3,"up":false,"down":true,"left":true,"right":false},{"row":3,"col":2,"up":true,"down":false,"left":false,"right":true},{"row":3,"col":3,"up":true,"down":true,"left":true,"right":true},{"row":3,"col":4,"up":false,"down":false,"left":true,"right":true},{"row":4,"col":3,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":13,"up":true,"down":true,"left":false,"right":false},{"row":6,"col":12,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":13,"up":true,"down":true,"left":true,"right":true},{"row":6,"col":14,"up":false,"down":true,"left":true,"right":false},{"row":7,"col":13,"up":true,"down":false,"left":false,"right":true},{"row":7,"col":14,"up":true,"down":false,"left":true,"right":false},{"row":9,"col":8,"up":false,"down":true,"left":false,"right":true},{"row":9,"col":9,"up":false,"down":true,"left":true,"right":false},{"row":10,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":10,"col":8,"up":true,"down":true,"left":true,"right":true},{"row":10,"col":9,"up":true,"down":false,"left":true,"right":false},{"row":11,"col":8,"up":true,"down":true,"left":false,"right":false},{"row":12,"col":17,"up":true,"down":true,"left":false,"right":false},{"row":13,"col":8,"up":true,"down":false,"left":false,"right":true},{"row":13,"col":9,"up":false,"down":false,"left":true,"right":true},{"row":13,"col":16,"up":false,"down":false,"left":true,"right":true},{"row":13,"col":17,"up":true,"down":true,"left":true,"right":true},{"row":13,"col":18,"up":false,"down":true,"left":true,"right":false},{"row":14,"col":17,"up":true,"down":false,"left":false,"right":true},{"row":14,"col":18,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":6,"col":9}};
var clogThePipe = {"numRows":15,"numCols":21,"blocks":[{"row":4,"col":16}],"goals":[{"row":5,"col":20,"dir":"LEFT"}],"ice":[{"row":6,"col":5},{"row":6,"col":6},{"row":6,"col":7},{"row":6,"col":8},{"row":6,"col":9},{"row":6,"col":10},{"row":6,"col":11},{"row":6,"col":12},{"row":6,"col":13},{"row":6,"col":14},{"row":6,"col":15},{"row":8,"col":5},{"row":8,"col":6},{"row":8,"col":7},{"row":8,"col":8},{"row":8,"col":9},{"row":8,"col":10},{"row":8,"col":11},{"row":8,"col":12},{"row":8,"col":13},{"row":8,"col":14},{"row":8,"col":15}],"arrows":[],"gblocks":[],"sand":[{"row":7,"col":5},{"row":7,"col":6},{"row":7,"col":7},{"row":7,"col":8},{"row":7,"col":9},{"row":7,"col":10},{"row":7,"col":11},{"row":7,"col":12},{"row":7,"col":13},{"row":7,"col":14},{"row":7,"col":15}],"portals":[],"pipes":[{"row":0,"col":5,"up":false,"down":true,"left":false,"right":true},{"row":0,"col":6,"up":false,"down":true,"left":true,"right":false},{"row":1,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":1,"col":6,"up":true,"down":true,"left":false,"right":false},{"row":2,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":2,"col":6,"up":true,"down":true,"left":false,"right":false},{"row":3,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":3,"col":6,"up":true,"down":true,"left":false,"right":false},{"row":3,"col":9,"up":false,"down":true,"left":false,"right":true},{"row":3,"col":10,"up":false,"down":true,"left":true,"right":false},{"row":4,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":4,"col":6,"up":true,"down":true,"left":false,"right":false},{"row":4,"col":9,"up":true,"down":false,"left":false,"right":true},{"row":4,"col":10,"up":true,"down":true,"left":true,"right":true},{"row":5,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":6,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":10,"up":true,"down":true,"left":false,"right":true},{"row":7,"col":4,"up":false,"down":true,"left":false,"right":true},{"row":7,"col":16,"up":false,"down":false,"left":true,"right":true},{"row":7,"col":17,"up":false,"down":true,"left":true,"right":false},{"row":8,"col":4,"up":true,"down":true,"left":false,"right":false},{"row":8,"col":17,"up":true,"down":true,"left":false,"right":false},{"row":9,"col":4,"up":true,"down":true,"left":false,"right":false},{"row":9,"col":10,"up":true,"down":true,"left":false,"right":false},{"row":9,"col":17,"up":true,"down":true,"left":false,"right":false},{"row":10,"col":4,"up":true,"down":true,"left":false,"right":false},{"row":10,"col":10,"up":true,"down":true,"left":false,"right":false},{"row":10,"col":14,"up":true,"down":false,"left":false,"right":true},{"row":10,"col":15,"up":false,"down":false,"left":true,"right":true},{"row":10,"col":16,"up":false,"down":false,"left":true,"right":true},{"row":10,"col":17,"up":true,"down":false,"left":true,"right":false},{"row":11,"col":4,"up":true,"down":true,"left":false,"right":false},{"row":11,"col":10,"up":true,"down":true,"left":false,"right":false},{"row":12,"col":4,"up":true,"down":false,"left":false,"right":true},{"row":12,"col":5,"up":false,"down":false,"left":true,"right":true},{"row":12,"col":6,"up":false,"down":false,"left":true,"right":true},{"row":12,"col":7,"up":false,"down":false,"left":true,"right":true},{"row":12,"col":8,"up":false,"down":false,"left":true,"right":true},{"row":12,"col":9,"up":false,"down":false,"left":true,"right":true},{"row":12,"col":10,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":7,"col":10}}; 
var cloggedPortalIntro = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":13},{"row":1,"col":14},{"row":1,"col":15},{"row":2,"col":13},{"row":2,"col":15},{"row":9,"col":13},{"row":10,"col":13},{"row":11,"col":13}],"goals":[{"row":3,"col":13,"dir":"RIGHT"},{"row":3,"col":15,"dir":"LEFT"}],"ice":[{"row":7,"col":7}],"arrows":[],"gblocks":[],"sand":[],"portals":[{"row":7,"col":4,"groupId":0},{"row":10,"col":14,"groupId":0}],"pipes":[{"row":3,"col":2,"up":false,"down":true,"left":false,"right":true},{"row":3,"col":3,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":4,"up":false,"down":false,"left":true,"right":true},{"row":3,"col":5,"up":false,"down":true,"left":true,"right":false},{"row":4,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":4,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":5,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":6,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":6,"col":5,"up":true,"down":true,"left":false,"right":false},{"row":7,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":8,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":9,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":10,"col":2,"up":true,"down":true,"left":false,"right":false},{"row":10,"col":4,"up":true,"down":true,"left":false,"right":false},{"row":11,"col":2,"up":true,"down":false,"left":false,"right":true},{"row":11,"col":3,"up":false,"down":false,"left":true,"right":true},{"row":11,"col":4,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":7,"col":9}};
var clogThePortal = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":7},{"row":1,"col":13},{"row":1,"col":19},{"row":2,"col":3},{"row":5,"col":9},{"row":6,"col":0},{"row":6,"col":1},{"row":7,"col":0},{"row":8,"col":0},{"row":8,"col":1},{"row":8,"col":5},{"row":8,"col":17},{"row":9,"col":20},{"row":10,"col":18},{"row":10,"col":19}],"goals":[{"row":6,"col":2,"dir":"DOWN"},{"row":8,"col":2,"dir":"UP"}],"ice":[{"row":11,"col":9}],"arrows":[{"row":7,"col":19,"dir":"UP"}],"gblocks":[{"row":5,"col":5,"groupId":0},{"row":6,"col":4,"groupId":0},{"row":6,"col":5,"groupId":0},{"row":6,"col":6,"groupId":0},{"row":7,"col":4,"groupId":0},{"row":7,"col":5,"groupId":0}],"sand":[{"row":11,"col":5},{"row":11,"col":13},{"row":14,"col":0},{"row":14,"col":1},{"row":14,"col":2},{"row":14,"col":3},{"row":14,"col":4},{"row":14,"col":5},{"row":14,"col":6},{"row":14,"col":7},{"row":14,"col":8},{"row":14,"col":9},{"row":14,"col":10},{"row":14,"col":11},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14},{"row":14,"col":15},{"row":14,"col":16},{"row":14,"col":17},{"row":14,"col":18},{"row":14,"col":19},{"row":14,"col":20}],"portals":[{"row":7,"col":9,"groupId":0},{"row":9,"col":13,"groupId":0}],"pipes":[{"row":2,"col":20,"up":false,"down":true,"left":true,"right":false},{"row":3,"col":20,"up":true,"down":false,"left":true,"right":false}],"ball":{"row":14,"col":9}};

levels = [starter, diagonal, iceIntro, pairTheIce, arrowIntro, arrowIceIntro, gblockIntro, tbars, sandIntro, sandyGblocksIntro, sandyGblocks, arrowIceMachine, fitThePegs, introPortals, threePortals, portalMess, untie, spaceShips, pipeIntro, iceAndPipes, cloggedPortalIntro, clogThePortal, cloggedIntro, clogThePipe, gblockMachine];

new Hundo({
    levels: levels,
    id: 1,
    viz: {
        playButton: false,
        levelSelect: true,
    },
    maker: false
});