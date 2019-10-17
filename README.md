# Hyperledger-study-35

하이퍼레져 앱 만들기 실습 35일차 - express 설치, Hello world 출력, express 언어로 변경

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

4. express 언어로 변경 - create, update, delete

main.js

        var express = require('express')
        var app = express()
        var fs = require('fs');
        var path = require('path');
        var qs = require('querystring');
        var sanitizeHtml = require('sanitize-html');
        var template = require('./lib/template.js');

        //route, routing
        //app.get('/', (req, res) => res.send('Hello World!'))
        app.get('/', function(request, response) { 
          fs.readdir('./data', function(error, filelist){
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>`
            ); 
            response.send(html);
          });
        });

        app.get('/page/:pageId', function(request, response) { 
          fs.readdir('./data', function(error, filelist){
            var filteredId = path.parse(request.params.pageId).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
              var title = request.params.pageId;
              var sanitizedTitle = sanitizeHtml(title);
              var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
              });
              var list = template.list(filelist);
              var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/create">create</a>
                  <a href="/update/${sanitizedTitle}">update</a>
                  <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                  </form>`
              );
              response.send(html);
            });
          });
        });

        app.get('/create', function(request, response){
          fs.readdir('./data', function(error, filelist){
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, '');
            response.send(html);
          });
        });

        app.post('/create_process', function(request, response){
          var body = '';
          request.on('data', function(data){
              body = body + data;
          });
          request.on('end', function(){
              var post = qs.parse(body);
              var title = post.title;
              var description = post.description;
              fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.redirect('/');
              })
          });
        });

        app.get('/update/:pageId', function(request, response){
          fs.readdir('./data', function(error, filelist){
            var filteredId = path.parse(request.params.pageId).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
              var title = request.params.pageId
              var list = template.list(filelist);
              var html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
              );
              response.send(html);
            });
          });
        });

        app.post('/update_process', function(request, response){
          var body = '';
              request.on('data', function(data){
                  body = body + data;
              });
              request.on('end', function(){
                  var post = qs.parse(body);
                  var id = post.id;
                  var title = post.title;
                  var description = post.description;
                  fs.rename(`data/${id}`, `data/${title}`, function(error){
                    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                      response.writeHead(302, {Location: `/?id=${title}`});
                      response.end();
                    })
                  });
              });
        });

        app.post('/delete_process', function(request, response){
          var body = '';
          request.on('data', function(data){
            body = body + data;
          });
          request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(error){
              response.redirect('/');
            })
          });
        });

        app.listen(3000, function() {
          console.log('Example app listening on port 3000!')
        });



