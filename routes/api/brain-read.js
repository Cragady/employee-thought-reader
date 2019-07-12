const router = require('express').Router(),
    request = require('request'),
    Thought = require('../../ThoughtTemp/ThoughtTemp');

function reading(req, response){
    request('https://pdqweb.azurewebsites.net/api/brain', (err, res, bod) => {
        try{
            const ThoughtPass = JSON.parse(res.body);
            const ThoughtShow = new Thought(ThoughtPass);
            response.json(ThoughtShow);
        } catch (err){
            console.log(err);
        };
    });
};

router.route("/")
    .get(reading);

module.exports = router;