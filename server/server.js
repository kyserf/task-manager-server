import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todosDB', {});

const todoSchema = new mongoose.Schema({
  id: String,
  title: String,
  date: Date,
})

const Todo = mongoose.model('Todo', todoSchema);

app.post('/upload', async (req, res) => {
  try {
    const todo = req.body;

    const newTodo = new Todo(todo);
    await newTodo.save();

    res.status(201).send('Todo uploaded successfully!');
  } catch (err) {
    console.error('Error uploading Todo:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/todoList', async (req, res) => {
  try {
    const data = await Todo.find();

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;

    await Todo.deleteOne({ id: idToDelete });

    res.status(200).send('Todo deleted successfully!');
  } catch (err) {
    console.error('Error deleting Todo:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/update/:id', async (req, res) => {
  try {
    const idToUpdate = req.params.id;
    const { title } = req.body;
    const existingTodo = await Todo.findOne({ id: idToUpdate });

    if (!existingTodo) {
      return res.status(404).send('Todo not found');
    }

    existingTodo.title = title;
    await existingTodo.save();

    res.status(200).send('Todo updated successfully!');
  } catch (err) {
    console.error('Error updating Todo:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})