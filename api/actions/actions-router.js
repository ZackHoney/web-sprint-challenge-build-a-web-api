// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model')

const router = express.Router();

router.get('/', async (req, res, next) => {
    Action.get(req.query)
    .then(actions => {
        res.status(200).json(actions || [])
    })
    .catch(next)
});


router.use((err, req, res, next ) => {// eslint-disable-line
    res.status(err.status || 500 ).json({
        customMessage: 'something bad happened inside actions router',
        message: err.message,
        stack: err.stack
    })
})

module.exports = router;