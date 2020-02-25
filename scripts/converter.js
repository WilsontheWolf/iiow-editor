// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports = (fileLocation = require('electron').remote.getGlobal('loaded').file) => {
  client = {}
  require('./functions')(client)
  let save = client.readLocalFile(fileLocation)
  let version
  let exists = true
  if (!save.exists || !save.exists.version) {
    if (!save.version) exists = false
  }
  if (!exists) return
  version = save.exists ? parseFloat(save.exists.version) : parseFloat(save.version.game)
  if (!version) return new Error('Error reading version!')
  return convertSave(save, version)
}
function convertSave(save, version) {
  if (version <= 6.1) return convert5(save)
  if (version >= 6.2 && version < 7.4) return convert62(save)
  if (version >= 7.4) return convert74(save)
}

function convert5(save) {
  let island = client.parse_island(save)
  let resources = []
  save.resources.resources.split(" ").forEach(r => {
    if (r) resources.push(parseFloat(r))
  })
  let inventory = save.inventory
  let realm = { v: 5, data: save.map.map, realm: parseInt(save.map.map.split(' ')[0]) + 1 }
  return {
    island: island,
    resources: resources,
    inventory: inventory,
    realm: realm,
    version: parseFloat(save.exists.version)
  }
}

function convert62(save) {
  let island = save.player.data.split(' ')
  let extra = []
  let max = 8
  let version = parseFloat(save.exists.version)
  if (version >= 6.4 && version < 7) max = 9
  if (version >= 7 && version < 7.2) {
    max = 7
    extra.push('0')
    extra.push('0')
  }
  if (version >= 7.2) {
    max = 8
    extra.push('0')
    extra.push('0')
  }
  for (i = 0; i < max; i++) {
    extra.push(island.shift())
  }
  if (version < 6.4) extra.push("0")
  island = client.parse_island(island, null, true, version)
  fIsland = client.parse_islandId(island, version)
  if (fIsland) island = fIsland
  island.extra = extra
  let resources = []
  save.resources.resources.split(" ").forEach(r => {
    if (r) resources.push(parseFloat(r))
  })
  let realm = { v: version, data: save.realm, realm: 1 }
  let inventory = save.inventory
  inventory.inventory = client.parse_inv(inventory.inventory, version)
  return {
    island: island,
    resources: resources,
    inventory: inventory,
    realm: realm,
    version: version
  }
}

function convert74(save) {
  let island = save.player.data.split(' ')
  let extra = []
  let max = 8
  let version = parseFloat(save.version.game)
  if (version >= 7.5) {
    max = island.indexOf('&')
    island.splice(max, 1)
  }
  for (i = 0; i < max; i++) {
    extra.push(island.shift())
  }
  island = client.parse_island(island, null, true, version)
  fIsland = client.parse_islandId(island, version, save.map)
  if (fIsland) island = fIsland
  island.extra = extra
  let resources = []
  if (save.resources) {
    save.resources.resources.split(" ").forEach(r => {
      if (r) resources.push(parseFloat(r))
    })
  }
  else if (save.game.resources) {
    save.game.resources.split(" ").forEach(r => {
      if (r) resources.push(parseFloat(r))
    })
  }
  else {
    resources = [parseFloat(save.game.money), null, null]
  }
  let realm = { v: version, data: save.realm, realm: 1 }
  let inventory = save.inventory
  inventory.inventory = client.parse_inv(inventory.inventory, version)
  return {
    island: island,
    resources: resources,
    inventory: inventory,
    realm: realm,
    version: version,
    ids: save.map
  }
}