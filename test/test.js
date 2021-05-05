const request = require("supertest");
const functions = require('../src/functions')
const app = require('../src/app')

//TEXT TO JSON tests
//Normal 1
test('Normal 1: TextToJSON giver et korrekt output for username 1', () => {
    let string = '{"id": 18, "username": "Erik","email": "email@hotmail.com","password": "123"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})
//Normal 2
test('Normal 2: TextToJSON giver et korrekt output for username 2', () => {
    let string = '{"id": 7, "username": "Pelle","email": "pelle@hotmail.com","password": "1777cb27"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})

//Extreme 1
test('Extreme 1: TextToJSON giver et korrekt output for username 3', () => {
    let string = '{"id": 1893, "username": "MADs-HENRIK-Petersen", "email": "Mads-Henrik-Petersen@hotmailhotmailmtail@123123.com", "password": "123781auwhduahw..--1!"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})
//Extreme 2
test('Extreme 2: TextToJSON giver et korrekt output for username 4', () => {
    let string = '{"id": 3929, "username": "ErikEmil--Petersen", "email": "Petersen2992...jawijda38@gmaillllll..com","password": "jidaj83jn2..291!!m93__m"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})
//Exceptional 1
test('Extreme 1: TextToJSON giver et korrekt output for username 3', () => {
    let string = '{"id": 183882293, "username": "MADs-HENRIK-Petersen.admi() i2jj( )#))U¤ ju", "email": "Mads-Henrik-Petersen@hotmailhotmailmtail@123123.com", "password": "123781aud iadmi2 k)((#whduahw.  mimd j3 (()).--1!"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})
//Exceptional 2
test('Exceptional 2: TextToJSON giver et korrekt output for username 6', () => {
    let string = '{"id": 18883377392, "username": "ErikEmil!!Petersen..--MadsKarlOscarPelllllee--..?", "email": "du7awdawd99938817737..-_:Æ!   iojd.@gmaillllll.....co0i2h.com","password": "!!!..dju2i  okdi2 __,,d !!"}'
    const object = functions.textToJSON(string)
    expect(typeof object.username).toBe('string')
})

//GetUserCheck
//Normal 1
test('Normal 1: getUserCheck finder bruger fra id 1', () => {

    expect(functions.getUserCheck(5)).toBeTruthy();
})
//Normal 2
test('Normal 2: getUserCheck finder bruger fra id 2', () => {

    expect(functions.getUserCheck(12)).toBeTruthy();
})
//Extreme 1
test('Extreme 1: getUserCheck finder bruger fra id 3', () => {

    expect(functions.getUserCheck(67)).toBeTruthy();
})
//Extreme 2
test('Extreme 2: getUserCheck finder bruger fra id 4', () => {

    expect(functions.getUserCheck(125)).toBeTruthy();
})
//Exceptional 1
test('Exceptional 1: getUserCheck finder bruger fra id 5', () => {

    expect(functions.getUserCheck(283477)).toBeTruthy();
})
//Exceptional 2
test('Exceptional 2: getUserCheck finder bruger fra id 6', () => {

    expect(functions.getUserCheck(289482)).toBeTruthy();
})


//getUserAccounts
//normal 1
test('Normal 1: getUserAccounts finder bruger fra id eller username 1', () => {
    expect(functions.getUserAccounts(7, null)).toStrictEqual({
        "id": 7,
        "username": "Gitte",
        "email": "email@mail.dk",
        "password": "123"
      })
})
//normal 2
test('Normal 2: getUserAccounts finder bruger fra id eller username 2', () => {
    expect(functions.getUserAccounts(12, null)).toStrictEqual({
        "id": 12,
        "username": "Vigga",
        "email": "email@mail.dk",
        "password": "123"
      })
})
//Extreme 1
test('Extreme 1: getUserAccounts finder bruger fra id eller username 3', () => {
    expect(functions.getUserAccounts(728, null)).toStrictEqual({
        "id": 728,
        "username": "Viggo-Michael",
        "email": "Viggo-Michael@@xujdw0292.com",
        "password": "hdyau72..2o1n--½!!93kd"
      })
})
//Extreme 2
test('Extreme 2: getUserAccounts finder bruger fra id eller username 4', () => {
    expect(functions.getUserAccounts(1728, null)).toStrictEqual({
        "id": 1728,
        "username": "MadsPetersen---JU288j",
        "email": "Mads Petersen@jdauj____m3333duaw.com)!",
        "password": " wandjan ajwndui228(U!/Hn873hn7/H(!? smim"
      })
})
//Exceptional 1
test('Exceptional 1: getUserAccounts finder bruger fra id eller username 5', () => {
    expect(functions.getUserAccounts(172299, null)).toStrictEqual({
        "id": 172299,
        "username": "Viggo-nye2983838::juMichael",
        "email": "Viggo-Michael@@xujawudjuadw0292.com",
        "password": "hdyau72..2o1n--½!!93kd"
      })
})
//Exceptional 2
test('Exceptional 2: getUserAccounts finder bruger fra id eller username 6', () => {
    expect(functions.getUserAccounts(177763, null)).toStrictEqual({
        "id": 177763,
        "username": "Mads 83e8  u33888 Petersen haha",
        "email": "Mads Petersen@jdaujduaw!!  !J8jd.com22m  i0K!)!",
        "password": " wandjan ajwndui228(U!/Hn873hn7/H(!? smim"
      })
})

//AccountInfoCheck
//Normal 1
test('Normal 1: AccountInfoCheck finder bruger fra id eller username 1', () => {
    expect(functions.accountInfoCheck(4)).toBeTruthy()
})
//Normal 2
test('Normal 2: AccountInfoCheck finder bruger fra id eller username 2', () => {
    expect(functions.accountInfoCheck(12)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: AccountInfoCheck finder bruger fra id eller username 3', () => {
    expect(functions.accountInfoCheck(167)).toBeTruthy()
})
//Extreme 2
test('Extreme 2: AccountInfoCheck finder bruger fra id eller username 4', () => {
    expect(functions.accountInfoCheck(443)).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: AccountInfoCheck finder bruger fra id eller username 5', () => {
    expect(functions.accountInfoCheck(290393929999)).toBeTruthy()
})
//Exceptional 2
test('Exceptional 2: AccountInfoCheck finder bruger fra id eller username 6', () => {
    expect(functions.accountInfoCheck(382883884929)).toBeTruthy()
})

//getData
//Normal 1
test('Normal 1: getData Læser fra fil og giver output 1', () => {
    expect(typeof functions.getData('users.txt')).toBe('string')
})
//Normal 2
test('Normal 2: getData Læser fra fil og giver output 2', () => {
    expect(typeof functions.getData('users_account.json')).toBe('string')
})


//getLastUserId
//Normal 1
test('Normal 1: getLastUserId Sidste id er større end 8 1', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(8);
    expect(typeof functions.getLastUserId()).toBe('number')
})
//Normal 2
test('Normal 2: getLastUserId Sidste id er større end 15 2', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(15);
    expect(typeof functions.getLastUserId()).toBe('number')
})
//Extreme 1
test('Extreme 1: getLastUserId Sidste id er større end 415 3', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(415);
    expect(typeof functions.getLastUserId()).toBe('number')
})
//Extreme 2
test('Extreme 2: getLastUserId Sidste id er større end 1822 4', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(1822);
    expect(typeof functions.getLastUserId()).toBe('number')
})
//Exceptional 1
test('Exceptional 1: getLastUserId Sidste id er større end 178492 5', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(178492);
    expect(typeof functions.getLastUserId()).toBe('number')
})
//Exceptional 2
test('Exceptional 2: getLastUserId Sidste id er større end 273897 6', () => {
    expect(functions.getLastUserId()).toBeGreaterThan(273897);
    expect(typeof functions.getLastUserId()).toBe('number')
})

//addUser
//Normal 1
test('Normal 1: addUser tilføjer user til fil 1', () => {
    expect(functions.addUser(172, 'Nybruger1', 'email1@email.com', '123456')).toBeTruthy()
})
//Normal 2
test('Normal 2: addUser tilføjer user til fil 2', () => {
    expect(functions.addUser(289, 'Nybruger2', 'email2@email.com', '123456')).toBeTruthy()
})
//Extreme 1
test('Extreme 1: addUser tilføjer user til fil 3', () => {
    expect(functions.addUser(18282, 'Nybruger3.--ij2iniam', 'email33JID2Ø-Quu@ema2QEIQil.com', '2JIQI-_9)u/"((JD')).toBeTruthy()
})
//Extreme 2
test('Extreme 2: addUser tilføjer user til fil 4', () => {
    expect(functions.addUser(928928, 'Nybruger4.--ijDAOKniajdam', ',DMUANDA IJJui38IU#Uail.com', 'E82(u(j" 8=i)0U?')).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: addUser tilføjer user til fil 5', () => {
    expect(functions.addUser(18282, 'Nybruger3.--ij239 39 4¤¤iniajdam', 'email33Jm9393 772 h/)¤¤ID2Ø-Quu@ema2QEIQil.com', '2JIQI-_9)   w_u/"((JD')).toBeTruthy()
})
//Exceptional 2
test('Exceptional 2: addUser tilføjer user til fil 6', () => {
    expect(functions.addUser(928928, 'Nybruger4.--ijDAOKD  IIM)#=") 2iniajdam', ',DMUANDA IJJI))((#@emAWMDKAWI  II22  22) =ail.com', 'E82 (u(j" 8=i)0  U?')).toBeTruthy()
})


//createAccInfo
//Normal 1
test('Normal 1: createAccInfo registrerer user info 1', () => {
    let parametre = ['Magnus', 18, 'm', 5, 2, 10, 2, 2, 3, 6, 2, 8]
    expect(functions.createAccInfo(183, parametre)).toBeTruthy()
})
//Normal 2
test('Normal 2: createAccInfo registrerer user info 2', () => {
    let parametre = ['Katrine', 22, 'f', 9, 2, 4, 5, 1, 2, 1, 6, 9]
    expect(functions.createAccInfo(281, parametre)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: createAccInfo registrerer user info 3', () => {
    let parametre = ['Aben-Emil-bobbemand-Per', 238, 'f', 1, 2, 5, 1, 1, 1, 6, 1, 9]
    expect(functions.createAccInfo(2991, parametre)).toBeFalsy()
})
//Extreme 2
test('Extreme 2: createAccInfo registrerer user info 4', () => {
    let parametre = ['Katjakaj og Bentebent --j28', 812, '12', 9, 2, 1, 0, 2, 2, 1, 2, 1]
    expect(functions.createAccInfo(38289, parametre)).toBeFalsy()
})

//Exceptional 1
test('Exceptional 1: createAccInfo registrerer user info 5', () => {
    let parametre = ['Aben-Emil-bobbe290290317777 8292mand-Per', 2848289, 'f', 1, 2, 5, 11, 21, 31, 16, 12, 99]
    expect(functions.createAccInfo(2991, parametre)).toBeFalsy()
})
//Exceptional 2
test('Exceptional 2: createAccInfo registrerer user info 6', () => {
    let parametre = ['Katjakaj og3io299238 389Bentebent --j28', 9179379, '12', 920, 2222, 12, 0, 29, 8282, 1, 22, 21]
    expect(functions.createAccInfo(38289, parametre)).toBeFalsy()
})


//checkChat
//Normal 1
test('Normal 1: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 1', () =>{
    let user_id1 = ['2']
    let user_id2 = ['3']
    expect(functions.checkChat(user_id1, user_id2)).toBeTruthy()
})
//Normal 2
test('Normal 2: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 2', () =>{
    let user_id1 = ['2']
    let user_id2 = ['4']
    expect(functions.checkChat(user_id1, user_id2)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 3', () =>{
    let user_id1 = ['2']
    let user_id2 = ['19']
    expect(functions.checkChat(user_id1, user_id2)).toBeTruthy()
})
//Extreme 2
test('Extreme 2: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 4', () =>{
    let user_id1 = ['19']
    let user_id2 = ['32']
    expect(functions.checkChat(user_id1, user_id2)).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 5', () =>{
    let user_id1 = ['48']
    let user_id2 = ['122']
    expect(functions.checkChat(user_id1, user_id2)).toBeFalsy()
})
//Exceptional 2
test('Exceptional 2: checkChat tjekker om 2 brugere har et chatroom, og returnerer roomid hvis de har 6', () =>{
    let user_id1 = ['2893']
    let user_id2 = ['38998']
    expect(functions.checkChat(user_id1, user_id2)).toBeFalsy()
})


//getRoomConnection
//Normal 1
test('Normal 1: getRoomConnection opretter et objekt og sender det retur baseret på et id 1', () => {
    let id = 1618990222358
    expect(functions.getRoomConnection(id)).toBeTruthy()
})
//Normal 2:
test('Normal 2: getRoomConnection opretter et objekt og sender det retur baseret på et id 2', () => {
    let id = 1619163628777
    expect(functions.getRoomConnection(id)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: getRoomConnection opretter et objekt og sender det retur baseret på et id 3', () => {
    let id = 1619163635523
    expect(functions.getRoomConnection(id)).toBeTruthy()
})
//Extreme 2:
test('Extreme 2: getRoomConnection opretter et objekt og sender det retur baseret på et id 4', () => {
    let id = 1619163650124
    expect(functions.getRoomConnection(id)).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: getRoomConnection opretter et objekt og sender det retur baseret på et id 5', () => {
    let id = 2839128391280
    expect(functions.getRoomConnection(id)).toBeFalsy()
})
//Exceptional 2:
test('Exceptional 2: getRoomConnection opretter et objekt og sender det retur baseret på et id 6', () => {
    let id = 192389101002202
    expect(functions.getRoomConnection(id)).toBeFalsy()
})


//getChat
//Normal 1
test('Normal 1: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 1', () => {
    let id = 1619163628777
    expect(functions.getChat(id)).toBeTruthy()
})
//Normal 2
test('Normal 2: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 2', () => {
    let id = 1618990222358
    expect(functions.getChat(id)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 3', () => {
    let id = 1618990209920
    expect(functions.getChat(id)).toBeTruthy()
})
//Extreme 2
test('Extreme 2: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 4', () => {
    let id = 1619163650124
    expect(functions.getChat(id)).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 5', () => {
    let id = 16726763767267
    expect(functions.getChat(id)).toBeFalsy()
})
//Exceptional 2
test('Exceptional 2: getChat tager et roomid som input og returnerer chatbeskederne fra rummet, som den finder i room-filerne 6', () => {
    let id = 18287387872878
    expect(functions.getChat(id)).toBeFalsy()
})


//makeFirstChat
//Normal 1
test('Normal 1: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 1', () => {
    let user_id1 = 1
    let user_id2 = 5
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})
//Normal 2
test('Normal 2: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 2', () => {
    let user_id1 = 2
    let user_id2 = 6
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 3', () => {
    let user_id1 = 12
    let user_id2 = 17
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})
//Extreme 2
test('Extreme 2: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 4', () => {
    let user_id1 = 19
    let user_id2 = 12
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})
//Exceptional 1
test('Exceptional 1: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 5', () => {
    let user_id1 = 228
    let user_id2 = 1782
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})
//Exceptional 2
test('Exceptional 2: makeFirstChat opretter room i roomconnections filen og laver en fil for sig selv 6', () => {
    let user_id1 = 1902
    let user_id2 = 215
    expect(functions.makeFirstChat(user_id1, user_id2)).toBeTruthy()
})



//saveChat
//Normal 1
test('Normal 1: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 1', () => {
    let id = 1619163628777
    let u_id1 = 2
    let u_id2 = 4
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeTruthy()
})
//Normal 2
test('Normal 2: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 2', () => {
    let id = 1619163650124
    let u_id1 = 19
    let u_id2 = 32
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeTruthy()
})
//Extreme 1
test('Extreme 1: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 3', () => {
    let id = 1619168122676
    let u_id1 = 12226
    let u_id2 = 22389
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeTruthy()
})
//Extreme 2
test('Extreme 2: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 4', () => {
    let id = 1619168373547
    let u_id1 = 262982
    let u_id2 = 3428992
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeTruthy()
})

//Exceptional 1
test('Exceptional 1: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 5', () => {
    let id = 1619168373624
    let u_id1 = 352892829
    let u_id2 = 36029022828922
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeFalsy()
})
//Exceptional 2
test('Exceptional 2: saveChat gemmer chatbeskederne og opretter rum, hvis det ikke findes 6', () => {
    let id = 1619168526193
    let u_id1 = 1892
    let u_id2 = -222
    let u_name = "Oscar"
    let u_message = "hej bro"
    expect(functions.saveChat(id, u_id1, u_id2, u_name, u_message)).toBeFalsy()
})


