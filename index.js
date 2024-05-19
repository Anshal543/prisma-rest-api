import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// User Routes
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                todos: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

app.post('/users', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password
            }

        });
        res.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating user', details: error.message });
    }
});

// Todo Routes (included for completeness)
app.get('/todos', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            include: {
                user: true
            }
        });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'An error occurred while fetching todos' });
    }
});

app.post('/todos', async (req, res) => {
    const { title, userId } = req.body;
    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                userId
            }
        });
        res.json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'An error occurred while creating todo' });
    }
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title,completed } = req.body;
    try {
        const todo = await prisma.todo.update({
            where: {
                id
            },
            data: {
                title, completed
            }
        });
        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'An error occurred while updating todo' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await prisma.todo.delete({
            where: { id },
        });
        res.json({ message: 'Todo deleted successfully', todo });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'An error occurred while deleting todo', details: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
