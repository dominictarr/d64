
# d64 - a copy-pastable, url friendly, ascii embeddable, lexiographicly sortable binary encoding.

//the 64 characters, in their order.
//(note, 0 codes for 1, `.` codes for 0)
//these characters not need to be escaped in URLs or in bash,
//and will not allow a linewrap in textareas.
//in d64 encoding, the lexiographic of the encoded string is consistent
//with the byte ordering of the unencoded buffer.

``` js
var chars = '.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
```
// there are only 62 alphanumeric characters, so we need to pick two more.
// first, lets find the characters which can be used in URLs without encoding them.
``` js
var sensible = '!@#$%^&*(){}?+|_"<>\',-.'
  .split('').sort().map(encodeURIComponent)
  .filter(function (e) { return e.length ==1 })
  .join('')
``
the non encoded characters are `!'()*-._~`

`_` is an obvious choice, because it's very nearly always a valid character within a variable name,
so it's treated like a aphabetic character in most cases.

`!` and `~` are problematic, because they are the first and last printable characters,
so they are quite useful for delimiting strings while maintaining the sorting properties
- for instance strings of d64.
`!` and `~` are commonly used in levelup stuff, and that is one of the target applications for d64.

`-` causes text areas to line wrap, so that is out.

`'*()` are all significant in bash.

that leaves just `.`
It feels weird to use `.` as a value, but all the other choices have been eliminated.

d64 does not have base64 style padding at the end, (there are no suitable characters left, anyway)
the string length mod 4 a d64 string encodes is always 2, 3, or 0. If the length % 4 is 1,
that means there is 6 bits overhanging which is invalid.

for characters which overhang the byte array, (i.e. the last character if length % 4 == 2 or 3)
the overhanging portion must encode 0 bits.

`if length % 4 == 2` then 4 bits overhang, the valid characters are: `.FVK`
`if length % 4 == 3` then 2 bits overhang, and the valid characters are: `.37BFJNRVZcgkosw`

``` js
var overhang2bits = chars.split('').filter(function (_, i) { return !(i&0xf) }).join('')
// ==> .FVK
var overhang4bits = chars.split('').filter(function (_, i) { return !(i&0x3) }).join('')
// ==> .37BFJNRVZcgkosw
```
Although everything is for a reason and carefully described, that doesn't mean inventing
your own encoding isn't a douchebag thing to do, but hey - everyone else does it!

