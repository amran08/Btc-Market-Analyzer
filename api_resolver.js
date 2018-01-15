const https = require('https');
const MARKETS_URL = "https://bittrex.com/api/v1.1/public/getmarkets";
const MARKET_SUMMARIES_URL = "https://bittrex.com/api/v1.1/public/getmarketsummaries";
const MARKET_ORDERBOOK_URL = "https://bittrex.com/api/v1.1/public/getorderbook?";
const MARKET_ORDERBOOK_URL_CRYPTOPIA = "https://www.cryptopia.co.nz/api/GetMarketOrders/";
//https://www.cryptopia.co.nz/api/GetMarketOrders/DOT_BTC
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

API.getMarketsBitrex = function(callback, errCallback)
{
    API.getURLResponse(MARKETS_URL,
                       callback,
                       errCallback);
}

API.getMarketSummariesBitrex = function(callback, errCallback)
{
    API.getURLResponse(MARKET_SUMMARIES_URL,
                      callback,
                      errCallback);
}

API.getOrderBookForBidBitrex = function(marketName,
                                  callback,
                                  errCallback)
{
    API.getURLResponse(MARKET_ORDERBOOK_URL + "market="+marketName+"&type=sell",
                       callback,
                       errCallback);
}

API.getOrderBookForAskBitrex = function(marketName,
                                  callback,
                                  errCallback)
{
    API.getURLResponse(MARKET_ORDERBOOK_URL + "market="+marketName+"&type=buy",
    callback,
    errCallback);
}

API.getOrderBookForBidCryptopia = function(marketName, callback, errCallback)
{
  API.getURLResponse(MARKET_ORDERBOOK_URL_CRYPTOPIA + marketName,
                     callback,
                    errCallback);
}



// for node to expose functionality
module.exports = {
    api_resolver: API.getURLResponseBitrex,
    api_markets_bitrex : API.getMarketsBitrex,
    api_market_summaries_bitrex : API.getMarketSummariesBitrex,
    api_orderbook_bid_bitrex : API.getOrderBookForBidBitrex,
    api_orderbook_ask_bitrex : API.getOrderBookForAskBitrex,
    api_orderbook_ask_cryptopia : API.getOrderBookForBidCryptopia
}
