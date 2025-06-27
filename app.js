import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
import UserRouter from './routes/user.routes.js'
app.use('/api/v1/user',UserRouter)

export default app;