function test(arr) {
  return arr.filter((i, idx) => arr.findIndex((_i) => _i === i) === idx)
}
