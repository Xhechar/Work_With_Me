import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routers/auth.router';

const app = express();

app.use(json());
app.use(cors());

app.use('/auth', authRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.json({
    err: err.message
  })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// const email = express();

// email.listen(3001, () => {
//   console.log("Email Server is running on port 3001");
  
// })