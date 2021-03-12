const cp = require('child_process');

//Vi bruger spawnSync to at kommunikere med c-programmet (child process)
const { stdout, stderr} = cp.spawnSync('alfa.exe', ['getmatch']);

const dataJSON = stdout.toString() //output om til string
data = JSON.parse(dataJSON) //laver stringoutput om til datajson
console.log(data[0].Username) //printer

