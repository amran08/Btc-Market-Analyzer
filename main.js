const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const processor = require('./data_processor');

let mainWindow;

// listen for app to be ready
app.on('ready', function(){

    // create a new window
    mainWindow = new BrowserWindow({
        width : 800,
        height : 280,
        resizable : false
    });

    // load the html file
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, "mainWindow.html"),
        protocol : "file:",
        slashes : true
    }));

    let templateMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(templateMenu);
});

ipcMain.on("process", function(e, market, api, percentage){
    console.log(market + " " + api + " " + percentage);

    processor.get_order_price(api,
                              market,
                              percentage,
                            function(order_price){
                                console.log("OrderPrice main.js " + order_price);
                                mainWindow.webContents.send("order_price", order_price);
                            },
                            function(status, msg){
                                console.log("status " + status + " " + msg);
                                switch(status)
                                {
                                    case processor.status_pending:
                                    {
                                        mainWindow.webContents.send("status", "#FEEFB3", "#9F6000", msg, true);
                                    }
                                    break;
                                    case processor.status_success:
                                    {
                                        mainWindow.webContents.send("status", "#DFF2BF", "#4F8A10", msg, false);
                                    }
                                    break;
                                    case processor.status_failed:
                                    {
                                        mainWindow.webContents.send("status", "#FFD2D2","#D8000C", msg, false);
                                    }
                                    break;
                                }
                            });
})

const menuTemplate = [
    {
        label: 'File',
        submenu:[
            // {
            //     label : 'Clear Fields',
            //     click(){
            //         console.log("Clear fields called");
            //         mainWindow.webContents.send('clear:fields');
            //     }
            // },
            {
                label : 'Exit',
                click()
                {
                    app.exit();
                }
            },

            {
                role: "reload"
            }
            ,
            {
                label: "Toggle Dev Tools",
                accelerator : process.platform == "darwin" ? "Command+D" : "Ctrl+D",
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
];