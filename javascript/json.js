//This file is not used in the express server

const fs = require('fs')
//const book = {
//    title: 'Bogtitle',
//    auther: 'authername'
//}
//Make json
//const bookJSON = JSON.stringify(book)
//console.log(bookJSON)

//Json parse back to object
//const parsedData = JSON.parse(bookJSON)
//console.log(parsedData.title)

//SAVE
//fs.writeFileSync('test3.json', bookJSON);

//LOAD
const dataBuffer = fs.readFileSync('test3.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)
console.log(data[1].title)