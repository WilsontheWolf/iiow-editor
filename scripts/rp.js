module.exports = (stuff) => {
    let renderer = require('electron').ipcRenderer
    renderer.send('rpc', stuff)
}