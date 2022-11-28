import app from './app';

const port = 8080;

app.listen(port, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
