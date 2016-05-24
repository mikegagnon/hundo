/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

// TODO: rm x

var TEST;

function assertEquals(x, a, b) {
    if (a != b) {
        console.error(TEST + ", " + x + ": " + a + " != " + b);
    }
}

function assert(x, a) {
    if (!a) {
        console.error(TEST + ", " + x + ": false");
    }
}