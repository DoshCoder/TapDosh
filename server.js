const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = path.join(BASE_DIR, parsedUrl.pathname);
  
  // Default to index.html for root
  if (parsedUrl.pathname === '/') {
    pathname = path.join(BASE_DIR, 'index.html');
  }
  
  // Check if file exists
  fs.stat(pathname, (err, stats) => {
    if (err) {
      // Try adding .html extension
      const htmlPath = pathname + '.html';
      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (htmlErr) {
          // Try as directory with index.html
          const indexPath = pathname + '/index.html';
          fs.stat(indexPath, (indexErr, indexStats) => {
            if (indexErr) {
              // File not found
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<h1>404 Not Found</h1><p>The page you requested could not be found.</p>');
            } else {
              // Serve directory index.html
              serveFile(indexPath, res);
            }
          });
        } else {
          // Serve file with .html extension
          serveFile(htmlPath, res);
        }
      });
    } else {
      if (stats.isDirectory()) {
        // Try to serve index.html in directory
        const indexPath = path.join(pathname, 'index.html');
        fs.stat(indexPath, (indexErr, indexStats) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1><p>Directory listing not available.</p>');
          } else {
            serveFile(indexPath, res);
          }
        });
      } else {
        // Serve regular file
        serveFile(pathname, res);
      }
    }
  });
});

function serveFile(filePath, res) {
  // Get file extension
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`✅ TapDosh server running at http://localhost:${PORT}`);
  console.log('📱 Mobile: http://' + getIPAddress() + ':' + PORT);
  console.log('🚀 Press Ctrl+C to stop the server');
  
  // Auto-generate sites on startup
  try {
    console.log('🔄 Generating restaurant sites...');
    const { execSync } = require('child_process');
    execSync('node generator.js', { stdio: 'inherit' });
    console.log('✅ Sites generated successfully');
  } catch (error) {
    console.error('❌ Generation error:', error.message);
  }
});

// Get local IP address
function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down TapDosh server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});