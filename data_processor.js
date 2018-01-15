const api = require('./api_resolver');

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
                callback(totalPrice);
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
                callback(newQuantity);
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


module.exports = {
    status_pending : stat_pending,
    status_success : stat_success,
    status_failed  : stat_failed,

    get_order_price : DATA_PROCESSOR.getOrderPrice
}