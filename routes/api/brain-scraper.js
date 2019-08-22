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

    const brainRacer = function(ms, promise){

        let timeout = new Promise((resolve, reject) =>{
            let id = setTimeout(() =>{
                clearTimeout(id);
                reject('oops');
            }, ms);
        });

        let nestPromise = new Promise((resolve, reject) =>{
            resolve(promise)
                .catch(err =>{
                    reject(err);
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
            if(err.statusCode === 500){
                console.log( 
`   Response Error!
------>>>                
merry-go-round
<<<------
`
                );
                return ping(); 
            } else {
                console.log('err on ping');
                throw err;
            };
        });
    };
    
    const scraped = (thoughtShow) =>{
        return request(options)
        .then($ =>{
                hi;
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
                console.log('err on scraped');
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

    return brainRacer(1000000, ping())
        .then(res =>{
            console.log('response');
            console.log(res);
            return response.json(res).end();
        })
        .catch(err =>{
            console.log('Request Timed Out');
            response.status(408).end();
            return;
        });
};

module.exports = brainScraper;