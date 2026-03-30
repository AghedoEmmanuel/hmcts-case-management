import { Request, Response } from "express";
import pool from "../config/db";

// GET all tasks
export const getTasks = async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// GET a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(`Error fetching task with ID ${id}:`, error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

// POST a new task
export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, priority, due_date, assigned_to, case_reference } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, case_reference) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, status || 'pending', priority || 'medium', due_date, assigned_to, case_reference]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// PUT update a task by ID
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to, case_reference } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, assigned_to = $6, case_reference = $7 WHERE id = $8 RETURNING *',
            [title, description, status || 'pending', priority || 'medium', due_date, assigned_to, case_reference, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(`Error updating task with ID ${id}:`, error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// DELETE a task by ID
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(`Error deleting task with ID ${id}:`, error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
