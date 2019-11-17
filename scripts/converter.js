// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports = (file, fileLocation =`${require('electron').remote.getGlobal('loaded').path}\\${require('electron').remote.getGlobal('loaded').file}`) =>{
client = {}
require('./functions')(client)
let save = client.readLocalFile(fileLocation)
console.log(save,file,fileLocation)
let version = parseFloat(save.exists.version)
if(!version) return new Error('Error reading version!')
convertSave(save, version)
}
function convertSave(save, version) {
  if(version <= 5) return convert5(save)
  
}

function convert5(save) {

}