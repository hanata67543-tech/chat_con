const fs = require('fs');
const path = require('path');

// 설정: 이미지 폴더와 결과물 파일명
const imageFolder = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'index.html');

// 1. images 폴더에서 이미지 파일 목록 읽기 (알파벳/가나다 순 정렬)
if (!fs.existsSync(imageFolder)) {
    console.error("❌ 에러: 'images' 폴더를 찾을 수 없습니다!");
    process.exit(1);
}

const imageFiles = fs.readdirSync(imageFolder)
    .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
    .sort();

// 2. HTML 템플릿 생성 (디자인 + 기능)
const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채팅콘 선택기</title>
    <style>
        :root {
            --bg-color: #1a1a1a;
            --card-bg: #2d2d2d;
            --accent-color: #00ffa3; /* 치지직 시그니처 컬러 느낌 */
            --text-color: #ffffff;
        }
        body {
            font-family: 'Pretendard', 'Malgun Gothic', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            text-align: center;
            padding: 40px 20px;
            margin: 0;
        }
        h1 { font-size: 2rem; margin-bottom: 10px; }
        .desc { color: #aaa; margin-bottom: 40px; }
        
        .emoticon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .emoticon-item {
            background-color: var(--card-bg);
            padding: 20px 10px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: 2px solid transparent;
        }
        .emoticon-item:hover {
            transform: translateY(-5px);
            border-color: var(--accent-color);
            background-color: #383838;
        }
        .emoticon-item img {
            max-width: 80px;
            max-height: 80px;
            object-fit: contain;
            margin-bottom: 12px;
        }
        .emoticon-item p {
            margin: 0;
            font-weight: bold;
            font-size: 0.95rem;
            color: #ccc;
        }
        .emoticon-item:hover p { color: var(--accent-color); }

        /* 토스트 알림 */
        #toast {
            visibility: hidden;
            min-width: 280px;
            background-color: var(--accent-color);
            color: #000;
            text-align: center;
            border-radius: 50px;
            padding: 12px 24px;
            position: fixed;
            z-index: 1000;
            left: 50%;
            bottom: 40px;
            transform: translateX(-50%);
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,255,163,0.3);
        }
        #toast.show { visibility: visible; animation: fadein 0.4s, fadeout 0.4s 2.5s; }
        @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 40px; opacity: 1;} }
        @keyframes fadeout { from {bottom: 40px; opacity: 1;} to {bottom: 0; opacity: 0;} }
    </style>
</head>
<body>

    <h1>채팅콘 메뉴판</h1>
    <p class="desc">원하는 이미지를 클릭하면 명령어가 복사됩니다!</p>

    <div id="toast">복사 완료!</div>

    <div class="emoticon-grid">
        ${imageFiles.map(file => {
            const name = file.substring(0, file.lastIndexOf('.'));
            return `
        <div class="emoticon-item" onclick="copyCmd('~${name}')">
            <img src="images/${file}" alt="${name}">
            <p>~${name}</p>
        </div>`;
        }).join('')}
    </div>

    <script>
        function copyCmd(cmd) {
            navigator.clipboard.writeText(cmd).then(() => {
                const toast = document.getElementById('toast');
                toast.innerText = "'" + cmd + "' 복사 완료!";
                toast.className = "show";
                setTimeout(() => { toast.className = ""; }, 3000);
            });
        }
    </script>
</body>
</html>`;

// 3. 파일 쓰기
fs.writeFileSync(outputFile, htmlContent, 'utf8');
console.log('--------------------------------------------------');
console.log('✅ 시청자용 index.html 생성 완료!');
console.log(\`📁 총 \${imageFiles.length}개의 채팅콘이 등록되었습니다.\`);
console.log('--------------------------------------------------');