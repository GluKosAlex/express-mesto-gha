import express, { json } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import router from './routes/index.js';

const { PORT = 3000, CONN_STR = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(CONN_STR).then(() => console.log('Connection to the DB is successful'));

const app = express();

app.use(json());

app.use(router);

const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occurred. Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
