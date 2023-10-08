// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model')

const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get(req.query)
        .then(actions => {
            res.status(200).json(actions || [])
        })
        .catch(next)
});

router.get('/:id', (req, res, next) => {
    Action.get(req.params.id)
        .then(action => {
            if (action) {
                res.status(200).json(action)
            } else {
                res.status(404).json({
                    message: 'could not retrieve action'
                })
            }
        })
        .catch(next)
})




router.use((err, req, res, next) => {// eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside actions router',
        message: err.message,
        stack: err.stack
    })
})

module.exports = router;