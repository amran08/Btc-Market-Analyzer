const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const processor = require('./data_processor');

let mainWindow;
let apiKeyWindow;

NODE_ENV=production;

// listen for app to be ready
app.on('ready', function(){

    // create a new window
    mainWindow = new BrowserWindow({
        width : 800,
        height : 300,
        resizable : false
    });

    // load the html file
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, "mainWindow.html"),
        protocol : "file:",
        slashes : true
    }));

    mainWindow.on('closed', function()
    {
        app.exit();
    });

    let templateMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(templateMenu);
});

function showApiKeysWindow()
{
    // create a new window
    apiKeyWindow = new BrowserWindow({
        width: 300,
        height: 200,
    });

    // load the html file
    apiKeyWindow.loadURL(url.format({
        pathname : path.join(__dirname, "apiKeyWindow.html"),
        protocol : "file:",
        slashes : true
    }));

    apiKeyWindow.on('closed', function()
    {
        apiKeyWindow = null;
    });
}

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
                                        mainWindow.webContents.send("status", "#FEEFB3", "#9F6000", msg, true,false);
                                    }
                                    break;
                                    case processor.status_success:
                                    {
                                        mainWindow.webContents.send("status", "#DFF2BF", "#4F8A10", msg, false,true);
                                    }
                                    break;
                                    case processor.status_failed:
                                    {
                                        mainWindow.webContents.send("status", "#FFD2D2","#D8000C", msg, false,false);
                                    }
                                    break;
                                }
                            });
});

ipcMain.on("buy:bitcoin", function(e, market_name, api_end, btc_amount, order_price){
    console.log(market_name + " : " + api_end + " : " + btc_amount + "  : " + order_price);

    processor.put_buy_order(market_name, api_end, btc_amount, order_price, function(data)
    {
        console.log(data);
    },
    function(status, msg)
    {
        switch(status)
        {
            case processor.status_pending:
            {
                mainWindow.webContents.send("status", "#FEEFB3", "#9F6000", msg, true,false);
            }
            break;
            case processor.status_success:
            {
                mainWindow.webContents.send("status", "#DFF2BF", "#4F8A10", msg, false,true);
            }
            break;
            case processor.status_failed:
            {
                mainWindow.webContents.send("status", "#FFD2D2","#D8000C", msg, false,false);
            }
            break;
        }
    });
});

const menuTemplate = [
    {
        label: 'File',
        submenu:[
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