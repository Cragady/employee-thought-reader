const router = require('express').Router(),
    Bottleneck = require('bottleneck'),
    brainScraper = require('./brain-scraper');

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 7000,
    highWater: 0,
    strategy: Bottleneck.strategy.OVERFLOW
});

function readLimit(req, res){
    limiter.schedule(() =>{brainScraper(req, res)})
    .catch(() =>{
        console.log('api call failed');
        res.end();
    });
};


router.route("/")
    .get(readLimit);

module.exports = router;