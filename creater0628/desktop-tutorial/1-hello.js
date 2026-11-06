// 引入 Node.js 自带的 HTTP 模块
const http = require('http');

// 创建一个服务器
const server = http.createServer((req, res) => {
  // 设置响应头，告诉浏览器我们返回的是文字
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  
  // 返回一句话
  res.end('你好！这是我的第一个 Node.js 后端程序。');
});

// 服务器开始监听 3000 端口
server.listen(3000, () => {
  console.log('后端服务已启动，请访问：http://localhost:3000');
});