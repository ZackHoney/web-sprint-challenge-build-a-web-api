// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', async (req, res, next) => {
    const projects = await Project.get()
    try {
        res.json(projects)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', (req, res, next) => {
    Project.get(req.params.id)
        .then(projects => {
            if (projects) {
                res.status(200).json(projects)
            } else {
                res.status(404).json({
                    message: 'could not retrieve projects'
                })
            }
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    const { description, name, completed } = req.body
    if (!description || !name, !completed) {
        res.status(400).json({
            message: 'Description and name required'
        })
    } else {
        Project.insert({ description, name, completed })
            .then(({ id }) => {
                return Project.get(id)
            })
            .then(project => {
                res.status(201).json(project)
            })
            .catch(next)
    }
})

router.put('/:id', async (req, res, next) => {
    const { description, name, completed} = req.body
    try {
        if (!description || !name || completed === undefined) {
            res.status(400).json({
                message: 'Please provide description and name for the post'
            })
        } else {
            Project.get(req.params.id)
                .then(project => {
                    if (!project) {
                        res.status(404).json({
                            message: 'The project with the specified ID does not exist'
                        })
                    } else {
                        return Project.update(req.params.id, req.body)
                    }
                })
                .then(project => {
                    if (project) {
                        res.json(project)
                    }
                })
        }
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const project = await Project.get(req.params.id)
    try {
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist'
            })
        } else{
            await Project.remove(req.params.id)
            res.json(project)
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions', (req, res, next) => {
        Project.getProjectActions(req.params.id)
            .then(projects => {
                if (projects) {
                    res.status(200).json(projects)
                } else {
                    res.status(404).json({
                        message: 'could not retrieve projects'
                    })
                }
            })
            .catch(next)
    })

router.use((err, req, res, next) => {// eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside projects router',
        message: err.message,
        stack: err.stack
    })
})


module.exports = router