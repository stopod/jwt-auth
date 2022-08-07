const router = require('express').Router();
const { body, validationResult } = require('express-validator'); // バリデーション
const { User } = require('../db/User'); // db代わり
const bcrypt = require('bcrypt'); // passwoerdのhash化
const JWT = require('jsonwebtoken');


router.get('/', (req, res) => {
  res.send('Hello Authjs');
});

// ユーザー新規登録用のAPI
/**
 * ユーザー新規登録の流れ
 * 
 * ユーザーがemailとパスワードを入力
 * 　▽
 * バリデーションチェック
 * 　▽
 * すでにそのユーザーが存在しているか確認
 * 　▽
 * パスワードの暗号化（ハッシュ化）
 * 　▽
 * DBへ保存
 * 　▽
 * JWT発行して渡す（JsonWebToken）
 * 
 */
router.post(
  '/register',
  // バリデーションチェック
  body('email').isEmail(),
  body('password').isLength({ min: 6}),
  async (req, res) => {
  // inputのemailとパスワード
  const email = req.body.email;
  const password = req.body.password;

  // バリデーションのエラー判別
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    return res.status(400).json({ errors: errors.array() });
  }

  // DBにユーザーが存在しているか確認
  const user = User.find((user) => user.email === email);
  if (user) {
    return res.status(400).json([
      {
        message: 'すでにそのユーザーは存在しています。'
      }
    ]);
  };

  // パスワードの暗号化
  /**
   * memo
   * hash(password, salt) saltは基本10が使われるらしい
   * 考え方
   * passwordの前後に文字列が付与されてからhash化するらしい
   * 何文字付与するかを指定するのがsaltらしい？
   * 10以上でもいいけれど複合するときに時間がかかるようになるので10がちょうどいいらしい
   */
  let hashedPassword = await bcrypt.hash(password, 10);
  // passは123456を指定 ⇒ $2b$10$oV6gyUmFTTK8vSGKN/.J0OmS5IzdPQJt6o7A7sFaS01sXUTPcR9oW(hash化したもの)
  console.log(hashedPassword);

  // DBへ保存(疑似的に)
  User.push({
    email,
    password: hashedPassword,
  });

  // クライアントへJWTの発行
  /**
   * JWT
   * 入館証みたいな物がトークン
   * このトークンを暗号化する必要がある
   * 
   * わたされたトークンはどこに保存するのか？
   * ローカルストレージにはやめたほうがいい（一般論）
   * => Cookieとかに保存するのが良い？
   */
  const token = await JWT.sign(
    {
      email, // ペイロード
    },
    'SECRET_KEY', // 直書きはダメ 本来は.envとかで見えないようにしておく(複合化するためのKey)
    {
      expiresIn: '24h', // 期間
    },
  );

  return res.json({
    token: token,
  });
});

// ログイン用のAPI
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json([
      {
        message: 'そのユーザーは存在しません'
      }
    ]);
  };

  // パスワードの複合、照合
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json([
      {
        message: 'パスワードが異なります',
      }
    ]);
  };

  const token = await JWT.sign(
    {
      email, // ペイロード
    },
    'SECRET_KEY', // 直書きはダメ 本来は.envとかで見えないようにしておく(複合化するためのKey)
    {
      expiresIn: '24h', // 期間
    },
  );

  return res.json({
    token: token,
  });
})

// DBのユーザーを確認するAPI
router.get('/allUsers', (req, res) => {
  return res.json(User);
})

module.exports = router;