const express = require('express');
const fs = require('fs');
const qs = require('querystring');
const template = require('./template6.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    let { name } = req.query;
    fs.readdir('page', (err, files) => {
        let list = template.list(files);
        fs.readFile(`page/${name}`, 'utf-8', (err, data) => {
            let control = `<button type="submit" onclick = "location.href ='/create'">CREATE</button><br><br><button type="submit" onclick = "location.href ='/update?name=${name}'">UPDATE</button><br>
            <form action="delete_process" method="post">
                <br><input type='hidden' name='id' value='${name}'>
                <button type='submit'>DELETE</button>
            </form>
            `;
            if (name === undefined) {
                name = '선린인터넷고등학교(예시)';
                data = '이곳에 하고싶은 말을 입력해주세요!( 익명은 보장됩니다:) )';
                control = `<button type="submit" onclick = "location.href ='/create'">CREATE</button>`;
            }
            const html = template.HTML(name, list, `<h2>${name}선생님의 특징</h2><p>해당 데이터는 휘발성 데이터입니다. 걱정말고 체크하세요:)</p><fieldset><legend><strong>성격</strong></legend><input type = "checkbox" id = "좋음" name = "좋음" value = "좋음"><label for = "좋음">좋음</label><br><input type = "checkbox" id = "보통" name = "좋음" value = "보통"><label for = "보통">보통</label><br><input type = "checkbox" id = "나쁨" name = "좋음" value = "나쁨"><label for = "좋음">나쁨</label><br></fieldset><fieldset><legend><strong>수업 퀄리티(얼마나 잘하시는지)</strong></legend><input type = "checkbox" id = "좋음" name = "좋음" value = "좋음"><label for = "좋음">좋음</label><br><input type = "checkbox" id = "보통" name = "좋음" value = "보통"><label for = "보통">보통</label><br><input type = "checkbox" id = "나쁨" name = "좋음" value = "나쁨"><label for = "좋음">나쁨</label><br></fieldset><fieldset><legend><strong>자습빈도</strong></legend><input type = "checkbox" id = "좋음" name = "좋음" value = "좋음"><label for = "좋음">높음</label><br><input type = "checkbox" id = "보통" name = "좋음" value = "보통"><label for = "보통">중간</label><br><input type = "checkbox" id = "나쁨" name = "좋음" value = "나쁨"><label for = "좋음">낮음</label><br></fieldset> <del>추후 추가될 예정입니다</del>.....`, control);

            res.send(html);
        });
    });
});

app.get('/create', (req, res) => {
    fs.readdir('page', (err, files) => {
        const name = '선생님 추가하기';
        const list = template.list(files);
        const data = template.create();
        const html = template.HTML(name, list, data, '');
        res.send(html);
    });
});

app.get('/update', (req, res) => {
    let { name } = req.query;
    fs.readdir('page', (err, files) => {
        let list = template.list(files);
        fs.readFile(`page/${name}`, 'utf-8', (err, content) => {
            // let control = `<br><button type="submit" onclick = "location.href ='/create'">CREATE</button><br><br><button type="submit" onclick = "location.href ='/update?name=${name}'">UPDATE</button><br>
            let control = `
            <form action="delete_process" method="post">
                <br><input type='hidden' name='id' value='${name}'>
                <button type='submit'>DELETE</button>
            </form>
            `;
            const data = template.update(name, content);
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control);
            res.send(html);
        });
    });
});

app.post('/create_process', (req, res) => {
    //res.send('성공');
    let body = '';
    req.on('data', (data) => { //전송할 데이터가 있으면 동작하는 메소드
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body); //parse : 데이터를 객체화
        const title = post.title;
        const description = post.description;

        fs.writeFile(`page/${title}`, description, 'utf-8', (err) => {
            res.redirect(302, `/?name=${title}`);
        });
    });
});

app.post('/update_process', (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;

        fs.rename(`page/${id}`, `page/${title}`, (err)=>{
            fs.writeFile(`page/${title}`, description, 'utf-8', (err) => {
                res.redirect(302, `/?name=${title}`);
            });
        });
    });
});

app.post('/delete_process', (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;

        fs.unlink(`page/${id}`, (err) => { //unlink : 파일 삭제하는 메소드
            res.redirect(302, '/');
        });
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});