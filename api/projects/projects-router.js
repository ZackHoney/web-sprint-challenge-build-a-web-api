// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', (req, res, next) => {
    Project.get(req.query)
    .then(projects => {
        res.json(projects)
    })
    .catch(next)
})


router.use((err, req, res, next ) => {// eslint-disable-line
    res.status(err.status || 500 ).json({
        customMessage: 'something bad happened inside projects router',
        message: err.message,
        stack: err.stack
    })
})


module.exports = router