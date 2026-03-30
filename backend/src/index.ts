import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

import express, { Request, Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import { createTasksTable } from "./models/taskModel";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api', taskRoutes);


app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'HMCTS Case Management API is running' }); 
});

createTasksTable().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })}).catch((error) => {
    console.error('Error initializing database:', error);
});

export default app;