const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 2000;
const todoRoutes = express.Router();
const mongoose = require('mongoose');
const Todo = require('./model/Todo');

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get((req,res)=>{
    Todo.find({}).then((todos)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(todos);
    }).catch((err)=>{
        res.end("cant gettt");
    })
})
todoRoutes.route('/:id').get((req,res)=>{
    var id = req.params.id;
    Todo.findById(id).then((todo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(todo);
    }).catch((err)=>{
        res.end("cant get");
    })
})
todoRoutes.route('/update/:id').post((req,res)=>{
    Todo.findById(req.params.id).then((todo)=>{
        if(!todo){
            return res.status(404).send("page not found");
        }
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    })

})
todoRoutes.route('/add').post((req,res)=>{
    var todo = new Todo(req.body);
    todo.save().then((todo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send("created");
    }).catch((err)=>{
        res.send(err);
    })
})



app.use(cors());
app.use(bodyParser.json());
app.use('/todos',todoRoutes)

app.listen(PORT,()=>{
    console.log("server running");

})
