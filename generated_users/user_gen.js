const fs = require('fs');

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function user_gen(users){
    let accObj = []
    fs.readFile('navne.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        let arrayOfNames = data.split(" ")


        for(let i = 1; i <= users; i++) {
            let User = {
                id: " ",
                name: " ",
                age: " ",
                gender: " ",
                sports: " ",
                food: " ",
                music: " ",
                movies: " ",
                drinking: " ",
                cars: " ",
                hiking: " ",
                magic: " ",
                djing: " ",

            }
            let accounts = {
                id: i,
                username: " ",
                password: "1234",
                email: "email@email.com",
            }

                let genderTypes = ["m", "f"]

                User.id = i
                User.name = arrayOfNames[Math.floor(Math.random() * arrayOfNames.length)]
                User.age = getRandomInt(18, 24)
                User.gender = genderTypes[Math.floor(Math.random() * genderTypes.length)]
                User.sports = getRandomInt(1, 11)
                User.food = getRandomInt(1, 11)
                User.music = getRandomInt(1, 11)
                User.movies = getRandomInt(1, 11)
                User.drinking = getRandomInt(1, 11)
                User.cars = getRandomInt(1, 11)
                User.hiking = getRandomInt(1, 11)
                User.magic = getRandomInt(1, 11)
                User.djing = getRandomInt(1, 11)
                accounts.username = User.name + getRandomInt(1,9999)

                fs.appendFileSync('random_user_gen.txt', User.id + " " + User.name + " " + User.age + " " + User.gender + " " + User.sports + " " + User.food + " " + User.music + " " + User.movies + " " + User.drinking + " " + User.cars + " " + User.hiking + " " + User.magic + " " + User.djing + "\n", function (err) {
                    if (err) throw err
                })
                accObj[i-1] = accounts
                //console.log(accObj)

        }
        //console.log(accObj)
        let accString = JSON.stringify(accObj,null,2)
        fs.writeFileSync('random_acc_gen.json',accString,function (err){
            if(err) throw err;
        })
    })


}
user_gen(5000)