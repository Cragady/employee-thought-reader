const router = require('express').Router(),
    brainRead = require('./brain-read');

router.use('/brain-read', brainRead);

module.exports = router;