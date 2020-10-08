module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}



//////////////////
// WEBPACK FOOTER
// ./~/to-array/index.js
// module id = 37
// module chunks = 0