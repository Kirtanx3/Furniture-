const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json'
};

http.createServer((req, res) => {
  const reqPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    }
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
