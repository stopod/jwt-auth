const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // JWTを持っているか確認 -> リクエストヘッダの中のx-auth-tokenを確認
  const token = req.header('x-auth-token');

  if (!token) {
    // ミドルウェアの使用
    res.status(400).json([
      {
        message: '権限がありません',
      }
    ]);
  } else {

    try {
      // verify -> デコード（複合）のこと
      let user = await JWT.verify(token, 'SECRET_KEY');
      console.log(user);
      req.user = user.email;
      next();
    } catch (error) {
      return res.status(400).json([
        {
          message: 'トークンが一致しません'
        }
      ]);
    }
  };
};