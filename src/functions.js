const cp = require('child_process');


//gir command og får string output ud.
function sendConsoleCommand(programPath, parameters){
    let par = parameters.split(" ");
    const {stdout, stderr} = cp.spawnSync(programPath, [par[0], par[1]]);
    return stdout.toString()
}

//function der tager string output og laver til json
function textToJSON(text){
    let data = JSON.parse(text)
    return data
}

//console.log(textToJSON(sendConsoleCommand('alfa.exe', 'getmatch 2'))[0].Username)

//Module export
module.exports = {
    sendConsoleCommand,
    textToJSON
}

