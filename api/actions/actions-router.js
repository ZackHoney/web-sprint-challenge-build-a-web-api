// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model.js')

const router = express.Router();

router.get('/', async (req, res, next) => {
    const actions = await Action.get()
    try {
        res.status(200).json(actions)
    } catch (err) {
        next(err)
    }
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

router.post('/', (req, res, next) => {
    const { project_id, description, notes } = req.body
    if (!description || !notes || !project_id) {
        res.status(400).json({
            message: 'Description and notes required'
        })
    } else {
        Action.insert({ description, notes, project_id })
            .then(({ id }) => {
                return Action.get(id)
            })
            .then(action => {
                res.status(201).json(action)
            })
            .catch(next)
    }
})

router.put('/:id', async (req, res, next) => {
    const { description, notes } = req.body
    try {
        if (!description || !notes ) {
            res.status(400).json({
                message: 'Please provide description and notes for the post'
            })
        } else {
            Action.get(req.params.id)
                .then(action => {
                    if (!action) {
                        res.status(404).json({
                            message: 'The action with the specified ID does not exist'
                        })
                    } else {
                        return Action.update(req.params.id, req.body)
                    }
                })
                .then(data => {
                    if (data) {
                        return Action.get(req.params.id)
                    }
                })
                .then(action => {
                    if (action) {
                        res.json(action)
                    }
                })
        }
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const action = await Action.get(req.params.id)
    try {
        if (!action) {
            res.status(404).json({
                message: 'The action with the specified ID does not exist'
            })
        } else{
            await Action.remove(req.params.id)
            res.json(action)
        }
    } catch (err) {
        next(err)
    }
})


router.use((err, req, res, next) => {// eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened inside actions router',
        message: err.message,
        stack: err.stack
    })
})

module.exports = router;