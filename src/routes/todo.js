const express = require('express');
const router = express.Router();
const withAuth = require("../withAuth");
const Todo = require('../models/todo');

router.get('/todo', withAuth, (req, res, next) => {
  const { username } = res.locals;
  Todo.find({username: username}, 'action') 
    .then(data => res.json(data))
    .catch(next)
});

router.post('/todo', withAuth, (req, res, next) => {
  if(req.body.action){
    const { action } = req.body;
    const { username } = res.locals;
    console.log("username: ", username);
    console.log("todo: ", action);
    Todo.create({ username, action })
        .then(data => res.json(data))
        .catch(next)
  }else{
    res.json({
      error: 'The input field is empty'
    })
  }
});

router.delete('/todo/:id', (req, res, next) => {
  Todo.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
});

module.exports = router;
