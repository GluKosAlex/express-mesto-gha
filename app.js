import express, { json } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import router from './routes/index.js';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
