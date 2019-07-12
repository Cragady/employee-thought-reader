const router = require('express').Router();

router.route("/brain-read")
    .get((req, res) => {
        res.json({"Test": "True"});
        console.log("api hit");
    });

module.exports = router;