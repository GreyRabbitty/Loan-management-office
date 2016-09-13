module.exports.percentDepth = function(lendbook, settings, exchangeName, cb) {
    if (lendbook && lendbook.offers && lendbook.offers.length > 0) {
        var offerTotal = 0;
        for (var x in lendbook.offers) {
            offerTotal += lendbook.offers[x].amount;
        }
        var target = offerTotal * (settings.lendbookPositioningPercentage / 100);
        var runningTotal = 0;
        var targetRate = lendbook.offers[0].rate;
        for (var x in lendbook.offers) {
            var offer = lendbook.offers[x];
            runningTotal += offer.amount;
            if (runningTotal <= target) {
		targetRate = offer.rate;
            }
        }
	cb(null, targetRate, durationByRate(targetRate, exchangeName));
    }
    else {
        cb({message: 'no offers in lendbook'});
    }
};

module.exports.topOfTheBook = function(lendbook, settings, exchangeName, cb) {
    if (lendbook && lendbook.offers && lendbook.offers.length > 0) {
	cb(null, lendbook.offers[0].rate, durationByRate(lendbook.offers[0].rate, exchangeName));
    }
    else {
        cb({message: 'no offers in lendbook'});
    }
};

function durationByRate(rate, exchangeName) {
    var duration = 2;
    if (rate > 25) {
        duration = 10;
    }
    if (rate > 30) {
        duration = 30;
    }
    if (exchangeName === 'poloniex' && rate > 35) {
        duration = 60;
    }

    return duration;
}
