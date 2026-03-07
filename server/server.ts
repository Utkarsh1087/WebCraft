import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const corsOptions = {
    origin: process.env.TRUSTED_ORIGIN?.split(',') || [],
    credentials: true,
}

app.use(cors(corsOptions));

app.use("/api/auth", toNodeHandler(auth));

app.use(express.json({ limit: '50mb' }))

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});


app.use('/api/project', projectRouter)
app.use('/api/user', userRouter)



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Keep-alive for Windows / nodemon event loop issues
setInterval(() => {}, 1000 * 60 * 60);
