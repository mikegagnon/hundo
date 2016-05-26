/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

/**
 * hundo.arrayRemove
 **************************************************/
TEST = "hundo.arrayRemove"

var array = []
assertEquals(-1, hundo.arrayRemove(array, function(x){return true;}));

array = [1]
assertEquals(0, hundo.arrayRemove(array, function(x){return true;}));
assertEquals(0, array.length)

array = [1]
assertEquals(-1, hundo.arrayRemove(array, function(x){return false;}));
assertEquals(1, array.length)

array = [1, 2]
assertEquals(0, hundo.arrayRemove(array, function(x){return true;}));
assertEquals(1, array.length)
assertEquals(2, array[0])

array = [1, 2]
assertEquals(1, hundo.arrayRemove(array, function(x){return x == 2;}));
assertEquals(1, array.length)
assertEquals(1, array[0])

array = [1, 2, 3]
assertEquals(1, hundo.arrayRemove(array, function(x){return x == 2;}));
assertEquals(2, array.length)
assertEquals(1, array[0])
assertEquals(3, array[1])

/**
 * oppositeDir
 **************************************************/
 TEST = "hundo.oppositeDir"

 assertEquals(hundo.DirectionEnum.UP,
    hundo.oppositeDir(hundo.DirectionEnum.DOWN));
 assertEquals(hundo.DirectionEnum.DOWN,
    hundo.oppositeDir(hundo.DirectionEnum.UP));
 assertEquals(hundo.DirectionEnum.LEFT,
    hundo.oppositeDir(hundo.DirectionEnum.RIGHT));
 assertEquals(hundo.DirectionEnum.RIGHT,
    hundo.oppositeDir(hundo.DirectionEnum.LEFT));

