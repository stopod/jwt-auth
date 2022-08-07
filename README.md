# jwt-auth

https://www.youtube.com/watch?v=IaCQqCIqZ6U  
↑これみて勉強したやつ  

# 使ったパッケージ
npm i express nodemon  
npm install --save express-validator  
npm i bcrypt  
npm i jsonwebtoken  

# curl

```
登録
curl --location --request POST 'http://localhost:8080/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test2@test.com",
    "password": "123456"
}'
```

```
ログイン
curl --location --request POST 'http://localhost:8080/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test2@test.com",
    "password": "123456"
}'
```

```
ユーザー情報取得
curl --location --request GET 'http://localhost:8080/auth/allUsers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "password": "123456"
}'
```

```
publicPost取得
curl --location --request GET 'http://localhost:8080/post/public' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "password": "123456"
}'
```

```
privatePost取得
curl --location --request GET 'http://localhost:8080/post/private' \
--header 'x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQHRlc3QuY29tIiwiaWF0IjoxNjU5ODgyMTYyLCJleHAiOjE2NTk5Njg1NjJ9.xNG9vmjWti9virrNjSUt5BqB-A2vMhI_4J9_LN-OUBU' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "password": "123456"
}'
```  
間違えてnode_modulesまであげてまった  
いつかgitignore書く