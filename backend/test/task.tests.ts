import request from 'supertest'
import app from '../src/index'
import pool from '../src/config/db'

//clean up database after each test
beforeAll(async()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            priority VARCHAR(20) DEFAULT 'medium',
            due_date DATE,
            assigned_to VARCHAR(255),
            case_reference VARCHAR(100),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
})

afterAll(async()=>{
    await pool.query('DELETE FROM tasks WHERE title LIKE $1', ['Test _%']);
    await pool.end();
})


//get all tasks
describe('GET /api/tasks', ()=>{
    it('should return an array of tasks with status 200', async()=>{
        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

//post create tasks
describe('POST /api/tasks', ()=>{
    it('should create a new task and return it with status 201', async()=>{
        const newTask = { 
            title: 'TEST_Create hearing bundle',
            description: 'This is a test task',
            status: 'pending',
            priority: 'high',
            due_date: '2026-01-01',
            assigned_to: 'John Doe',
            case_reference: 'HMCTS-2026-0001'
        };
        const res = await request(app).post('/api/tasks').send(newTask);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newTask.title);
        expect(res.body.priority).toBe('high');
        expect(res.body.case_reference).toBe('HMCTS-2026-0001');
        // expect(res.body).toMatchObject({
        //     id: expect.any(Number),
        //     title: newTask.title,
        //     description: newTask.description,
        //     status: newTask.status,
        //     priority: newTask.priority,
        //     due_date: newTask.due_date,
        //     assigned_to: newTask.assigned_to,
        //     case_reference: newTask.case_reference,
        //     created_at: expect.any(String),
        //     updated_at: expect.any(String)
        // });
    });
        it ('should return 500 if title is missing',async()=>{
            const res = await request(app).post('/api/tasks').send({
                description: 'This is a test task without title',
                // status: 'pending',              
        })
        expect(res.status).toBe(500);
    });
}); 

//get task by id
describe('GET /api/tasks/:id', ()=>{
    let taskID: number

    beforeAll(async()=>{
        const res = await request(app).post('/api/tasks').send({
            title: 'TEST_Get task by id',
            description: 'This is a test task for get by id',
            priority:'low',
            case_reference: 'HMCTS-2026-0002'
        });
        taskID = res.body.id;
    })

    it('should return a single task by ID', async()=>{
       const res = await request(app).get(`/api/tasks/${taskID}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(taskID);
        expect(res.body.title).toBe('TEST_Get task by id');
    });
        it('should return 404 if task not found', async()=>{
            const res = await request(app).get('/api/tasks/999999');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', 'Task not found');
        });         
});


//put update task
describe('PUT /api/tasks/:id', () => {
  let taskId: number

  beforeAll(async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'TEST_Task to update',
      description: 'Will be updated',
      status: 'pending',
      priority: 'low',
      case_reference: 'HMCTS-2025-003',
    })
    taskId = res.body.id
  })

  it('should update a task and return the updated record', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({
      title: 'TEST_Task to update',
      description: 'Updated description',
      status: 'in-progress',
      priority: 'high',
      due_date: '2025-07-01',
      assigned_to: 'Senior Caseworker',
      case_reference: 'HMCTS-2025-003',
    })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('in-progress')
    expect(res.body.priority).toBe('high')
    expect(res.body.assigned_to).toBe('Senior Caseworker')
  })

  it('should return 404 when updating a non-existent task', async () => {
    const res = await request(app).put('/api/tasks/999999').send({
      title: 'Ghost task',
      description: 'Does not exist',
      status: 'pending',
      priority: 'low',
    })
    expect(res.status).toBe(404)
  })
})

//delete task
describe('DELETE /api/tasks/:id', () => {
  let taskId: number

  beforeAll(async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'TEST_Task to delete',
      description: 'Will be deleted',
      priority: 'medium',
      case_reference: 'HMCTS-2025-004',
    })
    taskId = res.body.id
  })

  it('should delete a task and return success message', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'Task deleted successfully')
  })

  it('should return 404 when deleting a non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/999999')
    expect(res.status).toBe(404)
  })
})