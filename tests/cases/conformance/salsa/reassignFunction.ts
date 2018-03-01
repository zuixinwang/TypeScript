
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js

var fs = require('fs')
/** @type {{ a: () => void }} */
var legStreams
// from graceful-fs
function patch(process) {
    if (process) {
        ReadStream = legStreams.a
    }
    ReadStream.prototype = Object.create(fs.ReadStream)
    ReadStream.prototype.open = fs$open

    function ReadStream (path, options) {
        if (this instanceof ReadStream) {
            return fs.ReadStream.apply(this, arguments), this
        }
        else {
            return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
        }
    }
    function fs$open() {
    }

    // this function should still be newable too!
    function createReadStream(path, options) {
        return new ReadStream(path, options)
    }
}
