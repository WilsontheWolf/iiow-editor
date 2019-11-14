document.write(`
<html>
    <head>
      
        <style>
        body {
            padding: 0px;
            margin: 0px;
            background-color: #36393f;
            color: white;
        }
        
                #title-bar {
                -webkit-app-region: drag;
                height: 20px;
                text-align: center;
                line-height: 20px;
                vertical-align: middle;
                background-color: #202124;
                padding: none;
                margin: 0px;
                position: fixed;
                left: 0px;
                top: 0px;
                width: 100%;
            }

            #title {
                position: fixed;
                top: 0px;
                left: 20px;
                color:white;

            }

            button {
                color: white;
                background-color: transparent;
                border-color: transparent;
            }

            button:hover { filter: brightness(85%); }

            button.nohover:hover { filter: brightness(100%); }

            button.title-bar-btns {
                top: 0px;
                position: fixed;
                width: 20px;
                height: 20px;
                color: white;
                background-color: #202124;
                border-color: transparent;
                -webkit-app-region: no-drag;
            }
            textarea {
                color: white;
                background-color: #36393f;
                border-color: #202124;
            }
            select {
                color: white;
                background-color: #36393f;
                border-color: #202124; 
            }
            select:disabled {
                color: white;
                background-color: #202124;
                border-color: #202124;
            }
        </style>
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