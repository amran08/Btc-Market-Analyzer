const api = require('./api_resolver');
var api_key_config = require('./config.json');

const BITTREX_API_KEY = api_key_config.bittrex_api_key;
const CRYPTOPIA_API_KEY = api_key_config.cryptopia_api_key;
const CRYPTOPIA_SECRET_KEY = api_key_config.cryptopia_api_secret;



// configuration for cryptopia
const Cryptopia = require('./cryptopia_api');
const cryptopia = new Cryptopia(CRYPTOPIA_API_KEY, CRYPTOPIA_SECRET_KEY);

// configuration for bittrex
const bittrex = require('./node.bittrex.api');
bittrex.options({ 
  'apikey' : BITTREX_API_KEY, 
  //'apisecret' : BITTREX_SECRET_KEY, 
  'stream' : false, 
  'verbose' : false, 
  'cleartext' : false 
});


const stat_pending = 1;
const stat_success = 2;
const stat_failed = 3;

var DATA_PROCESSOR = {};


DATA_PROCESSOR.getOrderPrice = function(api_end_point,
                                        market_name,
                                        percentage,
                                        callback,
                                        stat_callback)
{
    // call the stat_callback with pending
    stat_callback(stat_pending, "Please wait...");

    if(api_end_point.toLowerCase() == "cryptopia")
    {
        // call cryptopia api
        api.api_orderbook_ask_cryptopia(market_name,
        function(data)
        {
            // parse the last bid
            var obj = JSON.parse(data);
            
            if(obj.Data)
            {
                // we got some data
                var lastBid = obj.Data.Buy[0];
                var newPrice = lastBid.Price * (1 + (percentage / 100));
                var totalPrice = newPrice * lastBid.Volume;
                callback(newPrice);
                stat_callback(stat_success, "Success");
            }
            else
            {
                // no data found
                stat_callback(stat_failed, obj.Error);
            }

        },
        function(err)
        {
            stat_callback(stat_failed, "Check your interent connection");
        });
    }
    else{
        // call bitrex api
        api.api_orderbook_ask_bitrex(market_name,
        function(data){
            // parse the data
            var obj = JSON.parse(data);
            if(obj.result)
            {
                var lastBid = obj.result[0];
                var newRate = lastBid.Rate * (1 + (percentage / 100));
                var volume = lastBid.Quantity / lastBid.Rate;
                var newQuantity =  newRate * volume;
                callback(newRate);
                stat_callback(stat_success, "Success");
            }
            else
            {
                stat_callback(stat_failed, obj.message);
            }
        },
        function(err){
            stat_callback(stat_failed, "Check your internet connection");
        })

    }
}

DATA_PROCESSOR.submitOrder = async function(market_name, api_end_point, btc_amount, order_price, callback, stat_callback)
{
    stat_callback(stat_pending, "Please wait...");
    if(api_end_point.toLowerCase() == "cryptopia")
    {
        // call cryptopia end apis
        try {
            var data = await (cryptopia.SubmitTrade(market_name, null, "Buy", order_price, btc_amount));
            if(data.Success == false)
            {
                // error occured
                stat_callback(stat_failed, data.Error);
            }
            else
            {
                stat_callback(stat_success, data.Data);
            }
            
        } catch (error) {
            

           stat_callback(stat_failed,"INVALID API KEY for CRYPTOPIA")
            
        }
        
        console.log(data);
       
    }
    else{
        // call bittrex end point
        bittrex.buylimit('https://bittrex.com/api/v1.1/public/buylimit??apikey='+BITTREX_API_KEY+'&market='+market_name+'&quantity='+btc_amount+'&rate='+order_price, 
        function(e, data) {
           // console.log(data);
            if(data.success == false)
            {
                stat_callback(stat_failed, data.message);
            }
            else
            {
                callback(data);
                stat_callback(stat_success, data.message);
            }
        });
    }
}

module.exports = {
    status_pending : stat_pending,
    status_success : stat_success,
    status_failed  : stat_failed,

    get_order_price : DATA_PROCESSOR.getOrderPrice,
    put_buy_order   : DATA_PROCESSOR.submitOrder
}