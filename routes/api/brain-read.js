const router = require('express').Router(),
    Bottleneck = require('bottleneck'),
    brainScraper = require('./brain-scraper');

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 5000
});

function readLimit(req, res){
    limiter.schedule(() =>{brainScraper(req, res)});
};

router.route("/")
    .get(readLimit);

module.exports = router;