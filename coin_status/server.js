const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.json': 'application/json',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  // URL 파싱
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // 파일 확장자
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'text/plain';

  // 파일 읽기
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - 파일을 찾을 수 없습니다</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`서버 오류: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🌐 웹 서버가 시작되었습니다!`);
  console.log(`\n📍 다음 주소로 접속하세요:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`💡 종료하려면 Ctrl+C를 누르세요.\n`);
});
