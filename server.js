const express = require('express');
const app = express();
const PORT = 8080;
const auth = require('./routes/auth');
const post = require('./routes/post');

// reqestのjsonを受け付ける
// app.use('/auth', auth)より先に呼び出さないとダメ
app.use(express.json());
// authというエンドポイントを指定してWebAPIを構築できる
app.use('/auth', auth);
app.use('/post', post);

app.get('/', (req, res) => { // エンドポイントの指定
  res.send('Hello Express');
})

app.listen(PORT, () => {
  console.log('サーバーを起動中・・・');
});