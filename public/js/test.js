/**
 * This is free and unencumbered software released into the public domain.
 * See UNLICENSE.txt
 */

// TODO: rm x

var TEST;

function assertEquals(a, b) {
    if (a != b) {
        console.error(TEST + ": " + a + " != " + b);
    }
}

function assert(a) {
    if (!a) {
        console.error(TEST + ": false");
    }
}