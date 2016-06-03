/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

TEST = "to/from Base64Digit"

function testBase64Digit(number) {
    var newNumber = hundo.Compress.fromBase64Digit(
        hundo.Compress.toBase64Digit(number));
    return number == newNumber
}

_.range(0, 62)
    .map(function(i){
        assert(testBase64Digit(i));
    })

TEST = "compress/decompress levels"

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
    ice: [],
    arrows: [],
    gblocks: [],
    sand: [],
    portals: [],
    pips: []
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
    ice: [],
    arrows: [],
    gblocks: [],
    sand: [],
    portals: [],
    pips: []
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
    },
    ice: [],
    arrows: [
        {
            row: 5,
            col: 5,
            dir: hundo.DirectionEnum.RIGHT
        }
    ],
    gblocks: [],
    sand: [],
    portals: [],
    pips: []
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
    },
    ice: [
        {
            row: 5,
            col: 7
        },
        {
            row: 5,
            col: 7
        }
    ],
    arrows: [
        {
            row: 5,
            col: 5,
            dir: hundo.DirectionEnum.RIGHT
        }
    ],
    gblocks: [
        {
            row: 6,
            col: 6,
            groupId: 0
        }
    ],
    sand: [
        {
            row: 0,
            col: 0
        },
        {
            row: 1,
            col: 0
        },
    ],
    portals: [
        {
            row: 9,
            col: 10,
            groupId: 0
        }

    ],
    pips: []

}



var foo = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":1},{"row":1,"col":2},{"row":1,"col":3},{"row":1,"col":14},{"row":2,"col":18},{"row":3,"col":1},{"row":3,"col":10},{"row":3,"col":11},{"row":3,"col":12},{"row":3,"col":13},{"row":3,"col":14},{"row":3,"col":18},{"row":4,"col":1},{"row":4,"col":18},{"row":5,"col":1},{"row":5,"col":18},{"row":6,"col":1},{"row":6,"col":18},{"row":7,"col":1},{"row":7,"col":18},{"row":8,"col":1},{"row":8,"col":12},{"row":9,"col":1},{"row":9,"col":12},{"row":10,"col":1},{"row":10,"col":12},{"row":10,"col":16},{"row":10,"col":17},{"row":10,"col":18},{"row":11,"col":12},{"row":12,"col":1},{"row":12,"col":2},{"row":12,"col":3},{"row":12,"col":12},{"row":14,"col":12},{"row":14,"col":13},{"row":14,"col":14}],"goals":[{"row":13,"col":6,"dir":"RIGHT"}],"ball":{"row":6,"col":9},ice:[],arrows:[],gblocks:[],sand:[],portals:[],pips:[]}
var diagonal = {"numRows":15,"numCols":21,"blocks":[{"row":2,"col":5},{"row":2,"col":6},{"row":2,"col":7},{"row":4,"col":3},{"row":4,"col":7},{"row":4,"col":8},{"row":4,"col":9},{"row":4,"col":10},{"row":4,"col":11},{"row":5,"col":3},{"row":6,"col":3},{"row":6,"col":5},{"row":6,"col":13},{"row":7,"col":5},{"row":7,"col":13},{"row":8,"col":5},{"row":8,"col":13},{"row":9,"col":5},{"row":9,"col":13},{"row":9,"col":15},{"row":10,"col":15},{"row":11,"col":7},{"row":11,"col":8},{"row":11,"col":9},{"row":11,"col":10},{"row":11,"col":11},{"row":11,"col":15},{"row":13,"col":11},{"row":13,"col":12},{"row":13,"col":13}],"goals":[{"row":3,"col":1,"dir":"RIGHT"},{"row":12,"col":17,"dir":"LEFT"}],"ball":{"row":7,"col":9},ice:[],arrows:[],gblocks: [],sand:[],portals:[],pips:[]}
var testLevels = [starter, diagonal, foo, boardConfig1, boardConfig2, boardConfig3];

function testCompress(level) {
    var newLevel = hundo.Compress.decompressLevel(
        hundo.Compress.compressLevel(level))

    result = Object.compare(level, newLevel);

    if (!result) {
        console.log(level)
        console.log(hundo.Compress.compressLevel(level));
        console.log(newLevel)
    }

    return result;
}

_.each(testLevels, function(level){
    assert(testCompress(level));
});

/**
 * Version 0 compression
 ******************************************************************************/

function testCompressJson(url, json, version) {
    assertEquals(_.trimEnd(url, "-"),
        _.trimEnd(hundo.Compress.compressLevel(json, version), "-"));
}

function testDecompressUrl(url, json, version) {
    assert(Object.compare(json, hundo.Compress.decompressLevel(url)));
}

function testCompressDecompress(url, json, version) {
    testDecompressUrl(url, json, version);
    testCompressJson(url, json, version);
}

var levelUrl = "fl33-03303663-----"
var levelJson = {"numRows":15,"numCols":21,"blocks":[{"row":0,"col":3},{"row":3,"col":0},{"row":3,"col":6},{"row":6,"col":3}],"goals":[],"ice":[],"arrows":[],"gblocks":[],"sand":[],"portals":[],"pips":[],"ball":{"row":3,"col":3}};
testCompressDecompress(levelUrl, levelJson, 0);

var levelUrl = "fl12-1415-1701911a21b32912a22b3370391-1c3c587a-1d01f21g32d02e12g33e13f2-1h01i11j12h02i12j13123223h03i03j1412422443533543553563643-565758-5a05c15e35g36c17a07e27g2-5i00115j11006i00116j11007j11008110018210018301018401108510108611018701119110019210019301019401109611019701119811109910119a10119b11119c11119d1111a51010a81110a91011ab1111"
var levelJson = {"numRows":15,"numCols":21,"blocks":[{"row":1,"col":4},{"row":1,"col":5}],"goals":[{"row":1,"col":7,"dir":"UP"},{"row":1,"col":9,"dir":"DOWN"},{"row":1,"col":10,"dir":"LEFT"},{"row":1,"col":11,"dir":"RIGHT"},{"row":2,"col":9,"dir":"DOWN"},{"row":2,"col":10,"dir":"LEFT"},{"row":2,"col":11,"dir":"RIGHT"},{"row":3,"col":7,"dir":"UP"},{"row":3,"col":9,"dir":"DOWN"}],"ice":[{"row":1,"col":12},{"row":3,"col":12},{"row":5,"col":8},{"row":7,"col":10}],"arrows":[{"row":1,"col":13,"dir":"UP"},{"row":1,"col":15,"dir":"LEFT"},{"row":1,"col":16,"dir":"RIGHT"},{"row":2,"col":13,"dir":"UP"},{"row":2,"col":14,"dir":"DOWN"},{"row":2,"col":16,"dir":"RIGHT"},{"row":3,"col":14,"dir":"DOWN"},{"row":3,"col":15,"dir":"LEFT"}],"gblocks":[{"row":1,"col":17,"groupId":0},{"row":1,"col":18,"groupId":1},{"row":1,"col":19,"groupId":1},{"row":2,"col":17,"groupId":0},{"row":2,"col":18,"groupId":1},{"row":2,"col":19,"groupId":1},{"row":3,"col":1,"groupId":2},{"row":3,"col":2,"groupId":2},{"row":3,"col":17,"groupId":0},{"row":3,"col":18,"groupId":0},{"row":3,"col":19,"groupId":1},{"row":4,"col":1,"groupId":2},{"row":4,"col":2,"groupId":2},{"row":4,"col":4,"groupId":3},{"row":5,"col":3,"groupId":3},{"row":5,"col":4,"groupId":3},{"row":5,"col":5,"groupId":3},{"row":5,"col":6,"groupId":3},{"row":6,"col":4,"groupId":3}],"sand":[{"row":5,"col":6},{"row":5,"col":7},{"row":5,"col":8}],"portals":[{"row":5,"col":10,"groupId":0},{"row":5,"col":12,"groupId":1},{"row":5,"col":14,"groupId":3},{"row":5,"col":16,"groupId":3},{"row":6,"col":12,"groupId":1},{"row":7,"col":10,"groupId":0},{"row":7,"col":14,"groupId":2},{"row":7,"col":16,"groupId":2}],"pips":[{"row":5,"col":18,"up":false,"down":false,"left":true,"right":true},{"row":5,"col":19,"up":true,"down":true,"left":false,"right":false},{"row":6,"col":18,"up":false,"down":false,"left":true,"right":true},{"row":6,"col":19,"up":true,"down":true,"left":false,"right":false},{"row":7,"col":19,"up":true,"down":true,"left":false,"right":false},{"row":8,"col":1,"up":true,"down":false,"left":false,"right":true},{"row":8,"col":2,"up":true,"down":false,"left":false,"right":true},{"row":8,"col":3,"up":false,"down":true,"left":false,"right":true},{"row":8,"col":4,"up":false,"down":true,"left":true,"right":false},{"row":8,"col":5,"up":true,"down":false,"left":true,"right":false},{"row":8,"col":6,"up":true,"down":true,"left":false,"right":true},{"row":8,"col":7,"up":false,"down":true,"left":true,"right":true},{"row":9,"col":1,"up":true,"down":false,"left":false,"right":true},{"row":9,"col":2,"up":true,"down":false,"left":false,"right":true},{"row":9,"col":3,"up":false,"down":true,"left":false,"right":true},{"row":9,"col":4,"up":false,"down":true,"left":true,"right":false},{"row":9,"col":6,"up":true,"down":true,"left":false,"right":true},{"row":9,"col":7,"up":false,"down":true,"left":true,"right":true},{"row":9,"col":8,"up":true,"down":true,"left":true,"right":false},{"row":9,"col":9,"up":true,"down":false,"left":true,"right":true},{"row":9,"col":10,"up":true,"down":false,"left":true,"right":true},{"row":9,"col":11,"up":true,"down":true,"left":true,"right":true},{"row":9,"col":12,"up":true,"down":true,"left":true,"right":true},{"row":9,"col":13,"up":true,"down":true,"left":true,"right":true},{"row":10,"col":5,"up":true,"down":false,"left":true,"right":false},{"row":10,"col":8,"up":true,"down":true,"left":true,"right":false},{"row":10,"col":9,"up":true,"down":false,"left":true,"right":true},{"row":10,"col":11,"up":true,"down":true,"left":true,"right":true}],"ball":{"row":1,"col":2}};
testCompressDecompress(levelUrl, levelJson, 0);

