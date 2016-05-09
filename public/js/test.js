
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