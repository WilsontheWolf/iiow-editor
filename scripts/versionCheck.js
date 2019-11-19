let checker = setInterval(function(){
    let version = require('electron').remote.getGlobal('version').newest
    if(!version) return
    if(version == 'unknown') return clearInterval(checker)
    else 
    v = {version:version.version,description:version.description}
    outdater(v)
    clearInterval(checker)
}, 100);

function outdater(version) {
    let isOutdated = false
    let current = require('electron').remote.getGlobal('version').current.split('.')
        let newest = version.version.split('.')
        current.forEach((n, i) => {
            if(parseInt(n)< parseInt(newest[i]) ) isOutdated = true
        });
        if(isOutdated) outDated(version.version, version.description)
};

function outDated(newest, desc){
    body = document.getElementsByTagName('body')[0]
body.innerHTML = body.innerHTML + `
<div id="outdated">
    <span style="vertical-align: bottem;"></span>
    Version ${newest} has been released! Download it now.<br>
    ${desc}
</div>
`
}