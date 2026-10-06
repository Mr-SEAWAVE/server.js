// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Cho phép trang web của bạn giao tiếp với máy chủ này
app.use(cors());

// Cổng Proxy: Mọi yêu cầu gửi tới /api/roblox sẽ được máy chủ Mỹ chuyển tiếp tới Roblox Global
app.use('/api/roblox', createProxyMiddleware({
    target: 'https://games.roblox.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/roblox': '', // Xóa tiền tố khi gửi đi
    },
    onProxyReq: (proxyReq, req, res) => {
        // Giả lập thông tin để không bị Roblox chặn API
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        proxyReq.setHeader('Accept', 'application/json');
    },
    onError: (err, req, res) => {
        res.status(500).json({ error: 'Lỗi Proxy khi kết nối với Roblox', details: err.message });
    }
}));

// Route kiểm tra IP của máy chủ (Xác nhận xem có đúng đang ở US không)
app.get('/api/check-ip', async (req, res) => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        res.json({ proxy_ip: data.ip, location: "US/EU Server (Bypass Ready)" });
    } catch (e) {
        res.status(500).json({ error: "Lỗi kiểm tra IP" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bypass Proxy Server đang chạy tại port ${PORT}`);
});