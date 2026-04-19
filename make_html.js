const fs = require('fs');
const path = require('path');

const imageFolder = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'index.html');

// 폴더가 없으면 에러 방지용 생성
if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder);

// 1. 이미지 읽기
const imageFiles = fs.readdirSync(imageFolder)
    .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
    .sort();

// 2. 메뉴판(HTML) 템플릿
const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채팅콘 선택기</title>
    <style>
        :root { --bg: #121212; --card: #1e1e1e; --accent: #00ffa3; --text: #e0e0e0; }
        body { font-family: 'Pretendard', sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 40px 20px; text-align: center; }
        .emoticon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; max-width: 900px; margin: 40px auto 0; }
        .emoticon-item { background: var(--card); border: 1px solid #333; border-radius: 12px; padding: 20px 10px; cursor: pointer; transition: 0.2s; }
        .emoticon-item:hover { transform: translateY(-4px); border-color: var(--accent); }
        .emoticon-item img { width: 70px; height: 70px; object-fit: contain; margin-bottom: 12px; }
        .emoticon-item p { margin: 0; font-size: 13px; font-weight: bold; color: #bbb; }
        #toast { visibility: hidden; background: var(--accent); color: #000; padding: 12px 24px; position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%); border-radius: 50px; font-weight: bold; }
        #toast.show { visibility: visible; animation: f 0.4s, g 0.4s 2.5s; }
        @keyframes f { from { bottom: 0; opacity: 0; } to { bottom: 40px; opacity: 1; } }
        @keyframes g { from { opacity: 1; } to { opacity: 0; } }
    </style>
</head>
<body>
    <h1>채팅콘 메뉴판</h1>
    <p>이미지를 클릭하면 명령어가 복사됩니다!</p>
    <div id="toast">복사 완료!</div>
    <div class="emoticon-grid">
        ${imageFiles.map(file => {
            const name = file.substring(0, file.lastIndexOf('.'));
            return `<div class="emoticon-item" onclick="cp('~${name}')">
                <img src="images/${file}">
                <p>~${name}</p>
            </div>`;
        }).join('')}
    </div>
    <script>
        function cp(c) {
            const t = document.createElement("textarea");
            document.body.appendChild(t); t.value = c; t.select();
            document.execCommand('copy'); document.body.removeChild(t);
            const s = document.getElementById('toast');
            s.innerText = "'" + c + "' 복사 완료!";
            s.className = "show"; setTimeout(() => { s.className = ""; }, 3000);
        }
    </script>
</body>
</html>`;

fs.writeFileSync(outputFile, htmlContent, 'utf8');