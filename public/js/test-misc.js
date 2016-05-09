/**
 * hundo.arrayRemove
 **************************************************/
TEST = "hundo.arrayRemove"

var array = []
assertEquals(1, -1, hundo.arrayRemove(array, function(x){return true;}));

array = [1]
assertEquals(2, 0, hundo.arrayRemove(array, function(x){return true;}));
assertEquals(3, 0, array.length)

array = [1]
assertEquals(4, -1, hundo.arrayRemove(array, function(x){return false;}));
assertEquals(5, 1, array.length)

array = [1, 2]
assertEquals(6, 0, hundo.arrayRemove(array, function(x){return true;}));
assertEquals(7, 1, array.length)
assertEquals(8, 2, array[0])

array = [1, 2]
assertEquals(9, 1, hundo.arrayRemove(array, function(x){return x == 2;}));
assertEquals(10, 1, array.length)
assertEquals(11, 1, array[0])

array = [1, 2, 3]
assertEquals(9, 1, hundo.arrayRemove(array, function(x){return x == 2;}));
assertEquals(10, 2, array.length)
assertEquals(11, 1, array[0])
assertEquals(12, 3, array[1])


