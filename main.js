const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const api = require('./api_resolver');

let mainWindow;

// listen for app to be ready
app.on('ready', function(){

    // create a new window
    mainWindow = new BrowserWindow({
        width : 600,
        height : 150,
        resizable : false
    });

    // load the html file
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, "mainWindow.html"),
        protocol : "file:",
        slashes : true
    }));


    // api.api_market_summaries(function(data){
    //     console.log(data);
    // }, function(err){
    //     console.log(err);
    // })

    // api.api_orderbook_bid("BTC-LTC",
    // function(data){
    //     console.log(data);
    // },
    // function(err){
    //     console.log(err);
    // });

    // api.api_orderbook_ask("BTC-LTC",
    // function(data){
    //     console.log(data);
    // },
    // function(err){
    //     console.log(err);
    // });

    api.api_markets(function(data){
        console.log(data);
    },
    function(err){
        console.log(err);
    });

    let templateMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(templateMenu);
});

ipcMain.on("go:calculate", function(evt, percentage, tabs, min)
{
    console.log(percentage + " " + tabs + " " + min);
})

const menuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label : 'Clear Fields',
                click(){
                    console.log("Clear fields called");
                    mainWindow.webContents.send('clear:fields');
                }
            },
            {
                label : 'Exit',
                click()
                {
                    app.exit();
                }
            }
            // ,
            // {
            //     label: "Toggle Dev Tools",
            //     accelerator : process.platform == "darwin" ? "Command+D" : "Ctrl+D",
            //     click(item, focusedWindow)
            //     {
            //         focusedWindow.toggleDevTools();
            //     }
            // }
        ]
    }
];