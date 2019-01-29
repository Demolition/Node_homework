const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Authorization');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to db!');
});

let TodoSchema = mongoose.Schema({
  name: String,
  status: String,
  date: String
});

const Todo = mongoose.model('Todo', TodoSchema);


router.get('/', getTodos);
router.post('/', addTodo);
router.delete('/:_id', removeTodo);
router.post('/:_id/done', markDone);
router.post('/:_id/undone', markUndone);


function getTodos(req, res) {
  Todo.find(function (err, todos) {
    if (err) return console.error(err);
    res.send(todos);
  });
}

function addTodo(req, res) {
  if (!req.body._id) {
    const newTodo = new Todo({
      name: req.body.name,
      status: 'waiting',
      date: createDate()
    });

    newTodo.save(function (err) {
      if (err) return console.error(err);
      res.send(newTodo);
    });
  } else {
    Todo.update({_id: req.body._id}, { $set: {status: req.body.status}},
      () => { res.send({success: true}); });
  }
}

function removeTodo(req, res) {
  Todo.deleteOne({_id: req.params._id}, function () {
    res.send({success: true});
  });
}

function createDate () {
  let currentDate = new Date();

  return currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear();
}

function markDone (req, res) {
  Todo.update({_id: req.body._id}, { $set: {status: 'Done'}},
      () => { res.send({success: true}); });
}

function markUndone (req, res) {
  Todo.update({_id: req.body._id}, { $set: {status: 'Undone'}},
      () => { res.send({success: true}); });
}

module.exports = router;
