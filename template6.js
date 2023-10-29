module.exports = {
    HTML: function (name, list, body, control) {
        return `
        <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name}</title>
    </head>
    <body>
        <h1>${name}</h1>
        ${list}
        ${control}
        ${body}
        <br><br>
        <a href="/">메인 페이지로 돌아가기</a>
    </body> 
    </html>
        `;
    }, list: function(files) {
        let list = '<ol>';
        for (i = 0; i < files.length; i++) {
            list = `<li><a href="?name=${files[i]}">${files[i]}</a></li>`+ list;
        }
        list = list + '</ol>';
        return list;
    }, create: function() {
        return `
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="선생님의 이름을 입력해주세요!"></p> <!--name이 서버로 넘어갈 때 구별됨-->
        <p><textarea name="description" placeholder="선생님의 특징을 입력해주세요!"></textarea></p>
        <p><button type="submit">send</button></p>
    </form>
    `;
    }, update: function(name, content) {
        return `
        <form action="/update_process" method="post">
        <p><input type="hidden" name="id" value="${name}"></p>
        <p><input type="text" name="title" placeholder="title" value="${name}"></p>
        <p><textarea name="description" placeholder="description">${content}</textarea></p>
        <p><button type="submit">send</button></p>
    </form>
    `;
    }
};