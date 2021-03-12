
//Kører et childprocces i baggrunden af programmet og vi har ikke fundet ud af hvordan vi får data'en ud af stdout og ind i main program igen.
const {exec} = require("child_process");

let data = [];

exec("alfa.exe test", (error, stdout, stderr) =>{
    const dataJSON = stdout.toString()
    data = JSON.parse(dataJSON)
});