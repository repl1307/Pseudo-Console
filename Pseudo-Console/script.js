const debug = new Console();

const testArray = [
  1, 2, 3, 4, 5, true,
  {
    testProp: 'sample property',
    anotherTestProp: 'another sample property',
  },
  "test string", "another test string",
  [['str','str','str'], 11, [7, [3,3,3], [3,3,3]]],
  [5, false, 5]
];

const testObject = {
  testProp: [ 'a', 'b', 'c'],
  anotherTestProp: [1, 2, 3],
  testString: 'test string',
  testBool: false,
  testNum: 8
};

//sample output
function samples(){
  debug.log('Outputting Samples...')
  setTimeout(() => debug.log(testArray), 1000);
  setTimeout(() => debug.log(testObject), 2000);
  setTimeout(() => debug.warn('This is a sample warning!'), 3000);
  setTimeout(() => debug.error('Uh oh! Error!'), 4000);
  setTimeout(() => debug.log(7 * 9 + 100), 5000);
  setTimeout(() => debug.log(7 * 9 == 55), 6000);
}
//loading samples
function loadingSamples(){
  let bigObj = {};
  for(let i = 0; i < 500; i++){
    bigObj['test'+i] = i;
  }
  setTimeout(() => debug.log({a: bigObj, b: bigObj}), 1000);
  setTimeout(() => debug.log([bigObj, bigObj, bigObj]), 2000);
}
//instructions
debug.log(
`
Commands:
    - clear()
    - log()
    - error()
    - warn()
    - Right click a log to copy the text
    - samples() to show samples
    - loadingSamples() to show large sized samples
`);


