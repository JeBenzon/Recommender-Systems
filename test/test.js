const request = require("supertest");
const functions = require('../src/functions')
const app = require('../src/app')

//Jest
test('Getmatch user 2 giver rigtige output', () => {
    expect(functions.sendConsoleCommand('alfa.exe', 'getmatch2 2')).toMatch(/8 3 17/)
})

test('TextToJSON giver et korrekt output', () => {
    let string = '{"id": 18, "username": "Erik","email": "email@hotmail.com","password": "123"}'
    let falseString = 'False string'
    const object = functions.textToJSON(string)
    const object2 = functions.textToJSON(falseString)
    //expect(typeof object2.id).toBe('number')
    // string
    expect(object2).toBe(false)
    expect(typeof object.username).toBe('string')
    expect(typeof object.email).toBe('string')
    expect(typeof object.password).toBe('string')
})

test('getUserCheck finder bruger fra id', () => {

    expect(functions.getUserCheck(18)).toBeTruthy();
})

test('getUser finder bruger fra id eller username', () => {

    expect(functions.getUserAccounts(7, null)).toBeTruthy()
    expect(functions.getUserAccounts(null, 'Tommy')).toBeTruthy()
    expect(functions.getUserAccounts(null, 'Oscar')).toBeTruthy()
    expect(functions.getUserAccounts(null, 'Jonathan')).toBeTruthy()
    // Tester kun id.
    expect(functions.getUserAccounts(3, 'dsadsads321312321sad')).toBeTruthy()
    expect(functions.getUserAccounts(1, 'Tommy')).toBeTruthy()

})

test('userInterestCheck finder bruger fra id eller username', () => {

    expect(functions.accountInfoCheck(7)).toBeTruthy()
    expect(functions.accountInfoCheck(1)).toBeTruthy()
    expect(functions.accountInfoCheck(4)).toBeTruthy()
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

//Supertest
describe("Test the root path", () => {
    test("It should response the GET method", () => {
        return request("localhost:3000")
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe("Test that we get redirected, when not logged in", () => {
    test("It should response the GET method", () => {
        return request("localhost:3000")
            .get("/createaccinfo")
            .then(response => {
                expect(response.statusCode).toBe(302);
            });
    });
});

describe("Test the 404 page", () => {
    test("It should response the GET method", () => {
        return request("localhost:3000")
            .get("/404")
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe("Test the register page", () => {
    test("It should response the GET method", () => {
        return request("localhost:3000")
            .get("/register")
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe("Test matchfound redirect when not logged in", () => {
    test("It should response the GET method", () => {
        return request("localhost:3000")
            .get("/matchfound")
            .then(response => {
                expect(response.statusCode).toBe(302);
            });
    });
});
