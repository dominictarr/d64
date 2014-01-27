var Buffer = require('buffer').Buffer

var CHARS = '.PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890'
  .split('').sort().join('')

module.exports = function (chars) {
  chars = chars || CHARS
  if(chars.length !== 64) throw new Error('a base 64 encoding requires 64 chars')

//  var indexToCode = new Buffer(64)
  var codeToIndex = new Buffer(128)
  //indexToCode.fill()
  codeToIndex.fill()

  for(var i = 0; i < 64; i++) {
    var code = chars.charCodeAt(i)
//    indexToCode[i] = code
    codeToIndex[code] = i
  }

  return {
    encode: function (data) {
      var s = '', l = data.length, hang = 0
      for(var i = 0; i < l || (i==l && (i)%3); i++) {
        var v = data[i]
        //console.log(i, v, i%3, chars)
        switch (i % 3) {
          case 0:
      //      console.log(v >> 2, chars[v >> 2])
            s += chars[v >> 2]
            hang = v & 3
          break;
          case 1:
    //        console.log(hang << 4 | v >> 4)
            s += chars[hang << 4 | v >> 4]
            hang = v & 0xf
          break;
          case 2:
  //          console.log(hang << 4 | v >> 2)
            if(v == null)
              return s += chars[hang << 2]
            s += chars[hang << 2 | v >> 6]
            s += chars[v & 0x3f]
            hang = 0
          break;
        }
//        console.log(s, hang, hang.toString(2))
      }
      return s
    },
    decode: function (str) {
      //console.log('decode', str)
      var l = str.length, j = 0
      var b = new Buffer(~~((l/4)*3)), hang = 0

      for(var i = 0; i < l; i++) {
        var v = codeToIndex[str.charCodeAt(i)]
        switch (i % 4) {
          case 0:
            hang = v << 2;
          break;
          case 1:
            b[j++] = hang | v >> 4
            hang = (v << 4) & 0xff
          break;
          case 2:
            b[j++] = hang | v >> 2
            hang = (v << 6) & 0xff
          break;
          case 3:
            b[j++] = hang | v
          break;
        }
        //console.log('?', str[i], v, i, hang, b)
      }
      return b
    }
  }
}
