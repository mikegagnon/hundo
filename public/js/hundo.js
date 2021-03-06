"use strict";

/**
 * Unless otherwise noted, the contents of this file are free and unencumbered
 * software released into the public domain.
 * See UNLICENSE.txt
 */


/**
 * Overview of code
 * =================
 *
 * - The Board class, in conjunction with the various "piece" classes,
 *   encapsulates all game logic.
 * - The Solver class attempts to solve puzzles using the standard graph-
 *   traversal algorithm
 * - The Viz class encapsulates all visualiztion logic, as well as receiving
 *   input from the user.
 ******************************************************************************/

/**
 * Overview of Board
 * =================
 *
 * The board is comprised of a matrix of cells. Each cell has two layers, a top
 * and a bottom. The top layer can only hold a top piece, and the bottom layer
 * can only hold a bottom piece.
 *
 * The top pieces are: Ball, Block, Ice, and Gblock
 * The bottom pieces are: Goal, Arrow, Sand, Portal, and Pipe
 *
 * Let's look at one hypthetical row:
 *          ____     ____    ____    __________    ____    ____
 * top     |____|   |____|  |ice |  |   ball   |  |____|  |____|
 *
 *          ____     ____    ____    __________    ____    ____
 * bottom  |____|   |____|  |sand|  |arrow-left|  |____|  |____|
 *      
 *          col0     col1    col2    col3    col4    col5
 *
 * A piece can only leave its cell if it has permission from:
 *   (A) the bottom piece of its current cell,
 *   (B) the bottom piece of its destination cell, and
 *   (C) the top piece of it's destination cell.
 *
 * The way we implement the permission system is with messages.
 * 
 * Example
 * -------
 *
 * In this case, the ball creates a message indicating it wants to move left
 * one cell, and hands the message down to the arrow-left piece.
 *
 * Because the arrow is pointing left, it forwards the message to the left cell.
 * (If the arrow had been pointing up or down, the arrow would have vetoed the
 * message, causing the ball to not move).
 *
 * The sand piece receives the ball's message, and forwards the message up
 * to the ice piece. (The sand piece happens to never veto messages). The sand
 * piece also adds a directive to stop the ball's momentum.
 *
 * The ice piece receives the message, so it creates a new message, hands it
 * down to the sand piece, which hands it to the empty cell in col1. Empty cells
 * never veto movement messages, so the ice moves into col1, and returns
 * "success," causes the sand to return "success," which causes arrow-left to
 * return "success," and so the ball then moves left into col2.
 *
 *          ____     ____    ____    __________    ____    ____
 * top     |____|   |____|  |ice |  |   ball   |  |____|  |____|
 *                    /\     \/ /\       \/
 *          ____     ____    ____    __________    ____    ____
 * bottom  |____|   |____|  |sand|  |arrow-left|  |____|  |____|
 *                    /\     \/ /\       \/
 *          col0     col1    col2    col3    col4    col5
 *
 * Mutations
 * ---------
 *
 * Oh yeah, bottom pieces can mutate messages. For example:
 *      - Elbow-pipe pieces mutate the direction of the message
 *      - Portal pieces change the row, col of the incoming piece, in order
 *        to transport the piece to the cell of its partner piece.
 * 
 * Review
 * ------
 *      - Top pieces sends message down to bottom pieces
 *      - Bottom pieces either veto messages or forward messages
 ******************************************************************************/

var hundo = {}

/**
 * Enums
 ******************************************************************************/

hundo.PieceTypeEnum = {
    BALL: "BALL",
    BLOCK: "BLOCK",
    GOAL: "GOAL",
    ICE: "ICE",
    ARROW: "ARROW",
    GBLOCK: "GBLOCK",
    SAND: "SAND",
    PORTAL: "PORTAL",
    PIP: "PIP"
}

hundo.DirectionEnum = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    NODIR: "NODIR"
}

hundo.FourDirections = [
    hundo.DirectionEnum.UP,
    hundo.DirectionEnum.DOWN,
    hundo.DirectionEnum.LEFT,
    hundo.DirectionEnum.RIGHT];


hundo.oppositeDir = {}
hundo.oppositeDir[hundo.DirectionEnum.UP] = hundo.DirectionEnum.DOWN;
hundo.oppositeDir[hundo.DirectionEnum.DOWN] = hundo.DirectionEnum.UP;
hundo.oppositeDir[hundo.DirectionEnum.LEFT] = hundo.DirectionEnum.RIGHT;
hundo.oppositeDir[hundo.DirectionEnum.RIGHT] = hundo.DirectionEnum.LEFT;

hundo.LayerEnum = {
    TOP: "TOP",
    BOTTOM: "BOTTOM"
}


// Two pieces are compatible iff they may occupy the same cell at the same time
// hundo.compatible[pieceType] == a list containing all the pieces
// that are compatible with pieceType
hundo.compatible = {};

hundo.compatible[hundo.PieceTypeEnum.BALL] = [
    hundo.PieceTypeEnum.ARROW,
    hundo.PieceTypeEnum.SAND,
    hundo.PieceTypeEnum.GOAL,
    hundo.PieceTypeEnum.PORTAL,
    hundo.PieceTypeEnum.PIP
];

hundo.compatible[hundo.PieceTypeEnum.BLOCK] = [];

hundo.compatible[hundo.PieceTypeEnum.ICE] = [
    hundo.PieceTypeEnum.ARROW,
    hundo.PieceTypeEnum.SAND,
    hundo.PieceTypeEnum.GOAL,
    hundo.PieceTypeEnum.PORTAL,
    hundo.PieceTypeEnum.PIP
];

hundo.compatible[hundo.PieceTypeEnum.GOAL] = [
    hundo.PieceTypeEnum.BALL,
    hundo.PieceTypeEnum.ICE
];

hundo.compatible[hundo.PieceTypeEnum.ARROW] = [
    hundo.PieceTypeEnum.BALL,
    hundo.PieceTypeEnum.ICE
];

hundo.compatible[hundo.PieceTypeEnum.GBLOCK] = [
    hundo.PieceTypeEnum.SAND
];

hundo.compatible[hundo.PieceTypeEnum.SAND] = [
    hundo.PieceTypeEnum.BALL,
    hundo.PieceTypeEnum.ICE,
    hundo.PieceTypeEnum.GBLOCK
];

hundo.compatible[hundo.PieceTypeEnum.PORTAL] = [
    hundo.PieceTypeEnum.BALL,
    hundo.PieceTypeEnum.ICE,
];

hundo.compatible[hundo.PieceTypeEnum.PIP] = [
    hundo.PieceTypeEnum.BALL,
    hundo.PieceTypeEnum.ICE,
];

/**
 * Functionality common to all pieces
 ******************************************************************************/

// Generates uuids for board pieces
hundo.IdGenerator = function() {
    this.nextId = 0;
}

// I'll be impressed if this ever overflows
hundo.IdGenerator.prototype.next = function() {
    return this.nextId++;
}

hundo.idGenerator = new hundo.IdGenerator();

hundo.equalsTypeRowCol = function(a, b) {
    return a.type == b.type &&
        a.row == b.row &&
        a.col == b.col;
}

/**
 * Overview of piece classes
 * =========================
 *
 * There are 9 different types of pieces, each with its own class.
 * 
 * Every top-piece class has:
 *      (1) a constructor,
 *      (2) a messageUp method
 *
 * Every bottom-piece class has:
 *      (1) a constructor,
 *      (2) a messageUp method
 *      (3) a messageDown method
 *   
 * The messageUp method is called when the message is coming from down below.
 *      - For top pieces, the up message is either coming from the board, or
 *        from its bottom piece.
 *      - For bottom pieces, the up message always comes from the board.
 *
 * The messageDown method is called when the message is coming from up above
 * (which is why only bottom pieces implement messageDown)
 *
 * Both messageUp and messageDown methods always return a triple of
 * [success, animations, moves], where:
 *
 *      - success is true or false; true iff the piece is allowing the movement
 *        request; false iff the piece is vetoing the movement request
 *      - animations is an array of animation descriptions
 *      - moves is an array of movement descriptions, which will be enacted
 *        should the ball's movement request succeed.
 *
 ******************************************************************************/

/**
 * Block piece
 ******************************************************************************/

hundo.Block = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.BLOCK;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

hundo.Block.prototype.messageUp = function(board, message) {
    return [false, [], []];
}

hundo.Block.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

/**
 * Ball piece
 ******************************************************************************/

hundo.Ball = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.BALL;
    this.layer = hundo.LayerEnum.TOP;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Ball.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

/**
 * Both Ball and Ice use slidingPieceMessageUp as the core to their messageUp
 * functions.
 *
 * Ball and Ice use THIS.pushingDir to deal with cases where other pieces bump
 * into the piece. For example:
 *      (1) The ball has a gblock-0 to the left and to the right, and the
 *          the ball pushes to the left. This causes the gblock-0 on the right
 *          to bump into the ball, pushing to the left. To avoid infinite
 *          recursion, the ball simply returns success.
 *      (2) The ball pushes into a chain of ice cubes, which go into a pipe,
 *          change direction, then push into the ball perpendicularly. In this
 *          case, the ball vetos the movement.
 ******************************************************************************/

hundo.slidingPieceMessageUp = function(board, message, pieceString, THIS) {
    var success;
    var animations = [];
    var moves = [];

    if (THIS.pushingDir == hundo.DirectionEnum.NODIR) {

        THIS.pushingDir = message.dir;

        var [newRow, newCol] = hundo.Board.dirRowCol(
            message.dir, THIS.row, THIS.col);

        var newMessage = {
            sender: THIS,
            forwarder: THIS,
            dir: message.dir,
            newRow: newRow,
            newCol: newCol,
        };

        [success, animations, moves] = board.messageDown(newMessage);

        if (success) {

            // in case some piece has mutated the direction of the piece
            THIS.dir = newMessage.dir;

            moves.push({
                piece: THIS,
                newRow: newMessage.newRow,
                newCol: newMessage.newCol
            });

            var newAnimation = {};
            newAnimation.move = {};
            newAnimation.move[pieceString] = THIS;
            newAnimation.move.dir = message.dir;

            animations.push(newAnimation);
        }
    } else if (THIS.pushingDir == message.dir) {
        success = true;
    } else {
        success = false;
    }

    return [success, animations, moves];
}

hundo.Ball.prototype.messageUp = function(board, message) {
    return hundo.slidingPieceMessageUp(board, message, "ball", this);
}

/**
 * Goal piece
 ******************************************************************************/

hundo.Goal = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.GOAL;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Goal.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Goal.prototype.messageUp = function(board, message) {

    var [top, bottom] = board.getTopBottom(this.row, this.col);

    if (hundo.Board.isCompatible(this, message.sender) &&
        this.dir == hundo.oppositeDir[message.dir] &&
        !top) {

        if (message.sender.type == hundo.PieceTypeEnum.BALL) {
            var animation = {
                goal: this
            };

            return [true, [animation], []];
        } else {
            return [true, [], []];
        }
    }
    return [false, [], []];
}

/**
 * Ice piece
 ******************************************************************************/

hundo.Ice = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.ICE;
    this.layer = hundo.LayerEnum.TOP;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

hundo.Ice.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

hundo.Ice.prototype.messageUp = function(board, message) {
    return hundo.slidingPieceMessageUp(board, message, "ice", this);
}

/**
 * Arrow piece
 ******************************************************************************/

hundo.Arrow = function(row, col, dir) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.ARROW;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.dir = dir;
}

hundo.Arrow.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

hundo.Arrow.prototype.messageUp = function(board, message) {

    if (hundo.Board.isCompatible(this, message.sender) &&
        this.dir == message.dir) {
        message.forwarder = this;
        return board.messageUp(message) 
    } else {
        return [false, [], []];
    }
}

hundo.Arrow.prototype.messageDown = function(board, message) {
    if (this.dir == message.dir ||
        this.dir == hundo.oppositeDir[message.dir]) {
        message.forwarder = this;
        return board.messageDown(message) 
    } else {
        return [false, [], []];
    }
}

/**
 * Gblock pieces move together as a group.
 ******************************************************************************/

hundo.Gblock = function(row, col, groupId) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.GBLOCK;
    this.layer = hundo.LayerEnum.TOP;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.groupId = groupId;
}

hundo.Gblock.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.dir == piece.dir;
}

/**
 * When a gblock piece is pushed, every member of that gblock's group must push.
 * And the the total push is only successful iff every group member's push 
 * was success. Then, and only then, the gblock pieces move forward. If the push
 * of any member of of the gblock group is vetoed, then the whole push is
 * vetoed.
 *
 * To implement this logic, the gblock detects if it is pushed by a foreigner
 * (namely, a piece that is not a member of this gblock's group).
 *
 * If the gblock piece is pushed by a foreigner, then the gblock pushes every
 * member of it's group, aggregating the push results, and returning success
 * only if every gblock member's push is a success.
 */
hundo.Gblock.prototype.messageUp = function(board, message) {

    // Push every member of this gblock's group.
    function pushMembers(THIS) {

        // members is an array containing every member of this gblock's group.
        var members = board.gblocks[THIS.groupId];

        var totalSuccess = true;
        var totalAnimations = [];
        var totalMoves = [];

        // clear out memoization
        _.each(members, function(member) {
            member.pushingDir = message.dir;
        });

        // push every member of this gblock's group
        _.each(members, function(member) {

            var newMessage = {
                sender: THIS,
                forwarder: THIS,
                dir: message.dir,
                newRow: member.row,
                newCol: member.col,
                pushFromMember: true,
            }

            // Send message directly to member.
            var [success, animations, moves] = member.messageUp(board,
                newMessage);

            totalAnimations = _.concat(totalAnimations, animations);
            totalMoves = _.concat(totalMoves, moves);

            if (!success) {
                totalSuccess = false;
            }
        });

        return [totalSuccess, totalAnimations, totalMoves];
    }

    // pushSelf is called when this gblock is being pushed by pushMembers.
    function pushSelf(THIS) {

        var [newRow, newCol] = hundo.Board.dirRowCol(
            message.dir, THIS.row, THIS.col);

        if (!board.inBounds(newRow, newCol)) {
            return [false, [], []];
        }

        var newMessage = {
            sender: THIS,
            forwarder: THIS,
            dir: message.dir,
            newRow: newRow,
            newCol: newCol,
        }

        var [success, animations, moves] = board.messageDown(newMessage);

        if (success) {

            moves.push({
                piece: THIS,
                newRow: newMessage.newRow,
                newCol: newMessage.newCol
            });

            animations.push(
                {
                    move: {
                        gblock: THIS,
                        dir: message.dir,
                    }
                });
        }

        return [success, animations, moves];
    }

    if (message.pushFromMember) {

        return pushSelf(this);

    } else {

        if (this.pushingDir == hundo.DirectionEnum.NODIR) {
            return pushMembers(this);
        } else {
            return [true, [], []];
        }

    }
}

/**
 * Sand piece
 ******************************************************************************/

hundo.Sand = function(row, col) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.SAND;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
}

hundo.Sand.prototype.messageDown = function(board, message) {

    message.forwarder = this;

    return board.messageDown(message);
}

hundo.Sand.prototype.messageUp = function(board, message) {

    message.forwarder = this;

    var [success, animations, moves] = board.messageUp(message);

    moves.push("stopBall");

    return [success, animations, moves];
}

hundo.Sand.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece);
}

/**
 * Portal piece
 ******************************************************************************/

hundo.Portal = function(row, col, groupId) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.PORTAL;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.groupId = groupId;
    this.origRow = row;
    this.origCol = col;
    this.receivingTeleportation = false;
}

hundo.Portal.prototype.messageDown = function(board, message) {

    message.forwarder = this;

    return board.messageDown(message);
}

hundo.Portal.prototype.getPartner = function(board) {

    var THIS = this;

    var index = _.findIndex(board.portals[this.groupId], function(portal) {
        return portal.id != THIS.id;
    });

    return board.portals[this.groupId][index];
}

hundo.Portal.prototype.messageUp = function(board, message) {

    if (message.sender.type == hundo.PieceTypeEnum.GBLOCK) {
        return [false, [], []];
    }

    // TODO: switch order of code so there's no negation here
     if (this.receivingTeleportation) {

        message.forwarder = this;

        var [success, animations, moves] = board.messageUp(message);

        return [success, animations, moves];
    } else {

        var partner = this.getPartner(board);

        message.newRow = partner.row;
        message.newCol = partner.col;

        message.forwarder = this;

        partner.receivingTeleportation = true;

        var [success, animations, moves] = partner.messageUp(board, message);

        partner.receivingTeleportation = false;

        return [success, animations, moves];
    }
}

hundo.Portal.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.groupId == piece.groupId;
}


/**
 * Pipe piece
 ******************************************************************************/

hundo.Pipe = function(row, col, up, down, left, right) {
    this.id = hundo.idGenerator.next();
    this.type = hundo.PieceTypeEnum.PIP;
    this.layer = hundo.LayerEnum.BOTTOM;
    this.row = row;
    this.col = col;
    this.origRow = row;
    this.origCol = col;
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.open = {}
    this.open[hundo.DirectionEnum.UP] = up;
    this.open[hundo.DirectionEnum.DOWN] = down;
    this.open[hundo.DirectionEnum.LEFT] = left;
    this.open[hundo.DirectionEnum.RIGHT] = right;

    // If this pipe is not an elbow, then this.elbow = false
    // If this pipe is an elbow, then this.elbow[x] = y, where
    // x == the direction the top piece is moving in, and
    // y == the new direction the top piece (because the pipe modifies the
    // direction of the top piece)
    if (up && right && !down && !left) {
        this.elbow = {};
        this.elbow[hundo.DirectionEnum.LEFT] = hundo.DirectionEnum.UP;
        this.elbow[hundo.DirectionEnum.DOWN] = hundo.DirectionEnum.RIGHT;
    } else if (up && left && !down && !right) {
        this.elbow = {};
        this.elbow[hundo.DirectionEnum.RIGHT] = hundo.DirectionEnum.UP;
        this.elbow[hundo.DirectionEnum.DOWN] = hundo.DirectionEnum.LEFT;
    } else if (down && left && !up && !right) {
        this.elbow = {};
        this.elbow[hundo.DirectionEnum.RIGHT] = hundo.DirectionEnum.DOWN;
        this.elbow[hundo.DirectionEnum.UP] = hundo.DirectionEnum.LEFT;
    } else if (down && right && !up && !left) {
        this.elbow = {};
        this.elbow[hundo.DirectionEnum.LEFT] = hundo.DirectionEnum.DOWN;
        this.elbow[hundo.DirectionEnum.UP] = hundo.DirectionEnum.RIGHT;
    } else {
        this.elbow = false;
    }
}

hundo.Pipe.prototype.messageDown = function(board, message) {

    if (this.open[message.dir]) {
        message.forwarder = this;
        return board.messageDown(message);
    } else if (this.elbow) {
        var newDir = this.elbow[message.dir];

        message.dir = newDir;
        [message.newRow, message.newCol] = hundo.Board.dirRowCol(newDir,
            this.row, this.col);

        message.forwarder = this;

        return board.messageDown(message);

    } else {
        return [false, [], []];
    }

}

hundo.Pipe.prototype.messageUp = function(board, message) {

    if (message.sender.type == hundo.PieceTypeEnum.GBLOCK) {
        return [false, [], []];
    }

    var oppositeDir = hundo.oppositeDir[message.dir];

    if (this.open[oppositeDir]) {
        message.forwarder = this;

        return board.messageUp(message);
    } else {
        return [false, [], []];
    }

}

hundo.Pipe.prototype.eq = function(piece) {
    return hundo.equalsTypeRowCol(this, piece) &&
        this.up == piece.up &&
        this.down == piece.down &&
        this.left == piece.left &&
        this.right == piece.right;
}

/**
 * Board encapsulates the model of the game (MVC style)
 ******************************************************************************/

hundo.Board = function(boardConfig) {

    // is the ball at rest?
    this.atRest = true;

    // is the board finished? namely, if the ball has gone out
    // of bounds or reached a goal
    this.done = false;

    this.solved = false;

    this.numRows = boardConfig.numRows;
    this.numCols = boardConfig.numCols;
    
    // The set of pieces that have moved out of bounds
    this.oob = [];

    // this.gblocks[gblock.groupId] == the set of gblocks in that group
    this.gblocks = {};

    // this.portals[portal.groupId] == the set of portals in that group
    this.portals = {};

    var THIS = this;

    // this.matrix[row][col][hundo.LayerEnum.TOP] == the top piece, or undefined
    // this.matrix[row][col][hundo.LayerEnum.BOTTOM] == the bottom piece, or
    // undefined
    this.matrix = new Array();
    _.each(_.range(0, this.numRows), function(r){
        THIS.matrix[r] = new Array();
        _.each(_.range(0, THIS.numCols), function(c){
            THIS.matrix[r][c] = {};

            var cell = THIS.matrix[r][c];

            cell[hundo.LayerEnum.TOP] = undefined;
            cell[hundo.LayerEnum.BOTTOM] = undefined;
        });
    });

    // Add blocks
    _.each(boardConfig.blocks, function(block){
        var piece = new hundo.Block(block.row, block.col)
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add the ball
    if ("ball" in boardConfig) {
        var row = boardConfig.ball.row;
        var col = boardConfig.ball.col;
        var piece = new hundo.Ball(row, col, hundo.DirectionEnum.NODIR);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    }

    // Add goals
    _.each(boardConfig.goals, function(goal) {
        var piece = new hundo.Goal(goal.row, goal.col, goal.dir);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add ice
    _.each(boardConfig.ice, function(ice) {
        var piece = new hundo.Ice(ice.row, ice.col, ice.dir);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add arrows
    _.each(boardConfig.arrows, function(arrow) {
        var piece = new hundo.Arrow(arrow.row, arrow.col, arrow.dir);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add gblocks
    _.each(boardConfig.gblocks, function(gblock) {
        var piece = new hundo.Gblock(gblock.row, gblock.col, gblock.groupId);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add sand
    _.each(boardConfig.sand, function(sand) {
        var piece = new hundo.Sand(sand.row, sand.col);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add portals
    _.each(boardConfig.portals, function(portal) {
        var piece = new hundo.Portal(portal.row, portal.col, portal.groupId);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

    // Add Pipes
    _.each(boardConfig.pipes, function(pipe) {
        var piece = new hundo.Pipe(pipe.row, pipe.col, pipe.up, pipe.down, pipe.left,
            pipe.right);
        if (!THIS.addPiece(piece)) {
            console.error("Could not add piece: ", piece);
        }
    });

}

hundo.Board.prototype.inBounds = function(row, col) {
    if (row >= 0 && row < this.numRows &&
        col >= 0 && col < this.numCols) {
        return true;
    }
}

hundo.Board.prototype.getTopBottom = function(row, col) {
    if (!this.inBounds(row, col)) {
        return [undefined, undefined];
    }

    var cell = this.matrix[row][col];
    return [cell[hundo.LayerEnum.TOP], cell[hundo.LayerEnum.BOTTOM]];
}


// return the number of pieces in cell: row, col
hundo.Board.prototype.numPieces = function(row, col) {

    var count = 0;
    
    var [top, bottom] = this.getTopBottom(row, col);
    
    if (top) {
        count ++;
    }

    if (bottom) {
        count ++;
    }
    
    return count;
}

hundo.Board.prototype.isEmptyCell = function(row, col) {
    return this.numPieces(row, col) == 0;
}

// returns all pieces for which func(piece) is true
hundo.Board.prototype.getPieces = function(func) {

    if (!func) {
        func = function(p) { return true };
    }

    var pieces = [];

    _.each(this.matrix, function(row) {
        _.each(row, function(cell) {

            var top = cell[hundo.LayerEnum.TOP];
            var bottom = cell[hundo.LayerEnum.BOTTOM];

            if (top && func(top)) {
                pieces.push(top);
            }

            if (bottom && func(bottom)) {
                pieces.push(bottom);
            }
        })
    });

    _.each(this.oob, function(piece){
        if (func(piece)) {
            pieces.push(piece);
        }
    })

    return pieces;
}

// return true iff the board has exactly one ball
hundo.Board.prototype.hasBall = function() {

    var balls = this.getPieces(function(piece) {
        return piece.type == hundo.PieceTypeEnum.BALL;
    });

    if (balls.length > 1) {
        console.error("Multiple balls");
        return null;
    }

    return balls.length == 1;
}

// Remove all pieces in row, col
hundo.Board.prototype.clearCell = function(row, col) {
    if (this.ball && this.ball.row == row && this.ball.col == col) {
        this.ball = undefined;
    }

    var cell = this.matrix[row][col];

    var bottom = cell[hundo.LayerEnum.BOTTOM]

    // If we are clearing out a portal, then update this.portals to reflect that
    if (bottom && bottom.type == hundo.PieceTypeEnum.PORTAL) {

        var i = _.findIndex(this.portals[bottom.groupId], function(portal) {
            return portal.id == bottom.id;
        });

        if (i < 0) {
            console.error("Could not find portal in board.portals");
        } else {
            this.portals[bottom.groupId].splice(i, 1);
        }

    }

    cell[hundo.LayerEnum.TOP] = undefined;
    cell[hundo.LayerEnum.BOTTOM] = undefined;
}

// hundo.compatible[piece.type] == the array of pieces that are
// compatible with the piece. Compatibility means two pieces can occupy the
// same cell.

// Returns true iff piece1 and piece2 are compatible
hundo.Board.isCompatible = function(piece1, piece2) {

    var compatible = hundo.compatible[piece1.type];

    var i = _.findIndex(compatible, function(p) {
        return piece2.type == p;
    });

    return i >= 0;
}


// Assuming matrix[row][col] is holding exactly one piece, returns that piece
hundo.Board.prototype.getOnePiece = function(row, col) {
    var numPieces = this.numPieces(row, col);

    if (numPieces != 1) {
        console.error("Num pieces == " + numPieces + " != 1");
    }

    var [top, bottom] = this.getTopBottom(row, col);
    
    if (top) {
        return top;
    } else if (bottom) {
        return bottom;
    } else {
        console.error("This code shouldn't be reachable");
        return undefined;
    }
}

// returns true iff piece can be added to the board
hundo.Board.prototype.canAddPiece = function(piece) {

    var numPieces = this.numPieces(piece.row, piece.col);

    if (piece.type == hundo.PieceTypeEnum.PORTAL) {
        var portals = this.portals[piece.groupId];
        if (portals && portals.length == 2) {
            return false;
        }
    }

    if (piece.type == hundo.PieceTypeEnum.BALL) {
        if (this.getBalls().length > 0) {
            return false;
        }
    }

    if (numPieces == 0) {
        return true;
    } else if (numPieces == 2) {
        return false;
    } else if (numPieces == 1) {
        var incumbent = this.getOnePiece(piece.row, piece.col);
        return hundo.Board.isCompatible(piece, incumbent);
    } else {
        console.error("Num pieces == " + numPieces);
        return undefined;
    }
}


// TODO refactor
hundo.Board.prototype.addPiece = function(piece) {

    if (this.canAddPiece(piece)) {

        if (this.inBounds(piece.row, piece.col)) {
            var cell = this.matrix[piece.row][piece.col];
            cell[piece.layer] = piece;
        } else {
            this.oob.push(piece);
        }

        if (piece.type == hundo.PieceTypeEnum.BALL) {
            this.ball = piece;
        }
        
        // TODO: refactor out common code?
        else if (piece.type == hundo.PieceTypeEnum.GBLOCK) {

            if (!(piece.groupId in this.gblocks)){
                this.gblocks[piece.groupId] = [];
            }   

            var i = _.findIndex(this.gblocks[piece.groupId], function(p) {
                return p.eq(piece);
            })
            
            if (i < 0) {
                this.gblocks[piece.groupId].push(piece);
            }
        }

        else if (piece.type == hundo.PieceTypeEnum.PORTAL) {

            if (!(piece.groupId in this.portals)) {
                this.portals[piece.groupId] = [];
            }

            var i = _.findIndex(this.portals[piece.groupId], function(p) {
                return p.eq(piece);
            })

            if (i < 0) {
                this.portals[piece.groupId].push(piece);
            }
        }

        return true;
    } else {
        return false;
    }
}

// removes the first element in array for which func(element) is true
// if an element is removed, returns the index of the element removed
// otherwise, returns -1
hundo.arrayRemove = function(array, func) {
    var i = _.findIndex(array, func);

    if (i < 0) {
        return -1;
    }

    array.splice(i, 1);

    return i;
}

hundo.Board.drdc = function(direction) {

    var dr = 0, dc = 0;

    if (direction == hundo.DirectionEnum.UP) {
        dr = -1;
    } else if (direction == hundo.DirectionEnum.DOWN) {
        dr = 1;
    } else if (direction == hundo.DirectionEnum.LEFT) {
        dc = -1;
    } else if (direction == hundo.DirectionEnum.RIGHT) {
        dc = 1;
    } else {
        console.error("Bad direction: " + direction);
        return null;
    }

    return [dr, dc];
}

// TODO: find all instances where this function should be used
hundo.Board.dirRowCol = function(direction, row, col) {
    var [dr, dc] = hundo.Board.drdc(direction);

    return [row + dr, col + dc];
}

hundo.Board.prototype.movePiece = function(piece, row, col) {

    var i;

    if (!this.inBounds(piece.row, piece.col)) {
        i = hundo.arrayRemove(this.oob, function(p) {
            return p.id == piece.id;
        })

        if (i == -1) {
            return false;
        }
    } else {
        var oldCell = this.matrix[piece.row][piece.col];

        if (!oldCell[piece.layer].eq(piece)) {
            return false;
        }

        oldCell[piece.layer] = undefined;
    }

    piece.row = row;
    piece.col = col;

    if (!this.inBounds(row, col)) {
        this.oob.push(piece);
    } else {

        if (!this.addPiece(piece)) {
            return false;
        }
    }

    return true;

}

hundo.Board.prototype.moveDir = function(piece, dir) {
    var [dr, dc] = hundo.Board.drdc(dir);

    var newRow = piece.row + dr;
    var newCol = piece.col + dc;

    this.movePiece(piece, newRow, newCol);
}

hundo.Board.prototype.reset = function() {

    var pieces = this.getPieces();

    this.portals = {};

    // TODO: this.gblocks = {} ?

    this.ball.dir = hundo.DirectionEnum.NODIR;

    _.each(pieces, function(p) {
        p.row = p.origRow;
        p.col = p.origCol;
    });

    _.each(this.matrix, function(row) {
        _.each(row, function(cell) {
            cell[hundo.LayerEnum.TOP] = undefined;
            cell[hundo.LayerEnum.BOTTOM] = undefined;
        })
    })

    this.oob = [];

    var THIS = this;

    _.each(pieces, function(p) {
        THIS.addPiece(p);
    })

    this.atRest = true;
    this.done = false;
    this.solved = false;
}

hundo.Board.prototype.setDir = function(direction) {
    this.ball.dir = direction;
    this.atRest = false;
}

hundo.Board.prototype.stopBall = function() {
    this.ball.dir = hundo.DirectionEnum.NODIR;
    this.atRest = true;
}
 
hundo.Board.prototype.getBlocks = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.BLOCK;
    });
};

hundo.Board.prototype.getBalls = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.BALL;
    });
};

hundo.Board.prototype.getGoals = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.GOAL;
    });
};


hundo.Board.prototype.getIce = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.ICE;
    });
};

hundo.Board.prototype.getArrows = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.ARROW;
    });
};

hundo.Board.prototype.getGblocks = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.GBLOCK;
    });
};

hundo.Board.prototype.getSand = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.SAND;
    });
};

hundo.Board.prototype.getPortals = function() {
    return this.getPieces(function(piece){
        return piece.type == hundo.PieceTypeEnum.PORTAL;
    });
};

// TODO: is this up, down, left, right functionality unnecessary?
hundo.Board.prototype.getPipes = function(up, down, left, right) {

    if (typeof up == "undefined") {
        return this.getPieces(function(piece){
            return piece.type == hundo.PieceTypeEnum.PIP;
        });
    } else {
        return this.getPieces(function(piece){
            return piece.type == hundo.PieceTypeEnum.PIP &&
                piece.up == up &&
                piece.down == down &&
                piece.left == left &&
                piece.right == right;
        });
    }
};

hundo.Board.prototype.getJson = function() {

    var j = {
        numRows: this.numRows,
        numCols: this.numCols,
        blocks: _.map(this.getBlocks(), function(block) {
                return {
                    row: block.row,
                    col: block.col
                }
            }),
        goals: _.map(this.getGoals(), function(goal) {
                return {
                    row: goal.row,
                    col: goal.col,
                    dir: goal.dir
                }
            }),
        ice: _.map(this.getIce(), function(ice) {
                return {
                    row: ice.row,
                    col: ice.col
                }
            }),
        arrows: _.map(this.getArrows(), function(arrow) {
                return {
                    row: arrow.row,
                    col: arrow.col,
                    dir: arrow.dir
                }
            }),
        gblocks: _.map(this.getGblocks(), function(gblock) {
                return {
                    row: gblock.row,
                    col: gblock.col,
                    groupId: gblock.groupId
                }
            }),
        sand: _.map(this.getSand(), function(sand) {
                return {
                    row: sand.row,
                    col: sand.col,
                }
            }),
        portals: _.map(this.getPortals(), function(portal) {
                return {
                    row: portal.row,
                    col: portal.col,
                    groupId: portal.groupId
                }
            }),
        pipes: _.map(this.getPipes(), function(pipe) {
                return {
                    row: pipe.row,
                    col: pipe.col,
                    up: pipe.up,
                    down: pipe.down,
                    left: pipe.left,
                    right: pipe.right
                }
            }),
    }

    if (this.ball) {
        j.ball = {
            row: this.ball.row,
            col: this.ball.col
        }
    }

    return j;

}


hundo.Board.prototype.messageDown = function(message) {

    // get the top and bottom pieces for the cell where the "piece that wants
    // to move" is.
    var [top, bottom] = this.getTopBottom(message.sender.row,
        message.sender.col);

    // TODO: we we really need to keep track of the forwarder and/or sender?

    // If the sender is the piece that wants to move
    if (message.forwarder.layer == hundo.LayerEnum.TOP) {

        // If there is a bottom piece, then forward the message to the bottom
        // piece
        if (bottom) {
            return bottom.messageDown(this, message);
        }
    }

    // If we are here, that means either:
    //      (A) The message came from a bottom piece, which means the bottom
    //          piece is forwarding the message from piece-that-wants-to-move
    //      (B) The message came from the piece-that wants to move, but there
    //          is not bottom piece.
    //
    // Either way, the thing to do is to pass the message to the "newCell."
    // 

    var newRow = message.newRow;
    var newCol = message.newCol;

    // Get the top and bottom pieces for the newCell
    var [top, bottom] = this.getTopBottom(newRow, newCol);
    
    // If there is a bottom piece in the newCell, forward the message up to that
    // bottom piece
    if (bottom) {
        message.forwarder = undefined;
        return bottom.messageUp(this, message);
    }

    // If there is no bottom piece in the newCell, forward the message up to
    // that top piece
    else if (top) {
        message.forwarder = undefined;
        return top.messageUp(this, message)
    }

    // If the newCell is empty, then there are no pieces to veto the movement,
    // so return true, which signifies that the movement is approved.
    else {
        return [true, [], []];
    }

}

// only callable from bottom pieces
// row, col are the coordinates  of the bottom piece making the call
hundo.Board.prototype.messageUp = function(message) {

    var [top, bottom] = this.getTopBottom(
        message.forwarder.row, message.forwarder.col);
    
    if (top) {
        return top.messageUp(this, message);
    } else {
        return [true, [], []];
    }
}

// TODO: reimplement using top and bottom
hundo.Board.prototype.checkSolved = function() {

    var [top, bottom] = this.getTopBottom(this.ball.row, this.ball.col)

    if (bottom) {
        return bottom.type == hundo.PieceTypeEnum.GOAL;
    } else {
        return false;
    }
}

// What if two pieces attempt to move into the same cell?
// See for example level-editor.html?level=fl22---4252627282--320330---a21001a31010
// movesClobber detects such collisions, returning true iff there is a collision
hundo.Board.movesClobber = function(moves) {

    var movesWithoutStopBall = _.clone(moves);

    _.remove(movesWithoutStopBall, function(move) {
        return move == "stopBall";
    })

    var destinations = _.map(movesWithoutStopBall, function(move){
        return move.newRow + "," + move.newCol;
    });

    var destinationSet = new Set(destinations);

    return destinationSet.size != movesWithoutStopBall.length;
}

// returns null on fatal error
// else, returns an animation object, which describes how the
// the step should be animated
hundo.Board.prototype.step = function() {

    _.each(this.getIce(), function(ice) {
        ice.pushingDir = hundo.DirectionEnum.NODIR;
    });

    _.each(this.getGblocks(), function(gblock) {
        gblock.pushingDir = hundo.DirectionEnum.NODIR;
    });

    this.ball.pushingDir = hundo.DirectionEnum.NODIR;


    var direction = this.ball.dir;

    if (direction == hundo.DirectionEnum.NODIR) {
        console.error("Ball must have a direction to step");
        return undefined;
    }
    
    var [dr, dc] = hundo.Board.drdc(direction);

    var newRow = this.ball.row + dr;
    var newCol = this.ball.col + dc;

    var [success, animations, moves] = this.ball.messageUp(this, {
            dir: direction,
            newRow: this.ball.row,
            newCol: this.ball.col,
        })

    if (hundo.Board.movesClobber(moves)) {
        success = false;
    }

    // Check for out of bounds
    if (!this.inBounds(this.ball.row, this.ball.col)) {

        this.atRest = true;
        this.done = true;
        this.ball.dir = hundo.DirectionEnum.NODIR;

        this.movePiece(this.ball, this.ball.row, this.ball.col);

        return [{
            move: {
                ball: this.ball,
                dir: direction,
                solved: false
            },
        }];
    }

    if (success) {

        var THIS = this;

        // TODO: explain
        _.each(moves, function(move){
            if (move != "stopBall") {
                THIS.movePiece(move.piece, -1, -1);
            } 
        });

        _.each(moves, function(move){
            if (move == "stopBall") {
                THIS.stopBall();
            } else {
                THIS.movePiece(move.piece, move.newRow, move.newCol);
            }
        });

        if (this.checkSolved()) {
            this.solved = true;
            this.atRest = true;
            this.ball.dir = hundo.DirectionEnum.NODIR;
        }
        return animations;
    } else {

        // recipients is the array of pieces that will be animated in the
        // collision
        var recipients = [];

        this.ball.dir = hundo.DirectionEnum.NODIR;
        this.atRest = true;
        
        var cell, top, bottom;

        // First, add the pieces from newRow, newCol
        cell = this.matrix[newRow][newCol];

        top = cell[hundo.LayerEnum.TOP];
        if (top) {
            recipients.push(top);
        }

        bottom = cell[hundo.LayerEnum.BOTTOM];
        if (bottom) {
            recipients.push(bottom);
        }

        // Second, add the pieces from ball.Row, ball.Col
        cell = this.matrix[this.ball.row][this.ball.col];

        top = cell[hundo.LayerEnum.TOP];
        if (top) {
            recipients.push(top);
        }

        bottom = cell[hundo.LayerEnum.BOTTOM];
        if (bottom) {
            recipients.push(bottom);
        }

        return [{
            collide: {
                dir: direction,
                recipients: recipients
            }
        }];
    } 
}


// TODO: remove duplicate edges
hundo.Board.prototype.move = function(dir, returnEdges) {

    var edges = [];

    this.setDir(dir);

    // TODO: factor out common code

    var [r1, c1] = [this.ball.row, this.ball.col];

    this.step();

    var [r2, c2] = [this.ball.row, this.ball.col];

    if (!(r1 == r2 && c1 == c2) &&
        !(r1 != r2 && c1 != c2)) {
        var edge = {
            row1: r1,
            col1: c1,
            row2: r2,
            col2: c2
        };
        edges.push(edge);
    }

    var [r1, c1] = [this.ball.row, this.ball.col];


    // TODO: can we get rid of this.solved and this.atRest?
    while (!this.done && !this.solved && !this.atRest) {
        this.step();
        var [r2, c2] = [this.ball.row, this.ball.col];

        if (!(r1 == r2 && c1 == c2) &&
            !(r1 != r2 && c1 != c2)) {
            var edge = {
                row1: r1,
                col1: c1,
                row2: r2,
                col2: c2
            };
            edges.push(edge);
        }

        var [r1, c1] = [this.ball.row, this.ball.col];

    }

    if (returnEdges) {
        return [this, edges];
    } else {
        return this;
    }
}

// Deep copy the board
hundo.Board.prototype.clone = function() {
    var config = this.getJson();
    return new hundo.Board(config);

}

hundo.Board.prototype.eq = function(board) {

    if (this.numRows != board.numRows || this.numCols != board.numCols) {
        return false;
    }

    if (this.ball && !board.ball || !this.ball && board.ball) {
        return false;
    }

    if (this.ball && board.ball) {
        if (this.ball.row != board.ball.row ||
            this.ball.col != board.ball.col) {
            return false;
        }
    }

    var THIS = this;

    var eq = true;

    function pieceEq(piece1, piece2) {
        if ((piece1 && !piece2) || (!piece1 && piece2)) {
            return false;
        } else if (piece1 && piece2) {
            return piece1.eq(piece2);
        } else if (!piece1 && !piece2) {
            return true;
        } else {
            console.error("This code should not be reachable")
        }
    }

    _.each(_.range(0, this.numRows), function(r) {
        _.each(_.range(0, THIS.numCols), function(c) {

            var [top1, bottom1] = THIS.getTopBottom(r, c);
            var [top2, bottom2] = board.getTopBottom(r, c);

            if (!pieceEq(top1, top2)) {
                eq = false;
            }

            if (!pieceEq(bottom1, bottom2)) {
                eq = false;
            }

        });
    });

    return eq;
}

/**
 * Code not released into the public domain
 ******************************************************************************/

// Thank you nicbell! https://gist.github.com/nicbell/6081098
Object.compare = function (obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
                break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
            //Compare values
            default:
                if (obj1[p] != obj2[p]) return false;
        }
    }
 
    //Check object 2 for any extra properties
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
};

/**
 * Solver solves puzzles
 ******************************************************************************/

// Thank you Wikipedia!
// https://en.wikipedia.org/wiki/Graph_traversal#Pseudocode

hundo.Solver = function(board) {

    this.maxEdges = 200;

    this.edges = [];

    this.cellEdges = [];

    this.winningEdges = [];

    this.cellWinningEdges = [];

    // TODO: rename to vertices
    this.boards = [];

    if (typeof board.ball == "undefined" ||
        typeof board.ball.row == "undefined" ||
        typeof board.ball.col == "undefined") {
        return;
    }

    this.cellWinningEdges = this.explore(board);

    // used for generating test cases for solver
    /*
    console.log("Edges");
    console.log(JSON.stringify(this.getCellEdges()));
    console.log("Winning edges")
    console.log(JSON.stringify(this.getCellWinningEdges()));
    */

}

hundo.Solver.prototype.hasExploredVertex = function(board1) {

    var matches = _.flatMap(this.boards, function(board2) {
        if (board1.eq(board2)) {
            return [true];
        } else {
            return [];
        }
    })

    if (matches.length == 0) {
        return false;
    } else if (matches.length == 1) {
        return true;
    } else {
        console.error("multiple matches for has explored: " + matches);
    }
}

hundo.Solver.prototype.hasExploredEdge = function(edge1) {

    var matches = _.flatMap(this.edges, function(edge2) {
        if (Object.compare(edge1[0].getJson(), edge2[0].getJson()) &&
            Object.compare(edge1[1].getJson(), edge2[1].getJson())) {
            return [true];
        } else {
            return [];
        }
    })

    if (matches.length == 0) {
        return false;
    } else if (matches.length == 1) {
        return true;
    } else {
        console.error("multiple matches for has explored: " + matches);
    }
}

hundo.Solver.prototype.getCellEdges = function() {
    return this.cellEdges;
}

hundo.Solver.prototype.getCellWinningEdges = function() {
    return this.cellWinningEdges;
}

// BUG: file:///Users/xyz/workspace/hundo/public/index.html?level=fl22--7b3-2c--bd0cb0cc0cd0dd0-2425262i3i4i595a5f6f7fa7b7c7ci--
hundo.Solver.prototype.explore = function(board) {
    if (this.edges.length >= this.maxEdges) {
        return [];
    }

    this.boards.push(board);

    // if out of bounds or solved
    if (!board.inBounds(board.ball.row, board.ball.col) || board.solved) {
        return [];
    }

    var boards = [];
    var edges = [];

    [boards[0], edges[0]] = board.clone().move(hundo.DirectionEnum.UP, true);
    [boards[1], edges[1]] = board.clone().move(hundo.DirectionEnum.DOWN, true);
    [boards[2], edges[2]] = board.clone().move(hundo.DirectionEnum.LEFT, true);
    [boards[3], edges[3]] = board.clone().move(hundo.DirectionEnum.RIGHT, true);

    var THIS = this;

    var cellWinningEdges = [];

    _.each(boards, function(newBoard, i) {

        var edge = [board, newBoard];

        if (!THIS.hasExploredEdge(edge)) { 

            if (!THIS.hasExploredVertex(newBoard)) {

                THIS.edges.push(edge);

                THIS.cellEdges = _.concat(THIS.cellEdges, edges[i]);

                var w = THIS.explore(newBoard) 

                cellWinningEdges = _.concat(cellWinningEdges, w)

                if (w.length > 0 || newBoard.solved) {
                    cellWinningEdges = _.concat(cellWinningEdges, edges[i]);
                }
            }            
        }
    });

    return cellWinningEdges;
}


/**
 * The Hundo class is what clients use to create a Hundo game
 ******************************************************************************/

var Hundo = function(config) {

    // clone hundo.defaultVizConfig so it doesn't get clobbered by extend
    var defaultVizConfig = jQuery.extend(true, {}, hundo.defaultVizConfig);

    if (!"vizConfig" in config) {
        config.viz = {};
    }

    config.viz = $.extend(defaultVizConfig, config.viz);

    var viz = new hundo.Viz(config);

    hundo.instances[config.id] = viz;

    if (_.size(hundo.instances) == 1) {
        hundo.vizz = viz;
    }

}

/**
 * Viz encapsulates the view and the controller
 ******************************************************************************/

hundo.Viz = function(config) {

    // TODO: validate vizConfig and levels
    this.vizConfig = config.viz;

    this.maker = {
        on: config.maker,
        play: false,
        mouseRow: undefined,
        mouseCol: undefined,
        showSolution: false,
        showGraph: false,
    }

    var levelFromUrl = hundo.Viz.levelFromUrl();

    if (this.maker.on) {

        if (levelFromUrl) {
            this.levels = [levelFromUrl];
        } else {
            this.levels = [
                {
                    numRows: config.viz.numRows,
                    numCols: config.viz.numCols
                }
            ]
        }

        config.viz.levelSelect = false;

    } else if (levelFromUrl) {
        this.levels = [levelFromUrl];
    } else {
        this.levels = config.levels;
    }

    this.id = config.id;
    this.level = 0;

    if (config.viz.allLevels) {
        this.levelMax = this.levels.length;
    } else {
        this.levelMax = config.viz.levelMax;
    }

    this.drawSvgGrid();

    var width = config.viz.numCols * config.viz.cellSize;

    $("#" + this.consoleId()).css("width", width);

    if (config.viz.playButton) {
        this.addPlayButton();
    }

    if (config.viz.levelSelect) {
        this.addLevelSelect();
    }

    if (config.viz.resetButton) {
        this.addResetButton();
    }

    if (config.viz.createButton) {
        this.addCreateButton();
    }

    if (this.maker.on) {
        this.addSave();
        this.addShowSolution();
        this.addPalette();
        this.addLevelUrlField();
        this.addPlayLevelUrlField();
    }

    this.boardSvg = d3.select("#" + this.boardSvgId())
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)
        .on("click", hundo.Viz.clickBoard);

    this.boardSvg.select("#background")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)
        .attr("style", "fill:black");

    this.boardSvg.select("#perim")
        .attr("width", this.vizConfig.numCols * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.numRows * this.vizConfig.cellSize)

    // TODO: drawGrid vs drawSvgGrid?
    this.drawGrid();

    var boardConfig = this.levels[0];

    this.board = new hundo.Board(boardConfig);

    this.drawBoard();

    this.updateLevelSelect();

    this.boardSvg
        .on("mousemove", hundo.Viz.mousemove)
        .on("mouseleave", hundo.Viz.mouseleave);

}

// TODO: assume untrusted input and write tests
hundo.Viz.getParams = function() {
    var url = window.location.href;

    var params = _.split(url, "?")[1]

    if (typeof params == "undefined") {
        return {}
    }

    var paramList = params.split("&");

    var paramObj = {}

    _.each(paramList, function(param) {
        var [key, value] = param.split("=");
        paramObj[key] = value;
    });

    return paramObj

}

hundo.Viz.levelFromUrl = function() {

    var params = hundo.Viz.getParams()

    if (!("level" in params)) {
        return false;
    }

    var compressedLevel = decodeURIComponent(params.level);

    var level = hundo.Compress.decompressLevel(compressedLevel);

    return level;
}

hundo.Viz.prototype.removeHighlight = function() {
    this.boardSvg.select("#" + this.highlightId())
        .remove();
}

// BUG TODO: it seems that mousemove and mouseleave are interferring
// with each other because mousemove updates the highlighter
// on every pixel change (as opposed to only updating the
// highlighter on cell changes). mouseleave only works when
// the mouse exits the board at high speed.
hundo.Viz.prototype.mousemove = function(x, y) {

    if (!this.maker.on || this.maker.play) {
        return;
    }

    var [row, col] = this.cellFromXY(x, y)

    this.removeHighlight();

    if (this.paletteSelection.delete) {
        if (this.board.isEmptyCell(row, col)) {
            return;
        }
    } else {
        var piece = this.getPieceFromPalette(row, col);
    }

    this.maker.mouseRow = row;
    this.maker.mouseCol = col;

    this.boardSvg.selectAll()
        .data([0])
        .enter()
        .append("rect")
        .attr("x", col * this.vizConfig.cellSize)
        .attr("y", row * this.vizConfig.cellSize)
        .attr("height", this.vizConfig.cellSize)
        .attr("width", this.vizConfig.cellSize)
        .attr("style", "fill:#3D8E37; fill-opacity: 0.5; cursor: pointer;")
        .attr("id", this.highlightId())

}

hundo.Viz.mousemove = function() {
    var [x, y] = d3.mouse(this);
    var id = hundo.Viz.getIdFromBoardSvg(this);
    var viz = hundo.instances[id]
    viz.mousemove(x, y);
}

hundo.Viz.prototype.mouseleave = function() {
    this.removeHighlight();
}

hundo.Viz.mouseleave = function() {
    var id = hundo.Viz.getIdFromBoardSvg(this);
    var viz = hundo.instances[id]
    viz.mouseleave();
}

hundo.Viz.prototype.drawSvgGrid = function(name) {

    var blockTemplate = `
        <rect x="0" y="0" width="20" height="20" fill="#888" />
        <path d="M0 0 L26 0 L20 6 L6 6 Z"
            stroke="none" fill="#aaa"/>
        <path d="M0 0 L6 6 L6 20 L0 26 Z"
            stroke="none" fill="#aaa"/>
        <path d="M26 0 L20 6 L20 20 L26 26 Z"
            stroke="none" fill="#666"/>
        <path d="M26 26 L20 20 L6 20 L0 26 Z"
            stroke="none" fill="#666"/>`

    var svgContents = `
        <div>
            <svg id="${this.boardSvgId(name)}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    
                    <g id="blockTemplate" height="20" width="20" >
                        ${blockTemplate}
                    </g>

                    <g id="goalTemplate" height="20" width="20">
                        <polygon points="0,26 0,13 13,26" style="fill:red" />
                        <polygon points="13,26 26,13 26,26" style="fill:red" />
                        <rect x="0" y="23" width="26" height="3" fill="red" />
                    </g>

                    <g id="arrowTemplate" height="20" width="20">
                        <polygon points="0,13 13,0 26,13 20,13 20,26 6,26 6,13" style="fill:yellow; stroke-width: 1; stroke: black;" />
                    </g>

                    <g id="gblockTemplate-0" height="26" width="26">
                        ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:red" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-1" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:yellow" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-2" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:blue" fill-opacity="0.3" />
                    </g>
                    <g id="gblockTemplate-3" height="26" width="26">
                        <rect x="0" y="0" width="20" height="20" fill="#888" />
                          ${blockTemplate}
                        <rect x="0" y="0" width="26" height="26" style="fill:green" fill-opacity="0.3" />
                    </g>
                    <g id="portalTemplate-0" height="26" width="26">
                        <rect x="0" y="0" width="26" height="26" fill="MediumVioletRed" />
                        <ellipse cx="13" cy="13" rx="12" ry="12" style="fill:black" />
                    </g>
                    <g id="portalTemplate-1" height="26" width="26">
                        <rect x="0" y="0" width="26" height="26" fill="CornflowerBlue" />
                        <ellipse cx="13" cy="13" rx="12" ry="12" style="fill:black" />
                    </g>
                    <g id="portalTemplate-2" height="26" width="26">
                        <rect x="0" y="0" width="26" height="26" fill="ForestGreen" />
                        <ellipse cx="13" cy="13" rx="12" ry="12" style="fill:black" />
                    </g>
                    <g id="portalTemplate-3" height="26" width="26">
                        <rect x="0" y="0" width="26" height="26" fill="yellow" />
                        <ellipse cx="13" cy="13" rx="12" ry="12" style="fill:black" />
                    </g>


                    <!-- PIP four dirs -->
                    <g id="pipeTemplate-1111" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <!-- three dirs -->
                    <g id="pipeTemplate-0111" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-1011" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-1101" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-1110" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <!-- two dirs -->
                    <g id="pipeTemplate-1100" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-1010" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-1001" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--up-->    <rect x="8" y="0" width="10" height="13" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-0110" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-0101" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--down-->  <rect x="8" y="13" width="10" height="13" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>

                    <g id="pipeTemplate-0011" height="26" width="26">
                        <ellipse cx="13" cy="13" rx="5" ry="5" style="fill:#0a0" />
                        <!--left-->  <rect x="0" y="8" width="13" height="10" style="fill:#0a0" />
                        <!--right--> <rect x="13" y="8" width="13" height="10" style="fill:#0a0" />
                    </g>







                </defs>

                <rect id="background" x="0" y="0" style="fill:black" />

                <rect id="perim" x="0" y="0" style="stroke-width:3;stroke:#999" fill-opacity="0.0"/>

            </svg>
        </div>
        <div id="${this.consoleId()}" class="console">
        </div>`

    var svg = $('<div/>').html(svgContents).contents();

    $("#" + this.hundoId()).append(svg);
}

hundo.Viz.prototype.cellFromXY = function(x, y) {

    var row = Math.floor(y / this.vizConfig.cellSize);
    var col = Math.floor(x / this.vizConfig.cellSize);

    return [row, col];
}

hundo.Viz.prototype.getPieceFromPalette = function(row, col) {

    if (this.paletteSelection.type == hundo.PieceTypeEnum.BALL) {
        return new hundo.Ball(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.BLOCK) {
        return new hundo.Block(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.GOAL) {
        return new hundo.Goal(row, col, this.paletteSelection.dir);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.ICE) {
        return new hundo.Ice(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.ARROW) {
        return new hundo.Arrow(row, col, this.paletteSelection.dir);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.GBLOCK) {
        return new hundo.Gblock(row, col, this.paletteSelection.groupId);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.SAND) {
        return new hundo.Sand(row, col);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.PORTAL) {
        return new hundo.Portal(row, col, this.paletteSelection.groupId);
    } else if (this.paletteSelection.type == hundo.PieceTypeEnum.PIP) {
        return new hundo.Pipe(row, col, this.paletteSelection.up,
            this.paletteSelection.down, this.paletteSelection.left,
            this.paletteSelection.right);
    }else {
        console.error("Unrecognized piece type")
    }

}

hundo.Viz.prototype.clickBoard = function(x, y) {

    if (!this.maker.on || this.maker.play) {
        return false;
    }

    var [row, col] = this.cellFromXY(x, y);

    if (this.paletteSelection.delete) {
        this.animateSolvedQuick();
        this.board.clearCell(row, col);
        this.drawBoardQuick();
        return;
    }

    var piece = this.getPieceFromPalette(row, col);

    if (this.board.addPiece(piece)) {
        this.animateSolvedQuick();
        this.drawBoardQuick();
        this.removeHighlight();

    } else {

        this.animateSolvedQuick();

        this.board.clearCell(row, col);
        if (!this.board.addPiece(piece) && piece.type != hundo.PieceTypeEnum.BALL) {
            console.error("This code shouldn't be reachable");
        }

        this.drawBoardQuick();
        this.removeHighlight();
    }

}

hundo.Viz.getIdFromBoardSvg = function(boardSvg) {
    var boardSvgId = boardSvg.getAttribute("id")
    var id = _.split(boardSvgId, "boardSvg")[1]

    return id;
}

hundo.Viz.clickBoard = function(){

    var id = hundo.Viz.getIdFromBoardSvg(this);

    var [x, y] = d3.mouse(this);

    var viz = hundo.instances[id]
    viz.clickBoard(x, y);
}

hundo.Viz.prototype.addPlayButton = function() {
    var contents = `<button id="${this.playButtonId()}" onclick="hundo.clickPlay(${this.id})" type="button"
     class="button">Play</button>`

    var playButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(playButton);
}

hundo.Viz.prototype.addLevelSelect = function() {
    var contents = `
        <button id="${this.levelBackButtonId()}" onclick="hundo.clickLevelBack(${this.id})" type="button" class="button" onmouseover="" style="cursor: pointer;">◀</button>
        <span id="${this.levelTextId()}""></span>
        <button id="${this.levelForwardButtonId()}" onclick="hundo.clickLevelForward(${this.id})" type="button" class="button" onmouseover="" style="color:#bbb">▶</button>
        `

    var levelSelect = $("<div/>").html(contents).contents();

    $("#" + this.consoleId()).append(levelSelect);
}

hundo.Viz.prototype.addResetButton = function() {
    var contents = `<button id="${this.resetButtonId()}" onclick="hundo.clickReset(${this.id})" type="button"
     class="button">Reset puzzle</button>`

    var resetButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(resetButton);
}

hundo.Viz.prototype.addCreateButton = function() {

    var contents = `<button id="${this.createButtonId()}" onclick="window.location.href = 'level-editor.html'" type="button"
     class="button">Create new puzzle</button>`

    var createButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(createButton);
}

// TODO: id incorpoates viz id
hundo.Viz.prototype.paletteButtonHtml = function(image, config) {
    return `
        <img src="img/${image}.png"
            id="${this.getPalettePieceId(config.id)}"
            onclick='hundo.clickPalette(${this.id}, ${JSON.stringify(config)})'
            onmouseover=""
            style="cursor: pointer; width: ${this.vizConfig.cellSize}px;
                height: ${this.vizConfig.cellSize}px; padding: 8px" />`
}

hundo.Viz.prototype.addPalette = function() {

    var buttons = [
        {
            image: "delete",
            config: {
                delete: true,
                id: 1

            },
        },
        {
            image: "ball",
            config: {
                type: hundo.PieceTypeEnum.BALL,
                id: 2
            },
        },
        {
            image: "block",
            config: {
                type: hundo.PieceTypeEnum.BLOCK,
                id: 3
            },
        },
        {
            image: "goal-up",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.UP,
                id: 4
            }
        },
        {
            image: "goal-down",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.DOWN,
                id: 5
            }
        },
        {
            image: "goal-left",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.LEFT,
                id: 6
            }
        },
        {
            image: "goal-right",
            config: {
                type: hundo.PieceTypeEnum.GOAL,
                dir: hundo.DirectionEnum.RIGHT,
                id: 7
            }
        },
        {
            image: "ice",
            config: {
                type: hundo.PieceTypeEnum.ICE,
                id: 8
            }
        },
        {
            image: "arrow-up",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.UP,
                id: 9
            }
        },
        {
            image: "arrow-down",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.DOWN,
                id: 10
            }
        },
        {
            image: "arrow-left",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.LEFT,
                id: 11
            }
        },
        {
            image: "arrow-right",
            config: {
                type: hundo.PieceTypeEnum.ARROW,
                dir: hundo.DirectionEnum.RIGHT,
                id: 12
            }
        },
        {
            image: "gblock-0",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupId: 0,
                id: 13
            }
        },
        {
            image: "gblock-1",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupId: 1,
                id: 14
            }
        },
        {
            image: "gblock-2",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupId: 2,
                id: 15
            }
        },
        {
            image: "gblock-3",
            config: {
                type: hundo.PieceTypeEnum.GBLOCK,
                groupId: 3,
                id: 16
            }
        },
        {
            image: "sand",
            config: {
                type: hundo.PieceTypeEnum.SAND,
                id: 17
            }
        },
        {
            image: "portal-0",
            config: {
                type: hundo.PieceTypeEnum.PORTAL,
                groupId: 0,
                id: 18
            }
        },
        {
            image: "portal-1",
            config: {
                type: hundo.PieceTypeEnum.PORTAL,
                groupId: 1,
                id: 19
            }
        },
        {
            image: "portal-2",
            config: {
                type: hundo.PieceTypeEnum.PORTAL,
                groupId: 2,
                id: 20
            }
        },
        {
            image: "portal-3",
            config: {
                type: hundo.PieceTypeEnum.PORTAL,
                groupId: 3,
                id: 21
            }
        },


        {
            image: "pipe-0011",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: false,
                down: false,
                left: true,
                right: true,
                id: 22
            }
        },
        {
            image: "pipe-1100",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: true,
                left: false,
                right: false,
                id: 23
            }
        },

        {
            image: "pipe-1001",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: false,
                left: false,
                right: true,
                id: 24
            }
        },
        {
            image: "pipe-0101",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: false,
                down: true,
                left: false,
                right: true,
                id: 25
            }
        },
        {
            image: "pipe-0110",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: false,
                down: true,
                left: true,
                right: false,
                id: 26
            }
        },
        {
            image: "pipe-1010",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: false,
                left: true,
                right: false,
                id: 27
            }
        },

        {
            image: "pipe-1101",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: true,
                left: false,
                right: true,
                id: 28
            }
        },
        {
            image: "pipe-0111",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: false,
                down: true,
                left: true,
                right: true,
                id: 29
            }
        },
        {
            image: "pipe-1110",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: true,
                left: true,
                right: false,
                id: 30
            }
        },
        {
            image: "pipe-1011",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: false,
                left: true,
                right: true,
                id: 31
            }
        },
        {
            image: "pipe-1111",
            config: {
                type: hundo.PieceTypeEnum.PIP,
                up: true,
                down: true,
                left: true,
                right: true,
                id: 32
            }
        },
    ]

    var THIS = this;

    var contents = _.map(buttons, function(pieceDescription) {
            return THIS.paletteButtonHtml(
                    pieceDescription.image,
                    pieceDescription.config
                )
        })
        .join("")

    var contents = "<div class='palette' id='" + this.paletteDivId() + "''>" + contents + "</div>"

    var palette = $("<div/>").html(contents).contents();

    $("#" + this.consoleId()).append(palette);

    this.paletteSelection = {
        type: hundo.PieceTypeEnum.BLOCK
    };

    this.clickPalette(buttons[2].config);

}

hundo.Viz.prototype.addSave = function() {
    var contents = `<button id="${this.saveButtonId()}" onclick="hundo.clickSave(${this.id})" type="button"
     class="button">Save</button>`

    var saveButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(saveButton);
}

hundo.Viz.prototype.addShowSolution = function() {
    var contents = `<button id="${this.solutionButtonId()}" onclick="hundo.clickShowSolution(${this.id})" type="button"
     class="button">Show solution</button>`

    var solutionButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(solutionButton);
}

hundo.Viz.prototype.addLevelUrlField = function() {
    var contents = `<div class="levelUrl">URL for editing this level: <input type="text" id="${this.levelUrlFieldId()}"
    value=""></input></div>`

    var saveButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(saveButton);
}

hundo.Viz.prototype.addPlayLevelUrlField = function() {
    var contents = `<div class="levelUrl">URL for playing this level: <input type="text" id="${this.levelPlayingUrlFieldId()}"
    value=""></input></div>`

    var saveButton = $("<div/>").html(contents).contents();

     $("#" + this.consoleId()).append(saveButton);
}

hundo.Viz.prototype.hundoId = function() {
    return "hundo" + this.id;
}

hundo.Viz.prototype.boardSvgId = function() {
    return "boardSvg" + this.id;
}

hundo.Viz.prototype.highlightId = function() {
    return "highlight" + this.id;
}

hundo.Viz.prototype.playButtonId = function() {
    return "playButton" + this.id;
}

hundo.Viz.prototype.resetButtonId = function() {
    return "resetButton" + this.id;
}

hundo.Viz.prototype.createButtonId = function() {
    return "createButton" + this.id;
}

hundo.Viz.prototype.saveButtonId = function() {
    return "saveButton" + this.id;
}

hundo.Viz.prototype.solutionButtonId = function() {
    return "solutionButton" + this.id;
}

hundo.Viz.prototype.levelUrlFieldId = function() {
    return "levelUrlField" + this.id
}

hundo.Viz.prototype.levelPlayingUrlFieldId = function() {
    return "levelPlayingUrlField" + this.id
}


hundo.Viz.prototype.consoleId = function() {
    return "console" + this.id;
}

hundo.Viz.prototype.levelTextId = function() {
    return "levelText" + this.id;
}

hundo.Viz.prototype.levelBackButtonId = function() {
    return "levelBackButton" + this.id;
}

hundo.Viz.prototype.levelForwardButtonId = function() {
    return "levelForwardButton" + this.id;
}

hundo.Viz.prototype.paletteDivId = function() {
    return "paletteDiv" + this.id;
}

hundo.Viz.prototype.drawGrid = function() {

    var vizConfig = this.vizConfig;

    var rows = _.range(1, vizConfig.numRows);

    this.boardSvg.selectAll()
        .data(rows)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("x1", vizConfig.perimStrokeWidth)
        .attr("y1", function(row) { return row * vizConfig.cellSize; })
        .attr("x2", vizConfig.numCols * vizConfig.cellSize -
                vizConfig.perimStrokeWidth)
        .attr("y2", function(row) { return row * vizConfig.cellSize; })
        .attr("style", "stroke:rgb(0,0,255);stroke-width:1;opacity:0.3");

    var cols = _.range(1, vizConfig.numCols);

    this.boardSvg.selectAll()
        .data(cols)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("y1", vizConfig.perimStrokeWidth)
        .attr("x1", function(col) { return col * vizConfig.cellSize; })
        .attr("y2", vizConfig.numRows * vizConfig.cellSize - 
            vizConfig.perimStrokeWidth)
        .attr("x2", function(col) { return col * vizConfig.cellSize; })
        .attr("style", "stroke:rgb(0,0,255);stroke-width:1;opacity:0.3");
}


hundo.Viz.pieceId = function(piece) {
    return "piece" + piece.id;
}

hundo.Viz.dirToDegrees = function(dir) {
    if (dir == hundo.DirectionEnum.UP) {
        return 0;
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return 180;
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return 270;
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return 90;
    } else {
        console.error("Invalid direction:" + dir);
    }
}

hundo.Viz.prototype.transform = function(piece, transformation) {

    if (typeof transformation == "undefined") {
        transformation = {};
    }

    var x = piece.col * this.vizConfig.cellSize;
    var y = piece.row * this.vizConfig.cellSize;

    if ("dx" in transformation) {
        x += transformation.dx;
    }

    if ("dy" in transformation) {
        y += transformation.dy;
    }

    var t = [];

    t.push("translate(" + x + ", " + y + ")");

    if ("scale" in transformation) {
        t.push("scale(" + transformation.scale + ")");
    }

    if (piece.type == hundo.PieceTypeEnum.BALL ||
        piece.type == hundo.PieceTypeEnum.BLOCK ||
        piece.type == hundo.PieceTypeEnum.ICE ||
        piece.type == hundo.PieceTypeEnum.GBLOCK ||
        piece.type == hundo.PieceTypeEnum.SAND ||
        piece.type == hundo.PieceTypeEnum.PORTAL ||
        piece.type == hundo.PieceTypeEnum.PIP) {
        return _.join(t, ",");
    } else if (piece.type == hundo.PieceTypeEnum.GOAL ||
        piece.type == hundo.PieceTypeEnum.ARROW) {

        var z = this.vizConfig.cellSize / 2;
        var degrees = hundo.Viz.dirToDegrees(piece.dir);
        t.push("rotate(" + degrees + ", " + z + ", " + z + ")");
        return _.join(t, ",");
    } else {
        console.error("Bad piece type: " + piece.type);
    }
}

hundo.getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

hundo.Viz.prototype.removeSolution = function() {

    this.boardSvg.selectAll(".solution").remove();

}

hundo.Viz.prototype.drawEdges = function(edges, style) {

    var THIS = this;
    
    this.boardSvg.selectAll()
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "solution")
        .attr("x1", function(edge) {
            return edge.col1 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("y1", function(edge) {
            return edge.row1 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("x2", function(edge) {
            return edge.col2 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("y2", function(edge) {
            return edge.row2 * THIS.vizConfig.cellSize +
                THIS.vizConfig.cellSize / 2;
        })
        .attr("style", style);
}

hundo.Viz.prototype.drawSolution = function() {
    var solver = new hundo.Solver(this.board);

    if (this.maker.showGraph) {
        this.drawEdges(solver.getCellEdges(),
            "stroke:#888;stroke-width:1;opacity:1.0");
    }

    this.drawEdges(solver.getCellWinningEdges(),
        "stroke:#B00000;stroke-width:4;opacity:1.0");

}


hundo.Viz.prototype.drawPieces = function(transformation) {

    var THIS = this;

    this.boardSvg.selectAll()
        .data(this.board.getBlocks())
        .enter()
        .append("svg:use")
        .attr("class", "block")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#blockTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });
    
    this.boardSvg.selectAll()
        .data(this.board.getSand())
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.vizConfig.cellSize)
        .attr("height", this.vizConfig.cellSize)
        .attr("style", "fill:green; fill-opacity: 0.5; stroke: #bbb; stroke-width: 2")
        .attr("class", "sand")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    this.boardSvg.selectAll()
        .data(this.board.getPortals())
        .enter()
        .append("svg:use")
        .attr("class", "block")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", function (piece) {
            return "#portalTemplate-" + piece.groupId;
        })        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    function pipeTemplate(pipe) {
        
        var connections = [pipe.up, pipe.down, pipe.left, pipe.right];

        var connectionString = _.map(connections, function(bool) {
                return bool ? "1" : "0";
            })
            .join("")
        return "#pipeTemplate-" + connectionString;

    }

    this.boardSvg.selectAll()
        .data(this.board.getPipes())
        .enter()
        .append("svg:use")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", pipeTemplate)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });


    // <ellipse cx="10" cy="10" rx="10" ry="10" style="fill:#eee" />
    this.boardSvg.selectAll()
        .data(this.board.getBalls())
        .enter()
        .append("ellipse")
        .attr("cx", this.vizConfig.cellSize / 2)
        .attr("cy", this.vizConfig.cellSize / 2)
        .attr("rx", this.vizConfig.cellSize / 2)
        .attr("ry", this.vizConfig.cellSize / 2)
        .attr("style", "fill:#eee; stroke-width: 1px; stroke: #000")
        .attr("class", "ball")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    this.boardSvg.selectAll()
        .data(this.board.getGoals())
        .enter()
        .append("svg:use")
        .attr("class", "goal")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#goalTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    var iceMargin = Math.floor(this.vizConfig.cellSize / 6);

    this.boardSvg.selectAll()
        .data(this.board.getIce())
        .enter()
        .append("rect")
        .attr("x", iceMargin)
        .attr("y", iceMargin)
        .attr("width", this.vizConfig.cellSize - iceMargin * 2)
        .attr("height", this.vizConfig.cellSize - iceMargin * 2)
        .attr("rx", iceMargin)
        .attr("ry", iceMargin)
        .attr("style", "fill:#63ADD2")
        .attr("class", "ice")
        .attr("id", hundo.Viz.pieceId)
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    this.boardSvg.selectAll()
        .data(this.board.getGblocks())
        .enter()
        .append("svg:use")
        .attr("class", "gblock")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", function (piece) {
            return "#gblockTemplate-" + piece.groupId;
        })
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    this.boardSvg.selectAll()
        .data(this.board.getArrows())
        .enter()
        .append("svg:use")
        .attr("class", "arrow")
        .attr("id", hundo.Viz.pieceId)
        .attr("xlink:href", "#arrowTemplate")
        .attr("transform", function(piece) {
            return THIS.transform(piece, transformation);
        });

    if (this.maker.showSolution) {
        this.drawSolution();
    }
}

hundo.Viz.prototype.drawBoardQuick = function() {
    this.drawPieces({})
}

hundo.Viz.prototype.drawBoard = function() {

    var dxdy = this.vizConfig.cellSize / 2;

    var THIS = this;

    this.drawPieces({
        dx: dxdy,
        dy: dxdy,
        scale: 0
    })

    var dxdy = -(this.vizConfig.cellSize / 2) * this.vizConfig.blowupScale;

    // TODO
    var pieces = this.board.getPieces(function(){ return true; });

    var delays = _.range(0, pieces.length)
        .map(function(){
            return hundo.getRandom(0, THIS.vizConfig.flyInDuration / 2);
        });

    _.each(pieces, function(piece, i){
        var id = "#" + hundo.Viz.pieceId(piece);
        var delay = delays[i];

        THIS.boardSvg.select(id)
            .transition()
            .ease("linear")
            .delay(delay)
            .attr("transform", function() {
                return THIS.transform(piece, {
                    dx: dxdy,
                    dy: dxdy,
                    scale: THIS.vizConfig.blowupScale
                });
            })
            .duration(THIS.vizConfig.flyInDuration / 2);
    });

    setTimeout(function(){
        _.each(pieces, function(piece, i){
            var piece = pieces[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            var delay = delays[i];
            THIS.boardSvg.select(id)
                .transition()
                .ease("linear")
                .delay(delay)
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(THIS.vizConfig.flyInDuration / 2);
        });            
    }, this.vizConfig.flyInDuration / 2);

}

hundo.Viz.prototype.reset = function() {
    this.board.reset();
    this.animateSolvedQuick();
    this.drawBoardQuick();
}

hundo.Viz.dxdy = function(dir) {
    if (dir == hundo.DirectionEnum.UP) {
        return [0, -1];
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return [0, 1];
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return [-1, 0];
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return [1, 0];
    } else {
        console.error("Bad direction: " + dir);
    }
}


// TODO: add instance id to #background
hundo.Viz.prototype.undoAnimateVictory = function() {

    this.boardSvg.select("#background")
        .style("fill", "#000")

    this.boardSvg.select("#theend" + this.id)
        .remove();

    this.drawGrid();
}

// TODO: Cleanup
hundo.Viz.prototype.animateVictory = function() {

    var THIS = this;

    this.boardSvg.select("#background")
        .transition()
        .style("fill", "#EEE")
        .duration(0);

    this.boardSvg.selectAll(".grid")
        .remove();

    this.boardSvg.selectAll()
        .data([1])
        .enter()
        .append("text")
        .attr("id", "theend" + this.id)
        .attr("x", 50)
        .attr("y", 150)
        .attr("font-family", "Impact")
        .attr("font-size", 55)
        .text("The end...");

}

hundo.Viz.prototype.animateSolvedQuick = function() {

    var pieces = this.board.getPieces(function(){ return true; });

    _.each(pieces, function(piece,i){
        var id = "#" + hundo.Viz.pieceId(piece);
        $(id).remove();
    })

    this.removeSolution();
}

hundo.Viz.prototype.animateSolved = function() {

    var pieces = this.board.getPieces(function(){ return true; });

    var dxdy = this.vizConfig.cellSize / 2;

    var THIS = this;

    var delays = _.range(0, pieces.length)
        .map(function(){
            return hundo.getRandom(0, THIS.vizConfig.flyInDuration / 2);
        })

    _.each(pieces, function(piece, i){
        var id = "#" + hundo.Viz.pieceId(piece);

        var delay = delays[i];

        THIS.boardSvg.select(id)
            .transition()
            .ease("linear")
            .delay(delay)
            .attr("transform", function() {
                return THIS.transform(piece, {
                    dx: dxdy,
                    dy: dxdy,
                    scale: 0
                });
            })
            .duration(THIS.vizConfig.flyInDuration)
            .remove();
    });

    this.removeSolution();
}

hundo.Viz.prototype.prevLevel = function() {

    if (this.level <= 0) {
        return;
    }

    if (this.level == "victory") {
        this.level = this.levels.length;
    }

    this.animateSolvedQuick();

    this.level--;
    this.board = new hundo.Board(this.levels[this.level]);

    if (this.level == this.levels.length - 1) {
        this.undoAnimateVictory();
    }

    this.drawBoardQuick();
    this.updateLevelSelect();

}

hundo.Viz.prototype.loadNextLevel = function(quick) {

    if (this.level < this.levels.length - 1) {
        this.level++;

        if (this.level > this.levelMax) {
            this.levelMax = this.level;
        }

        this.board = new hundo.Board(this.levels[this.level]);

        if (quick) {
            this.drawBoardQuick();
        } else {
            this.drawBoard();
        }

    } else {
        // all levels solved
        this.level = "victory";
        this.animateVictory();

        this.levelMax = this.levels.length;
    }

    this.updateLevelSelect();
}

hundo.Viz.prototype.nextLevel = function(quick) {

    var THIS = this;

    if (quick) {
        this.animateSolvedQuick();
        this.loadNextLevel(quick);
    } else {
        setTimeout(function(){
            THIS.loadNextLevel();
        }, this.vizConfig.flyInDuration / 2);

        this.animateSolved(); 
    }



}

hundo.Viz.prototype.updateLevelSelect = function() {

    var levelText;

    if (this.level == "victory" ) {
        levelText = "The end... "
    } else {
        levelText = "Level " + (this.level + 1) + "/" + this.levels.length;
    }

    $("#" + this.levelTextId()).text(levelText);

    if (this.level == "victory" || this.level > 0) {
        $("#" + this.levelBackButtonId())
            .css({
                color: "#000",
                cursor: "pointer"
            });
    } else {
        $("#" + this.levelBackButtonId())
            .css({
                color: "#bbb",
                cursor: ""
            })
    }

    if (this.level != "victory" && this.level < this.levelMax) {
        $("#" + this.levelForwardButtonId())
            .css({
                color: "#000",
                cursor: "pointer"
            });
    } else {
        $("#" + this.levelForwardButtonId())
            .css({
                color: "#bbb",
                cursor: ""
            })
    }
}

hundo.Viz.prototype.animateBall = function(animation) {

    var ball = animation.move.ball;
    var ballId = "#" + hundo.Viz.pieceId(ball);

    var dx;
    var dy;

    if (ball.dir == hundo.DirectionEnum.NODIR) {
        dx = 0;
        dy = 0;
    } else {
        [dx, dy] = hundo.Viz.dxdy(ball.dir);
    }

    var THIS = this;


    this.boardSvg.select(ballId)
        .transition()
        .ease("linear")
        .attr("rx", function() {
            if (dy != 0) {
                return THIS.vizConfig.cellSize / 4;
            } else {
                return THIS.vizConfig.cellSize / 2;
            }
        })
        .attr("ry", function() {
            if (dx != 0) {
                return THIS.vizConfig.cellSize / 4;
            } else {
                return THIS.vizConfig.cellSize / 2;
            }
        })
        .attr("transform", function() {
            return THIS.transform(ball);
        })
        .duration(this.vizConfig.stepDuration);

    // leave a trail behind the ball
    this.boardSvg.selectAll()
        .data([{row: ball.row, col: ball.col}])
        .enter()
        .append("circle")
        .attr("cx", ball.col * this.vizConfig.cellSize +
                this.vizConfig.cellSize / 2
        )
        .attr("cy", ball.row * this.vizConfig.cellSize +
                this.vizConfig.cellSize / 2
        )
        .attr("r", this.vizConfig.cellSize / 2 -
                this.vizConfig.cellSize / 8)
        .attr("style", "fill:#bbb")
        .transition()
        .duration(this.vizConfig.stepDuration * 4)
        .attr("r", "0")
        .remove();

}

hundo.Viz.prototype.animateGoal = function(animation) {

    var goal = animation.goal;
    var circles = _.range(0, 4);

    var delayMultiplier = 40;
    var duration = 400;
    var maxRadius = this.vizConfig.cellSize * 5;

    this.boardSvg.selectAll()
        .data(circles)
        .enter()
        .append("circle")
        .attr("cx", goal.col * this.vizConfig.cellSize +
            this.vizConfig.cellSize / 2)
        .attr("cy", goal.row * this.vizConfig.cellSize +
            this.vizConfig.cellSize / 2)
        .attr("r", 0)
        .attr("stroke", "#F00")
        .attr("stroke-width", 5)
        .attr("fill", "#F00")
        .attr("fill-opacity", 0)
        .transition()
        .delay(function(circleNum) {
            return circleNum * delayMultiplier;
        })
        .duration(duration)
        .attr("r", maxRadius)
        .attr("stroke", "#000")
        .remove();
}

// TODO: move common code (in animateBall) into seperate function
hundo.Viz.prototype.animateIce = function(animation) {

    var ice = animation.move.ice;
    var iceId = "#" + hundo.Viz.pieceId(ice);
    
    var THIS = this;

    this.boardSvg.select(iceId)
        .transition()
        .ease("linear")
        .attr("transform", function() {
            return THIS.transform(ice);
        })
        .duration(this.vizConfig.stepDuration);

}

hundo.Viz.prototype.animateGblock = function(animation) {

    var gblock = animation.move.gblock;
    var gblockId = "#" + hundo.Viz.pieceId(gblock);
    
    var THIS = this;

    this.boardSvg.select(gblockId)
        .transition()
        .ease("linear")
        .attr("transform", function() {
            return THIS.transform(gblock);
        })
        .duration(this.vizConfig.stepDuration);

}

hundo.Viz.prototype.animateCollide = function(animation) {

    var THIS = this;

    var recipients = animation.collide.recipients;
    var dir = animation.collide.dir;
    for (var i = 0; i < recipients.length; i++) {
        var piece = recipients[i];
        var id = "#" + hundo.Viz.pieceId(piece);

        if (piece.type == hundo.PieceTypeEnum.BALL) {
            this.boardSvg.select(id)
                .transition()
                .ease("linear")
                // undo the ball squish
                .attr("rx", this.vizConfig.cellSize / 2)
                .attr("ry", this.vizConfig.cellSize / 2)

                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= THIS.vizConfig.cellSize / 3;
                    dy *= THIS.vizConfig.cellSize / 3;

                    return THIS.transform(piece, {dx: dx, dy: dy});
                })
                .duration(this.vizConfig.stepDuration / 2);
        } else {

            this.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("transform", function() {

                    var [dx, dy] = hundo.Viz.dxdy(dir);

                    dx *= THIS.vizConfig.cellSize / 3;
                    dy *= THIS.vizConfig.cellSize / 3;

                    return THIS.transform(piece, {dx: dx, dy: dy});
                })
                .duration(this.vizConfig.stepDuration / 2);

        }
    }

    setTimeout(function(){
        for (var i = 0; i < recipients.length; i++) {
            var piece = recipients[i];
            var id = "#" + hundo.Viz.pieceId(piece);
            THIS.boardSvg.select(id)
                .transition()
                .ease("linear")
                .attr("transform", function() {
                    return THIS.transform(piece);
                })
                .duration(THIS.vizConfig.stepDuration / 2);
            }
    }, this.vizConfig.stepDuration / 2);

}

hundo.Viz.prototype.stepAnimate = function() {

    var THIS = this;

    var animations = this.board.step();

    if (this.board.atRest) {
        clearInterval(this.animateInterval);
    }

    if (this.board.done) {
        setTimeout(
            function(){THIS.reset(this.board);},
            THIS.animateInterval);
    }

    var THIS = this;

    _.each(animations, function(animation) {
        if ("move" in animation && "ball" in animation.move) {
            THIS.animateBall(animation);
        } else if ("move" in animation && "ice" in animation.move) {
            THIS.animateIce(animation);
        } else if ("move" in animation && "gblock" in animation.move) {
            THIS.animateGblock(animation);
        } else if ("collide" in animation) {
            THIS.animateCollide(animation);
        } else if ("goal" in animation) {
            THIS.animateGoal(animation);
        }
    })

    if (this.board.solved) {
        if (this.maker.on) {
            this.reset(this.board);
        } else {
            this.nextLevel(false);
        }
    }
}


hundo.Viz.prototype.checkKey = function(e) {
    if (!this.board.atRest) {
        return;
    }

    if (this.board.solved) {
        return;
    }

    if (this.maker.on && !this.maker.play) {
        return;
    }

    var e = e || window.event;

    var direction;

    // diable browser scrolling on arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    if (e.keyCode == '38') {
        direction = hundo.DirectionEnum.UP;
    } else if (e.keyCode == '40') {
        direction = hundo.DirectionEnum.DOWN;
    } else if (e.keyCode == '37') {
        direction = hundo.DirectionEnum.LEFT;
    } else if (e.keyCode == '39') {
        direction = hundo.DirectionEnum.RIGHT;
    } else {
        return;
    }

    this.board.setDir(direction);

    this.stepAnimate();

    var THIS = this;

    if (!this.board.atRest) {
        this.animateInterval =
            setInterval(
                function(){
                    THIS.stepAnimate();
                },
                this.vizConfig.stepDuration);
    }
}

// TODO: hoist code into Viz.prototype.checkKey
hundo.Viz.checkKey = function(e) {
    hundo.vizz.checkKey(e);
}

hundo.Viz.prototype.clickPlay = function() {

    if (!this.maker.on) {
        return;
    }

    this.maker.play = !this.maker.play;

    if (this.maker.play) {
        $("#" + this.playButtonId()).text("Edit");
        $("#" + this.paletteDivId()).children().css("opacity", 0.15).css("cursor", "");
    } else {
        $("#" + this.playButtonId()).text("Play");
        $("#" + this.paletteDivId()).children().css("opacity", 1.0).css("cursor", "pointer");
    }

}

hundo.clickPlay = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickPlay();
}

hundo.Viz.prototype.clickReset = function() {
    clearInterval(this.animateInterval);
    this.reset();
}

hundo.clickReset = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickReset();
}

hundo.Viz.prototype.clickSave = function() {
    console.log("save");

    var url = this.getBoardUrl("level-editor.html");

    $("#" + this.levelUrlFieldId()).attr("value", url);

    $("#" + this.levelUrlFieldId()).select();

    var url = this.getBoardUrl("index.html");

    $("#" + this.levelPlayingUrlFieldId()).attr("value", url);


    console.log(url);
    console.log(JSON.stringify(this.board.getJson()));
}

hundo.clickSave = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickSave();
}

hundo.Viz.prototype.clickShowSolution = function() {
    this.maker.showSolution = !this.maker.showSolution;
    this.maker.showGraph = this.maker.showSolution;

    if (this.maker.showSolution) {
        $("#" + this.solutionButtonId()).text("Hide solution");
    } else {
        $("#" + this.solutionButtonId()).text("Show solution");
    }

    this.animateSolvedQuick();
    this.drawBoardQuick();

}

hundo.clickShowSolution = function(id) {
    hundo.vizz = hundo.instances[id];
    hundo.vizz.clickShowSolution();
}

// TODO: bug, hundo.vizz is unsafe here because
// you might click level left on one Hundo and do nextLevel
// on another level
hundo.clickLevelForward = function(id) {

    if (hundo.vizz.level != "victory" && hundo.vizz.level < hundo.vizz.levelMax) {
        hundo.vizz.nextLevel(true);
    }
}

hundo.clickLevelBack = function(id) {
    hundo.vizz.prevLevel();
}

hundo.Viz.prototype.getPalettePieceId = function(id) {
    return "palette-" + this.id + "-" + id;
}

hundo.Viz.prototype.clickPalette = function(config) {

    if (this.maker.play) {
        return;
    }

    $("#" + this.getPalettePieceId(this.paletteSelection.id))
        .css("border-style", "")
        .css("border-width", "")
        .css("border-color", "")
        .css("padding", "8px");

    this.paletteSelection = config;

    $("#" + this.getPalettePieceId(config.id))
        .css("border-style", "double")
        .css("border-width", "5px")
        .css("border-color", "#0F0")
        .css("padding", "3px");
}

hundo.clickPalette = function(id, config) {
    var viz = hundo.instances[id]
    viz.clickPalette(config);
}

hundo.Viz.prototype.getBoardUrl = function(filename) {
    var levelParam = hundo.Compress.compressLevel(this.board.getJson());
    var url = window.location.href;

    url = _.split(url, "?")[0];

    var parts = _.split(url, "/");

    parts.pop();

    var urlPrefix = _.join(parts, "/");

    return urlPrefix + "/" + filename + "?level=" +
        encodeURIComponent(levelParam);
}

hundo.cheat = function() {
    hundo.vizz.maker.showSolution = !hundo.vizz.maker.showSolution;
    hundo.vizz.maker.showGraph = true;

    if (hundo.vizz.maker.showSolution) {
        hundo.vizz.drawSolution();
    } else {
        hundo.vizz.removeSolution();
    }

}

/**
 * Compress functions enable levels to be encoded in URLs
 ******************************************************************************/

hundo.Compress = {}

hundo.Compress.toBase64Digit = function (number) {
    if (number < 0 || number >= 62) {
        console.error("Cannot convert to base64: " + number);
        return null;
    }

    if (number < 10) {
        return "" + number
    } else if (number < 36) {
        return String.fromCharCode("a".charCodeAt(0) + number - 10)
    } else {
        return String.fromCharCode("A".charCodeAt(0) + number - 36)
    }
}

hundo.Compress.fromBase64Digit = function(digit) {

    var charCode = digit.charCodeAt(0);

    if (charCode >= "0".charCodeAt(0) &&
        charCode <= "9".charCodeAt(0)) {
        return charCode - "0".charCodeAt(0);
    } else if (charCode >= "a".charCodeAt(0) &&
        charCode <= "z".charCodeAt(0)) {
        return charCode - "a".charCodeAt(0) + 10;
    } else if (charCode >= "A".charCodeAt(0) &&
        charCode <= "Z".charCodeAt(0)) {
        return charCode - "A".charCodeAt(0) + 36;
    } else {
        console.error("Cannot convert from base64: " + digit);
        return null;
    }
}

hundo.Compress.dirToNum = function(dir) {

    if (dir == hundo.DirectionEnum.UP) {
        return "0";
    } else if (dir == hundo.DirectionEnum.DOWN) {
        return "1";
    } else if (dir == hundo.DirectionEnum.LEFT) {
        return "2";
    } else if (dir == hundo.DirectionEnum.RIGHT) {
        return "3";
    } else {
        console.error("Bad direction: " + dir);
        return null;
    }
}

hundo.Compress.numToDir = function(num) {

    if (num == "0") {
        return hundo.DirectionEnum.UP;
    } else if (num == "1") {
        return hundo.DirectionEnum.DOWN;
    } else if (num == "2") {
        return hundo.DirectionEnum.LEFT;
    } else if (num == "3") {
        return hundo.DirectionEnum.RIGHT;
    } else {
        console.error("Bad num: " + num);
        return null;
    }
}

hundo.Compress.sep = "-";

hundo.Compress.versioningSentinel = 61;

hundo.Compress.versionNumber = 1;

hundo.Compress.pushNumbers = function(levelArray, ...nums) {

    _.each(nums, function(num) {
        levelArray.push(hundo.Compress.toBase64Digit(num));
    });
}

hundo.Compress.addVersion = function(levelArray) {
    hundo.Compress.pushNumbers(levelArray,
        hundo.Compress.versioningSentinel,
        hundo.Compress.versionNumber);
}

hundo.Compress.addDimensions = function(level, levelArray) {
    hundo.Compress.pushNumbers(levelArray, level.numRows, level.numCols);
}

hundo.Compress.addBall = function(level, levelArray) {
    if (typeof level.ball != "undefined") {
        hundo.Compress.pushNumbers(levelArray, level.ball.row, level.ball.col);
    }

    levelArray.push(hundo.Compress.sep);
}

hundo.Compress.addRowCol = function(level, levelArray, pieces) {
    _.each(pieces, function(piece){
        hundo.Compress.pushNumbers(levelArray, piece.row, piece.col);
    });

    levelArray.push(hundo.Compress.sep);
}

hundo.Compress.addRowColDir = function(level, levelArray, pieces) {

    _.each(pieces, function(piece){
        hundo.Compress.pushNumbers(levelArray, piece.row, piece.col,
            hundo.Compress.dirToNum(piece.dir));
    });

    levelArray.push(hundo.Compress.sep);
}

hundo.Compress.addRowColGroupId = function(level, levelArray, pieces) {

    _.each(pieces, function(piece){
        hundo.Compress.pushNumbers(levelArray, piece.row, piece.col,
            piece.groupId);
    });

    levelArray.push(hundo.Compress.sep);
}

hundo.Compress.addPipes = function(level, levelArray, pieces, version) {

    if (version == 0) {

        _.each(pieces, function(piece){
            hundo.Compress.pushNumbers(levelArray, piece.row, piece.col,
                    piece.up ? 1 : 0,
                    piece.down ? 1 : 0,
                    piece.left ? 1 : 0,
                    piece.right ? 1 : 0);
        });

    } else if (version == 1) {

        _.each(pieces, function(piece){

            var directions = 0;

            if (piece.up) {
                directions |= 1;
            }

            directions <<= 1;

            if (piece.down) {
                directions |= 1;
            }

            directions <<= 1;

            if (piece.left) {
                directions |= 1;
            }

            directions <<= 1;

            if (piece.right) {
                directions |= 1;
            }

            hundo.Compress.pushNumbers(levelArray, piece.row, piece.col,
                    directions);

        });

    } else {
        console.error("Unsupported version number: " + version);
    }
}

// TODO: make a class
// assumes numRows, numCols < 32
hundo.Compress.compressLevel = function(level, version) {

    if (typeof version == "undefined") {
        version = hundo.Compress.versionNumber;
    }

    var levelArray = [];

    if (version > 0) {
        hundo.Compress.addVersion(levelArray);
    }

    hundo.Compress.addDimensions(level, levelArray);
    
    hundo.Compress.addBall(level, levelArray);
    
    hundo.Compress.addRowCol(level, levelArray, level.blocks);
    
    hundo.Compress.addRowColDir(level, levelArray, level.goals);
    
    hundo.Compress.addRowCol(level, levelArray, level.ice);
    
    hundo.Compress.addRowColDir(level, levelArray, level.arrows);
    
    hundo.Compress.addRowColGroupId(level, levelArray, level.gblocks);
    
    hundo.Compress.addRowCol(level, levelArray, level.sand);
    
    hundo.Compress.addRowColGroupId(level, levelArray, level.portals);
    
    hundo.Compress.addPipes(level, levelArray, level.pipes, version);

    return _.join(levelArray, "");
}

hundo.Compress.getRowCol = function(bytes) {

    var row = hundo.Compress.fromBase64Digit(bytes[0]);
    var col = hundo.Compress.fromBase64Digit(bytes[1]);

    bytes.shift();
    bytes.shift();

    return [row, col];

}

hundo.Compress.pullSeparator = function(bytes) {
    // shift past the sep
    if (bytes.length > 0) {
        if (bytes[0] != hundo.Compress.sep) {
            console.error("Could not parse level");
            return null;
        }
        bytes.shift();
    }
}

hundo.Compress.pullVersion = function(bytes) {
    var version;

    var firstByteNum = hundo.Compress.fromBase64Digit(bytes[0]);
    bytes.shift();

    if (firstByteNum == hundo.Compress.versioningSentinel) {
        version = hundo.Compress.fromBase64Digit(bytes[0]);
        bytes.shift();
    } else {
        version = 0;
        var firstByte = hundo.Compress.toBase64Digit(firstByteNum);
        bytes = _.concat(firstByte, bytes);
    }

    return [version, bytes];
}

// TODO: unit test without ball
hundo.Compress.pullBall = function(bytes) {

    var ball;

    if (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        var [r, c] = hundo.Compress.getRowCol(bytes);
        ball = {
            row: r,
            col: c
        }
    }

    hundo.Compress.pullSeparator(bytes);

    return ball;
}

hundo.Compress.pullRowColPieces = function(bytes) {

    var pieces = [];

    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        var [r, c] = hundo.Compress.getRowCol(bytes);
        var piece = {
            row: r,
            col: c
        }
        pieces.push(piece);
    }

    hundo.Compress.pullSeparator(bytes);

    return pieces;
}

hundo.Compress.pullRowColDirPieces = function(bytes) {

    var pieces = [];

    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        var [r, c] = hundo.Compress.getRowCol(bytes);
        var dir = hundo.Compress.numToDir(bytes[0]);
        bytes.shift();
        var piece = {
            row: r,
            col: c,
            dir: dir
        }
        pieces.push(piece);
    }

    hundo.Compress.pullSeparator(bytes);

    return pieces;
}

hundo.Compress.pullRowColGroupIdPieces = function(bytes) {

    var pieces = [];

    while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
        var [r, c] = hundo.Compress.getRowCol(bytes);
        var groupId = hundo.Compress.fromBase64Digit(bytes[0]);
        bytes.shift();
        var piece = {
            row: r,
            col: c,
            groupId: groupId
        }
        pieces.push(piece);
    }

    hundo.Compress.pullSeparator(bytes);

    return pieces;
}

hundo.Compress.pullPipes = function(bytes, version) {

    var pieces = [];

    if (version == 0) {

        while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
            var [r, c] = hundo.Compress.getRowCol(bytes);
            var up = hundo.Compress.fromBase64Digit(
                bytes[0]) == 1 ? true : false;
            bytes.shift();
            var down = hundo.Compress.fromBase64Digit(
                bytes[0]) == 1 ? true : false;
            bytes.shift();
            var left = hundo.Compress.fromBase64Digit(
                bytes[0]) == 1 ? true : false;
            bytes.shift();
            var right = hundo.Compress.fromBase64Digit(
                bytes[0]) == 1 ? true : false;
            bytes.shift();

            var pipe = {
                row: r,
                col: c,
                up: up,
                down: down,
                left: left,
                right: right
            }
            pieces.push(pipe);
        }

    } else if (version == 1) {

        while (bytes.length > 0 && bytes[0] != hundo.Compress.sep) {
            var [r, c] = hundo.Compress.getRowCol(bytes);
            var directions = hundo.Compress.fromBase64Digit(bytes[0]);
            bytes.shift();

            var up = false, down = false, left = false, right = false;

            if (directions & 1 == 1) {
                right = true;
            }

            directions >>= 1;

            if (directions & 1 == 1) {
                left = true;
            }

            directions >>= 1;

            if (directions & 1 == 1) {
                down = true;
            }

            directions >>= 1;

            if (directions & 1 == 1) {
                up = true;
            }

            var pipe = {
                row: r,
                col: c,
                up: up,
                down: down,
                left: left,
                right: right
            }

            pieces.push(pipe);
        }
    } else {
        console.error("Unsupported version number: " + version);
    }

    hundo.Compress.pullSeparator(bytes);

    return pieces;
}
// 64-bit bytes
// TODO: factor out common code
hundo.Compress.decompressLevel = function(byteString) {

    var level = {
        blocks: [],
        goals: [],
        ice: [],
        arrows: [],
        gblocks: [],
        sand: [],
        portals: [],
        pipes: []
    };

    var r, c;

    var bytes = _.split(byteString, "")

    var [version, bytes] = hundo.Compress.pullVersion(bytes);

    [level.numRows, level.numCols] = hundo.Compress.getRowCol(bytes);

    level.ball = hundo.Compress.pullBall(bytes);
    
    level.blocks = hundo.Compress.pullRowColPieces(bytes);

    level.goals = hundo.Compress.pullRowColDirPieces(bytes);

    level.ice = hundo.Compress.pullRowColPieces(bytes);

    level.arrows = hundo.Compress.pullRowColDirPieces(bytes);

    level.gblocks = hundo.Compress.pullRowColGroupIdPieces(bytes);

    level.sand = hundo.Compress.pullRowColPieces(bytes);

    level.portals = hundo.Compress.pullRowColGroupIdPieces(bytes);

    level.pipes = hundo.Compress.pullPipes(bytes, version);

    return level;
}

hundo.instances = {}

hundo.vizz = null;

hundo.defaultVizConfig = {
    cellSize: 26,
    stepDuration: 50,
    flyInDuration: 250,
    blowupScale: 3,
    perimStrokeWidth: 3,
    numRows: 15,
    numCols: 21,
    playButton: false,
    resetButton: true,
    createButton: true,
    levelSelect: true,
    levelMax: 0,
    allLevels: true
}

document.onkeydown = hundo.Viz.checkKey;


