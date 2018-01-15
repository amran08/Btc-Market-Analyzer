const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

const api = require('./api_resolver');

let mainWindow;

// listen for app to be ready
app.on('ready', function(){

    // create a new window
    mainWindow = new BrowserWindow({
        width : 600,
        height : 150,
        // resizable : false
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
    })


});
