const cp = require('child_process');
const { stdout } = require('process');


//gir command og får string output ud.
function sendConsoleCommand(programPath, parameters){
    try{
        let par = parameters.split(" ");
        const {stdout, stderr} = cp.spawnSync(programPath, [par[0], par[1]]);
        return stdout.toString()
    }catch(e){
        console.log('C kommunikations fejl errorcode:' + e)
    }
}

//function der tager string output og laver til json
function textToJSON(text){
    let data = JSON.parse(text)
    return data
}

function createuser(programPath, createuser, name, age, gender, dog, triangle, football, red, yellow, green, blue, spaghetti, pizza){
    try{
        cp.exec(`${programPath} ${createuser} ${name} ${age} ${gender} ${dog} ${triangle} ${football} ${red} ${yellow} ${green} ${blue} ${spaghetti} ${pizza}`, (err, stdout, stderr) => {
            
        })
        
    }catch(e){
        console.log('C kommunikations fejl errorcode:' + e)
        return false
    }
    return true
}

//console.log(textToJSON(sendConsoleCommand('alfa.exe', 'getmatch 2'))[0].Username)

//console.log(createuser("alfa.exe", "createuser", "Jonathan", 22, "m", 1, 2, 3, 1, 4, 4, 2, 1, 2))

//Module export
module.exports = {
    sendConsoleCommand,
    textToJSON,
    createuser,
}

//Wo
/*cp.exec('alfa.exe createuser jonathan 22 m 1 2 3 1 4 4 2 1 2', (err, stdout, stderr) => {
    console.log('#1. exec')
    console.log(stdout);
});*/
