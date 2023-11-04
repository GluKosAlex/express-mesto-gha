import express from 'express';
import 'dotenv/config';

const { PORT } = process.env;

const app = express();

app.listen(3000, () => {
  console.log(`Server started on ${PORT} port`);
});
