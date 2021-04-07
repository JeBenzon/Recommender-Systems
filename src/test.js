const functions = require('./functions')

function sum(a, b) {
  return a + b;
}


test('Getmatch user 2 giver rigtige output', () => {
  expect(functions.sendConsoleCommand('alfa.exe', 'getmatch2 2')).toMatch(/8 3 17/)
})


test('TextToJSON giver et korrekt output', () => {
  let string = '{"id": 18, "username": "Erik","email": "email@hotmail.com","password": "123"}'
  const object = functions.textToJSON(string)
  // string
  expect(typeof object.id).toBe('number')
  expect(typeof object.username).toBe('string')
  expect(typeof object.email).toBe('string')
  expect(typeof object.password).toBe('string')
})

test('getUserCheck finder bruger fra id', () => {

  expect(functions.getUserCheck(18)).toBeTruthy();
})

test('getUser finder bruger fra id eller username', () => {

  expect(functions.getUser(7, null)).toBeTruthy()
  expect(functions.getUser(null, 'Tommy')).toBeTruthy()
  expect(functions.getUser(null, 'Oscar')).toBeTruthy()
  expect(functions.getUser(null, 'Jonathan')).toBeTruthy()
  // Tester kun id.
  expect(functions.getUser(3, 'dsadsads321312321sad')).toBeTruthy()
  expect(functions.getUser(1, 'Tommy')).toBeTruthy()

})

test('userInterestCheck finder bruger fra id eller username', () => {

  expect(functions.userInterestCheck(7)).toBeTruthy()
  expect(functions.userInterestCheck(1)).toBeTruthy()
  expect(functions.userInterestCheck(4)).toBeTruthy()
})

test('getData Læser fra fil og giver output', () => {

  expect(typeof functions.getData('users.txt')).toBe('string')
  expect(typeof functions.getData('users_account.json')).toBe('string')
})

test('getLastUserId Sidste id er større end 15', () => {
  expect(functions.getLastUserId()).toBeGreaterThan(15);
  expect(typeof functions.getLastUserId()).toBe('number')
});

test('addUser tilføjer user til fil', () => {
  expect(functions.addUser(222, 'username', 'email@email.com', '123456')).toBeTruthy()
});


test('createAccInfo rigistrere user info', () => {
  let parametre = ['username', 22, 'f', 1, 1, 1, 1, 1, 1, 1, 1, 1]
  expect(functions.createAccInfo(222, parametre)).toBeTruthy()
});



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



test('id should match', () => {
  const obj = {
    id: '111',
    productName: 'Jest Handbook',
    url: 'https://jesthandbook.com'
  };
  expect(obj.id).toEqual('111');
});

expect(state.active.ID).toEqual(expect.any(String))

expect(brokers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        nodeId: expect.any(Number),
        host: expect.any(String),
        port: expect.any(Number),
      }),
    ])
  )

*/