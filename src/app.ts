import express from 'express';

const app = express();

app.listen(8080, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
