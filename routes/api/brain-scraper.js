const request = require('request-promise-native'),
    cheerio = require('cheerio'),
    Thought = require('../../ThoughtTemp/ThoughtTemp');

const options = {
    uri: 'https://www.pdq.com/about-us/',
    transform: function(body){
        return cheerio.load(body);
    }
};

let arrPlace = 32;
let empArr = ['Shawn', 'Adam', 'Shane', 'JJ', 'Lex', 'Kris', 'Chase', 'Jason', 'Emily', 'Brigg', 'Alyssa', 'Kelly', 'Jordan', 'Nate', 'Matt', 'Elitia', 'Josh', 'Colby', 'Victoria', 'Rene', 'Chris', 'Katie', 'Jake', 'Lisa', 'Mark', 'Alex', 'Mark', 'Jason', 'Steven', 'Stephanie', 'Julie', 'Brett', 'Steven', 'Whitney', 'Shelby', 'Dakota', 'Lauren', 'Jon', 'Josh', 'Sergio', 'Michael', 'Greg', 'Dani', 'Brook', 'Randall', 'Renzo', 'Paul', 'Jarem', 'Bryan', 'Brenda', 'You?'];

function brainScraper(req, response){
    console.log("HIT");

    const ping = () =>{
        return request('https://pdqweb.azurewebsites.net/api/brain')
            .then(res =>{
                const ThoughtPass = JSON.parse(res);
                const ThoughtShow = new Thought(ThoughtPass);
                scraped(ThoughtShow);
            })
            .catch(err =>{
                console.log( 
`   Response Error!
    ------>>>                
    merry-go-round
    <<<------
`
                );
                ping(); 
            });
    };
    
    const scraped = (thoughtShow) =>{
        thoughtShow.name = empArr[arrPlace];
        arrPlace++;
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
                console.log('response');
                response.json(multipleName(thoughtArr)).end();
            })
            .catch(err => {
                console.log(err);
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
    
    return ping();
};

module.exports = brainScraper;