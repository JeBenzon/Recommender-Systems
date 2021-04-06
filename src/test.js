const functions = require('./functions')

function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});


test('Sidste id er større end 15', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(15);
});
test('Sidste id er større end 30', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(30);
});

test('Getmatch user 2 giver rigtige output', () => {
    expect(functions.sendConsoleCommand('alfa.exe', 'getmatch2 2')).toMatch(/8 3 17/)
})

/*
https://jestjs.io/docs/expect#tomatchobjectobject
test('onPress gets called with the right thing', () => {
  const onPress = jest.fn();
  simulatePresses(onPress);
  expect(onPress).toBeCalledWith(
    expect.objectContaining({
      x: expect.any(Number),
      y: expect.any(Number),
    }),
  );
});

*/