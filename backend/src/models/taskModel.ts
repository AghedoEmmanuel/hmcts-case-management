import pool from '../config/db';
 

export const createTasksTable = async () =>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            PRIORITY VARCHAR(20) DEFAULT 'medium',
            due_date DATE,
            assigned_to VARCHAR(255),
            case_reference VARCHAR(100),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `)
}