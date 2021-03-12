const cp = require('child_process');

//Vi bruger spawnSync to at kommunikere med c-programmet (child process)
const { stdout, stderr} = cp.spawnSync('alfainport.exe getmatch');

console.log(stdout.toString())
/*
const dataJSON = stdout.toString() //output om til string
data = JSON.parse(dataJSON) //laver stringoutput om til datajson
console.log(data[0].Username) //printer
*/


/*const cp = require('child_process');

//gir command og får string output ud.
function sendConsoleCommand(programPath, parameters){
    const {stdout, stderr} = cp.spawnSync(programPath, [parameters]);
    return stdout.toString()
}

//function der tager string output og laver til json
function textToJSON(text){
    let data = JSON.parse(text)
    return data
}




//textToJSON(sendConsoleCommand('alfainport.exe', 'test'))

console.log(textToJSON(sendConsoleCommand('.\\alfainport', 'getmatch 2'))[0].Username)



//Module export
module.exports = {
    sendConsoleCommand,
    textToJSON
}
*/
