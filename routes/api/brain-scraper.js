const request = require('request-promise-native'),
    cheerio = require('cheerio'),
    Thought = require('../../ThoughtTemp/ThoughtTemp');

const options = {
    uri: 'https://www.pdq.com/about-us/',
    transform: function(body){
        return cheerio.load(body);
    }
};

function brainScraper(req, response){
    console.log("HIT");

    const ping = () =>{
        request('https://pdqweb.azurewebsites.net/api/brain')
            .then(res =>{
                console.log('readerrrrrrr')
                console.log(res);
                const ThoughtPass = JSON.parse(res);
                const ThoughtShow = new Thought(ThoughtPass);
                scraped(ThoughtShow);
            })
            .catch(err =>{
                console.log(err.StatusCodeError, 
`
    ------>>>                
    merry-go-round
    <<<------
`
                );
                ping(); 
            });
    };
    
    const scraped = (thoughtShow) =>{
        thoughtShow.name = "Kristen";
        request(options)
            .then($ =>{
                let thoughtArr = [];
                $(".c.figures").children().each(function(i, element){
                    const portfolio = $(element).find('img');
                    const thoughtPusher = new Thought(thoughtShow);
                    
                    if(portfolio.attr('alt') === thoughtShow.name){
                        thoughtPusher.imgUrl = portfolio.attr('src');
                        thoughtArr.push(thoughtPusher);
                        console.log(portfolio.attr('src'));
                    } else if (i === $(".c.figures").children().length - 1){
                        thoughtArr.push(thoughtShow);
                    };
                });
                response.json(multipleName(thoughtArr)).end();
            })
            .catch(err => {
                console.log(err);
            }); 
    };

    const multipleName = (arr) =>{
        const randI = Math.floor(Math.random() * arr.length);
        console.log(arr);
        if(arr.length > 1){
            console.log(`Multiple people named ${arr[0].name}, guessing what ${arr[0].name} looks like!`);
            return arr[randI];
        } else {
            return arr[0];
        };
    };
    
    ping();
};

module.exports = brainScraper;