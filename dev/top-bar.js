document.write(`
<html>
    <head>
      
    <link rel="stylesheet" href="../styles/main.css">
    </head>
    <body>
        <div id="title-bar">
             <div id="title">
                 <span style="vertical-align: top;"><img src="../assets/icon.png" style="width:15px;height:15px;top:2.5px;left:1px;position:fixed;"/></span>
                IIOW Save File Editor Dev Menu
             </div>
             <div id="title-bar-btns">
                  <button id="rld-btn" class="title-bar-btns" style="right: 60px;">R</button>
                  <button id="min-btn" class="title-bar-btns" style="right: 40px;">-</button>
                  <button id="max-btn" class="title-bar-btns" style="right: 20px">+</button>
                  <button id="close-btn" class="title-bar-btns" style="right: 0px;">x</button>
             </div>
        </div>

        <script>
        (function () {
            // Retrieve remote BrowserWindow
            const {BrowserWindow} = require('electron').remote

            function init() {
                // Minimize task
                document.getElementById("min-btn").addEventListener("click", (e) => {
                    var window = BrowserWindow.getFocusedWindow();
                    window.minimize();
                });

                // Maximize window
                document.getElementById("max-btn").addEventListener("click", (e) => {
                    var window = BrowserWindow.getFocusedWindow();
                    if(window.isMaximized()){
                        window.unmaximize();
                    }else{
                        window.maximize();
                    }
                });

                // Close app
                document.getElementById("close-btn").addEventListener("click", (e) => {
                    var window = BrowserWindow.getFocusedWindow();
                    window.close();
                });
                document.getElementById("rld-btn").addEventListener("click", (e) => {
                    var window = BrowserWindow.getFocusedWindow();
                    window.reload();
                });
            };

            document.onreadystatechange =  () => {
                if (document.readyState == "complete") {
                    init();
                }
            };
        })();
        </script>
    </body>
</html>
`)