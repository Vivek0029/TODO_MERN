const dotenv = require('dotenv').config({ path: '../.env' })
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const Todo = require('./models/todo')
const PORT = process.env.PORT || 8080
const url = process.env.MONGO_URL

app.use(express.json())
app.use(cors());

mongoose.connect(url).then(() => console.log("Connected to MongoDB")).catch(console.error);



app.get('/todos', async (req, res) => {
	const todos = await Todo.find();

	res.json(todos);
});

app.post('/todo/new', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	})

	todo.save();

	res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});



app.listen(PORT , () => {
    console.log(`Server runs perfectly ${PORT}`)
})