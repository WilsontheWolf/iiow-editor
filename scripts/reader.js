// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports = (file, fileLocation =`${require('electron').remote.getGlobal('loaded').path}\\${require('electron').remote.getGlobal('loaded').file}`) =>{
client = {}
require('./functions')(client)
file.file = client.readLocalFile(fileLocation)
file.resources = file.file.resources.resources.split(' ')
file.version = parseFloat(file.file.exists.version)
file.island = file.file.island.island
console.log(file.file)

}