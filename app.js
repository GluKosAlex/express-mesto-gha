import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

const { PORT } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});
