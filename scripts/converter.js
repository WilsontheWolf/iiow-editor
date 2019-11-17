// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports = () =>{
  client = {}
  let fileLocation =`${require('electron').remote.getGlobal('loaded').path}\\${require('electron').remote.getGlobal('loaded').file}`
  require('./functions')(client)
  let save = client.readLocalFile(fileLocation)
  let version = parseFloat(save.exists.version)
  if(!version) return new Error('Error reading version!')
  return convertSave(save, version)
  }
  function convertSave(save, version) {
    if(version <= 6.1) return convert5(save)
    if(version >= 6.2 && version < 6.4) return convert62(save)
    if(version >= 6.4) return convert64(save)
  }
  
  function convert5(save) {
  console.log('5')
  let island = client.parse_island(save)
  let resources = []
  save.resources.resources.split(" ").forEach(r => {
    if(r) resources.push(parseFloat(r))
  })
  let inventory = save.inventory
  let realm = {v: 5, data: save.map.map, realm: parseInt(save.map.map.split(' ')[0])+1}
  return {
    island:island,
    resources:resources,
    inventory:inventory,
    realm:realm,
    version:parseFloat(save.exists.version)
  }
  }
  
  function convert62(save) {
  console.log('6.2')
  let island = save.player.data.split(' ')
  let extra = []
  for (i = 0; i < 8; i++) {
      extra.push(island.shift())
    }
    extra.push("0")
    island = client.parse_island(island, null, true)
    island = client.parse_islandId(island, parseFloat(save.exists.version))
    island.extra = extra
    let resources = []
  save.resources.resources.split(" ").forEach(r => {
    if(r) resources.push(parseFloat(r))
  })
  let realm = {v: parseFloat(save.exists.version), data: save.realm, realm:1}
  let inventory = save.inventory
  return {
    island:island,
    resources:resources,
    inventory:inventory,
    realm:realm,
    version:parseFloat(save.exists.version)
  }
  }
  
  function convert64(save) {
    console.log('6.4')
    let iisland = save.player.data.split(' ')
    let extra = []
    for (i = 0; i < 9; i++) {
      extra.push(iisland.shift())
    }
    let island = client.parse_island(iisland, null, true)
    island.extra = extra

  }