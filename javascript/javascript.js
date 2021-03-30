//this file is a test file

const fs = require('fs');

class User {
    constructor(id, name, gender, dog, triangle, football, red, yellow, green, blue, spaghetti, pizza, pearson){
        this.id = id,
        this.name = name,
        this.gender = gender,
        this.dog = dog,
        this.triangle = triangle,
        this.football = football,
        this.red = red,
        this.yellow = yellow,
        this.green = green,
        this.blue = blue,
        this.spaghetti = spaghetti,
        this.pizza = pizza,
        this.pearson = pearson
    }

    userExsist(identifyer){
            if(identifyer == id){
                return true;
            }
        return false;
    }
}


let Users = [];
Users[0] = new User(1, "Jonathan", "m")
Users[1] = new User(2, "Pelle", "m")
Users[2] = new User(3, "Frederik", "m")

/*
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    console.log(data.toString());
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

readFile('test.txt')*/

fs.readFile('test.txt', 'utf-8', (err, data) => { 
    if (err) throw err; 
  
    // Converting Raw Buffer to text 
    // data using tostring function. 
    console.log(data);
})