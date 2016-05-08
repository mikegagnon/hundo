
var TEST_CASE;

function assertEquals(x, a, b) {
    if (a != b) {
        console.error(TEST_CASE + ", " + x + ": " + a + " != " + b);
    }
}

function assert(x, a) {
    if (!a) {
        console.error(TEST_CASE + ", " + x + ": false");
    }
}