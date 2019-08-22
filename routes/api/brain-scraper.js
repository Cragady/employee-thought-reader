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
    // let recallLimiter = 0;
    let recallLimiter = 3;

    const brainRacer = function(ms, promise){

        let timeout = new Promise((resolve, reject) =>{
            let id = setTimeout(() =>{
                clearTimeout(id);
                const err = new Error(['Request Timed Out', 'brain-scraper.js', 22])
                err.statusCode = 408;
                err.cusMessage = err.message;
                reject(err);
            }, ms);
        });

        let nestPromise = new Promise((resolve, reject) =>{
            resolve(promise)
                .catch(err =>{
                    throw err;
                });
        });

        return Promise.race([
            nestPromise,
            timeout
        ]);
    };  

    const ping = () =>{
        const r = request('https://pdqweb.azurewebsites.net/api/brain');
        return r.then(res =>{
            const ThoughtPass = JSON.parse(res);
            const ThoughtShow = new Thought(ThoughtPass);
            return scraped(ThoughtShow);
        })
        .catch(err =>{
            if(recallLimiter < 3){
                recallLimiter++;
                console.log( 
`   Response Error!
------>>>                
merry-go-round
<<<------
`
                );
                return ping(); 
            } else {
            err.cusMessage = 'Infinite recursion potential identified, exiting loop.';
            err.statusCode = 508;
            console.log(err.cusMessage);
            throw err;
            };
        });
    };
    
    const scraped = (thoughtShow) =>{
        return request(options)
        .then($ =>{
                let thoughtArr = [];
                $(".c.figures").children().each(function(i, element){
                    const portCatch = $(element).find('div');
                    const portThrow = portCatch.parent().find('img');
                    const thoughtPusher = new Thought(thoughtShow);
                    
                    if(portCatch.text().includes(thoughtShow.name)){// === thoughtShow.name){
                        thoughtPusher.imgUrl = portThrow.attr('src');
                        thoughtArr.push(thoughtPusher);
                    } else if (i === $(".c.figures").children().length - 1 && thoughtArr.length === 0){
                        thoughtArr.push(thoughtShow);
                    };
                });
                return multipleName(thoughtArr);
            })
            .catch(err => {
                throw err;
            }); 
    };

    const multipleName = (arr) =>{
        const randI = Math.floor(Math.random() * arr.length);
        if(arr.length > 1){
            console.log(`Multiple people named ${arr[0].name}, guessing what ${arr[0].name} looks like!`);
            return arr[randI];
        } else {
            return arr[0];
        };
    };

    return brainRacer(100000000, ping())
        .then(res =>{
            console.log('response');
            return response.json(res).end();
        })
        .catch(err =>{
            console.log(err.cusMessage);
            console.log(err.statusCode);
            if(err.statusCode === 408){
                return response.status(408).end();
            } else {
                return response.status(508).end();
            };
        });
};

module.exports = brainScraper;