import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { Error_Handler } from './middlewares/Errors.middlewares.js';
import dotenv from "dotenv"
import userRouter from './routes/user.routes.js';
import { healthCheck } from './controllers/healthCheckController/healthCheck.controller.js';
import quizRouter from './routes/quiz.routes.js';
import submissionRouter from './routes/submission.routes.js';
import analyticsRouter from './routes/analytics.router.js';

dotenv.config()



const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,  
    credentials: true,              
  }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser())

// routes
app.use("/api/v1/healthcheck",healthCheck)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/analytics", analyticsRouter);


app.use(Error_Handler)
export default app

