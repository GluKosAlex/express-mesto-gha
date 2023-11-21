import express, { json } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import router from './routes/index.js';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6548cb5c88e8414c0b9f1018',
//   };

//   next();
// });

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
