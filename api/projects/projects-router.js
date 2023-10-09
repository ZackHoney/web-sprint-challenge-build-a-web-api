// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', async (req, res, next) => {
    const projects = await Project.get(req)
    try {
        res.json(projects)
    } catch(err) {
        next(err)
    }
})


router.use((err, req, res, next ) => {// eslint-disable-line
    res.status(err.status || 500 ).json({
        customMessage: 'something bad happened inside projects router',
        message: err.message,
        stack: err.stack
    })
})


module.exports = router