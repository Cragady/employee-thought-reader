const router = require('express').Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    Bottleneck = require('bottleneck'),
    Thought = require('../../ThoughtTemp/ThoughtTemp');

let globalStop = false;

function reading(req, response){
    if(!globalStop){
        globalStop = true;
        console.log('hit!');
        request('https://pdqweb.azurewebsites.net/api/brain', (err, res, bod) => {
            try{
                const ThoughtPass = JSON.parse(res.body);
                const ThoughtShow = new Thought(ThoughtPass);
                request('https://www.pdq.com/about-us/', (picErr, picRes, html) =>{
                    const $ = cheerio.load(html);

                    $(".c.figures").children().each(function(i, element){
                        const portfolio = $(element).find('img');

                        if(portfolio.attr('alt') === ThoughtShow.name){
                            ThoughtShow.imgUrl = portfolio.attr('src');
                            globalStop = false;
                            console.log('response')
                            return response.json(ThoughtShow).end();
                        };
                    });
                });
            } catch (err){
                globalStop = false;
                console.log(`
------>>>                
merry-go-round
<<<------
`);
                return reading(req, response);
            };
        });
    } else {
        console.log('too many');
        response.end();
    }
};

router.route("/")
    .get(reading);

module.exports = router;