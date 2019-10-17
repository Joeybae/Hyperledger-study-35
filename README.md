# Hyperledger-study-35

하이퍼레져 앱 만들기 실습 35일차 - express 설치, Hello world 출력

출처 : https://opentutorials.org/course/3370/21387

1. express 설치

        # npm install express --save

2. Hello world 출력

        const express = require('express')
        const app = express()

        app.get('/', (req, res) => res.send('Hello World!'))

        app.listen(3000, () => console.log('Example app listening on port 3000!'))


3. route, routing

        const express = require('express')
        const app = express()

        //route, routing
        // app.get('/', (req, res) => res.send('Hello World!'))
        app.get('/', function(req, res){
          return res.send('/')
        });

        app.get('/', function(req, res){
          return res.send('/page')
        });

        app.listen(3000, () => console.log('Example app listening on port 3000!'))





