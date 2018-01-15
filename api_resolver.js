const https = require('https');
const MARKETS_URL = "https://bittrex.com/api/v1.1/public/getmarkets";
const MARKET_SUMMARIES_URL = "https://bittrex.com/api/v1.1/public/getmarketsummaries";
const MARKET_ORDERBOOK_URL = "https://bittrex.com/api/v1.1/public/getorderbook?";
var API = {};


/**
 * @param1 url - requested url of the response
 * @param2 callback - a function with a parameter. this parameter hold the response data
 * @param3 errCallback - a function with a parameter. this parameter hold the error occured
 */
API.getURLResponse = function(url, callback, errCallback)
{
    https.get(url, (resp) => {
    let data = '';
   
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
   
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      callback(data);
    });
   
  }).on("error", (err) => {
    errCallback(err);
  });
}

API.getMarkets = function(callback, errCallback)
{
    API.getURLResponse(MARKETS_URL,
                       callback,
                       errCallback);
}

API.getMarketSummaries = function(callback, errCallback)
{
    API.getURLResponse(MARKET_SUMMARIES_URL,
                      callback,
                      errCallback);
}

API.getOrderBookForBid = function(marketName,
                                  callback,
                                  errCallback)
{
    API.getURLResponse(MARKET_ORDERBOOK_URL + "market="+marketName+"&type=buy",
                       callback,
                       errCallback);
}

API.getOrderBookForAsk = function(marketName,
                                  callback,
                                  errCallback)
{
    API.getURLResponse(MARKET_ORDERBOOK_URL + "market="+marketName+"&type=sell",
    callback,
    errCallback);
}

API.getMarke



// for node to expose functionality
module.exports = {
    api_resolver: API.getURLResponse,
    api_markets : API.getMarkets,
    api_market_summaries : API.getMarketSummaries,
    api_orderbook_bid : API.getOrderBookForBid,
    api_orderbook_ask : API.getOrderBookForAsk
}
