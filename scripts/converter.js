// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports = (file, fileLocation =`${require('electron').remote.getGlobal('loaded').path}\\${require('electron').remote.getGlobal('loaded').file}`) =>{
client = {}
require('./functions')(client)
let save = client.readLocalFile(fileLocation)
let version = parseFloat(save.exists.version)
console.log(save,file,fileLocation,version)
if(!version) return new Error('Error reading version!')
convertSave(save, version)
}
function convertSave(save, version) {
  if(version <= 6.1) return convert5(save)
  if(version >= 6.2 && version < 6.4) convert62(save)
  if(version >= 6.4) convert64(save)
}

function convert5(save) {
console.log('5')
console.log(client.parse_island(save))
}

function convert62(save) {
console.log('6.2')
let iisland = save.player.data.split(' ')
for (i = 0; i < 8; i++) {
    iisland.shift()
  }
  console.log(iisland)
console.log(client.parse_island(iisland, null, true))
}

function convert64(save) {
console.log('6.4')
let iisland = save.player.data.split(' ')
for (i = 0; i < 9; i++) {
    iisland.shift()
  }
  console.log(iisland)
console.log(client.parse_island(iisland, null, true))
}