
TEST = "to/from Base64Digit"

function testBase64Digit(number) {
    var newNumber = hundo.Compress.fromBase64Digit(
        hundo.Compress.toBase64Digit(number));
    return number == newNumber
}

_.range(0, 62)
    .map(function(i){
        assert(i, testBase64Digit(i));
    })


